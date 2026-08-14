import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
      }
    });
  }

  try {
    const {
      conjunto_id,
      rol,
      nombres,
      apellidos,
      email,
      tipo_documento,
      numero_documento,
      telefono,
      apartamento_id
    } = await req.json();

    /* ======================================================
       🔒 VALIDACIONES
    ====================================================== */

    // 🔹 Campos mínimos comunes
    if (!conjunto_id || !rol || !email) {
      return new Response(
        JSON.stringify({ error: "Faltan campos obligatorios" }),
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // 🔹 Validaciones específicas por rol
    //
    // Para "Residente", `apartamento_id` es OPCIONAL: se puede invitar a alguien
    // antes de decidir dónde vivirá y asignarle el apartamento después desde el
    // panel. Antes era obligatorio y bloqueaba ese flujo.
    if (rol !== "Residente") {
      if (!nombres || !apellidos || !tipo_documento || !numero_documento) {
        return new Response(
          JSON.stringify({ error: "Faltan datos obligatorios para este rol" }),
          { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
        );
      }
    }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    /* ======================================================
       🔍 OBTENER NOMBRE DEL CONJUNTO
    ====================================================== */

    const { data: conjunto, error: conjuntoError } = await supabase
      .from("conjuntos")
      .select("nombre")
      .eq("id", conjunto_id)
      .single();

    if (conjuntoError || !conjunto) {
      return new Response(
        JSON.stringify({ error: "No se pudo obtener el nombre del conjunto" }),
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const nombreConjunto = conjunto.nombre;

    /* ======================================================
       🏠 VALIDAR APARTAMENTO (SOLO RESIDENTE, SI VIENE)
    ====================================================== */

    let numeroApartamento: string | null = null;

    if (rol === "Residente" && apartamento_id) {
      const { data: apartamento, error: aptError } = await supabase
        .from("apartamentos")
        .select("id, conjunto_id, ocupado, numero_apartamento")
        .eq("id", apartamento_id)
        .single();

      if (aptError || !apartamento) {
        return new Response(
          JSON.stringify({ error: "El apartamento no existe" }),
          { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
        );
      }

      if (apartamento.conjunto_id !== conjunto_id) {
        return new Response(
          JSON.stringify({ error: "El apartamento no pertenece al conjunto" }),
          { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
        );
      }

      // Un apartamento puede alojar a varios residentes (familia, arrendatarios),
      // así que `ocupado` ya no rechaza la invitación. Antes devolvía 409.

      numeroApartamento = apartamento.numero_apartamento;
    }

    /* ======================================================
       🔑 CREAR INVITACIÓN
    ====================================================== */

    const token = crypto.randomUUID();

    const { error: insertError } = await supabase
      .from("invitaciones")
      .insert([{
        conjunto_id,
        rol,
        email,
        nombres: rol === "Residente" ? null : nombres,
        apellidos: rol === "Residente" ? null : apellidos,
        tipo_documento: rol === "Residente" ? null : tipo_documento,
        numero_documento: rol === "Residente" ? null : numero_documento,
        telefono,
        apartamento_id: rol === "Residente" ? (apartamento_id ?? null) : null,
        token
      }]);

    if (insertError) throw insertError;

    /* ======================================================
       📧 ENVIAR CORREO
    ====================================================== */

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const inviteLink = `https://copperapp.co/aceptarInvitacion?token=${token}`;

    const apartamentoTexto =
      rol === "Residente" && numeroApartamento
        ? `\nApartamento asignado: ${numeroApartamento}\n`
        : "";

    const emailBody = `
Hola,

Has sido invitado a unirte al conjunto **${nombreConjunto}** en Copper App
con el rol de **${rol}**.${apartamentoTexto}

Para completar tu registro, haz clic en el siguiente enlace:

👉 ${inviteLink}

Si no esperabas esta invitación, puedes ignorar este correo.

Atentamente,
El equipo de Copper App
`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Copper App <noreply@copperapp.co>",
        to: [email],
        subject: `Invitación al conjunto ${nombreConjunto}`,
        text: emailBody
      })
    });

    if (!resendRes.ok) {
      const resendError = await resendRes.text();
      throw new Error(`Error al enviar correo: ${resendError}`);
    }

    return new Response(
      JSON.stringify({ message: "Invitación enviada correctamente" }),
      { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
});
