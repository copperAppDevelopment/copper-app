import { supabase } from "./supabaseClient";

/**
 * Lista de apartamentos de un conjunto para alimentar selectores.
 *
 * Vive en `lib/` y no dentro de un feature porque la necesitan varios (recaudos,
 * comunicados) y la convención del README prohíbe que un feature importe a otro.
 */
export interface ApartamentoOpcion {
  id: string;
  numero_apartamento: string;
  /** Lo usa el selector de residentes para marcar los apartamentos ya ocupados. */
  ocupado: boolean;
}

export async function listarOpcionesApartamento(conjuntoId: string): Promise<ApartamentoOpcion[]> {
  const { data } = await supabase
    .from("apartamentos")
    .select("id, numero_apartamento, ocupado")
    .eq("conjunto_id", conjuntoId)
    // Ordena por el número real, no por su texto: así 10 va después de 9.
    .order("numero_apartamento_num", { ascending: true });

  return (data as ApartamentoOpcion[]) || [];
}
