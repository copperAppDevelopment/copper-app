import { supabase } from "@/lib/supabaseClient";
import { postConAuth } from "@/lib/apiClient";
import type { BorradorTorre } from "@/lib/torres";
import type { TorreListado, PisoTorre, ResultadoAjuste } from "./types";

/**
 * Torres del conjunto.
 *
 * El total de apartamentos sale de `vista_gestion_torres`, que lo cuenta en vivo. La
 * columna `torres.total_apartamentos` no la mantiene ningún trigger y llegó a marcar 4 en
 * una torre con cero apartamentos.
 */
export async function listarTorres(conjuntoId: string): Promise<TorreListado[]> {
  const { data, error } = await supabase
    .from("vista_gestion_torres")
    .select("id, conjunto_id, nombre_torre, pisos, aptos_por_piso, total_apartamentos")
    .eq("conjunto_id", conjuntoId)
    .order("nombre_torre", { ascending: true });

  if (error) throw error;

  const torres = (data as unknown as Omit<TorreListado, "prefijo">[]) || [];
  if (torres.length === 0) return [];

  // La vista no expone `prefijo`; se completa desde la tabla en vez de recrearla.
  const { data: prefijos } = await supabase
    .from("torres")
    .select("id, prefijo")
    .eq("conjunto_id", conjuntoId);

  const porId = new Map((prefijos ?? []).map((t: any) => [t.id, t.prefijo]));

  return torres.map(t => ({ ...t, prefijo: porId.get(t.id) ?? null }));
}

/** Pisos de una torre, con los apartamentos que de verdad cuelgan de cada uno. */
export async function listarPisos(torreId: string): Promise<PisoTorre[]> {
  const { data, error } = await supabase
    .from("torre_pisos")
    .select("id, torre_id, piso, aptos_en_piso, apartamentos(count)")
    .eq("torre_id", torreId)
    .order("piso", { ascending: true });

  if (error) throw error;

  return ((data as any[]) || []).map(fila => ({
    id: fila.id,
    torre_id: fila.torre_id,
    piso: fila.piso,
    aptos_en_piso: fila.aptos_en_piso,
    apartamentos: fila.apartamentos?.[0]?.count ?? 0,
  }));
}

export function crearTorres(conjuntoId: string, torres: BorradorTorre[]) {
  return postConAuth("/api/v1/admin/torres", {
    conjunto_id: conjuntoId,
    accion: "crear",
    torres,
  });
}

export function agregarPisos(
  conjuntoId: string,
  torreId: string,
  pisosNuevos: number,
  aptosPorPiso: number
) {
  return postConAuth("/api/v1/admin/torres", {
    conjunto_id: conjuntoId,
    accion: "agregar_pisos",
    torre_id: torreId,
    pisos_nuevos: pisosNuevos,
    aptos_por_piso: aptosPorPiso,
  });
}

export async function ajustarPiso(
  conjuntoId: string,
  torreId: string,
  torrePisoId: string,
  aptosObjetivo: number
): Promise<ResultadoAjuste> {
  const { data } = await postConAuth("/api/v1/admin/torres", {
    conjunto_id: conjuntoId,
    accion: "ajustar_piso",
    torre_id: torreId,
    torre_piso_id: torrePisoId,
    aptos_objetivo: aptosObjetivo,
  });
  return data;
}

export function eliminarTorre(conjuntoId: string, torreId: string) {
  return postConAuth("/api/v1/admin/torres", {
    conjunto_id: conjuntoId,
    accion: "eliminar",
    torre_id: torreId,
  });
}
