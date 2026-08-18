import type { BadgeProps } from "@/components/ui/badge";

/**
 * Vocabulario de `suscripciones.estado`, espejo de `estado_suscripcion` en la base.
 *
 * Los umbrales los aplica el cron diario a través de `estado_suscripcion_por_fecha`:
 * 30 días de aviso antes de vencer, 15 días de gracia después.
 */
export type EstadoSuscripcion = "activa" | "proxima" | "vencida" | "bloqueada";

export const ESTADOS_SUSCRIPCION: EstadoSuscripcion[] =
  ["activa", "proxima", "vencida", "bloqueada"];

export const ETIQUETA_ESTADO_SUSCRIPCION: Record<EstadoSuscripcion, string> = {
  activa: "Activa",
  proxima: "Próxima a vencer",
  vencida: "Vencida",
  bloqueada: "Bloqueada",
};

export const VARIANTE_ESTADO_SUSCRIPCION:
  Record<EstadoSuscripcion, NonNullable<BadgeProps["variant"]>> = {
  activa: "success",
  proxima: "warning",
  vencida: "danger",
  bloqueada: "neutral",
};

export const etiquetaSuscripcion = (valor: string | null) =>
  ETIQUETA_ESTADO_SUSCRIPCION[valor as EstadoSuscripcion] ?? "Sin suscripción";

export const varianteSuscripcion = (valor: string | null): NonNullable<BadgeProps["variant"]> =>
  VARIANTE_ESTADO_SUSCRIPCION[valor as EstadoSuscripcion] ?? "neutral";

/** Días entre hoy y la fecha, en negativo si ya pasó. */
export function diasHasta(fecha: string | null): number | null {
  if (!fecha) return null;
  const destino = new Date(fecha);
  if (Number.isNaN(destino.getTime())) return null;

  const hoy = new Date();
  const unDia = 24 * 60 * 60 * 1000;
  return Math.ceil(
    (Date.UTC(destino.getFullYear(), destino.getMonth(), destino.getDate()) -
      Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) / unDia
  );
}

/** Texto que acompaña a la insignia: cuánto falta o cuánto lleva vencida. */
export function textoVigencia(estado: string | null, fechaFin: string | null): string {
  const dias = diasHasta(fechaFin);
  if (dias === null) return "Sin suscripción registrada";
  if (estado === "activa") return `Vence en ${dias} días`;
  if (estado === "proxima") return dias === 1 ? "Vence mañana" : `Vence en ${dias} días`;
  const transcurridos = Math.abs(dias);
  return transcurridos === 1 ? "Venció ayer" : `Venció hace ${transcurridos} días`;
}
