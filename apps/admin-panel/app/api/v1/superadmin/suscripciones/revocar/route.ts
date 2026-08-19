import { withSuperAdmin, ok, fail } from "@/lib/apiHandler";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revocarSuscripcion } from "@/lib/suscripcionesServidor";

/**
 * Corta la vigencia de una suscripción.
 *
 * No borra la fila —el historial y los pagos asociados se conservan— ni toca
 * `conjuntos.activo`, que puede estar como está por otros motivos.
 */
export const POST = withSuperAdmin(async ({ body }) => {
  const suscripcionId = String(body?.suscripcion_id ?? "");
  if (!suscripcionId) return fail("Falta la suscripción", 400);

  const { data: suscripcion } = await supabaseAdmin
    .from("suscripciones")
    .select("id, fecha_fin")
    .eq("id", suscripcionId)
    .maybeSingle();

  if (!suscripcion) return fail("La suscripción no existe", 404);

  if (new Date(suscripcion.fecha_fin) <= new Date()) {
    return fail("Esa suscripción ya estaba vencida", 409);
  }

  await revocarSuscripcion(suscripcionId);

  return ok({ suscripcion_id: suscripcionId });
});
