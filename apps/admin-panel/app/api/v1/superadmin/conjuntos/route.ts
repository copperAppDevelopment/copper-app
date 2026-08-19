import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { withSuperAdmin, ok, fail } from "@/lib/apiHandler";

/**
 * POST: activa o desactiva un conjunto.
 *
 * Desactivar deja sin acceso a la app a todos sus residentes: el guard de
 * `/api/v1/residents/**` mira `conjuntos.activo`, y ahí es por donde la app móvil pide todos
 * sus datos.
 *
 * `vetado` se escribe junto a `activo` para que un pago de Wompi no reactive lo que el
 * SuperAdmin apagó a propósito.
 */
export const POST = withSuperAdmin(async ({ body }) => {
  const conjuntoId = String(body?.conjunto_id ?? "");
  if (!conjuntoId) return fail("Falta el conjunto", 400);

  const activo = Boolean(body?.activo);

  const { data: conjunto } = await supabaseAdmin
    .from("conjuntos")
    .select("id, nombre")
    .eq("id", conjuntoId)
    .maybeSingle();

  if (!conjunto) return fail("El conjunto no existe", 404);

  const { error } = await supabaseAdmin
    .from("conjuntos")
    .update({ activo, vetado: !activo } as any)
    .eq("id", conjuntoId);

  if (error) {
    console.error("Error al cambiar el estado del conjunto:", error);
    return fail("No se pudo cambiar el estado del conjunto", 500);
  }

  // Cuántas personas quedan fuera, para poder decirlo en el aviso.
  const { count } = await supabaseAdmin
    .from("residentes")
    .select("id", { count: "exact", head: true })
    .eq("conjunto_id", conjuntoId)
    .eq("activo", true);

  return ok({
    conjunto_id: conjuntoId,
    conjunto: conjunto.nombre,
    activo,
    residentes_afectados: count ?? 0,
  });
});
