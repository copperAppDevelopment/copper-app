import type { TipoCalculo, TipoProntoPago } from "@/lib/conceptos";

export interface Concepto {
  id: string;
  conjunto_id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  valor: number;
  tipo_calculo: string;
  porcentaje: number | null;
  aplica_descuento: boolean;
  es_recurrente: boolean;
  activo: boolean;
}

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
}

export interface DatosConfiguracion {
  link_pago: string;
  pronto_pago_habilitado: boolean;
  pronto_pago_tipo: TipoProntoPago;
  pronto_pago_valor: string;
  pronto_pago_porcentaje: string;
  pronto_pago_dias: string;
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
