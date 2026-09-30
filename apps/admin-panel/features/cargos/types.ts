import { periodoActual } from "@/lib/conceptos";

export type EstadoCargo = "pendiente" | "abonado" | "pagado" | "condonado";
export type FiltroEstado = "todos" | EstadoCargo;

/** Fila de `vista_cargos_admin`: un cargo con lo que se le ha pagado, perdonado y lo que debe. */
export interface Cargo {
  id: string;
  conjunto_id: string;
  apartamento_id: string;
  numero_apt: string | null;
  nombre_torre: string | null;
  periodo: string;
  concepto_id: string;
  concepto_codigo: string;
  concepto_nombre: string;
  /** `cron`, `manual` o `import_excel`. */
  origen: string;
  valor_final: number;
  pagado: number;
  descuento_aplicado: number;
  valor_condonado: number;
  saldo: number;
  fecha_generado: string | null;
  fecha_vencimiento: string | null;
  condonado_motivo: string | null;
  condonado_en: string | null;
  condonado_por_nombre: string | null;
  estado: EstadoCargo;
}

export const ETIQUETA_ESTADO: Record<EstadoCargo, string> = {
  pendiente: "Pendiente",
  abonado: "Abonado",
  pagado: "Pagado",
  condonado: "Condonado",
};

/**
 * Valor especial del selector de periodo: los cargos condonados de cualquier mes.
 *
 * Existe porque la página siempre consulta un periodo —hay más de mil cargos y crecen cada
 * mes—, y sin esto un acuerdo de hace medio año solo se encontraría acertando el mes.
 */
export const TODOS_LOS_CONDONADOS = "condonados";

/** Mismo mínimo que exige la ruta, para avisar antes de enviar. */
export const MINIMO_MOTIVO = 10;

/** Meses seleccionables: tres adelante y dos años atrás, del más nuevo al más viejo. */
export function opcionesPeriodo(): { value: string; label: string }[] {
  const actual = periodoActual();
  const anio = Number(actual.slice(0, 4));
  const mes = Number(actual.slice(5, 7));
  const opciones: { value: string; label: string }[] = [];

  for (let salto = 3; salto >= -24; salto--) {
    const fecha = new Date(Date.UTC(anio, mes - 1 + salto, 1));
    const valor = `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, "0")}`;
    const nombre = fecha.toLocaleDateString("es-CO", {
      month: "long", year: "numeric", timeZone: "UTC",
    });
    const etiqueta = nombre.charAt(0).toUpperCase() + nombre.slice(1);
    opciones.push({ value: valor, label: valor === actual ? `${etiqueta} (actual)` : etiqueta });
  }

  opciones.push({ value: TODOS_LOS_CONDONADOS, label: "Condonados, de cualquier periodo" });
  return opciones;
}

/** «Torre 2 · 301», o solo el número si el conjunto no usa torres. */
export const etiquetaApartamento = (c: Pick<Cargo, "numero_apt" | "nombre_torre">) =>
  [c.nombre_torre, c.numero_apt].filter(Boolean).join(" · ") || "—";

/** Se puede condonar lo que todavía debe algo y no está ya condonado. */
export const sePuedeCondonar = (c: Cargo) => c.estado !== "condonado" && Number(c.saldo) > 0;

/**
 * Un cargo de un mes ya cerrado pudo entrar en la base de la mora de los meses siguientes.
 * Condonarlo no recalcula esos intereses: hay que condonarlos aparte.
 */
export const pudoGenerarMora = (c: Cargo) =>
  c.concepto_codigo !== "MORA" && c.periodo < periodoActual();
