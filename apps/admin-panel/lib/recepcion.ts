import type { BadgeProps } from "@/components/ui/badge";

/**
 * Vocabulario de recepción, espejo de los enums `estado_visita_enum` y `estado_envio_enum`.
 *
 * Vive en `lib/` porque lo usan la feature y las rutas de API, y una feature nunca importa
 * de otra.
 */

export type EstadoVisita = "pendiente" | "aprobado" | "rechazado";

export const ESTADOS_VISITA: EstadoVisita[] = ["pendiente", "aprobado", "rechazado"];

export const ETIQUETA_ESTADO_VISITA: Record<EstadoVisita, string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobada",
  rechazado: "Rechazada",
};

export const VARIANTE_ESTADO_VISITA:
  Record<EstadoVisita, NonNullable<BadgeProps["variant"]>> = {
  pendiente: "warning",
  aprobado: "success",
  rechazado: "danger",
};

export const esEstadoVisita = (valor: unknown): valor is EstadoVisita =>
  typeof valor === "string" && ESTADOS_VISITA.includes(valor as EstadoVisita);

/** Los dos únicos con los que se puede responder a una visita pendiente. */
export const RESPUESTAS_VISITA: EstadoVisita[] = ["aprobado", "rechazado"];

export type EstadoEnvio = "pendiente" | "entregado";

export const ESTADOS_ENVIO: EstadoEnvio[] = ["pendiente", "entregado"];

export const ETIQUETA_ESTADO_ENVIO: Record<EstadoEnvio, string> = {
  pendiente: "Por entregar",
  entregado: "Entregado",
};

export const VARIANTE_ESTADO_ENVIO:
  Record<EstadoEnvio, NonNullable<BadgeProps["variant"]>> = {
  pendiente: "warning",
  entregado: "success",
};

export const esEstadoEnvio = (valor: unknown): valor is EstadoEnvio =>
  typeof valor === "string" && ESTADOS_ENVIO.includes(valor as EstadoEnvio);

/**
 * Quién respondió a la visita, en una frase.
 *
 * El rol importa: no es lo mismo que la autorice el residente desde el móvil que la
 * portería en su nombre, y la vista expone los dos datos justo para poder distinguirlo.
 */
export function textoAutorizacion(
  nombre: string | null,
  rol: string | null
): string | null {
  const limpio = (nombre ?? "").trim();
  if (!limpio) return null;
  return rol === "Recepcion" ? `${limpio} · portería` : limpio;
}
