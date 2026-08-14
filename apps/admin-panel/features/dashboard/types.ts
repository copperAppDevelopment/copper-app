/**
 * `vista_dashbard_admin` (el nombre tiene la errata en la base) devuelve una fila por
 * conjunto con los indicadores agregados.
 */
export interface KpisAdmin {
  total_apartamentos: number | null;
  apartamentos_ocupados: number | null;
  porcentaje_ocupacion: number | null;
  solicitudes_pendientes: number | null;
  total_residentes: number | null;
  max_residentes_plan: number | null;
  nombre_plan: string | null;
  tipo_periodo: string | null;
  fecha_fin_suscripcion: string | null;
}

export interface Solicitud {
  numero_apartamento: string | null;
  nombre_residente: string | null;
  titulo: string | null;
  prioridad: string | null;
  estado: string | null;
  fecha: string | null;
  nombre_admin_asignado: string | null;
}
