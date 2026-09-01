export type FiltroEstado = "todos" | "aplicados" | "parciales" | "sin_aplicar";

/**
 * Sobre qué campo se aplica el filtro de mes y año.
 *
 * No son intercambiables: `periodo` es el mes contable al que se imputa el recaudo y `fecha`
 * es cuándo entró el dinero. Un pago de junio recibido el 3 de julio cae en meses distintos
 * según cuál se mire, y las dos preguntas son legítimas.
 */
export type BasePeriodo = "periodo" | "fecha";

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
