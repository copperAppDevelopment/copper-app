import type { Recaudo, FiltroEstado } from "./types";

/** `recaudos` no tiene columna de estado: se deriva de `cargos_recaudos`. */
export function totalAplicado(r: Recaudo): number {
  return (r.cargos_recaudos ?? []).reduce((suma, c) => suma + Number(c.valor_aplicado ?? 0), 0);
}

export function estadoDe(r: Recaudo): FiltroEstado {
  const aplicado = totalAplicado(r);
  if (aplicado === 0) return "sin_aplicar";
  if (aplicado < Number(r.valor_total ?? 0)) return "parciales";
  return "aplicados";
}

/**
 * Periodo por defecto en el formato de `recaudos`: 'YYYY/M', sin cero a la izquierda.
 * Distinto del 'YYYY-MM' de `cargos_mensuales`: nunca compararlos directamente.
 */
export function periodoActual(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}/${hoy.getMonth() + 1}`;
}
