export interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
}

export const REQUEST_STATUS_MAP: Record<string, StatusConfig> = {
  pendientes: {
    label: 'Pendiente',
    bgColor: '#fef3c7',
    textColor: '#92400e',
  },
  asignadas: {
    label: 'Asignada',
    bgColor: '#e0f2fe',
    textColor: '#075985',
  },
  en_proceso: {
    label: 'En Proceso',
    bgColor: '#ffedd5',
    textColor: '#9a3412',
  },
  completadas: {
    label: 'Completada',
    bgColor: '#dcfce7',
    textColor: '#166534',
  },
  canceladas: {
    label: 'Cancelada',
    bgColor: '#f1f5f9',
    textColor: '#475569',
  },
};

/**
 * Retorna la configuración de texto y color correspondiente al estado de la solicitud.
 */
export function getRequestStatusConfig(status?: string): StatusConfig {
  const normStatus = status?.toLowerCase().trim() || 'pendientes';
  return REQUEST_STATUS_MAP[normStatus] || REQUEST_STATUS_MAP.pendientes;
}
