import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail, esUuid } from '@/lib/apiHandler';

/**
 * POST: deshace una condonación. El cargo vuelve a deber lo que se le había perdonado.
 *
 * Vuelve con su fecha de vencimiento original, así que si ya está vencido entra en la base de
 * la mora del próximo mes. La mora de los meses en que estuvo condonado no se cobra hacia
 * atrás: en ese tiempo no debía nada.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const cargoId = String(body.cargo_id ?? '').trim();

  if (!esUuid(cargoId)) {
    return fail('Falta el cargo', 400);
  }

  const { data, error } = await supabaseAdmin.rpc('reactivar_cargo', {
    p_cargo_id: cargoId,
    p_conjunto_id: conjuntoId,
  });

  if (error) {
    console.error('Error al reactivar el cargo:', error);
    return fail(error.message, 400);
  }

  return ok({ reactivado: Number(data ?? 0) });
});
