import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';

/**
 * POST: Vincular a un usuario que YA tiene cuenta como residente de este conjunto.
 *
 * Es la contrapartida de `/invitar` cuando el correo ya existe: no hace falta invitación
 * ni correo, basta con crear la fila en `residentes`. El apartamento es opcional y puede
 * asignarse después desde la tabla.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const { user_id, apartamento_id } = body;

  if (!user_id) {
    return fail('Falta el user_id', 400);
  }

  // `uniq_residente_activo` no protege este caso: en btree los NULL son distintos entre sí,
  // así que un mismo usuario puede acumular filas activas sin apartamento. Se comprueba aquí.
  const { data: yaExiste, error: errorExiste } = await supabaseAdmin
    .from('residentes')
    .select('id, activo')
    .eq('user_id', user_id)
    .eq('conjunto_id', conjuntoId)
    .eq('activo', true)
    .maybeSingle();

  if (errorExiste) {
    console.error('Error al verificar el residente existente:', errorExiste);
    return fail('Error interno al validar el residente', 500);
  }

  if (yaExiste) {
    return fail('Este usuario ya es residente activo de este conjunto', 409);
  }

  if (apartamento_id) {
    const { data: apartamento } = await supabaseAdmin
      .from('apartamentos')
      .select('id, conjunto_id')
      .eq('id', apartamento_id)
      .maybeSingle();

    if (!apartamento || apartamento.conjunto_id !== conjuntoId) {
      return fail('El apartamento no pertenece a este conjunto', 400);
    }
  }

  const { data: nuevo, error } = await supabaseAdmin
    .from('residentes')
    .insert({
      user_id,
      conjunto_id: conjuntoId,
      apartamento_id: apartamento_id || null,
      activo: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error al vincular el residente:', error);
    return fail('Error interno al vincular el residente', 500);
  }

  if (apartamento_id) {
    await supabaseAdmin.from('apartamentos').update({ ocupado: true }).eq('id', apartamento_id);
  }

  return ok(nuevo, 201);
});
