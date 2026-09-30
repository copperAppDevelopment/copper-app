import { supabase } from "@/lib/supabaseClient";
import { postConAuth } from "@/lib/apiClient";
import { TODOS_LOS_CONDONADOS } from "./types";
import type { Cargo } from "./types";

/**
 * Los cargos de un periodo, o los condonados de todos.
 *
 * Siempre acotado: el conjunto más grande ya pasa de mil cargos y suma uno por apartamento y
 * concepto cada mes, así que traerlos todos para filtrar en memoria no aguantaría.
 */
export async function listarCargos(conjuntoId: string, periodo: string): Promise<Cargo[]> {
  let consulta = supabase
    .from("vista_cargos_admin")
    .select("*")
    .eq("conjunto_id", conjuntoId);

  consulta = periodo === TODOS_LOS_CONDONADOS
    ? consulta.gt("valor_condonado", 0)
    : consulta.eq("periodo", periodo);

  const { data, error } = await consulta.order("fecha_vencimiento", { ascending: true });

  if (error) throw error;
  return (data as unknown as Cargo[]) || [];
}

export async function condonarCargo(
  conjuntoId: string,
  cargoId: string,
  motivo: string
): Promise<{ condonado: number }> {
  const { data } = await postConAuth("/api/v1/admin/cargos/condonar", {
    conjunto_id: conjuntoId,
    cargo_id: cargoId,
    motivo,
  });
  return data;
}

export async function reactivarCargo(
  conjuntoId: string,
  cargoId: string
): Promise<{ reactivado: number }> {
  const { data } = await postConAuth("/api/v1/admin/cargos/reactivar", {
    conjunto_id: conjuntoId,
    cargo_id: cargoId,
  });
  return data;
}
