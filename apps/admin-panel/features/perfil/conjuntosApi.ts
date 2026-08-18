import { supabase } from "@/lib/supabaseClient";
import { postConAuth } from "@/lib/apiClient";
import type { ConjuntoAdmin, MiembroEquipo, NuevoMiembro } from "./conjuntosTypes";
import type { RolEquipo } from "@/lib/equipo";

/** Todos los conjuntos del admin, no solo el seleccionado. */
export async function listarMisConjuntos(userId: string): Promise<ConjuntoAdmin[]> {
  const { data, error } = await supabase
    .from("vista_mis_conjuntos")
    .select("*")
    .eq("user_id", userId)
    .order("nombre_conjunto", { ascending: true });

  if (error) throw error;
  return (data as unknown as ConjuntoAdmin[]) || [];
}

export async function listarEquipo(conjuntoId: string): Promise<MiembroEquipo[]> {
  const { data, error } = await supabase
    .from("admins_conjuntos")
    .select("id, user_id, es_propietario, activo, fecha_asignacion, users(nombres, apellidos, email, rol)")
    .eq("conjunto_id", conjuntoId)
    .eq("activo", true);

  if (error) throw error;

  return ((data as any[]) || []).map(fila => ({
    id: fila.id,
    user_id: fila.user_id,
    es_propietario: fila.es_propietario,
    activo: fila.activo,
    fecha_asignacion: fila.fecha_asignacion,
    nombres: fila.users?.nombres ?? null,
    apellidos: fila.users?.apellidos ?? null,
    email: fila.users?.email ?? null,
    rol: fila.users?.rol ?? null,
  }));
}

export function invitarMiembro(conjuntoId: string, payload: NuevoMiembro) {
  return postConAuth("/api/v1/admin/equipo", { conjunto_id: conjuntoId, ...payload });
}

export function vincularMiembro(conjuntoId: string, userId: string, rol: RolEquipo) {
  return postConAuth("/api/v1/admin/equipo/vincular", {
    conjunto_id: conjuntoId,
    user_id: userId,
    rol,
  });
}

export function removerMiembro(conjuntoId: string, miembroId: string) {
  return postConAuth("/api/v1/admin/equipo/remover", {
    conjunto_id: conjuntoId,
    miembro_id: miembroId,
  });
}
