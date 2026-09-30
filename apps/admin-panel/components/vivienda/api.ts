import { supabase } from "@/lib/supabaseClient";
import type { Hogar } from "./types";

const TABLAS = ["vehiculos", "convivientes", "mascotas", "empleados_servicio"] as const;

/**
 * Todo lo registrado en el apartamento, **archivado incluido**: el administrador consulta aquí
 * lo que dejó el inquilino anterior. El nombre de quien lo registró llega por la FK
 * `registrado_por`.
 */
export async function listarHogar(apartamentoId: string): Promise<Hogar> {
  const respuestas = await Promise.all(
    TABLAS.map(tabla =>
      supabase
        .from(tabla)
        .select("*, residentes(users(nombres, apellidos))")
        .eq("apartamento_id", apartamentoId)
        .order("id")
    )
  );

  const [vehiculos = [], convivientes = [], mascotas = [], empleados_servicio = []] = respuestas.map(({ data, error }) => {
    if (error) throw error;
    return ((data as any[]) || []).map(({ residentes, ...fila }) => ({
      ...fila,
      registrado_por_nombre:
        [residentes?.users?.nombres?.trim(), residentes?.users?.apellidos?.trim()]
          .filter(Boolean)
          .join(" ") || null,
    }));
  });

  return { vehiculos, convivientes, mascotas, empleados_servicio };
}
