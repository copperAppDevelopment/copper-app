export interface Torre {
  id: string;
  nombre: string;
}

export interface Apartamento {
  id: string;
  numero_apartamento: string;
  numero_apartamento_num: number | null;
  direccion: string;
  ocupado: boolean;
  torre_id: string | null;
  torres: { nombre: string } | null;
  torre_pisos: { piso: number } | null;
  /**
   * Torre + piso + número, para que dos torres no salgan entremezcladas: `A-101` y
   * `B-101` comparten `numero_apartamento_num`. La calcula `claveOrden` en `lib/`.
   */
  clave_orden: string;
}

export interface DetalleApt {
  id_apt: string;
  numero_apt: string | null;
  direccion: string | null;
  ocupado: boolean | null;
  nombre_torre: string | null;
  numero_piso: number | null;
  nombre_conjunto: string | null;
}

export interface ResidenteApt {
  id: string;
  activo: boolean | null;
  ano_ingreso: number | null;
  direccion_unidad: string | null;
  users: {
    nombres: string | null;
    apellidos: string | null;
    email: string | null;
    phone_number: string | null;
    rol: string | null;
  } | null;
}

export interface Indicadores {
  saldo_total: number | null;
  saldo_en_contra: number | null;
  saldo_a_favor: number | null;
  proximo_vencimiento: string | null;
  ultimo_pago: string | null;
}

export interface Movimiento {
  periodo: string | null;
  fecha_movimiento: string | null;
  fecha_vencimiento: string | null;
  movimiento_tipo: string | null;
  concepto_cargo: string | null;
  origen_pago: string | null;
  debito: number | null;
  credito: number | null;
}
