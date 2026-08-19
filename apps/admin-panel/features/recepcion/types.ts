import type { EstadoVisita, EstadoEnvio } from "@/lib/recepcion";

/** Fila de `vista_visitas_recepcion`. */
export interface VisitaRecepcion {
  id: string;
  nombres: string;
  telefono: string | null;
  motivo: string | null;
  fecha: string | null;
  observaciones: string | null;
  estado_autorizacion: EstadoVisita;
  fecha_autorizacion: string | null;
  autorizado_por: string | null;
  autorizado_por_nombre: string | null;
  /** `Recepcion` cuando la autorizó la portería en nombre del residente. */
  autorizado_por_rol: string | null;
  registrado_por_nombre: string | null;
  apartamento_id: string;
  conjunto_id: string;
  label_apartamento: string;
}

/** Fila de `vista_envios_recepcion`. */
export interface EnvioRecepcion {
  id: string;
  empresa_mensajeria: string;
  fecha: string | null;
  estado: EstadoEnvio;
  observaciones: string | null;
  fecha_entrega: string | null;
  entregado_por_nombre: string | null;
  recibido_por: string | null;
  registrado_por_nombre: string | null;
  apartamento_id: string;
  conjunto_id: string;
  label_apartamento: string;
}

export interface NuevaVisita {
  apartamento_id: string;
  nombres: string;
  telefono: string;
  motivo: string;
  observaciones: string;
}

export const VISITA_VACIA: NuevaVisita = {
  apartamento_id: "",
  nombres: "",
  telefono: "",
  motivo: "",
  observaciones: "",
};

export interface NuevoEnvio {
  apartamento_id: string;
  empresa_mensajeria: string;
  observaciones: string;
}

export const ENVIO_VACIO: NuevoEnvio = {
  apartamento_id: "",
  empresa_mensajeria: "",
  observaciones: "",
};

export type Pestana = "visitas" | "envios";

/**
 * Días hacia atrás que se traen de la base.
 *
 * El filtro va en la consulta y no en memoria: `useTablaLocal` recibe la lista entera, y un
 * conjunto de 200 apartamentos genera miles de visitas al año. La portería solo necesita lo
 * de hoy; el administrador, una ventana corta.
 */
export const RANGOS = [
  { value: "1", label: "Hoy" },
  { value: "7", label: "Últimos 7 días" },
  { value: "30", label: "Últimos 30 días" },
  { value: "90", label: "Últimos 90 días" },
];

/** Fecha ISO desde la que se consulta, según el rango elegido. */
export function desdeISO(dias: string): string {
  const desde = new Date();
  if (dias === "1") {
    desde.setHours(0, 0, 0, 0);
  } else {
    desde.setDate(desde.getDate() - Number(dias));
  }
  return desde.toISOString();
}
