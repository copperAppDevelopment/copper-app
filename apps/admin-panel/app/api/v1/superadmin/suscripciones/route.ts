import { withSuperAdmin, ok, fail } from "@/lib/apiHandler";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizarPeriodo } from "@/lib/conjuntos";
import { asignarSuscripcion, type InicioVigencia } from "@/lib/suscripcionesServidor";

/** Referencia con prefijo propio: distingue la asignación manual de lo que vino de Wompi. */
const referenciaManual = (conjuntoId: string) => `SA-${conjuntoId}-${Date.now()}`;

/**
 * Asigna o cambia el plan de un conjunto sin pasar por la pasarela.
 *
 * Es la vía para cortesías, demos y clientes que pagan por transferencia. Escribe lo mismo que
 * escribiría el webhook de un pago aprobado, con `metodo_pago = 'manual'`.
 */
export const POST = withSuperAdmin(async ({ body }) => {
  const conjuntoId = String(body?.conjunto_id ?? "");
  const planId = String(body?.plan_id ?? "");
  const adminUserId = String(body?.admin_user_id ?? "");
  const periodo = normalizarPeriodo(body?.tipo_periodo);
  const desde: InicioVigencia = body?.desde === "vencimiento" ? "vencimiento" : "hoy";

  if (!conjuntoId) return fail("Hay que elegir el conjunto", 400);
  if (!planId || !periodo) return fail("Hay que elegir el plan y el periodo", 400);
  if (!adminUserId) return fail("Hay que elegir el administrador de la suscripción", 400);

  const precio = Number(body?.precio_pagado ?? 0);
  if (!Number.isFinite(precio) || precio < 0) {
    return fail("El precio no es válido", 400);
  }

  const { data: conjunto } = await supabaseAdmin
    .from("conjuntos")
    .select("id, nombre")
    .eq("id", conjuntoId)
    .maybeSingle();

  if (!conjunto) return fail("El conjunto no existe", 404);

  const { data: plan } = await supabaseAdmin
    .from("planes")
    .select("id, nombre")
    .eq("id", planId)
    .eq("activo", true)
    .maybeSingle();

  if (!plan) return fail("El plan no existe o está inactivo", 404);

  // El titular tiene que ser administrador *de este conjunto*, no un miembro cualquiera del
  // equipo: a `admins_conjuntos` entra también el recepcionista, y la suscripción quedaría a
  // su nombre además de habilitarle la cuenta. `suscripciones.admin_user_id` solo tiene clave
  // foránea a `users`, así que la base no lo impide.
  const { data: miembro } = await supabaseAdmin
    .from("admins_conjuntos")
    .select("id, users!inner(rol, estado)")
    .eq("conjunto_id", conjuntoId)
    .eq("user_id", adminUserId)
    .eq("activo", true)
    .maybeSingle();

  const usuario = Array.isArray((miembro as any)?.users)
    ? (miembro as any).users[0]
    : (miembro as any)?.users;

  if (!miembro || usuario?.rol !== "Admin" || usuario?.estado === false) {
    return fail("Ese usuario no es administrador activo del conjunto", 400);
  }

  const resultado = await asignarSuscripcion({
    conjuntoId,
    adminUserId,
    planId,
    periodo,
    precio,
    metodoPago: "manual",
    referencia: referenciaManual(conjuntoId),
    desde,
  });

  return ok(
    {
      ...resultado,
      conjunto: conjunto.nombre,
      plan: plan.nombre,
    },
    resultado.actualizada ? 200 : 201
  );
});
