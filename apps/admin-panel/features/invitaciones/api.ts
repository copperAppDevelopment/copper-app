import { postConAuth } from "@/lib/apiClient";
import type { Invitacion, LineaMasiva } from "./types";

/** Por el servidor y no por Supabase directo: así el token de cada invitación no sale de allá. */
export async function listarInvitaciones(conjuntoId: string): Promise<Invitacion[]> {
  const { data } = await postConAuth("/api/v1/admin/invitaciones/listar", { conjunto_id: conjuntoId });
  return (data as Invitacion[]) ?? [];
}

export function reenviarInvitacion(conjuntoId: string, invitacionId: string) {
  return postConAuth("/api/v1/admin/invitaciones/reenviar", {
    conjunto_id: conjuntoId,
    invitacion_id: invitacionId,
  });
}

export async function previsualizarMasivo(conjuntoId: string, texto: string): Promise<LineaMasiva[]> {
  const { data } = await postConAuth("/api/v1/admin/invitaciones/masivo", {
    conjunto_id: conjuntoId,
    texto,
    modo: "previsualizar",
  });
  return data.lineas;
}

export async function enviarMasivo(conjuntoId: string, texto: string): Promise<{
  lineas: LineaMasiva[];
  enviadas: number;
  fallidas: { email: string; error: string }[];
}> {
  const { data } = await postConAuth("/api/v1/admin/invitaciones/masivo", {
    conjunto_id: conjuntoId,
    texto,
    modo: "enviar",
  });
  return data;
}
