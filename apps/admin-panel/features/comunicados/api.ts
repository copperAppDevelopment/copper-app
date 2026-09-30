import { supabase } from "@/lib/supabaseClient";
import { postConAuth, postFormConAuth } from "@/lib/apiClient";
import type { Comunicado, NuevoComunicado } from "./types";

/**
 * Todo lo publicado en el conjunto, lo más reciente primero. Son decenas, no miles: se escriben
 * a mano. El autor, el apartamento y los destinatarios llegan por sus FK.
 */
export async function listarComunicados(conjuntoId: string): Promise<Comunicado[]> {
  const { data, error } = await supabase
    .from("comunicados")
    .select(
      "id, titulo, descripcion, tipo, tipo_novedad, fecha_publicacion, adjunto, apartamento_id, " +
      "users(nombres, apellidos), apartamentos(numero_apartamento), notifications(userIds)"
    )
    .eq("conjunto_id", conjuntoId)
    .order("fecha_publicacion", { ascending: false });

  if (error) throw error;

  return ((data as any[]) || []).map(({ users, apartamentos, notifications, ...fila }) => ({
    ...fila,
    autor_nombre:
      [users?.nombres?.trim(), users?.apellidos?.trim()].filter(Boolean).join(" ") || null,
    numero_apartamento: apartamentos?.numero_apartamento ?? null,
    // El trigger crea una sola notificación por comunicado; ninguna si no había a quién
    // enviarlo. Los anteriores a septiembre de 2026 también salen en 0: esa tabla se vació.
    destinatarios: (notifications ?? []).reduce(
      (total: number, n: { userIds: string[] | null }) => total + (n.userIds?.length ?? 0),
      0
    ),
  }));
}

/** URL firmada y de corta duración: el bucket es privado. */
export async function urlAdjunto(conjuntoId: string, comunicadoId: string): Promise<string> {
  const { data } = await postConAuth("/api/v1/admin/comunicados/adjunto", {
    conjunto_id: conjuntoId,
    comunicado_id: comunicadoId,
  });
  return data.url;
}

export function eliminarComunicado(conjuntoId: string, comunicadoId: string) {
  return postConAuth("/api/v1/admin/comunicados/eliminar", {
    conjunto_id: conjuntoId,
    comunicado_id: comunicadoId,
  });
}

/**
 * Crea un comunicado o reporte. Va como `multipart/form-data` porque puede llevar adjunto;
 * el navegador nunca toca el bucket, la ruta sube el archivo con service role.
 */
export function crearComunicado(
  conjuntoId: string,
  payload: NuevoComunicado,
  archivo: File | null
) {
  const form = new FormData();
  form.append("conjunto_id", conjuntoId);
  form.append("tipo", payload.tipo);
  form.append("tipo_novedad", payload.tipo_novedad);
  form.append("titulo", payload.titulo);
  form.append("descripcion", payload.descripcion);

  if (payload.apartamento_id) {
    form.append("apartamento_id", payload.apartamento_id);
  }
  if (archivo) {
    form.append("archivo", archivo);
  }

  return postFormConAuth("/api/v1/admin/comunicados/crear", form);
}
