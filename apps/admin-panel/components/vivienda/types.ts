/**
 * El hogar de un apartamento: lo que registran sus residentes y comparten entre todos.
 *
 * `registrado_por_nombre` solo informa quién lo creó; cualquier residente activo lo edita.
 * `archivado_en` se llena cuando el apartamento se queda sin residentes activos.
 */
interface RegistroHogar {
  id: number;
  registrado_por_nombre?: string | null;
  archivado_en?: string | null;
}

export interface Vehiculo extends RegistroHogar {
  marca: string | null;
  modelo: string | null;
  placa: string | null;
  color: string | null;
  tipo_vehiculo: string | null;
}

export interface Conviviente extends RegistroHogar {
  nombres: string | null;
  apellidos: string | null;
  parentesco: string | null;
  fecha_nacimiento: string | null;
}

export interface Mascota extends RegistroHogar {
  nombre: string | null;
  especie: string | null;
  raza: string | null;
  tamano: string | null;
}

export interface Empleado extends RegistroHogar {
  nombres: string | null;
  apellidos: string | null;
  cargo: string | null;
  documento_ident: string | null;
  tipo_documento: string | null;
}

export interface Hogar {
  vehiculos: Vehiculo[] | null;
  convivientes: Conviviente[] | null;
  mascotas: Mascota[] | null;
  empleados_servicio: Empleado[] | null;
}
