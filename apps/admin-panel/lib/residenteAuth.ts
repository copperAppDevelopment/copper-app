import { getAuthUser } from './auth';
import { supabaseAdmin } from './supabaseAdmin';
import { ErrorHttp } from './apiHandler';

/**
 * Autorización de las rutas del residente.
 *
 * No es una comodidad: **la app móvil no consulta Supabase ni una sola vez**, todos sus datos
 * salen de `/api/v1/residents/**`. Estas comprobaciones son, por tanto, el único sitio donde
 * desactivar un conjunto o vetar a una persona significa algo de verdad — y el único que surte
 * efecto en los teléfonos que ya tienen la app instalada, sin publicar una versión nueva.
 *
 * `login.tsx` hace comprobaciones equivalentes para dar un mensaje claro, pero casi nunca se
 * ejecuta: la sesión queda guardada en el teléfono y la app abre directamente en el inicio.
 */
export interface ContextoResidente {
  user: { id: string };
  residenteId: string;
  conjuntoId: string;
  apartamentoId: string | null;
}

/** Mensajes pensados para que el móvil pueda mostrarlos tal cual. */
const CUENTA_INACTIVA =
  'Tu cuenta está inactiva. Comunícate con el administrador de tu conjunto.';
const CONJUNTO_INACTIVO =
  'Tu conjunto no tiene el servicio activo en este momento. Comunícate con su administración.';

/**
 * Devuelve el residente del token o lanza `ErrorHttp`, que el envoltorio de la ruta traduce a
 * respuesta. Comprueba, en este orden: sesión, estado de la persona, vínculo de residente y
 * estado del conjunto.
 */
export async function residenteAutorizado(req: Request): Promise<ContextoResidente> {
  const user = await getAuthUser(req);
  if (!user) throw new ErrorHttp('No autorizado', 401);

  const { data: perfil } = await supabaseAdmin
    .from('users')
    .select('estado, cuenta_bloqueada')
    .eq('id', user.id)
    .maybeSingle();

  if (!perfil) throw new ErrorHttp('No se encontró tu perfil de usuario', 404);
  if (perfil.estado === false || perfil.cuenta_bloqueada === true) {
    throw new ErrorHttp(CUENTA_INACTIVA, 403);
  }

  const { data: residente } = await supabaseAdmin
    .from('residentes')
    .select('id, conjunto_id, apartamento_id, activo')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!residente) throw new ErrorHttp('Perfil de residente no encontrado', 404);
  if (residente.activo === false) throw new ErrorHttp(CUENTA_INACTIVA, 403);

  const { data: conjunto } = await supabaseAdmin
    .from('conjuntos')
    .select('activo')
    .eq('id', residente.conjunto_id)
    .maybeSingle();

  // `activo` es la única fuente de verdad: la columna `estado` de `conjuntos` es texto libre y
  // quedó sucia (`'true'`, `'Activo'`, `NULL`).
  if (!conjunto || conjunto.activo === false) {
    throw new ErrorHttp(CONJUNTO_INACTIVO, 403);
  }

  return {
    user,
    residenteId: residente.id,
    conjuntoId: residente.conjunto_id,
    apartamentoId: residente.apartamento_id,
  };
}

/**
 * Envuelve un handler de residente con esa autorización.
 *
 * Las rutas siguen devolviendo `{ error }` con su código, que es lo que la app publicada espera.
 */
export function withResidente(
  handler: (ctx: ContextoResidente, req: Request) => Promise<Response>
) {
  return async (req: Request): Promise<Response> => {
    try {
      const ctx = await residenteAutorizado(req);
      return await handler(ctx, req);
    } catch (error: any) {
      if (error instanceof ErrorHttp) {
        return Response.json({ error: error.message }, { status: error.status });
      }
      console.error(`Error en ${req.method} ${new URL(req.url).pathname}:`, error);
      return Response.json(
        { error: error?.message || 'Error interno del servidor' },
        { status: 500 }
      );
    }
  };
}
