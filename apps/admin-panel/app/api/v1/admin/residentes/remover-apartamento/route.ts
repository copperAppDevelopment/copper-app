import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, okCon, fail } from '@/lib/apiHandler';

/**
 * POST: Remover a un residente de su apartamento.
 *
 * Marca la fila como `activo = false` pero **conserva `apartamento_id`**: el registro queda,
 * y ese vínculo es lo que permite mostrar "Residentes anteriores" en el detalle del
 * apartamento. Poner `apartamento_id = NULL` borraría ese rastro.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const { residente_id } = body;

  if (!residente_id) {
    return fail('Falta el residente_id', 400);
  }

  const { data: residente } = await supabaseAdmin
    .from('residentes')
    .select('id, conjunto_id, apartamento_id, activo')
    .eq('id', residente_id)
    .maybeSingle();

  if (!residente || residente.conjunto_id !== conjuntoId) {
    return fail('El residente no pertenece a este conjunto', 404);
  }

  if (!residente.activo) {
    return fail('Este residente ya está inactivo', 409);
  }

  if (!residente.apartamento_id) {
    return fail('Este residente no tiene un apartamento asignado', 409);
  }

  const { data: actualizado, error } = await supabaseAdmin
    .from('residentes')
    .update({ activo: false })
    .eq('id', residente_id)
    .select()
    .single();

  if (error) {
    console.error('Error al remover el residente del apartamento:', error);
    return fail('Error interno al remover el residente', 500);
  }

  // Un apartamento puede alojar a varios residentes: solo queda libre si no queda
  // ninguno activo.
  const { count } = await supabaseAdmin
    .from('residentes')
    .select('id', { count: 'exact', head: true })
    .eq('apartamento_id', residente.apartamento_id)
    .eq('activo', true);

  if ((count ?? 0) === 0) {
    await supabaseAdmin
      .from('apartamentos')
      .update({ ocupado: false })
      .eq('id', residente.apartamento_id);
  }

  return okCon({
    data: actualizado,
    message: (count ?? 0) === 0
      ? 'Residente removido. El apartamento quedó libre.'
      : `Residente removido. Quedan ${count} residentes activos en el apartamento.`,
  });
});
