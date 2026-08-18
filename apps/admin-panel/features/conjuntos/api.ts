import { supabase } from "@/lib/supabaseClient";
import { postConAuth, postFormConAuth } from "@/lib/apiClient";
import type {
  ConjuntoListado,
  ConjuntoDetalle,
  DatosConjunto,
  Plan,
  SuscripcionActual,
  RespuestaCheckout,
} from "./types";
import type { TipoPeriodo } from "@/lib/conjuntos";
import type { BorradorTorre } from "@/lib/torres";

/** Los conjuntos que administra el usuario, activos y pendientes de pago por igual. */
export async function listarConjuntos(userId: string): Promise<ConjuntoListado[]> {
  const { data, error } = await supabase
    .from("vista_mis_conjuntos_administracion")
    .select("*")
    .eq("user_id", userId)
    .order("nombre", { ascending: true });

  if (error) throw error;
  return (data as unknown as ConjuntoListado[]) || [];
}

/**
 * Detalle del conjunto. La vista repite una fila por administrador, así que se filtra
 * también por el usuario en sesión para quedarse con una sola.
 */
export async function obtenerDetalle(
  conjuntoId: string,
  userId: string
): Promise<ConjuntoDetalle | null> {
  const { data, error } = await supabase
    .from("vista_mis_conjuntos_con_suscripcion")
    .select("*")
    .eq("conjunto_id", conjuntoId)
    .eq("admin_user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data as unknown as ConjuntoDetalle) || null;
}

/** Campos editables, que la vista de detalle no expone completos. */
export async function obtenerEditables(conjuntoId: string): Promise<DatosConjunto | null> {
  const { data, error } = await supabase
    .from("conjuntos")
    .select("nombre, direccion, ciudad, codigo_municipio, tipo_vivienda, estrato, anio_construccion, tiene_torres, foto_url")
    .eq("id", conjuntoId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const fila = data as any;
  return {
    nombre: fila.nombre ?? "",
    direccion: fila.direccion ?? "",
    ciudad: fila.ciudad ?? "",
    codigo_municipio: fila.codigo_municipio ?? "",
    tipo_vivienda: fila.tipo_vivienda ?? "Apartamentos",
    estrato: fila.estrato != null ? String(fila.estrato) : "",
    anio_construccion: fila.anio_construccion != null ? String(fila.anio_construccion) : "",
    tiene_torres: Boolean(fila.tiene_torres),
    foto_url: fila.foto_url ?? null,
  };
}

export async function listarPlanes(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from("planes")
    .select("id, nombre, subtipo, descripcion, precio_mensual, precio_trimestral, precio_anual, max_residentes")
    .eq("activo", true)
    .order("precio_mensual", { ascending: true });

  if (error) throw error;
  return (data as unknown as Plan[]) || [];
}

export async function suscripcionVigente(conjuntoId: string): Promise<SuscripcionActual | null> {
  const { data, error } = await supabase
    .from("suscripciones")
    .select("id, plan_id, tipo_periodo, estado, fecha_fin")
    .eq("conjunto_id", conjuntoId)
    .order("fecha_fin", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data as unknown as SuscripcionActual) || null;
}

export interface RespuestaGuardado {
  conjunto_id: string;
  torres?: { creadas: number; fallidas: { nombre: string; motivo: string }[] };
}

/**
 * Crea o edita el conjunto. `multipart` porque puede llevar foto.
 *
 * Las torres van en el mismo envío, como JSON: si se crearan aparte tras recibir el id,
 * un fallo dejaría el conjunto sin ellas y el modal ya cerrado. Solo se admiten al crear.
 */
export async function guardarConjunto(
  datos: DatosConjunto,
  foto: File | null,
  conjuntoId?: string,
  torres: BorradorTorre[] = []
): Promise<RespuestaGuardado> {
  const form = new FormData();
  if (conjuntoId) form.append("conjunto_id", conjuntoId);

  form.append("nombre", datos.nombre);
  form.append("direccion", datos.direccion);
  form.append("codigo_municipio", datos.codigo_municipio);
  form.append("tipo_vivienda", datos.tipo_vivienda);
  form.append("estrato", datos.estrato);
  form.append("anio_construccion", datos.anio_construccion);
  form.append("tiene_torres", String(datos.tiene_torres));
  if (torres.length > 0) form.append("torres", JSON.stringify(torres));
  if (foto) form.append("foto", foto);

  const { data } = await postFormConAuth("/api/v1/admin/conjuntos", form);
  return data;
}

/** Abre el cobro en Wompi y devuelve el enlace del checkout. */
export async function crearPago(
  conjuntoId: string,
  planId: string,
  periodo: TipoPeriodo
): Promise<RespuestaCheckout> {
  const { data } = await postConAuth("/api/v1/pagos/crear", {
    conjunto_id: conjuntoId,
    plan_id: planId,
    tipo_periodo: periodo,
  });
  return data;
}
