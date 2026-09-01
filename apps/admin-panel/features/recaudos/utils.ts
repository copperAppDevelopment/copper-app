import type { Recaudo, FiltroEstado, BasePeriodo } from "./types";

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

// ------------------------------------------------------------------ periodo

/**
 * Año y mes de un `periodo` (`YYYY-MM`) o de una `fecha` (`YYYY-MM-DD`).
 *
 * Un solo patrón sirve para los dos porque comparten el prefijo. Devuelve `null` cuando el
 * texto no tiene esa forma: `periodo` es `text` sin `check` en la base, y hubo una época en
 * que se escribía `YYYY/M` —ver el comentario de arriba—, así que puede haber filas viejas
 * que no se pueden clasificar. Quedan fuera de los filtros concretos, pero siguen listándose
 * con «todos»: se ven, en vez de desaparecer sin explicación.
 */
export function anioMesDe(valor: string | null): { anio: string; mes: string } | null {
  const partes = /^(\d{4})-(\d{2})/.exec(valor ?? "");
  if (!partes) return null;

  const [, anio, mes] = partes;
  return anio && mes ? { anio, mes } : null;
}

/** El campo sobre el que se aplica el filtro de periodo. */
export function campoDePeriodo(r: Recaudo, base: BasePeriodo): string | null {
  return base === "fecha" ? r.fecha : r.periodo;
}

const nombreMes = (indice: number) =>
  new Date(Date.UTC(2000, indice, 1)).toLocaleDateString("es-CO", {
    month: "long",
    timeZone: "UTC",
  });

/** Los doce meses, con el valor de dos dígitos que usan `periodo` y `fecha`. */
export const MESES: { value: string; label: string }[] = Array.from({ length: 12 }, (_, i) => {
  const nombre = nombreMes(i);
  return {
    value: String(i + 1).padStart(2, "0"),
    label: nombre.charAt(0).toUpperCase() + nombre.slice(1),
  };
});

/** Cómo se nombra el periodo filtrado en los indicadores y en la tabla vacía. */
export function etiquetaPeriodo(anio: string, mes: string): string {
  const nombre = mes ? nombreMes(Number(mes) - 1) : "";
  if (anio && mes) return `${nombre} de ${anio}`;
  if (anio) return anio;
  if (mes) return `${nombre} de cualquier año`;
  return "todos los periodos";
}
