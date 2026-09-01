import type { TipoCalculo, TipoProntoPago } from "@/lib/conceptos";

/**
 * `Concepto` se mudó a `lib/` cuando el modal de cobros extras pasó a necesitarlo: una
 * feature no puede importar de otra. Se reexporta para no tocar a sus consumidores.
 */
export type { Concepto } from "@/lib/conceptosData";

export interface DatosConcepto {
  codigo: string;
  nombre: string;
  descripcion: string;
  valor: string;
  tipo_calculo: TipoCalculo;
  /** En la UI se escribe como 2 (%) y en la base se guarda como 0.02. */
  porcentaje: string;
  aplica_descuento: boolean;
  es_recurrente: boolean;
}

export interface ConfiguracionConjunto {
  id: string | null;
  link_pago: string | null;
  pronto_pago_habilitado: boolean;
  pronto_pago_tipo: TipoProntoPago | null;
  pronto_pago_valor: number | null;
  pronto_pago_porcentaje: number | null;
  pronto_pago_dias: number | null;
  /** Datos del emisor. Viven en `conjuntos`, pero se editan en esta misma pantalla. */
  nit: string | null;
  telefono: string | null;
  email: string | null;
}

export interface DatosConfiguracion {
  link_pago: string;
  pronto_pago_habilitado: boolean;
  pronto_pago_tipo: TipoProntoPago;
  pronto_pago_valor: string;
  pronto_pago_porcentaje: string;
  pronto_pago_dias: string;
  nit: string;
  telefono: string;
  email: string;
}

export interface AreaComun {
  id: string;
  conjunto_id: string;
  nombre: string;
  descripcion: string | null;
  activa: boolean;
  created_at: string | null;
}

export interface DatosArea {
  nombre: string;
  descripcion: string;
  activa: boolean;
}
