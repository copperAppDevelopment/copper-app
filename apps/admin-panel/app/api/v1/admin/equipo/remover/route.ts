import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';

/**
 * POST: Sacar a alguien del equipo del conjunto.
 *
 * Marca `activo = false` en vez de borrar: la fila queda como historial y se puede
 * reactivar desde `/equipo/vincular` sin volver a invitar.
 */
export const POST = withAdminConjunto(async ({ user, conjuntoId, body }) => {
  const { miembro_id } = body;

  if (!miembro_id) {
    return fail('Falta el miembro_id', 400);
  }

  const { data: miembro } = await supabaseAdmin
    .from('admins_conjuntos')
    .select('id, user_id, conjunto_id, es_propietario, activo')
    .eq('id', miembro_id)
    .maybeSingle();

  if (!miembro || miembro.conjunto_id !== conjuntoId) {
    return fail('Ese miembro no pertenece a este conjunto', 404);
  }

  // Sin esto, el conjunto podría quedarse sin nadie que lo administre.
  if (miembro.es_propietario) {
    return fail('No se puede quitar al propietario del conjunto.', 409);
  }

  if (miembro.user_id === user.id) {
    return fail('No puedes quitarte a ti mismo del equipo.', 409);
  }

  const { error } = await supabaseAdmin
    .from('admins_conjuntos')
    .update({ activo: false })
    .eq('id', miembro_id);

  if (error) {
    console.error('Error al quitar al miembro del equipo:', error);
    return fail('No se pudo quitar al miembro', 500);
  }

  return ok({ miembro_id });
});
