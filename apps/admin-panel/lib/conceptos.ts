/**
 * Vocabulario de `conceptos_cobro` y `conjuntos_configuracion`.
 *
 * ⚠️ `generar_cargos_mensuales` genera un cargo a **todos** los apartamentos por cada
 * concepto con `es_recurrente = true`, `tipo_calculo = 'fijo'` y `activo = true`. No filtra
 * por código: cualquier concepto que cumpla eso entra en la facturación mensual.
 */
export type TipoCalculo = "fijo" | "porcentaje_saldo";

export const TIPOS_CALCULO: TipoCalculo[] = ["fijo", "porcentaje_saldo"];

export const ETIQUETA_TIPO_CALCULO: Record<TipoCalculo, string> = {
  fijo: "Valor fijo",
  porcentaje_saldo: "Porcentaje del saldo",
};

export const OPCIONES_TIPO_CALCULO = TIPOS_CALCULO.map(v => ({
  value: v,
  label: ETIQUETA_TIPO_CALCULO[v],
}));

export const esTipoCalculo = (valor: string): valor is TipoCalculo =>
  (TIPOS_CALCULO as string[]).includes(valor);

/**
 * Códigos que la base protege con `trg_proteger_conceptos`: no se pueden renombrar,
 * desactivar ni borrar. `ADMIN` es el cargo de administración y `MORA` lo busca la función
 * del cron **por código literal**, así que renombrarlo apagaría el cálculo de intereses.
 */
export const CODIGOS_PROTEGIDOS = ["ADMIN", "MORA"];

export const esProtegido = (codigo: string | null) =>
  CODIGOS_PROTEGIDOS.includes((codigo ?? "").toUpperCase());

/** `conjuntos_configuracion.pronto_pago_tipo`, con CHECK en la base. */
export type TipoProntoPago = "valor" | "porcentaje";

export const OPCIONES_PRONTO_PAGO = [
  { value: "valor", label: "Valor fijo" },
  { value: "porcentaje", label: "Porcentaje" },
];

export const esTipoProntoPago = (valor: string): valor is TipoProntoPago =>
  valor === "valor" || valor === "porcentaje";

/** Periodo de facturación: `YYYY-MM`, el único formato que ordena bien como texto. */
export function periodoActual(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Último día del periodo, que es el vencimiento por defecto.
 *
 * Es la misma fecha que pone el cron, y no da igual: `aplicar_recaudo` reparte cada pago
 * entre los cargos pendientes `order by fecha_vencimiento`. Un vencimiento arbitrario
 * —«hoy + 30 días»— colaría el cobro nuevo por delante de deudas más antiguas.
 *
 * Vive aquí y no en `features/cobros/` porque también lo necesita la cuenta de cobro, y una
 * feature no importa de otra.
 */
export function ultimoDiaDelPeriodo(periodo: string): string {
  const anio = Number(periodo.slice(0, 4));
  const mes = Number(periodo.slice(5, 7));
  if (!anio || !mes) return "";
  // El día 0 del mes siguiente es el último del actual.
  const fecha = new Date(Date.UTC(anio, mes, 0));
  return fecha.toISOString().slice(0, 10);
}

/**
 * Hasta qué día se puede pagar con descuento, para un periodo dado.
 *
 * Espejo de la función `fecha_limite_pronto_pago` de la base, que es la que decide de verdad
 * al aplicar el recaudo. `pronto_pago_dias` es un **día del mes** (1..28), no un plazo desde
 * la emisión: para `2026-09` con 10, el descuento vale hasta el 2026-09-10 inclusive.
 *
 * Sin días configurados no hay plazo, y devuelve cadena vacía.
 */
export function fechaLimiteProntoPago(periodo: string, dias: number | null): string {
  if (!dias || dias < 1 || !/^\d{4}-\d{2}$/.test(periodo)) return "";
  return `${periodo}-${String(dias).padStart(2, "0")}`;
}

/** Primer día del periodo, la fecha de emisión cuando no hay cargos que la fijen. */
export function primerDiaDelPeriodo(periodo: string): string {
  return /^\d{4}-\d{2}$/.test(periodo) ? `${periodo}-01` : "";
}

/** El formato que exige toda la facturación; se valida en varias rutas de API. */
export const PATRON_PERIODO = /^\d{4}-(0[1-9]|1[0-2])$/;
