import type { BadgeProps } from "@/components/ui/badge";

/**
 * Roles del equipo de un conjunto.
 *
 * «Administrador secundario» no es un rol propio en la base: es `users.rol = 'Admin'` con
 * `admins_conjuntos.es_propietario = false`. El login enruta por `users.rol`, así que estos
 * son los valores que hay que escribir para que cada quien aterrice en su dashboard.
 */
export type RolEquipo = "Admin" | "Recepcion" | "Contador";

export const ROLES_EQUIPO: RolEquipo[] = ["Admin", "Recepcion", "Contador"];

export const ETIQUETA_ROL: Record<RolEquipo, string> = {
  Admin: "Administrador secundario",
  Recepcion: "Recepcionista",
  Contador: "Contador",
};

/** Opciones del selector de invitación. */
export const OPCIONES_ROL = ROLES_EQUIPO.map(r => ({ value: r, label: ETIQUETA_ROL[r] }));

export const esRolEquipo = (valor: string): valor is RolEquipo =>
  (ROLES_EQUIPO as string[]).includes(valor);

/** El propietario se distingue del administrador secundario por `es_propietario`. */
export function etiquetaMiembro(rol: string | null, esPropietario: boolean | null): string {
  if (rol === "Admin" && esPropietario) return "Propietario";
  return ETIQUETA_ROL[rol as RolEquipo] ?? rol ?? "Sin rol";
}

export function varianteMiembro(
  rol: string | null,
  esPropietario: boolean | null
): NonNullable<BadgeProps["variant"]> {
  if (rol === "Admin" && esPropietario) return "brand";
  if (rol === "Admin") return "info";
  return "neutral";
}
