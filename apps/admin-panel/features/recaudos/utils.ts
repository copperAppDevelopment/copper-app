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
 * Antes esto producía 'YYYY/M' mientras `cargos_mensuales` usaba 'YYYY-MM'. El cálculo de
 * mora compara periodos como texto, y '-' ordena antes que '/', así que los cargos con
 * barra nunca contaban como periodo anterior y su saldo no generaba intereses. Un solo
 * formato en todo el sistema.
 */
export { periodoActual } from "@/lib/conceptos";
