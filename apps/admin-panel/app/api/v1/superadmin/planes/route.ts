import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { withSuperAdmin, ok, fail } from "@/lib/apiHandler";
import { SUBTIPOS_PLAN, MAX_PLANES_ACTIVOS } from "@/lib/planesData";

/** Cuántos planes quedarían activos aparte de este. El tope lo impone el trigger de la base. */
async function activosSinContar(planId?: string): Promise<number> {
  let consulta = supabaseAdmin.from("planes").select("id", { count: "exact", head: true }).eq("activo", true);
  if (planId) consulta = consulta.neq("id", planId);

  const { count } = await consulta;
  return count ?? 0;
}

/** El trigger `trg_planes_tope_activos` lanza `check_violation`; se traduce a un mensaje claro. */
const esTopeActivos = (error: { code?: string; message?: string } | null) =>
  error?.code === "23514" || Boolean(error?.message?.includes("3 planes activos"));

/**
 * POST: crea o actualiza un plan comercial, o solo cambia su estado.
 *
 * Es la única vía de escritura sobre `planes`: los grants de `anon` y `authenticated` quedaron
 * revocados, así que sin esta ruta la tabla solo se puede leer.
 */
export const POST = withSuperAdmin(async ({ body }) => {
  const { plan_id, solo_activo, activo } = body;

  // Alternar el estado desde la lista, sin abrir el formulario.
  if (solo_activo) {
    if (!plan_id) return fail("Falta el plan_id", 400);

    const encender = Boolean(activo);

    if (encender && (await activosSinContar(plan_id)) >= MAX_PLANES_ACTIVOS) {
      return fail(
        `Ya hay ${MAX_PLANES_ACTIVOS} planes activos, que es lo que la página de precios muestra. Desactiva uno antes.`,
        409
      );
    }

    const { error } = await supabaseAdmin
      .from("planes")
      .update({ activo: encender })
      .eq("id", plan_id);

    if (error) {
      if (esTopeActivos(error)) return fail(`Solo puede haber ${MAX_PLANES_ACTIVOS} planes activos`, 409);
      console.error("Error al cambiar el estado del plan:", error);
      return fail("No se pudo cambiar el estado", 500);
    }

    return ok({ plan_id, activo: encender });
  }

  const nombre = String(body.nombre ?? "").trim();
  const subtipo = String(body.subtipo ?? "");

  if (!nombre) return fail("El nombre es obligatorio", 400);

  if (!(SUBTIPOS_PLAN as readonly string[]).includes(subtipo)) {
    return fail("El subtipo no es válido", 400);
  }

  // Los tres precios llegan como texto desde el formulario. El CHECK `planes_precios_check`
  // solo exige que no sean negativos; el cero se permite pero se avisa en la interfaz, porque
  // deja el checkout de ese periodo devolviendo 400.
  const precioValido = (valor: unknown) => {
    const numero = Number(valor ?? NaN);
    return Number.isFinite(numero) && numero >= 0 ? numero : null;
  };

  const mensual = precioValido(body.precio_mensual);
  const trimestral = precioValido(body.precio_trimestral);
  const anual = precioValido(body.precio_anual);

  if (mensual === null || trimestral === null || anual === null) {
    return fail("Los tres precios deben ser números mayores o iguales que cero", 400);
  }

  const maxResidentes = Number(body.max_residentes ?? NaN);
  if (!Number.isInteger(maxResidentes) || maxResidentes <= 0) {
    return fail("El tope de residentes debe ser un número entero mayor que cero", 400);
  }

  const fila = {
    nombre,
    descripcion: String(body.descripcion ?? "").trim() || null,
    max_residentes: maxResidentes,
    precio_mensual: mensual,
    precio_trimestral: trimestral,
    precio_anual: anual,
  };

  if (plan_id) {
    const { data: plan } = await supabaseAdmin
      .from("planes")
      .select("id")
      .eq("id", plan_id)
      .maybeSingle();

    if (!plan) return fail("El plan no existe", 404);

    // El subtipo no se toca al editar: es la etiqueta comercial con la que ya se vendió.
    const { error } = await supabaseAdmin.from("planes").update(fila).eq("id", plan_id);

    if (error) {
      console.error("Error al actualizar el plan:", error);
      return fail("No se pudo guardar el plan", 500);
    }

    return ok({ plan_id, creado: false });
  }

  // Un plan nuevo nace inactivo si ya hay tres: así se puede preparar antes de reemplazar a otro.
  const nace = (await activosSinContar()) < MAX_PLANES_ACTIVOS;

  const { data: creado, error } = await supabaseAdmin
    .from("planes")
    .insert({ ...fila, subtipo, activo: nace })
    .select("id")
    .single();

  if (error) {
    if (esTopeActivos(error)) return fail(`Solo puede haber ${MAX_PLANES_ACTIVOS} planes activos`, 409);
    console.error("Error al crear el plan:", error);
    return fail("No se pudo crear el plan", 500);
  }

  return ok({ plan_id: creado.id, creado: true, activo: nace }, 201);
});
