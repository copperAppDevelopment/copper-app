import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { withSuperAdmin, ok, fail } from "@/lib/apiHandler";
import { esEstadoContacto } from "@/lib/contactos";

/**
 * GET: las solicitudes recibidas desde la página web.
 *
 * Pasa por el servidor y no se lee desde el navegador como el resto del panel porque
 * `contactos` guarda datos personales de gente que no es usuaria: sus grants están revocados
 * para `anon` y `authenticated`, así que solo el service_role la ve.
 *
 * Sin paginación de servidor: hay ocho filas y el mes más movido del último año tuvo cinco. El
 * día que crezca, hará falta un índice sobre `created_at`, que hoy no existe.
 */
export const GET = withSuperAdmin(async () => {
  const { data, error } = await supabaseAdmin
    .from("contactos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al listar contactos:", error);
    return fail("No se pudieron cargar los contactos", 500);
  }

  return ok(data ?? []);
});

/** POST: marca una solicitud con otro estado, o la borra. */
export const POST = withSuperAdmin(async ({ body }) => {
  const contactoId = String(body?.contacto_id ?? "");
  if (!contactoId) return fail("Falta el contacto", 400);

  const { data: contacto } = await supabaseAdmin
    .from("contactos")
    .select("id")
    .eq("id", contactoId)
    .maybeSingle();

  if (!contacto) return fail("Esa solicitud no existe", 404);

  if (body?.eliminar) {
    const { error } = await supabaseAdmin.from("contactos").delete().eq("id", contactoId);

    if (error) {
      console.error("Error al borrar el contacto:", error);
      return fail("No se pudo borrar la solicitud", 500);
    }

    return ok({ contacto_id: contactoId, eliminado: true });
  }

  // `estado` es un enum: sin esta validación un valor desconocido se iría en un 500 por error
  // 22P02 en vez de un mensaje útil.
  if (!esEstadoContacto(body?.estado)) {
    return fail("El estado no es válido", 400);
  }

  const { error } = await supabaseAdmin
    .from("contactos")
    .update({ estado: body.estado } as any)
    .eq("id", contactoId);

  if (error) {
    console.error("Error al cambiar el estado del contacto:", error);
    return fail("No se pudo cambiar el estado", 500);
  }

  return ok({ contacto_id: contactoId, estado: body.estado });
});
