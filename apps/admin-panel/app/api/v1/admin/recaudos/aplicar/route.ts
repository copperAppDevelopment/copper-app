import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, okCon, fail } from '@/lib/apiHandler';

/**
 * POST: Aplicar un recaudo contra los cargos pendientes de su apartamento.
 *
 * `aplicar_recaudo` NO es idempotente: no comprueba si el recaudo ya se aplicó, y no hay
 * unique en `(cargo_id, recaudo_id)`. Llamarla dos veces acredita el pago dos veces en
 * silencio. Esta guarda es lo único que lo impide.
 *
 * Tampoco valida nada: con `valor_total` nulo revienta con NOT NULL violation dentro de
 * `cargos_recaudos.valor_aplicado`, así que se descarta antes.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const { recaudo_id } = body;

  if (!recaudo_id) {
    return fail('Falta el recaudo_id', 400);
  }

  const { data: recaudo } = await supabaseAdmin
    .from('recaudos')
    .select('id, conjunto_id, valor_total')
    .eq('id', recaudo_id)
    .maybeSingle();

  if (!recaudo || recaudo.conjunto_id !== conjuntoId) {
    return fail('El recaudo no pertenece a este conjunto', 404);
  }

  if (recaudo.valor_total === null) {
    return fail('El recaudo no tiene valor total: no se puede aplicar.', 400);
  }

  const { count } = await supabaseAdmin
    .from('cargos_recaudos')
    .select('id', { count: 'exact', head: true })
    .eq('recaudo_id', recaudo_id);

  if ((count ?? 0) > 0) {
    return fail('Este recaudo ya fue aplicado. Volver a aplicarlo duplicaría el abono.', 409);
  }

  const { error } = await supabaseAdmin.rpc('aplicar_recaudo', { p_recaudo_id: recaudo_id });

  if (error) {
    console.error('Error al aplicar el recaudo:', error);
    return fail('Error interno al aplicar el recaudo', 500);
  }

  // La función no lanza excepción cuando no hay cargos pendientes: sale en silencio.
  // Se relee para poder informar de lo que realmente pasó.
  const { data: aplicaciones } = await supabaseAdmin
    .from('cargos_recaudos')
    .select('valor_aplicado')
    .eq('recaudo_id', recaudo_id);

  const totalAplicado = (aplicaciones ?? []).reduce(
    (suma, a) => suma + Number(a.valor_aplicado ?? 0),
    0
  );

  return okCon({
    data: { aplicaciones: aplicaciones?.length ?? 0, total_aplicado: totalAplicado },
    message:
      (aplicaciones?.length ?? 0) === 0
        ? 'El apartamento no tiene cargos pendientes: no se aplicó nada.'
        : `Aplicado a ${aplicaciones!.length} cargo(s).`,
  });
});
