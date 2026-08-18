import { supabase } from "@/lib/supabaseClient";
import { postConAuth } from "@/lib/apiClient";
import { claveOrden } from "@/lib/apartamentos";
import type {
  Apartamento, Torre, DetalleApt, ResidenteApt, Indicadores, Movimiento,
} from "./types";

/**
 * Se consulta la tabla y no `vista_apartamentos_recepcion` porque esa vista no expone
 * `ocupado`, que es justo el campo de los indicadores.
 */
export async function listarApartamentos(conjuntoId: string): Promise<Apartamento[]> {
  const { data, error } = await supabase
    .from("apartamentos")
    .select("id, numero_apartamento, numero_apartamento_num, direccion, ocupado, torre_id, torres(nombre), torre_pisos(piso)")
    .eq("conjunto_id", conjuntoId)
    .order("numero_apartamento_num", { ascending: true });

  if (error) throw error;

  return ((data as any[]) || []).map(fila => ({
    ...fila,
    clave_orden: claveOrden(
      fila.torres?.nombre ?? null,
      fila.torre_pisos?.piso ?? null,
      fila.numero_apartamento_num,
      fila.numero_apartamento
    ),
  })) as Apartamento[];
}

/** El selector de torre solo tiene sentido si el conjunto está organizado por torres. */
export async function listarTorres(conjuntoId: string): Promise<Torre[]> {
  const { data } = await supabase
    .from("torres")
    .select("id, nombre")
    .eq("conjunto_id", conjuntoId)
    .order("nombre", { ascending: true });

  return (data as Torre[]) || [];
}

export function crearApartamento(payload: {
  conjunto_id: string;
  numero_apartamento: string;
  direccion: string;
  torre_id: string | null;
}) {
  return postConAuth("/api/v1/admin/apartamentos", payload);
}

export function generarApartamentos(payload: {
  conjunto_id: string;
  prefijo: string;
  cantidad: number;
  direccion_base: string;
}) {
  return postConAuth("/api/v1/admin/apartamentos/generar", payload);
}

// ---------------------------------------------------------------- detalle

export async function obtenerDetalle(apartamentoId: string): Promise<DetalleApt | null> {
  const { data, error } = await supabase
    .from("vista_detalle_apt")
    .select("id_apt, numero_apt, direccion, ocupado, nombre_torre, numero_piso, nombre_conjunto")
    .eq("id_apt", apartamentoId)
    .maybeSingle();

  if (error) throw error;
  return (data as DetalleApt) || null;
}

export async function listarResidentesDe(apartamentoId: string): Promise<ResidenteApt[]> {
  const { data } = await supabase
    .from("residentes")
    .select("id, activo, ano_ingreso, direccion_unidad, users(nombres, apellidos, email, phone_number, rol)")
    .eq("apartamento_id", apartamentoId);

  return (data as unknown as ResidenteApt[]) || [];
}

/**
 * Estado de cuenta del apartamento.
 *
 * Las dos vistas hacen `LEFT JOIN residentes ON r.apartamento_id = a.id` sin filtrar por
 * `activo`: un apartamento con N residentes devuelve cada movimiento N veces, y en
 * `indicadores` el `GROUP BY r.id` atribuye el saldo completo del apartamento a cada uno.
 * Fijando un único `residente_id` se elimina esa duplicación; el saldo es del apartamento,
 * así que la elección no altera las cifras.
 */
export async function obtenerBalances(apartamentoId: string, residentes: ResidenteApt[]) {
  const referencia =
    [...residentes]
      .filter(r => r.activo)
      .sort((a, b) => (a.ano_ingreso ?? 0) - (b.ano_ingreso ?? 0))[0] ?? null;

  let queryIndicadores = supabase
    .from("vista_mis_balances_indicadores")
    .select("saldo_total, saldo_en_contra, saldo_a_favor, proximo_vencimiento, ultimo_pago")
    .eq("apartamento_id", apartamentoId);

  let queryHistorial = supabase
    .from("vista_mis_balances_historial2")
    .select("periodo, fecha_movimiento, fecha_vencimiento, movimiento_tipo, concepto_cargo, origen_pago, debito, credito")
    .eq("apartamento_id", apartamentoId)
    .order("fecha_movimiento", { ascending: false });

  if (referencia) {
    queryIndicadores = queryIndicadores.eq("residente_id", referencia.id);
    queryHistorial = queryHistorial.eq("residente_id", referencia.id);
  }

  const [{ data: indicadores }, { data: historial }] = await Promise.all([
    queryIndicadores.maybeSingle(),
    queryHistorial,
  ]);

  return {
    indicadores: (indicadores as Indicadores) || null,
    movimientos: (historial as Movimiento[]) || [],
  };
}
