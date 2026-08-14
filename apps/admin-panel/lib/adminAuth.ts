import { supabaseAdmin } from './supabaseAdmin';

/**
 * Verifica que el usuario administre efectivamente el conjunto indicado.
 *
 * La base de datos no tiene RLS ni políticas: los roles `anon` y `authenticated`
 * tienen CRUD completo sobre todas las tablas. Esta comprobación es, hoy, la única
 * frontera de autorización real para las escrituras del panel, así que debe
 * ejecutarse en el servidor antes de cualquier operación con `supabaseAdmin`.
 *
 * `admins_conjuntos.user_id` referencia `public.users(id)`, que coincide con el uid
 * de Supabase Auth (el resto del panel ya lo asume al leer `users` por `session.user.id`).
 */
export async function esAdminDeConjunto(userId: string, conjuntoId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('admins_conjuntos')
    .select('id')
    .eq('user_id', userId)
    .eq('conjunto_id', conjuntoId)
    .eq('activo', true)
    .maybeSingle();

  if (error) {
    console.error('Error al verificar permisos de admin sobre el conjunto:', error);
    return false;
  }

  return Boolean(data);
}
