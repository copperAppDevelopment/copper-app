import { supabase } from "@/lib/supabaseClient";
import type { KpisAdmin, Solicitud, PendientesConjunto } from "./types";

export async function obtenerKpis(conjuntoId: string): Promise<KpisAdmin | null> {
  const { data, error } = await supabase
    .from("vista_dashbard_admin")
    .select("*")
    .eq("conjunto_id", conjuntoId)
    .maybeSingle();

  if (error) {
    console.error("Error al cargar KPIs de vista_dashbard_admin:", error);
    return null;
  }
  return (data as unknown as KpisAdmin) || null;
}

/**
 * Lo que hace falta para saber si al conjunto le queda algo por montar.
 *
 * `vista_dashbard_admin` ya trae los apartamentos y los residentes; aquí solo falta si el
 * conjunto está activo —es decir, pagado— y si la cuota de administración se fijó. El concepto
 * `ADMIN` nace en 0 por el trigger `trg_crear_conceptos_default`, y mientras siga en 0 no se
 * puede facturar nada.
 */
export async function obtenerPendientes(conjuntoId: string): Promise<PendientesConjunto> {
  const [{ data: conjunto }, { data: concepto }] = await Promise.all([
    supabase.from("conjuntos").select("activo, tiene_torres").eq("id", conjuntoId).maybeSingle(),
    supabase
      .from("conceptos_cobro")
      .select("valor")
      .eq("conjunto_id", conjuntoId)
      .eq("codigo", "ADMIN")
      .maybeSingle(),
  ]);

  return {
    activo: conjunto?.activo !== false,
    tieneTorres: Boolean(conjunto?.tiene_torres),
    cuotaDefinida: Number(concepto?.valor ?? 0) > 0,
  };
}

export async function listarSolicitudes(conjuntoId: string): Promise<Solicitud[]> {
  const { data, error } = await supabase
    .from("vista_gestion_solicitudes")
    .select("*")
    .eq("conjunto_id", conjuntoId)
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error al cargar solicitudes de vista_gestion_solicitudes:", error);
    return [];
  }
  return (data as unknown as Solicitud[]) || [];
}
