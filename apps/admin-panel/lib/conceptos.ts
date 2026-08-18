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
