import { supabase } from "@/lib/supabaseClient";
import { postConAuth } from "@/lib/apiClient";
import type { Solicitud, AdminAsignable, GestionSolicitud } from "./types";

export async function listarSolicitudes(conjuntoId: string): Promise<Solicitud[]> {
  const { data, error } = await supabase
    .from("vista_gestion_solicitudes_detalle")
    .select("*")
    .eq("conjunto_id", conjuntoId)
    .order("fecha_solicitud", { ascending: false });

  if (error) throw error;
  return (data as unknown as Solicitud[]) || [];
}

/** Los admins del conjunto a los que se puede asignar una solicitud. */
export async function listarAdminsAsignables(conjuntoId: string): Promise<AdminAsignable[]> {
  const { data, error } = await supabase
    .from("admins_conjuntos")
    .select("id, activo, users(nombres, apellidos, rol)")
    .eq("conjunto_id", conjuntoId)
    .eq("activo", true);

  if (error) throw error;

  return ((data as any[]) || []).map(fila => ({
    id: fila.id,
    nombre: [fila.users?.nombres, fila.users?.apellidos].filter(Boolean).join(" ") || "Sin nombre",
    rol: fila.users?.rol ?? null,
  }));
}

export function gestionarSolicitud(payload: GestionSolicitud) {
  return postConAuth("/api/v1/admin/solicitudes/gestionar", payload);
}
