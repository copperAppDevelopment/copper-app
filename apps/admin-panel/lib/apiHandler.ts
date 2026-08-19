import { NextResponse } from 'next/server';
import { getAuthUser } from './auth';
import { rolEnConjunto } from './adminAuth';
import { supabaseAdmin } from './supabaseAdmin';
import type { RolEquipo } from './equipo';

/** Sobre estándar de las rutas del panel: `{ data }` en éxito, `{ error }` en fallo. */
export const ok = <T,>(data: T, status = 200) =>
  NextResponse.json({ data }, { status });

export const okCon = (payload: Record<string, unknown>, status = 200) =>
  NextResponse.json(payload, { status });

export const fail = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

/** Error con estado propio: lo lanza el handler y el envoltorio lo traduce a respuesta. */
export class ErrorHttp extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ErrorHttp';
  }
}

export interface ContextoAdmin {
  user: { id: string };
  conjuntoId: string;
  /** Con qué rol pertenece el llamante al conjunto. Útil para auditar quién hizo qué. */
  rol: RolEquipo;
  /** El JSON del cuerpo, o el `FormData` ya leído en las rutas multipart. */
  body: any;
  req: Request;
  /** El token del llamante, para reenviarlo a las edge functions que lo exigen. */
  accessToken: string;
}

export interface OpcionesAdmin {
  /**
   * Roles del equipo que pueden usar la ruta. **Por defecto solo `Admin`.**
   *
   * El default no es una precaución teórica: a `admins_conjuntos` entra todo el equipo, así
   * que antes de existir esta opción un recepcionista podía llamar a cualquier ruta de
   * `/api/v1/admin/**` de su conjunto. Dejarlo en `['Admin']` cierra esa puerta para todas
   * las rutas que no digan lo contrario.
   */
  roles?: RolEquipo[];
  /**
   * De dónde sale el `conjunto_id`. Por defecto del cuerpo.
   * `recaudos/reintentar` lo resuelve desde la base: recibe el id de la carga y el
   * conjunto sale de esa fila, no de lo que mande el cliente.
   */
  resolverConjunto?: (body: any, req: Request) => Promise<string | null> | string | null;
  /**
   * `true` para rutas `multipart/form-data`. El cuerpo se lee como `FormData` y se pasa
   * al handler ya leído: `req.formData()` solo puede consumirse una vez.
   */
  formData?: boolean;
}

/**
 * Envuelve un handler con el preámbulo de autorización que estaba repetido en las diez
 * rutas de `admin/**`: sesión, conjunto y pertenencia real del administrador.
 *
 * No es una comodidad: con RLS desactivado en toda la base, esta comprobación es la
 * única frontera de autorización que existe. Tenerla en un solo sitio evita que una
 * ruta nueva se olvide de ella.
 */
export function withAdminConjunto(
  handler: (ctx: ContextoAdmin) => Promise<Response>,
  opts: OpcionesAdmin = {}
) {
  return async (req: Request): Promise<Response> => {
    try {
      const user = await getAuthUser(req);
      if (!user) return fail('No autorizado', 401);

      const accessToken = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? '';

      // Se lee una sola vez y se reparte: el cuerpo de una Request no se puede releer.
      const body = opts.formData
        ? await req.formData()
        : await req.json().catch(() => ({}));

      const conjuntoId = opts.resolverConjunto
        ? await opts.resolverConjunto(body, req)
        : opts.formData
          ? String((body as FormData).get('conjunto_id') ?? '')
          : body?.conjunto_id;

      if (!conjuntoId) return fail('Falta el conjunto_id', 400);

      const rol = await rolEnConjunto(user.id, conjuntoId);
      const permitidos = opts.roles ?? ['Admin'];

      if (!rol || !permitidos.includes(rol)) {
        return fail('No tienes permiso sobre este conjunto', 403);
      }

      return await handler({ user, conjuntoId, rol, body, req, accessToken });
    } catch (error: any) {
      if (error instanceof ErrorHttp) {
        return fail(error.message, error.status);
      }
      console.error(`Error en ${req.method} ${new URL(req.url).pathname}:`, error);
      return fail(error?.message || 'Error interno del servidor', 500);
    }
  };
}

/** El rol global, tal cual está escrito en `users.rol`: la comparación distingue mayúsculas. */
const ROL_SUPERADMIN = 'SuperAdmin';

export interface ContextoSuperAdmin {
  user: { id: string };
  body: any;
  req: Request;
  accessToken: string;
}

/**
 * Envuelve un handler con la autorización del rol global.
 *
 * Hermano de `withAdminConjunto` y no una opción suya: aquel resuelve un `conjunto_id` y mira
 * la pertenencia a `admins_conjuntos`, donde el SuperAdmin no está. Y `RolEquipo` sigue sin
 * incluirlo a propósito —si entrara ahí, se colaría en el `roles` de las veinte rutas de
 * `admin/**` y se reabriría la escalada de privilegios que se cerró con Recepción—.
 *
 * Con RLS desactivada, `anon` puede escribir en `suscripciones` desde el navegador: esta
 * comprobación de servidor es la única frontera que hay.
 */
export function withSuperAdmin(
  handler: (ctx: ContextoSuperAdmin) => Promise<Response>
) {
  return async (req: Request): Promise<Response> => {
    try {
      const user = await getAuthUser(req);
      if (!user) return fail('No autorizado', 401);

      const { data: perfil } = await supabaseAdmin
        .from('users')
        .select('rol, estado')
        .eq('id', user.id)
        .maybeSingle();

      if (perfil?.rol !== ROL_SUPERADMIN || perfil?.estado === false) {
        return fail('Necesitas ser SuperAdmin', 403);
      }

      const accessToken = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? '';
      const body = await req.json().catch(() => ({}));

      return await handler({ user, body, req, accessToken });
    } catch (error: any) {
      if (error instanceof ErrorHttp) {
        return fail(error.message, error.status);
      }
      console.error(`Error en ${req.method} ${new URL(req.url).pathname}:`, error);
      return fail(error?.message || 'Error interno del servidor', 500);
    }
  };
}
