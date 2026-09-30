import type { Hogar } from "@/components/vivienda/types";

export type FiltroEstado = "todos" | "activos" | "pendientes" | "inactivos";

export interface Residente {
  residente_id: string;
  user_id: string;
  nombre_completo: string | null;
  email: string | null;
  documento: string | null;
  tipo_documento: string | null;
  contacto: string | null;
  estado_usuario: boolean | null;
  apartamento_id: string | null;
  apartamento_numero: string | null;
  torre_nombre: string | null;
  activo: boolean | null;
}

export interface UsuarioExistente {
  id: string;
  nombres: string | null;
  apellidos: string | null;
  email: string | null;
  rol: string | null;
}

/**
 * La vista trae el hogar del apartamento —solo lo vigente, y vacío si el residente ya no está
 * activo—, no algo propio del residente.
 */
export interface ResidenteCompleto extends Hogar {
  residente_id: string;
  user_id: string;
  nombres: string | null;
  apellidos: string | null;
  tipo_documento: string | null;
  documento: string | null;
  email: string | null;
  phone_number: string | null;
  direccion_personal: string | null;
  foto_url: string | null;
  estado: boolean | null;
  rol: string | null;
  conjunto_id: string | null;
  nombre_conjunto: string | null;
  direccion_unidad: string | null;
  estrato: number | null;
  ano_ingreso: number | null;
  apartamento_id: string | null;
  numero_apartamento: string | null;
}
