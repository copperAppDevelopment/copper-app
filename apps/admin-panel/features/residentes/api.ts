import { supabase } from "@/lib/supabaseClient";
import { postConAuth } from "@/lib/apiClient";
import type {
  Residente, ApartamentoOpcion, ResidenteCompleto,
} from "./types";
import type {
  IndicadoresBalance, MovimientoBalance,
} from "@/components/balances/estado-de-cuenta";

export async function listarResidentes(conjuntoId: string): Promise<Residente[]> {
  const { data, error } = await supabase
    .from("vista_mis_residentes")
    .select("residente_id, user_id, nombre_completo, email, cedula, tipo_documento, contacto, estado_usuario, apartamento_id, apartamento_numero, torre_nombre, activo")
    .eq("conjunto_id", conjuntoId);

  if (error) throw error;
  return (data as Residente[]) || [];
}

export async function listarApartamentos(conjuntoId: string): Promise<ApartamentoOpcion[]> {
  const { data } = await supabase
    .from("apartamentos")
    .select("id, numero_apartamento, ocupado")
    .eq("conjunto_id", conjuntoId)
    .order("numero_apartamento_num", { ascending: true });

  return (data as ApartamentoOpcion[]) || [];
}

export function invitar(payload: {
  conjunto_id: string;
  email: string;
  telefono: string | null;
  apartamento_id: string | null;
}) {
  return postConAuth("/api/v1/admin/residentes/invitar", payload);
}

export function vincular(payload: {
  conjunto_id: string;
  user_id: string;
  apartamento_id: string | null;
}) {
  return postConAuth("/api/v1/admin/residentes/vincular", payload);
}

export function asignarApartamento(payload: {
  conjunto_id: string;
  residente_id: string;
  apartamento_id: string;
}) {
  return postConAuth("/api/v1/admin/residentes/asignar-apartamento", payload);
}

export function removerApartamento(payload: { conjunto_id: string; residente_id: string }) {
  return postConAuth("/api/v1/admin/residentes/remover-apartamento", payload);
}

// ---------------------------------------------------------------- detalle

/**
 * `vista_residente_completo` agrega las cuatro sub-colecciones como JSON:
 * una sola consulta en vez de cinco.
 */
export async function obtenerResidenteCompleto(residenteId: string): Promise<ResidenteCompleto | null> {
  const { data, error } = await supabase
    .from("vista_residente_completo")
    .select("*")
    .eq("residente_id", residenteId)
    .maybeSingle();

  if (error) throw error;
  return (data as unknown as ResidenteCompleto) || null;
}

/** La vista no expone `activo`; se lee de la tabla base. */
export async function obtenerActivo(residenteId: string): Promise<boolean | null> {
  const { data } = await supabase
    .from("residentes")
    .select("activo")
    .eq("id", residenteId)
    .maybeSingle();

  return data?.activo ?? null;
}

/**
 * Aquí `residente_id` es la clave natural de ambas vistas, así que no aplica la
 * duplicación por residente que sí afecta al filtrar solo por apartamento.
 */
export async function obtenerBalances(residenteId: string) {
  const [{ data: indicadores }, { data: historial }] = await Promise.all([
    supabase
      .from("vista_mis_balances_indicadores")
      .select("saldo_total, saldo_en_contra, saldo_a_favor, proximo_vencimiento, ultimo_pago")
      .eq("residente_id", residenteId)
      .maybeSingle(),
    supabase
      .from("vista_mis_balances_historial2")
      .select("periodo, fecha_movimiento, movimiento_tipo, concepto_cargo, origen_pago, debito, credito")
      .eq("residente_id", residenteId)
      .order("fecha_movimiento", { ascending: false }),
  ]);

  return {
    indicadores: (indicadores as IndicadoresBalance) || null,
    movimientos: (historial as MovimientoBalance[]) || [],
  };
}
