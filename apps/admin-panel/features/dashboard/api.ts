import { supabase } from "@/lib/supabaseClient";
import type { KpisAdmin, Solicitud } from "./types";

export async function obtenerKpis(conjuntoId: string): Promise<KpisAdmin | null> {
  const { data, error } = await supabase
    .from("vista_dashbard_admin")
    .select("*")
    .eq("conjunto_id", conjuntoId)
    .maybeSingle();

  if (error) {
    console.error("Error al cargar KPIs de vista_dashbard_admin:", error);
    return null;
  }
  return (data as unknown as KpisAdmin) || null;
}

export async function listarSolicitudes(conjuntoId: string): Promise<Solicitud[]> {
  const { data, error } = await supabase
    .from("vista_gestion_solicitudes")
    .select("*")
    .eq("conjunto_id", conjuntoId)
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error al cargar solicitudes de vista_gestion_solicitudes:", error);
    return [];
  }
  return (data as unknown as Solicitud[]) || [];
}
