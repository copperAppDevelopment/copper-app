'use client';

import { useSesionPanel } from "./useSesionPanel";
import type { SesionPanel } from "./useSesionPanel";

/**
 * Sesión de las páginas de `/admin`: exige rol `Admin`.
 *
 * La lógica está en `useSesionPanel`, parametrizada por rol, porque la página de recepción
 * la comparten dos rutas con guards distintos.
 */
export type AdminSession = SesionPanel;

const SOLO_ADMIN = ["Admin"] as const;

export function useAdminSession(): AdminSession {
  return useSesionPanel([...SOLO_ADMIN]);
}
