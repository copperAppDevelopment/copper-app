import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';
import { configWompi, referenciaPago, enlaceCheckout } from '@/lib/wompi';
import { normalizarPeriodo, COLUMNA_PRECIO } from '@/lib/conjuntos';

/** Días antes del vencimiento en los que se habilita la renovación. */
const DIAS_VENTANA_RENOVACION = 5;

/**
 * POST: abre un cobro de suscripción en Wompi y devuelve el enlace del checkout.
 *
 * Reemplaza a la edge function `create-wompi-payment`, que además estaba rota: filtraba
 * `estado = 'Activa'` y el enum `estado_suscripcion` solo admite minúsculas, así que
 * nunca encontraba la suscripción vigente y trataba toda renovación como alta nueva.
 */
export const POST = withAdminConjunto(async ({ user, conjuntoId, body }) => {
  const periodo = normalizarPeriodo(body.tipo_periodo);
  const planId = String(body.plan_id ?? '');

  if (!planId || !periodo) {
    return fail('Falta el plan o el periodo', 400);
  }

  const config = configWompi();

  const { data: plan } = await supabaseAdmin
    .from('planes')
    .select('id, nombre, precio_mensual, precio_trimestral, precio_anual')
    .eq('id', planId)
    .eq('activo', true)
    .maybeSingle();

  if (!plan) {
    return fail('El plan no existe o está inactivo', 404);
  }

  const monto = Number((plan as any)[COLUMNA_PRECIO[periodo]]);
  if (!Number.isFinite(monto) || monto <= 0) {
    return fail('El plan no tiene precio para ese periodo', 400);
  }

  // La suscripción vigente del conjunto, si la hay: define si esto es renovación.
  const { data: suscripcion } = await supabaseAdmin
    .from('suscripciones')
    .select('id, plan_id, fecha_fin, estado')
    .eq('conjunto_id', conjuntoId)
    .order('fecha_fin', { ascending: false })
    .limit(1)
    .maybeSingle();

  const esRenovacion = Boolean(suscripcion);

  if (suscripcion && suscripcion.estado === 'activa' && suscripcion.plan_id === planId) {
    // Renovar el mismo plan cuando todavía queda mucho solo adelantaría el pago sin dar
    // nada a cambio. Cambiar de plan sí se permite en cualquier momento: es lo que se
    // ofrece desde el detalle del conjunto.
    const limite = new Date(suscripcion.fecha_fin);
    limite.setDate(limite.getDate() - DIAS_VENTANA_RENOVACION);

    if (new Date() < limite) {
      return fail(
        `La suscripción sigue vigente. Podrás renovarla desde ${DIAS_VENTANA_RENOVACION} días antes de su vencimiento.`,
        400
      );
    }
  }

  const referencia = referenciaPago(conjuntoId);

  const { error } = await supabaseAdmin.from('pagos').insert({
    suscripcion_id: suscripcion?.id ?? null,
    monto,
    metodo_pago: 'wompi',
    referencia_externa: referencia,
    estado: 'pendiente',
    // El webhook llega sin sesión: todo lo que necesita para crear la suscripción tiene
    // que viajar aquí.
    datos_pago: {
      plan_id: planId,
      tipo_periodo: periodo,
      conjunto_id: conjuntoId,
      admin_user_id: user.id,
      es_renovacion: esRenovacion,
    },
  } as any);

  if (error) {
    console.error('Error al registrar el pago:', error);
    return fail('No se pudo iniciar el pago', 500);
  }

  const enlace = enlaceCheckout(config, referencia, monto);

  return ok({
    checkout_url: enlace.url,
    referencia,
    monto,
    es_renovacion: esRenovacion,
    plan: plan.nombre,
  });
});
