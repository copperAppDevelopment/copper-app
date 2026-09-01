import { supabase } from "@/lib/supabaseClient";
import { postConAuth } from "@/lib/apiClient";
import type {
  DatosConcepto, ConfiguracionConjunto, DatosConfiguracion, AreaComun, DatosArea,
} from "./adminTypes";

// La consulta de conceptos vive en `lib/` desde que también la usa el modal de cobros
// extras; se reexporta para no tocar a los llamantes de esta feature.
export { listarConceptos } from "@/lib/conceptosData";

/**
 * La configuración de cobro y los datos del emisor, que están en dos tablas: el pronto pago en
 * `conjuntos_configuracion` y el NIT, el teléfono y el correo en `conjuntos`. Se leen juntos
 * porque se editan en el mismo formulario.
 */
export async function obtenerConfiguracion(conjuntoId: string): Promise<ConfiguracionConjunto | null> {
  const [{ data, error }, { data: emisor }] = await Promise.all([
    supabase
      .from("conjuntos_configuracion")
      .select("id, link_pago, pronto_pago_habilitado, pronto_pago_tipo, pronto_pago_valor, pronto_pago_porcentaje, pronto_pago_dias")
      .eq("conjunto_id", conjuntoId)
      .maybeSingle(),
    supabase
      .from("conjuntos")
      .select("nit, telefono, email")
      .eq("id", conjuntoId)
      .maybeSingle(),
  ]);

  if (error) throw error;

  // Un conjunto puede no tener fila de configuración todavía y sí tener datos de emisor.
  if (!data && !emisor) return null;

  return {
    ...(data as any),
    id: (data as any)?.id ?? null,
    nit: (emisor as any)?.nit ?? null,
    telefono: (emisor as any)?.telefono ?? null,
    email: (emisor as any)?.email ?? null,
  } as ConfiguracionConjunto;
}

export async function listarAreas(conjuntoId: string): Promise<AreaComun[]> {
  const { data, error } = await supabase
    .from("areas_comunes")
    .select("*")
    .eq("conjunto_id", conjuntoId)
    .order("nombre", { ascending: true });

  if (error) throw error;
  return (data as unknown as AreaComun[]) || [];
}

export function guardarConcepto(conjuntoId: string, payload: DatosConcepto, conceptoId?: string) {
  return postConAuth("/api/v1/admin/conceptos", {
    conjunto_id: conjuntoId,
    concepto_id: conceptoId ?? null,
    ...payload,
  });
}

export function cambiarActivoConcepto(conjuntoId: string, conceptoId: string, activo: boolean) {
  return postConAuth("/api/v1/admin/conceptos", {
    conjunto_id: conjuntoId,
    concepto_id: conceptoId,
    solo_activo: true,
    activo,
  });
}

export function guardarConfiguracion(conjuntoId: string, payload: DatosConfiguracion) {
  return postConAuth("/api/v1/admin/configuracion", { conjunto_id: conjuntoId, ...payload });
}

export function guardarArea(conjuntoId: string, payload: DatosArea, areaId?: string) {
  return postConAuth("/api/v1/admin/areas", {
    conjunto_id: conjuntoId,
    area_id: areaId ?? null,
    ...payload,
  });
}

export function borrarArea(conjuntoId: string, areaId: string) {
  return postConAuth("/api/v1/admin/areas", {
    conjunto_id: conjuntoId,
    area_id: areaId,
    eliminar: true,
  });
}
