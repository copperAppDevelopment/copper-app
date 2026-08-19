import { supabase } from "@/lib/supabaseClient";
import type { KpisSuperAdmin, SuscripcionReciente } from "./types";

/** Cuántas suscripciones muestra el dashboard. */
export const ULTIMAS_SUSCRIPCIONES = 5;

export async function obtenerKpis(): Promise<KpisSuperAdmin | null> {
  const { data, error } = await supabase
    .from("vista_superadmin_kpis")
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Error al cargar KPIs de vista_superadmin_kpis:", error);
    return null;
  }
  return (data as unknown as KpisSuperAdmin) || null;
}

/**
 * Las últimas suscripciones de toda la plataforma.
 *
 * Va contra `vista_superadmin_ultimas_suscripciones` y no contra
 * `vista_superadmin_nuevas_suscripciones`, que filtra por el mes en curso y devolvería una
 * lista vacía cada día 1. La vista ya viene ordenada, pero el `order` explícito evita
 * depender de eso: PostgREST puede reordenar.
 */
export async function listarUltimasSuscripciones(): Promise<SuscripcionReciente[]> {
  const { data, error } = await supabase
    .from("vista_superadmin_ultimas_suscripciones")
    .select("*")
    .order("fecha_suscripcion", { ascending: false })
    .limit(ULTIMAS_SUSCRIPCIONES);

  if (error) {
    console.error("Error al cargar vista_superadmin_ultimas_suscripciones:", error);
    return [];
  }
  return (data as unknown as SuscripcionReciente[]) || [];
}
