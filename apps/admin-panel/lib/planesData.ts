import { supabase } from "./supabaseClient";
import type { Plan } from "./conjuntos";

/**
 * Consultas de `planes`, compartidas por el modal de plan del administrador y por el módulo de
 * planes del SuperAdmin.
 *
 * Vive aquí y no en [`conjuntos.ts`](./conjuntos.ts) —que es el vocabulario y lo importan rutas
 * de servidor— porque este archivo trae `supabaseClient`, con su anon key de navegador. Es el
 * mismo reparto que ya hay entre `conceptos.ts` y `conceptosData.ts`.
 */

/** Espejo literal del CHECK `planes_subtipo_check`: la base rechaza cualquier otro valor. */
export const SUBTIPOS_PLAN = ["Básico", "Profesional", "Enterprise"] as const;
export type SubtipoPlan = (typeof SUBTIPOS_PLAN)[number];

export const esSubtipoPlan = (valor: unknown): valor is SubtipoPlan =>
  typeof valor === "string" && (SUBTIPOS_PLAN as readonly string[]).includes(valor);

/**
 * Cuántos planes pueden estar activos a la vez.
 *
 * Es el número de tarjetas que la landing sabe pintar (`grid lg:grid-cols-3`). Lo hace cumplir
 * el trigger `trg_planes_tope_activos`; esta constante es solo para avisar antes en la interfaz.
 */
export const MAX_PLANES_ACTIVOS = 3;

/** Un plan con lo que el módulo de gestión necesita y las lecturas normales no piden. */
export interface PlanCompleto extends Plan {
  activo: boolean;
  created_at: string | null;
}

const COLUMNAS =
  "id, nombre, subtipo, descripcion, precio_mensual, precio_trimestral, precio_anual, max_residentes";

/** Los planes que se pueden contratar. Los inactivos no los aceptan ni el checkout ni la asignación. */
export async function listarPlanesActivos(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from("planes")
    .select(COLUMNAS)
    .eq("activo", true)
    .order("precio_mensual", { ascending: true });

  if (error) throw error;
  return (data as unknown as Plan[]) || [];
}

/** Todos, incluidos los inactivos: solo lo usa el módulo del SuperAdmin. */
export async function listarTodosLosPlanes(): Promise<PlanCompleto[]> {
  const { data, error } = await supabase
    .from("planes")
    .select(`${COLUMNAS}, activo, created_at`)
    .order("precio_mensual", { ascending: true });

  if (error) throw error;
  return (data as unknown as PlanCompleto[]) || [];
}
