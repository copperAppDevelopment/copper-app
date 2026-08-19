'use client';

import { useSesionPanel } from "./useSesionPanel";
import type { SesionPanel } from "./useSesionPanel";

/** Sesión de `/recepcion`: exige rol `Recepcion`. */
const SOLO_RECEPCION = ["Recepcion"] as const;

export function useRecepcionSession(): SesionPanel {
  return useSesionPanel([...SOLO_RECEPCION]);
}
