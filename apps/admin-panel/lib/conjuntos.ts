import type { BadgeProps } from "@/components/ui/badge";

/**
 * Vocabulario compartido de conjuntos, planes y pagos de suscripción.
 *
 * Vive en `lib/` y no dentro de `features/conjuntos/` porque lo consumen a la vez el
 * módulo del panel y las rutas de `/api/v1/pagos/*`, y una feature nunca importa de otra.
 */

/* ── Periodo de la suscripción ────────────────────────────────────────────── */

/** Espejo de `suscripciones.tipo_periodo`, que en la base sigue siendo texto libre. */
export type TipoPeriodo = "mensual" | "trimestral" | "anual";

export const PERIODOS: TipoPeriodo[] = ["mensual", "trimestral", "anual"];

export const ETIQUETA_PERIODO: Record<TipoPeriodo, string> = {
  mensual: "Mensual",
  trimestral: "Trimestral",
  anual: "Anual",
};

/** Cada cuántos meses se cobra. `anual` son 12 meses, no un salto de año aparte. */
export const MESES_POR_PERIODO: Record<TipoPeriodo, number> = {
  mensual: 1,
  trimestral: 3,
  anual: 12,
};

export const esPeriodo = (valor: unknown): valor is TipoPeriodo =>
  typeof valor === "string" && PERIODOS.includes(valor.toLowerCase().trim() as TipoPeriodo);

/** Normaliza lo que llegue del cliente o de `datos_pago` al valor canónico. */
export function normalizarPeriodo(valor: unknown): TipoPeriodo | null {
  if (typeof valor !== "string") return null;
  const limpio = valor.toLowerCase().trim() as TipoPeriodo;
  return PERIODOS.includes(limpio) ? limpio : null;
}

/** Columna de `planes` que guarda el precio de ese periodo. */
export const COLUMNA_PRECIO: Record<TipoPeriodo, string> = {
  mensual: "precio_mensual",
  trimestral: "precio_trimestral",
  anual: "precio_anual",
};

/* ── Planes ───────────────────────────────────────────────────────────────── */

/** Fila de `planes`, con los tres precios. */
export interface Plan {
  id: string;
  nombre: string;
  subtipo: string;
  descripcion: string | null;
  precio_mensual: number;
  precio_trimestral: number;
  precio_anual: number;
  max_residentes: number;
}

/**
 * Precio de lista del plan para ese periodo.
 *
 * Vive aquí y no en `features/conjuntos/` desde que también lo usa la asignación manual del
 * SuperAdmin: una feature nunca importa de otra.
 */
export const precioDelPlan = (plan: Plan, periodo: TipoPeriodo): number =>
  Number((plan as unknown as Record<string, number>)[COLUMNA_PRECIO[periodo]]);

/* ── Estado del pago ──────────────────────────────────────────────────────── */

/** Espejo del enum `estado_pago`. */
export type EstadoPago = "pendiente" | "aprobado" | "rechazado" | "expirado";

/** Un pago en cualquiera de estos estados ya fue resuelto: el webhook no lo reprocesa. */
export const ESTADOS_PAGO_FINALES: EstadoPago[] = ["aprobado", "rechazado", "expirado"];

export const ETIQUETA_ESTADO_PAGO: Record<EstadoPago, string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  expirado: "Expirado",
};

export const VARIANTE_ESTADO_PAGO:
  Record<EstadoPago, NonNullable<BadgeProps["variant"]>> = {
  pendiente: "warning",
  aprobado: "success",
  rechazado: "danger",
  expirado: "neutral",
};

/* ── Datos del conjunto ───────────────────────────────────────────────────── */

/** `conjuntos.tipo_vivienda` es texto libre, pero solo se usan estos dos valores. */
export const TIPOS_VIVIENDA = ["Apartamentos", "Casas"] as const;
export type TipoVivienda = (typeof TIPOS_VIVIENDA)[number];

export const ESTRATOS = [1, 2, 3, 4, 5, 6];

/**
 * Suma un periodo a una fecha.
 *
 * `setMonth` desborda solo: sumar 1 mes al 31 de enero da el 2 o 3 de marzo. Se acepta
 * porque es lo que hacía el webhook anterior y cambiarlo movería las fechas de fin de
 * las suscripciones ya vendidas.
 */
export function sumarPeriodo(base: Date, periodo: TipoPeriodo): Date {
  const nueva = new Date(base);
  nueva.setMonth(nueva.getMonth() + MESES_POR_PERIODO[periodo]);
  return nueva;
}
