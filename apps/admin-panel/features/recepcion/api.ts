import { supabase } from "@/lib/supabaseClient";
import { postConAuth } from "@/lib/apiClient";
import type { EstadoVisita } from "@/lib/recepcion";
import type { VisitaRecepcion, EnvioRecepcion, NuevaVisita, NuevoEnvio } from "./types";

/** Tope por consulta: la tabla ordena y pagina en memoria a partir de aquí. */
const LIMITE = 500;

export async function listarVisitas(
  conjuntoId: string,
  desde: string
): Promise<VisitaRecepcion[]> {
  const { data, error } = await supabase
    .from("vista_visitas_recepcion")
    .select("*")
    .eq("conjunto_id", conjuntoId)
    .gte("fecha", desde)
    .order("fecha", { ascending: false })
    .limit(LIMITE);

  if (error) throw error;
  return (data as unknown as VisitaRecepcion[]) || [];
}

export async function listarEnvios(
  conjuntoId: string,
  desde: string
): Promise<EnvioRecepcion[]> {
  const { data, error } = await supabase
    .from("vista_envios_recepcion")
    .select("*")
    .eq("conjunto_id", conjuntoId)
    .gte("fecha", desde)
    .order("fecha", { ascending: false })
    .limit(LIMITE);

  if (error) throw error;
  return (data as unknown as EnvioRecepcion[]) || [];
}

export function registrarVisita(conjuntoId: string, payload: NuevaVisita) {
  return postConAuth("/api/v1/admin/recepcion/visitas/crear", {
    conjunto_id: conjuntoId,
    ...payload,
  });
}

export function responderVisita(
  conjuntoId: string,
  visitaId: string,
  estado: EstadoVisita
) {
  return postConAuth("/api/v1/admin/recepcion/visitas/estado", {
    conjunto_id: conjuntoId,
    visita_id: visitaId,
    estado,
  });
}

export function registrarEnvio(conjuntoId: string, payload: NuevoEnvio) {
  return postConAuth("/api/v1/admin/recepcion/envios/crear", {
    conjunto_id: conjuntoId,
    ...payload,
  });
}

export function entregarEnvio(conjuntoId: string, envioId: string, recibidoPor: string) {
  return postConAuth("/api/v1/admin/recepcion/envios/estado", {
    conjunto_id: conjuntoId,
    envio_id: envioId,
    recibido_por: recibidoPor,
  });
}
