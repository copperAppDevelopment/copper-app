import { supabase } from "@/lib/supabaseClient";
import { postConAuth } from "@/lib/apiClient";
import type {
  Concepto, DatosConcepto, ConfiguracionConjunto, DatosConfiguracion, AreaComun, DatosArea,
} from "./adminTypes";

export async function listarConceptos(conjuntoId: string): Promise<Concepto[]> {
  const { data, error } = await supabase
    .from("conceptos_cobro")
    .select("*")
    .eq("conjunto_id", conjuntoId)
    .order("codigo", { ascending: true });

  if (error) throw error;
  return (data as unknown as Concepto[]) || [];
}

export async function obtenerConfiguracion(conjuntoId: string): Promise<ConfiguracionConjunto | null> {
  const { data, error } = await supabase
    .from("conjuntos_configuracion")
    .select("id, link_pago, pronto_pago_habilitado, pronto_pago_tipo, pronto_pago_valor, pronto_pago_porcentaje, pronto_pago_dias")
    .eq("conjunto_id", conjuntoId)
    .maybeSingle();

  if (error) throw error;
  return (data as unknown as ConfiguracionConjunto) || null;
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
