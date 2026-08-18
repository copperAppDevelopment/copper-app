import type { RolEquipo } from "@/lib/equipo";

/** Fila de `vista_mis_conjuntos`: un conjunto del admin con su última suscripción. */
export interface ConjuntoAdmin {
  user_id: string;
  conjunto_id: string;
  nombre_conjunto: string;
  plan_id: string | null;
  nombre_plan: string | null;
  periodo_plan: string | null;
  fecha_inicio_suscripcion: string | null;
  fecha_fin_suscripcion: string | null;
  estado_suscripcion: string | null;
  precio_suscripcion: number | null;
}

/** Miembro del equipo: `admins_conjuntos` con los datos de su usuario. */
export interface MiembroEquipo {
  id: string;
  user_id: string;
  es_propietario: boolean | null;
  activo: boolean | null;
  fecha_asignacion: string | null;
  nombres: string | null;
  apellidos: string | null;
  email: string | null;
  rol: string | null;
}

export interface NuevoMiembro {
  email: string;
  rol: RolEquipo;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  telefono: string;
}

export interface UsuarioExistenteEquipo {
  id: string;
  nombres: string | null;
  apellidos: string | null;
  email: string | null;
  rol: string | null;
}
