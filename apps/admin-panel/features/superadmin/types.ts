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

/** Una fila de `vista_superadmin_usuarios`: un administrador de la plataforma. */
export interface UsuarioAdmin {
  user_id: string;
  nombre_completo: string | null;
  email: string | null;
  telefono: string | null;
  documento: string | null;
  rol: string | null;
  estado: boolean;
  /** Vetado a mano por el SuperAdmin, a diferencia de una cuenta que nunca se activó. */
  cuenta_bloqueada: boolean;
  ultimo_login: string | null;
  created_at: string | null;
  total_conjuntos: number;
}

/** Una fila de `vista_superadmin_admin_conjuntos`: un conjunto de un administrador, con su plan. */
export interface ConjuntoDeAdmin {
  user_id: string;
  conjunto_id: string;
  nombre_conjunto: string;
  conjunto_activo: boolean | null;
  conjunto_vetado: boolean | null;
  ciudad: string | null;
  es_propietario: boolean | null;
  suscripcion_id: string | null;
  nombre_plan: string | null;
  tipo_periodo: string | null;
  estado_suscripcion: string | null;
  fecha_fin: string | null;
  precio_pagado: number | null;
}

/** Una fila de `vista_superadmin_conjuntos`. */
export interface ConjuntoSuper {
  conjunto_id: string;
  nombre_conjunto: string;
  activo: boolean | null;
  vetado: boolean | null;
  ciudad: string | null;
  direccion: string | null;
  tipo_vivienda: string | null;
  estrato: number | null;
  foto_url: string | null;
  tiene_torres: boolean | null;
  created_at: string | null;
  num_apartamentos: number;
  num_residentes: number;
  num_admins: number;
  propietario_id: string | null;
  propietario_nombre: string | null;
  propietario_email: string | null;
  suscripcion_id: string | null;
  nombre_plan: string | null;
  tipo_periodo: string | null;
  estado_suscripcion: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  precio_pagado: number | null;
  metodo_pago: string | null;
}

/** Una fila de `contactos`: una solicitud llegada desde la página web. */
export interface Contacto {
  id: string;
  created_at: string | null;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  nombre_conjunto: string | null;
  /** Texto libre en la base: las opciones del filtro salen de los propios datos. */
  tipo_solicitud: string;
  estado: string;
  descripcion: string | null;
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
