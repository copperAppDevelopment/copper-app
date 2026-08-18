import { supabase } from "@/lib/supabaseClient";
import { postConAuth } from "@/lib/apiClient";
import type {
  NuevoCobro, ResultadoCobro, CobroGenerado, ResultadoReversion,
} from "./types";

/** Cobros manuales ya generados, agrupados por periodo y concepto. */
export async function listarCobrosGenerados(conjuntoId: string): Promise<CobroGenerado[]> {
  const { data, error } = await supabase
    .from("vista_cobros_manuales")
    .select("*")
    .eq("conjunto_id", conjuntoId)
    .order("periodo", { ascending: false });

  if (error) throw error;
  return (data as unknown as CobroGenerado[]) || [];
}

export async function crearCobro(
  conjuntoId: string,
  payload: NuevoCobro
): Promise<ResultadoCobro> {
  const { data } = await postConAuth("/api/v1/admin/cobros/crear", {
    conjunto_id: conjuntoId,
    concepto_codigo: payload.concepto_codigo,
    apartamento_id: payload.apartamento_id,
    periodo: payload.periodo,
    fecha_vencimiento: payload.fecha_vencimiento,
    valor: Number(payload.valor),
  });
  return data;
}

export async function revertirCobro(
  conjuntoId: string,
  conceptoCodigo: string,
  periodo: string
): Promise<ResultadoReversion> {
  const { data } = await postConAuth("/api/v1/admin/cobros/revertir", {
    conjunto_id: conjuntoId,
    concepto_codigo: conceptoCodigo,
    periodo,
  });
  return data;
}
