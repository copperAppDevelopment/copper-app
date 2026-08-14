import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';

/**
 * POST: Asignar un apartamento a un residente.
 *
 * Dos caminos según el estado del residente:
 *  - Pendiente (activo, sin apartamento) → se actualiza su fila.
 *  - Inactivo (fue removido) → se crea una fila nueva. La anterior se conserva con su
 *    `apartamento_id` intacto, que es lo que alimenta "Residentes anteriores" en el
 *    detalle del apartamento.
 *
 * Un apartamento admite varios residentes activos: `uniq_residente_activo` es
 * UNIQUE (user_id, apartamento_id) WHERE activo, así que solo prohíbe el duplicado exacto.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const { residente_id, apartamento_id } = body;

  if (!residente_id || !apartamento_id) {
    return fail('Faltan residente_id o apartamento_id', 400);
  }

  const { data: apartamento } = await supabaseAdmin
    .from('apartamentos')
    .select('id, conjunto_id')
    .eq('id', apartamento_id)
    .maybeSingle();

  if (!apartamento || apartamento.conjunto_id !== conjuntoId) {
    return fail('El apartamento no pertenece a este conjunto', 400);
  }

  const { data: residente } = await supabaseAdmin
    .from('residentes')
    .select('id, user_id, conjunto_id, apartamento_id, activo, direccion_unidad, estrato, ano_ingreso')
    .eq('id', residente_id)
    .maybeSingle();

  if (!residente || residente.conjunto_id !== conjuntoId) {
    return fail('El residente no pertenece a este conjunto', 404);
  }

  if (residente.activo && residente.apartamento_id) {
    return fail('Este residente ya tiene un apartamento asignado. Remuévelo primero.', 409);
  }

  let resultado;

  if (residente.activo) {
    // Pendiente de asignación: se completa su fila.
    const { data, error } = await supabaseAdmin
      .from('residentes')
      .update({ apartamento_id })
      .eq('id', residente_id)
      .select()
      .single();

    if (error) {
      console.error('Error al asignar el apartamento:', error);
      return fail('Error interno al asignar el apartamento', 500);
    }
    resultado = data;
  } else {
    // Reasignación: fila nueva, conservando la anterior como historial.
    const { data, error } = await supabaseAdmin
      .from('residentes')
      .insert({
        user_id: residente.user_id,
        conjunto_id: conjuntoId,
        apartamento_id,
        activo: true,
        direccion_unidad: residente.direccion_unidad,
        estrato: residente.estrato,
        ano_ingreso: residente.ano_ingreso,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al reasignar el residente:', error);
      return fail('Error interno al reasignar el residente', 500);
    }
    resultado = data;
  }

  // `ocupado` no lo mantiene nadie más; sin esto los indicadores de apartamentos
  // se desalinean de los residentes reales.
  await supabaseAdmin.from('apartamentos').update({ ocupado: true }).eq('id', apartamento_id);

  return ok(resultado);
});
