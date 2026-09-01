import { periodoActual, ultimoDiaDelPeriodo } from "@/lib/conceptos";
import type { Concepto } from "@/lib/conceptosData";

export interface NuevoCobro {
  concepto_codigo: string;
  /** Vacío significa «todo el conjunto», igual que en comunicados. */
  apartamento_id: string;
  periodo: string;
  fecha_vencimiento: string;
  valor: string;
}

export interface ResultadoCobro {
  creados: number;
  apartamentos: number;
  /** Los que ya tenían este concepto en el periodo y el `on conflict` descartó. */
  omitidos: number;
}

/** Fila de `vista_cobros_manuales`: un cobro manual agrupado por periodo y concepto. */
export interface CobroGenerado {
  conjunto_id: string;
  periodo: string;
  concepto_id: string;
  concepto_codigo: string;
  concepto_nombre: string;
  cargos: number;
  total: number;
  /** Cargos con un pago ya aplicado: esos no se pueden revertir. */
  con_pagos: number;
  generado_en: string | null;
  vence_el: string | null;
}

export interface ResultadoReversion {
  eliminados: number;
  bloqueados: number;
}

// Subido a `lib/` cuando la cuenta de cobro lo necesitó: una feature no importa de otra.
export { ultimoDiaDelPeriodo } from "@/lib/conceptos";

/** Meses seleccionables: doce atrás y tres adelante desde el actual. */
export function opcionesPeriodo(): { value: string; label: string }[] {
  const actual = periodoActual();
  const anio = Number(actual.slice(0, 4));
  const mes = Number(actual.slice(5, 7));
  const opciones: { value: string; label: string }[] = [];

  for (let salto = -12; salto <= 3; salto++) {
    const fecha = new Date(Date.UTC(anio, mes - 1 + salto, 1));
    const valor = `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, "0")}`;
    const nombre = fecha.toLocaleDateString("es-CO", {
      month: "long", year: "numeric", timeZone: "UTC",
    });
    opciones.push({
      value: valor,
      label: valor === actual ? `${nombre} (actual)` : nombre,
    });
  }

  return opciones;
}

export const COBRO_VACIO = (): NuevoCobro => ({
  concepto_codigo: "",
  apartamento_id: "",
  periodo: periodoActual(),
  fecha_vencimiento: ultimoDiaDelPeriodo(periodoActual()),
  valor: "",
});

/**
 * Consecuencias de cobrar este concepto a mano, para enseñarlas antes de confirmar.
 *
 * `generar_cargos_mensuales` decide qué facturar con un `not exists` sobre
 * *(apartamento, concepto, periodo)* **sin mirar `origen`**: un cobro manual de un
 * concepto recurrente hace que el cron no genere el suyo ese mes. En silencio.
 */
export function avisosDelConcepto(concepto: Concepto | undefined, periodo: string): string[] {
  if (!concepto) return [];
  const avisos: string[] = [];

  if (concepto.es_recurrente) {
    avisos.push(
      `«${concepto.nombre}» lo genera el cron el día 1 de cada mes. Si creas este cobro para ${periodo}, el cron no generará el suyo ese mes para estos apartamentos.`
    );
  }

  if (concepto.tipo_calculo === "porcentaje_saldo") {
    avisos.push(
      `«${concepto.nombre}» se calcula como un porcentaje del saldo vencido, no con un valor fijo. Crearlo a mano impedirá que el cron calcule ese importe.`
    );
  }

  return avisos;
}

export const esPeriodoPasado = (periodo: string) => periodo < periodoActual();
