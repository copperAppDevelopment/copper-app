import { postFormConAuth } from "@/lib/apiClient";
import type { NuevoComunicado } from "./types";

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
