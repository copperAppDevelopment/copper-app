import { supabase } from "@/lib/supabaseClient";
import { postConAuth, getConAuth } from "@/lib/apiClient";
import { nombreCompleto } from "@/lib/formato";
import type { TipoPeriodo } from "@/lib/conjuntos";
import type { PlanCompleto } from "@/lib/planesData";
import type { EstadoContacto } from "@/lib/contactos";
import type {
  KpisSuperAdmin,
  SuscripcionReciente,
  FilaAsignacion,
  AdminDelConjunto,
  Contacto,
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

export { listarPlanesActivos, listarTodosLosPlanes } from "@/lib/planesData";

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

// `postConAuth` devuelve el sobre entero, `{ data }`: hay que desenvolverlo aquí, como hacen
// las demás features. Sin esto el modal leía `respuesta.actualizada` sobre el sobre y siempre
// salía indefinido.
export async function asignarPlan(payload: PayloadAsignacion): Promise<RespuestaAsignacion> {
  const { data } = await postConAuth("/api/v1/superadmin/suscripciones", payload);
  return data as RespuestaAsignacion;
}

export const revocarSuscripcion = (suscripcionId: string) =>
  postConAuth("/api/v1/superadmin/suscripciones/revocar", { suscripcion_id: suscripcionId });

/* ── Gestión de planes ────────────────────────────────────────────────────── */

/** Los campos del formulario. Los números viajan como texto y los convierte el servidor. */
export interface DatosPlan {
  nombre: string;
  subtipo: string;
  descripcion: string;
  precio_mensual: string;
  precio_trimestral: string;
  precio_anual: string;
  max_residentes: string;
}

export const PLAN_VACIO: DatosPlan = {
  nombre: "",
  subtipo: "Básico",
  descripcion: "",
  precio_mensual: "",
  precio_trimestral: "",
  precio_anual: "",
  max_residentes: "",
};

export async function guardarPlan(
  datos: DatosPlan,
  planId?: string
): Promise<{ plan_id: string; creado: boolean; activo?: boolean }> {
  const { data } = await postConAuth("/api/v1/superadmin/planes", { ...datos, plan_id: planId });
  return data;
}

export const cambiarActivoPlan = (planId: string, activo: boolean) =>
  postConAuth("/api/v1/superadmin/planes", { plan_id: planId, solo_activo: true, activo });

/* ── Contactos ────────────────────────────────────────────────────────────── */

/** Por el servidor, no directo: `contactos` tiene los grants de `anon` revocados. */
export const listarContactos = () =>
  getConAuth<Contacto[]>("/api/v1/superadmin/contactos");

export const marcarContacto = (contactoId: string, estado: EstadoContacto) =>
  postConAuth("/api/v1/superadmin/contactos", { contacto_id: contactoId, estado });

export const borrarContacto = (contactoId: string) =>
  postConAuth("/api/v1/superadmin/contactos", { contacto_id: contactoId, eliminar: true });

/** De la fila a lo que espera el formulario. Los números salen de PostgREST como texto. */
export const planAFormulario = (plan: PlanCompleto): DatosPlan => ({
  nombre: plan.nombre,
  subtipo: plan.subtipo,
  descripcion: plan.descripcion ?? "",
  precio_mensual: String(plan.precio_mensual ?? ""),
  precio_trimestral: String(plan.precio_trimestral ?? ""),
  precio_anual: String(plan.precio_anual ?? ""),
  max_residentes: String(plan.max_residentes ?? ""),
});
