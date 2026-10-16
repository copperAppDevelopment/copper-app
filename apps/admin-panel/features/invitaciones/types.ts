/** Una invitación de residente, como la lista el panel. El token no sale del servidor. */
export interface Invitacion {
  id: string;
  email: string;
  telefono: string | null;
  numero_apartamento: string | null;
  creado_en: string;
  ultimo_envio_en: string | null;
  envios: number;
  error_envio: string | null;
  usado: boolean;
  usado_en: string | null;
  expira_en: string;
}

export type EstadoInvitacion = "pendiente" | "vencida" | "aceptada" | "error";
export type FiltroEstado = EstadoInvitacion | "todas";

export const ETIQUETA_ESTADO: Record<EstadoInvitacion, string> = {
  pendiente: "Pendiente",
  vencida: "Vencida",
  aceptada: "Aceptada",
  error: "Error de envío",
};

export function estadoDe(inv: Invitacion, ahora = new Date()): EstadoInvitacion {
  if (inv.usado) return "aceptada";
  if (inv.error_envio) return "error";
  return new Date(inv.expira_en) < ahora ? "vencida" : "pendiente";
}

/** Una aceptada ya gastó su token: no hay nada que reenviar. */
export const sePuedeReenviar = (inv: Invitacion) => !inv.usado;

// ------------------------------------------------------------------ invitación masiva

/** Por envío. Resend acepta lotes de 100; esto son tres. */
export const MAX_LINEAS = 300;

export type AccionLinea =
  | "invitar"
  | "reenviar"
  | "ya_tiene_cuenta"
  | "apartamento_no_encontrado"
  | "correo_invalido"
  | "repetido";

export interface LineaMasiva {
  /** Número de línea en lo que pegó el administrador, para que la ubique. */
  linea: number;
  email: string;
  apartamento: string | null;
  accion: AccionLinea;
}

export const ETIQUETA_ACCION: Record<AccionLinea, string> = {
  invitar: "Se invita",
  reenviar: "Ya invitado: se reenvía",
  ya_tiene_cuenta: "Ya tiene cuenta: vincúlalo desde Residentes",
  apartamento_no_encontrado: "Apartamento no encontrado: se omite",
  correo_invalido: "Correo inválido: se omite",
  repetido: "Repetido en la lista: se omite",
};

/** Las acciones que mandan un correo. */
export const ACCIONES_CON_ENVIO: AccionLinea[] = ["invitar", "reenviar"];

/** La fila de la tabla: la invitación con su estado ya calculado. */
export type InvitacionConEstado = Invitacion & { estado: EstadoInvitacion };
