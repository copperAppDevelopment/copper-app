import { supabase } from "@/lib/supabaseClient";
import { postConAuth } from "@/lib/apiClient";
import { nombreCompleto } from "@/lib/formato";
import type { TipoPeriodo, Plan } from "@/lib/conjuntos";
import type {
  KpisSuperAdmin,
  SuscripcionReciente,
  FilaAsignacion,
  AdminDelConjunto,
} from "./types";

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

/* ── Asignación de planes ─────────────────────────────────────────────────── */

/** Un conjunto por fila, con su suscripción vigente. Las lecturas van directas, como el resto. */
export async function listarAsignaciones(): Promise<FilaAsignacion[]> {
  const { data, error } = await supabase
    .from("vista_superadmin_asignacion")
    .select("*")
    .order("nombre_conjunto", { ascending: true });

  if (error) throw error;
  return (data as unknown as FilaAsignacion[]) || [];
}

export async function listarPlanesActivos(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from("planes")
    .select("id, nombre, subtipo, descripcion, precio_mensual, precio_trimestral, precio_anual, max_residentes")
    .eq("activo", true)
    .order("precio_mensual", { ascending: true });

  if (error) throw error;
  return (data as unknown as Plan[]) || [];
}

/**
 * Los administradores activos del conjunto: la suscripción tiene que quedar a nombre de uno.
 *
 * No sirve `vista_admins_dropdown`, que no expone el rol: a `admins_conjuntos` entra todo el
 * equipo —incluido el recepcionista— y la suscripción no puede quedar a su nombre.
 */
export async function listarAdminsDeConjunto(conjuntoId: string): Promise<AdminDelConjunto[]> {
  const { data, error } = await supabase
    .from("admins_conjuntos")
    .select("user_id, es_propietario, users!inner(nombres, apellidos, email, rol, estado)")
    .eq("conjunto_id", conjuntoId)
    .eq("activo", true)
    .eq("users.rol", "Admin")
    .eq("users.estado", true);

  if (error) throw error;

  return ((data as any[]) || [])
    .map(fila => {
      const u = Array.isArray(fila.users) ? fila.users[0] : fila.users;
      return {
        user_id: fila.user_id,
        nombre_completo: nombreCompleto(u, ""),
        email: u?.email ?? null,
        es_propietario: fila.es_propietario,
      };
    })
    // El propietario primero: es el que se preselecciona.
    .sort((a, b) => Number(b.es_propietario) - Number(a.es_propietario));
}

export interface PayloadAsignacion {
  conjunto_id: string;
  plan_id: string;
  tipo_periodo: TipoPeriodo;
  admin_user_id: string;
  precio_pagado: number;
  desde: "hoy" | "vencimiento";
}

export interface RespuestaAsignacion {
  suscripcionId: string;
  actualizada: boolean;
  fechaFin: string;
  conjunto: string;
  plan: string;
}

export const asignarPlan = (payload: PayloadAsignacion) =>
  postConAuth<RespuestaAsignacion>("/api/v1/superadmin/suscripciones", payload);

export const revocarSuscripcion = (suscripcionId: string) =>
  postConAuth<{ suscripcion_id: string }>("/api/v1/superadmin/suscripciones/revocar", {
    suscripcion_id: suscripcionId,
  });
