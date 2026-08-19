import { supabase } from "./supabaseClient";

/**
 * Consulta de `conceptos_cobro`, compartida por la pestaña de configuración y el modal de
 * cobros extras.
 *
 * Vive aquí y no en [`conceptos.ts`](./conceptos.ts) —que es el vocabulario— porque aquel
 * archivo no importa nada y lo usan rutas de servidor: meterle `supabaseClient` metería el
 * cliente de navegador, con su anon key, en el grafo de imports del servidor. Es el mismo
 * reparto que ya hay entre vocabulario y datos en `apartamentos.ts`.
 */
export interface Concepto {
  id: string;
  conjunto_id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  valor: number;
  tipo_calculo: string;
  porcentaje: number | null;
  aplica_descuento: boolean;
  /** Si es `true`, el cron mensual lo factura solo: cobrarlo a mano lo desactiva ese mes. */
  es_recurrente: boolean;
  activo: boolean;
}

export async function listarConceptos(conjuntoId: string): Promise<Concepto[]> {
  const { data, error } = await supabase
    .from("conceptos_cobro")
    .select("*")
    .eq("conjunto_id", conjuntoId)
    .order("codigo", { ascending: true });

  if (error) throw error;
  return (data as unknown as Concepto[]) || [];
}

/** Los que se pueden cobrar: los inactivos no los acepta la ruta. */
export const conceptosActivos = (conceptos: Concepto[]) => conceptos.filter(c => c.activo);
