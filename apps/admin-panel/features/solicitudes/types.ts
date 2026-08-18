import type { EstadoSolicitud, PrioridadSolicitud } from "@/lib/solicitudes";

/** Una fila de `vista_gestion_solicitudes_detalle`. */
export interface Solicitud {
  id_solicitud: string;
  nombre_residente: string | null;
  apartamento_id: string | null;
  numero_apartamento: string | null;
  phone_number: string | null;
  email: string | null;
  tipo_solicitud: string | null;
  titulo: string | null;
  descripcion: string | null;
  ubicacion: string | null;
  fecha_solicitud: string | null;
  fecha_preferida_residente: string | null;
  admin_conjunto_id: string | null;
  admin_user_id: string | null;
  prioridad: string | null;
  comentario_administrador: string | null;
  fecha_atencion_viable: boolean | null;
  fecha_programada: string | null;
  hora: string | null;
  costo: number | null;
  estado_solicitud: string | null;
  conjunto_id: string;
  nombre_admin_asignado: string | null;
}

export interface AdminAsignable {
  id: string;
  nombre: string;
  rol: string | null;
}

/** Lo que manda el modal; todo opcional salvo el id, se aplica solo lo que venga. */
export interface GestionSolicitud {
  solicitud_id: string;
  solicitud_estado?: EstadoSolicitud;
  solicitud_prioridad?: PrioridadSolicitud | null;
  asignado_admin_conjunto_id?: string | null;
  admin_comentario?: string | null;
  fecha_atencion_viable?: boolean | null;
  fecha_atencion_solicitud?: string | null;
  hora_atencion?: string | null;
  /** Si viene y es mayor que cero, se genera un cargo real al residente. */
  costo?: number | null;
}

export interface ResultadoGestion {
  solicitud: Solicitud;
  cobro: { cargo_id: string; creado: boolean } | null;
}

export type FiltroEstado = EstadoSolicitud | "todos";
