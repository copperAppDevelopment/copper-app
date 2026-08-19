import type { BadgeProps } from "@/components/ui/badge";

/**
 * Vocabulario de `contactos.estado`, espejo del enum `contacto_estado_enum`.
 *
 * Los valores van capitalizados y con tilde, tal como están guardados: son también los que se
 * muestran, así que no hace falta tabla de etiquetas.
 */
export type EstadoContacto = "Pendiente" | "Atendida" | "Rechazada";

export const ESTADOS_CONTACTO: EstadoContacto[] = ["Pendiente", "Atendida", "Rechazada"];

export const esEstadoContacto = (valor: unknown): valor is EstadoContacto =>
  typeof valor === "string" && (ESTADOS_CONTACTO as string[]).includes(valor);

export const VARIANTE_ESTADO_CONTACTO:
  Record<EstadoContacto, NonNullable<BadgeProps["variant"]>> = {
  Pendiente: "warning",
  Atendida: "success",
  Rechazada: "danger",
};

export const varianteContacto = (valor: string | null): NonNullable<BadgeProps["variant"]> =>
  VARIANTE_ESTADO_CONTACTO[valor as EstadoContacto] ?? "neutral";

/**
 * `nombreCompleto` de `lib/formato.ts` espera `{ nombres, apellidos }` en plural, y aquí las
 * columnas son singulares.
 */
export const nombreContacto = (
  contacto: { nombre?: string | null; apellido?: string | null } | null | undefined
): string => [contacto?.nombre, contacto?.apellido].filter(Boolean).join(" ") || "Sin nombre";
