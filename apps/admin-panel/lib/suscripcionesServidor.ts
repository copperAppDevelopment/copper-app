import { supabaseAdmin } from "./supabaseAdmin";
import { sumarPeriodo, type TipoPeriodo } from "./conjuntos";
import { ErrorHttp } from "./apiHandler";

/**
 * Escritura de suscripciones, compartida por el webhook de Wompi y por la asignación manual
 * del SuperAdmin.
 *
 * Vive aquí y no en una feature porque la usan dos rutas de API distintas, y porque los
 * efectos secundarios de dar de alta una suscripción **no están en ningún trigger**:
 * `suscripciones` no tiene ni uno. Si esto no habilita el conjunto y al administrador, quedan
 * con plan pero sin acceso.
 */

/** Desde cuándo cuenta el periodo nuevo. */
export type InicioVigencia =
  /** Empieza hoy: el tiempo que quedara de la suscripción anterior se pierde. */
  | "hoy"
  /** Se encadena a la fecha de fin vigente si aún es futura. Es lo que hace una renovación. */
  | "vencimiento";

export interface DatosSuscripcion {
  conjuntoId: string;
  adminUserId: string;
  planId: string;
  periodo: TipoPeriodo;
  precio: number;
  /** `'wompi'` o `'manual'`: hoy no había forma de distinguir el origen de una suscripción. */
  metodoPago: string;
  referencia: string;
  desde: InicioVigencia;
}

export interface ResultadoSuscripcion {
  suscripcionId: string;
  /** `false` cuando se creó la primera suscripción del conjunto. */
  actualizada: boolean;
  fechaFin: string;
}

/**
 * Da de alta o renueva la suscripción de un conjunto.
 *
 * **Actualiza la vigente en vez de insertar** cuando ya existe. Antes el webhook insertaba a
 * ciegas y un conjunto acabó con tres suscripciones activas a la vez; ahora además hay un
 * índice único parcial que lo impediría con un error de base de datos.
 *
 * «La vigente» es la de mayor `fecha_fin`, el mismo criterio de
 * `vista_mis_conjuntos_con_suscripcion` y de `suscripcionVigente()` en el panel.
 */
export async function asignarSuscripcion(
  datos: DatosSuscripcion
): Promise<ResultadoSuscripcion> {
  const ahora = new Date();

  const { data: vigente } = await supabaseAdmin
    .from("suscripciones")
    .select("id, fecha_fin")
    .eq("conjunto_id", datos.conjuntoId)
    .order("fecha_fin", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Renovar antes de tiempo no debe regalarle días a la casa: si todavía quedaba vigencia, el
  // periodo nuevo se encadena a la fecha de fin en lugar de empezar hoy.
  const fin = vigente ? new Date(vigente.fecha_fin) : null;
  const base =
    datos.desde === "vencimiento" && fin && fin > ahora ? fin : ahora;

  const fechaFin = sumarPeriodo(base, datos.periodo).toISOString();

  const campos = {
    admin_user_id: datos.adminUserId,
    plan_id: datos.planId,
    tipo_periodo: datos.periodo,
    fecha_fin: fechaFin,
    // Minúscula: el enum `estado_suscripcion` rechaza el 'Activa' que escribía la edge
    // function que esto reemplazó.
    estado: "activa",
    precio_pagado: datos.precio,
    metodo_pago: datos.metodoPago,
    referencia_pago: datos.referencia,
    updated_at: ahora.toISOString(),
  };

  let suscripcionId: string;

  if (vigente) {
    const { error } = await supabaseAdmin
      .from("suscripciones")
      .update({
        ...campos,
        // Si el periodo arranca hoy, la fecha de inicio también: si no, la ficha mostraría
        // una vigencia que no se corresponde con nada.
        ...(datos.desde === "hoy" ? { fecha_inicio: ahora.toISOString() } : {}),
      } as any)
      .eq("id", vigente.id);

    if (error) throw new ErrorHttp(`No se pudo actualizar la suscripción: ${error.message}`, 500);
    suscripcionId = vigente.id;
  } else {
    const { data: nueva, error } = await supabaseAdmin
      .from("suscripciones")
      .insert({
        ...campos,
        conjunto_id: datos.conjuntoId,
        fecha_inicio: ahora.toISOString(),
      } as any)
      .select("id")
      .single();

    if (error || !nueva) {
      throw new ErrorHttp(`No se pudo crear la suscripción: ${error?.message ?? ""}`, 500);
    }
    suscripcionId = nueva.id;
  }

  await habilitarConjuntoYAdmin(datos.conjuntoId, datos.adminUserId);
  await reconciliarEstados();

  return { suscripcionId, actualizada: Boolean(vigente), fechaFin };
}

/** Corta la vigencia de una suscripción. No borra la fila: el historial se conserva. */
export async function revocarSuscripcion(suscripcionId: string): Promise<void> {
  // Un segundo atrás y no `now()`: si la fecha quedara exactamente en el instante actual,
  // el recálculo de estado dependería de qué microsegundo se evalúe primero.
  const fin = new Date(Date.now() - 1000).toISOString();

  const { error } = await supabaseAdmin
    .from("suscripciones")
    .update({ fecha_fin: fin, estado: "vencida", updated_at: new Date().toISOString() } as any)
    .eq("id", suscripcionId);

  if (error) throw new ErrorHttp(`No se pudo revocar la suscripción: ${error.message}`, 500);

  await reconciliarEstados();
}

/**
 * `activo` es la única fuente de verdad del conjunto: la columna `estado` es texto libre y
 * quedó sucia (`'true'`, `'Activo'`, `NULL`) cuando algo escribió un booleano ahí.
 *
 * **Un pago no levanta un veto.** Antes esto reactivaba sin mirar nada, así que el primer cobro
 * que entrara deshacía en silencio la decisión del SuperAdmin. `conjuntos.vetado` y
 * `users.cuenta_bloqueada` distinguen «inactivo por impago» —que un pago sí resuelve— de
 * «desactivado a mano».
 */
async function habilitarConjuntoYAdmin(conjuntoId: string, adminUserId: string) {
  await supabaseAdmin
    .from("conjuntos")
    .update({ activo: true })
    .eq("id", conjuntoId)
    .eq("vetado", false);

  await supabaseAdmin
    .from("users")
    .update({ estado: true } as any)
    .eq("id", adminUserId)
    .eq("cuenta_bloqueada", false);
}

/**
 * Deja el `estado` de todas las suscripciones acorde a su `fecha_fin`.
 *
 * Se llama a la misma función que el cron de las 02:00 en vez de fijar el estado a mano: la
 * regla de los 30 días de aviso y los 15 de gracia vive en la base, y una asignación que la
 * contradijera duraría hasta esa noche.
 */
async function reconciliarEstados() {
  const { error } = await supabaseAdmin.rpc("actualizar_estados_suscripciones");
  if (error) console.error("Error al recalcular los estados de suscripción:", error);
}
