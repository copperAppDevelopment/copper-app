import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // 🔹 Manejo del preflight (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*", // o tu dominio: https://copper-app-hlgzi2.flutterflow.app
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { nombre, apellido, email, telefono, nombre_conjunto, tipo_solicitud, descripcion } = await req.json();

    if (!nombre || !apellido || !email || !tipo_solicitud || !descripcion) {
      return new Response(JSON.stringify({ error: "Datos incompletos" }), {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

    // 1️⃣ Guardar en Supabase
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

    const { error: insertError } = await supabase.from("contactos").insert([
      { nombre, apellido, email, telefono, nombre_conjunto, tipo_solicitud, descripcion },
    ]);

    if (insertError) throw insertError;

    // 2️⃣ Enviar correo con Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SALES_EMAIL = "danielfe796@gmail.com";

    const emailBody = `
Hola equipo de ventas,

Se ha recibido una nueva solicitud de contacto:

Nombre: ${nombre} ${apellido}
Email: ${email}
Teléfono: ${telefono || "No especificado"}
Conjunto: ${nombre_conjunto || "No especificado"}
Tipo de solicitud: ${tipo_solicitud}

Descripción:
${descripcion}

Por favor contacten al cliente lo antes posible.
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Copper App <noreply@copperapp.co>",
        to: [SALES_EMAIL],
        subject: "Nueva solicitud de contacto",
        text: emailBody,
      }),
    });

    if (!resendRes.ok) {
      const resendError = await resendRes.text();
      throw new Error(`Error enviando correo: ${resendError}`);
    }

    return new Response(JSON.stringify({ message: "Solicitud enviada" }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
});
