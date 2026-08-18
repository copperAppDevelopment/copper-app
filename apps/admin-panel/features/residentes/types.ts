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

export interface Vehiculo {
  id: number;
  marca: string | null;
  modelo: string | null;
  placa: string | null;
  color: string | null;
  tipo_vehiculo: string | null;
}

export interface Conviviente {
  id: number;
  nombres: string | null;
  apellidos: string | null;
  parentesco: string | null;
  fecha_nacimiento: string | null;
}

export interface Mascota {
  id: number;
  nombre: string | null;
  especie: string | null;
  raza: string | null;
  tamano: string | null;
}

export interface Empleado {
  id: number;
  nombres: string | null;
  apellidos: string | null;
  cargo: string | null;
  documento_ident: string | null;
  tipo_documento: string | null;
}

export interface ResidenteCompleto {
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
  vehiculos: Vehiculo[] | null;
  mascotas: Mascota[] | null;
  convivientes: Conviviente[] | null;
  empleados_servicio: Empleado[] | null;
}
