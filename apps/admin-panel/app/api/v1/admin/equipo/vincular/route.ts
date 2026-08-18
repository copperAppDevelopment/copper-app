import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';
import { esRolEquipo } from '@/lib/equipo';

/**
 * POST: Añadir al equipo a alguien que ya tiene cuenta, sin pasar por el correo.
 *
 * Reactiva la fila de `admins_conjuntos` si ya existía desactivada, en vez de crear otra.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const { user_id, rol } = body;

  if (!user_id) {
    return fail('Falta el user_id', 400);
  }

  if (!esRolEquipo(String(rol))) {
    return fail('El rol no es válido', 400);
  }

  const { data: usuario } = await supabaseAdmin
    .from('users')
    .select('id, rol')
    .eq('id', user_id)
    .maybeSingle();

  if (!usuario) {
    return fail('El usuario no existe', 404);
  }

  // El login enruta por `users.rol`, así que sin esto un contador entraría al panel de admin.
  const { error: errorRol } = await supabaseAdmin
    .from('users')
    .update({ rol, updated_at: new Date().toISOString() })
    .eq('id', user_id);

  if (errorRol) {
    console.error('Error al fijar el rol del usuario:', errorRol);
    return fail('No se pudo asignar el rol', 500);
  }

  const { data: existente } = await supabaseAdmin
    .from('admins_conjuntos')
    .select('id, activo')
    .eq('user_id', user_id)
    .eq('conjunto_id', conjuntoId)
    .maybeSingle();

  if (existente) {
    if (existente.activo) {
      return fail('Esta persona ya forma parte del equipo de este conjunto.', 409);
    }

    const { error } = await supabaseAdmin
      .from('admins_conjuntos')
      .update({ activo: true })
      .eq('id', existente.id);

    if (error) {
      console.error('Error al reactivar al miembro del equipo:', error);
      return fail('No se pudo reactivar al miembro', 500);
    }

    return ok({ vinculado: true, reactivado: true });
  }

  const { error } = await supabaseAdmin.from('admins_conjuntos').insert({
    user_id,
    conjunto_id: conjuntoId,
    // Solo hay un propietario por conjunto, y es quien lo creó.
    es_propietario: false,
    activo: true,
    fecha_asignacion: new Date().toISOString(),
  });

  if (error) {
    console.error('Error al vincular al equipo:', error);
    return fail('No se pudo añadir al equipo', 500);
  }

  return ok({ vinculado: true, reactivado: false });
});
