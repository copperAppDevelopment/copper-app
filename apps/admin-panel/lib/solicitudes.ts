import type { BadgeProps } from "@/components/ui/badge";

/**
 * Vocabulario de `solicitudes`, compartido entre el módulo de solicitudes y la tabla del
 * dashboard. Vive en `lib/` porque lo usan dos features y la convención del README prohíbe
 * que uno importe al otro.
 *
 * Los valores son los de los enums de la base tal cual (`solicitud_estado_enum`,
 * `solicitud_prioridad_enum`, `solicitud_tipo_enum`), en minúsculas y plural: mapear contra
 * cualquier otra forma deja todas las insignias en gris.
 */
export type EstadoSolicitud =
  | "pendientes" | "asignadas" | "en_proceso" | "completadas" | "canceladas";

export type PrioridadSolicitud = "baja" | "media" | "alta";

export type TipoSolicitud =
  | "Mantenimiento" | "Seguridad" | "Administración" | "Parqueaderos" | "Otros";

type Variante = NonNullable<BadgeProps["variant"]>;

export const ESTADOS: EstadoSolicitud[] =
  ["pendientes", "asignadas", "en_proceso", "completadas", "canceladas"];

export const PRIORIDADES: PrioridadSolicitud[] = ["baja", "media", "alta"];

/** Debe seguir coincidiendo con el selector del móvil (`CreateRequestModal.tsx`). */
export const TIPOS: TipoSolicitud[] =
  ["Mantenimiento", "Seguridad", "Administración", "Parqueaderos", "Otros"];

export const ETIQUETA_ESTADO: Record<EstadoSolicitud, string> = {
  pendientes: "Pendiente",
  asignadas: "Asignada",
  en_proceso: "En proceso",
  completadas: "Completada",
  canceladas: "Cancelada",
};

export const VARIANTE_ESTADO: Record<EstadoSolicitud, Variante> = {
  pendientes: "warning",
  asignadas: "info",
  en_proceso: "brand",
  completadas: "success",
  canceladas: "neutral",
};

export const ETIQUETA_PRIORIDAD: Record<PrioridadSolicitud, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

export const VARIANTE_PRIORIDAD: Record<PrioridadSolicitud, Variante> = {
  baja: "success",
  media: "warning",
  alta: "danger",
};

/** Traducen un valor que llega como `string | null` desde la vista. */
export const etiquetaEstado = (valor: string | null) =>
  ETIQUETA_ESTADO[valor as EstadoSolicitud] ?? "Sin estado";

export const varianteEstado = (valor: string | null): Variante =>
  VARIANTE_ESTADO[valor as EstadoSolicitud] ?? "neutral";

export const etiquetaPrioridad = (valor: string | null) =>
  ETIQUETA_PRIORIDAD[valor as PrioridadSolicitud] ?? "Sin definir";

export const variantePrioridad = (valor: string | null): Variante =>
  VARIANTE_PRIORIDAD[valor as PrioridadSolicitud] ?? "neutral";

export const esEstado = (valor: string): valor is EstadoSolicitud =>
  (ESTADOS as string[]).includes(valor);

export const esPrioridad = (valor: string): valor is PrioridadSolicitud =>
  (PRIORIDADES as string[]).includes(valor);

export const esTipo = (valor: string): valor is TipoSolicitud =>
  (TIPOS as string[]).includes(valor);
