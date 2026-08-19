import { supabaseAdmin } from './supabaseAdmin';
import { esRolEquipo } from './equipo';
import type { RolEquipo } from './equipo';

/**
 * Resuelve con qué rol pertenece un usuario a un conjunto, o `null` si no pertenece.
 *
 * La base de datos no tiene RLS ni políticas: los roles `anon` y `authenticated` tienen
 * CRUD completo sobre todas las tablas. Esta comprobación es, hoy, la única frontera de
 * autorización real para las escrituras del panel, así que debe ejecutarse en el servidor
 * antes de cualquier operación con `supabaseAdmin`.
 *
 * ⚠️ **Devuelve el rol y no un booleano a propósito.** Antes esto era `esAdminDeConjunto`,
 * que solo miraba la pertenencia a `admins_conjuntos` — y a esa tabla entra **todo** el
 * equipo, recepcionistas y contadores incluidos. El resultado era que un recepcionista
 * podía llamar a cualquier ruta de `/api/v1/admin/**` de su conjunto, incluida
 * `equipo/vincular`, que hace `update users set rol`: podía ascenderse a `Admin` él mismo.
 *
 * `admins_conjuntos.user_id` referencia `public.users(id)`, que coincide con el uid de
 * Supabase Auth (el resto del panel ya lo asume al leer `users` por `session.user.id`).
 */
export async function rolEnConjunto(
  userId: string,
  conjuntoId: string
): Promise<RolEquipo | null> {
  const { data, error } = await supabaseAdmin
    .from('admins_conjuntos')
    .select('id, users!inner(rol, estado)')
    .eq('user_id', userId)
    .eq('conjunto_id', conjuntoId)
    .eq('activo', true)
    .maybeSingle();

  if (error) {
    console.error('Error al verificar el rol del usuario en el conjunto:', error);
    return null;
  }

  if (!data) return null;

  // `users!inner` llega como objeto, pero el tipado generado lo declara como relación:
  // se normaliza para no depender de esa forma.
  const usuario = (Array.isArray((data as any).users)
    ? (data as any).users[0]
    : (data as any).users) as { rol: string | null; estado: boolean | null } | null;

  // Un miembro desactivado seguía entrando: nadie miraba `users.estado`.
  if (!usuario || usuario.estado === false) return null;

  const rol = String(usuario.rol ?? '');
  return esRolEquipo(rol) ? rol : null;
}

/** Compatibilidad: pertenencia con rol de administrador. */
export async function esAdminDeConjunto(userId: string, conjuntoId: string): Promise<boolean> {
  return (await rolEnConjunto(userId, conjuntoId)) === 'Admin';
}
