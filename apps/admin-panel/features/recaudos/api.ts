import { supabase } from "@/lib/supabaseClient";
import { postConAuth, postFormConAuth } from "@/lib/apiClient";
import type { Recaudo, ApartamentoOpcion, Carga, NuevoRecaudo } from "./types";

export async function listarRecaudos(conjuntoId: string): Promise<Recaudo[]> {
  const { data, error } = await supabase
    .from("recaudos")
    .select("id, fecha, fecha_aplicacion, valor_total, origen, tipo_recaudo_origen, referencia_1, periodo, archivo_url, apartamentos(numero_apartamento), cargos_recaudos(valor_aplicado)")
    .eq("conjunto_id", conjuntoId)
    .order("fecha", { ascending: false });

  if (error) throw error;
  return (data as unknown as Recaudo[]) || [];
}

export async function listarApartamentos(conjuntoId: string): Promise<ApartamentoOpcion[]> {
  const { data } = await supabase
    .from("apartamentos")
    .select("id, numero_apartamento")
    .eq("conjunto_id", conjuntoId)
    .order("numero_apartamento_num", { ascending: true });

  return (data as ApartamentoOpcion[]) || [];
}

export async function listarCargas(conjuntoId: string): Promise<Carga[]> {
  const { data } = await supabase
    .from("cargas_recaudos")
    .select("id, archivo_nombre, periodo, procesadas, insertados, errores, detalles, creado_en")
    .eq("conjunto_id", conjuntoId)
    .order("creado_en", { ascending: false })
    .limit(10);

  return (data as Carga[]) || [];
}

export function crearRecaudo(conjuntoId: string, payload: NuevoRecaudo) {
  return postConAuth("/api/v1/admin/recaudos/crear", { conjunto_id: conjuntoId, ...payload });
}

export function aplicarRecaudo(conjuntoId: string, recaudoId: string) {
  return postConAuth("/api/v1/admin/recaudos/aplicar", {
    conjunto_id: conjuntoId,
    recaudo_id: recaudoId,
  });
}

export function cargarArchivo(conjuntoId: string, periodo: string, archivo: File) {
  const form = new FormData();
  form.append("conjunto_id", conjuntoId);
  form.append("periodo", periodo);
  form.append("archivo", archivo);
  return postFormConAuth("/api/v1/admin/recaudos/cargar", form);
}

export function reintentarCarga(cargaId: string) {
  return postConAuth("/api/v1/admin/recaudos/reintentar", { carga_id: cargaId });
}
