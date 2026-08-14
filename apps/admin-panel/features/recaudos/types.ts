export type FiltroEstado = "todos" | "aplicados" | "parciales" | "sin_aplicar";

export interface Recaudo {
  id: string;
  fecha: string;
  fecha_aplicacion: string;
  valor_total: number | null;
  origen: string | null;
  tipo_recaudo_origen: string | null;
  referencia_1: string | null;
  periodo: string;
  archivo_url: string;
  apartamentos: { numero_apartamento: string } | null;
  cargos_recaudos: { valor_aplicado: number }[];
}

export interface ApartamentoOpcion {
  id: string;
  numero_apartamento: string;
}

export interface Carga {
  id: string;
  archivo_nombre: string | null;
  periodo: string;
  procesadas: number;
  insertados: number;
  errores: number;
  detalles: unknown;
  creado_en: string;
}

export interface DetalleCarga {
  tipo?: "validacion" | "apartamento" | "duplicado" | "insercion" | "aplicacion";
  linea: string;
  referencia_1?: string;
  recaudo_id?: string;
  error: string;
}

export interface ResultadoCarga {
  procesadas: number;
  insertados: number;
  duplicados?: number;
  errores: number;
  detalles: DetalleCarga[];
}

export interface NuevoRecaudo {
  apartamento_id: string;
  fecha: string;
  fecha_aplicacion: string;
  valor_total: number;
  origen: string;
  tipo_recaudo_origen: string;
  periodo: string;
  referencia_1?: string;
}
