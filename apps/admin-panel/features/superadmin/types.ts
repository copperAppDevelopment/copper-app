/**
 * `vista_superadmin_kpis` devuelve una única fila con los agregados de toda la plataforma.
 *
 * Ojo con los dos ingresos, que no son lo mismo:
 * - `ingresos_mes_actual` suma la tabla `pagos`, es decir lo que los residentes le pagan a SU
 *   conjunto por la administración. Es dinero que no pasa por Copper.
 * - `ingresos_suscripciones_mes` suma `suscripciones.precio_pagado` del mes en curso: eso sí
 *   es la facturación propia.
 */
export interface KpisSuperAdmin {
  total_conjuntos: number | null;
  total_admins: number | null;
  ingresos_mes_actual: number | null;
  ingresos_suscripciones_mes: number | null;
}

/**
 * Una fila de `vista_superadmin_asignacion`: un conjunto con su suscripción vigente —la de
 * mayor `fecha_fin`— y su administrador propietario.
 */
export interface FilaAsignacion {
  conjunto_id: string;
  nombre_conjunto: string;
  conjunto_activo: boolean | null;
  ciudad: string | null;
  suscripcion_id: string | null;
  plan_id: string | null;
  nombre_plan: string | null;
  tipo_periodo: string | null;
  estado_suscripcion: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  precio_pagado: number | null;
  metodo_pago: string | null;
  admin_user_id: string | null;
  propietario_id: string | null;
  propietario_nombre: string | null;
  propietario_email: string | null;
}

/** Un administrador del conjunto, para elegir a nombre de quién queda la suscripción. */
export interface AdminDelConjunto {
  user_id: string;
  nombre_completo: string | null;
  email: string | null;
  es_propietario: boolean | null;
}

/** Una fila de `vista_superadmin_ultimas_suscripciones`. */
export interface SuscripcionReciente {
  id: string | null;
  conjunto_id: string | null;
  nombre_conjunto: string | null;
  nombre_plan: string | null;
  tipo_periodo: string | null;
  precio_pagado: number | null;
  estado: string | null;
  fecha_suscripcion: string | null;
}
