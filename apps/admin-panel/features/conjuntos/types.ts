import type { TipoPeriodo } from "@/lib/conjuntos";

/** Fila de `vista_mis_conjuntos_administracion`: lo que se pinta en la lista. */
export interface ConjuntoListado {
  conjunto_id: string;
  nombre: string;
  foto_url: string | null;
  direccion: string | null;
  ciudad: string | null;
  tipo_vivienda: string | null;
  estrato: number | null;
  cantidad_apartamentos: number;
  cantidad_admins: number;
  /** Es `conjuntos.activo`, con el alias que ya traía la vista. */
  estado: boolean;
  user_id: string;
}

/** Fila de `vista_mis_conjuntos_con_suscripcion`: el detalle, con plan y vigencia. */
export interface ConjuntoDetalle {
  conjunto_id: string;
  fecha_creacion: string | null;
  ultima_actualizacion: string | null;
  nombre: string;
  direccion: string | null;
  ciudad: string | null;
  tipo_vivienda: string | null;
  num_viviendas: number;
  estrato: number | null;
  anio_construccion: number | null;
  valor_administracion: number | null;
  estado_suscripcion: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  precio_pagado: number | null;
  metodo_pago: string | null;
  referencia_pago: string | null;
  tipo_periodo: string | null;
  nombre_plan: string | null;
  admin_user_id: string;
}

/**
 * Campos editables del conjunto.
 *
 * Salen de la tabla y no de la vista de detalle: la vista no expone `foto_url`,
 * `codigo_municipio` ni `tiene_torres`, y el formulario los necesita.
 */
export interface DatosConjunto {
  nombre: string;
  direccion: string;
  /**
   * Solo informativa: no se envía. El servidor la deriva del municipio elegido, porque
   * hay 66 nombres repetidos entre departamentos y el par código→nombre solo es fiable
   * en el catálogo.
   */
  ciudad: string;
  codigo_municipio: string;
  tipo_vivienda: string;
  estrato: string;
  anio_construccion: string;
  tiene_torres: boolean;
  foto_url: string | null;
}

export const CONJUNTO_VACIO: DatosConjunto = {
  nombre: "",
  direccion: "",
  ciudad: "",
  codigo_municipio: "",
  tipo_vivienda: "Apartamentos",
  estrato: "",
  anio_construccion: "",
  tiene_torres: false,
  foto_url: null,
};

/** Fila de `planes`, con los tres precios. */
export interface Plan {
  id: string;
  nombre: string;
  subtipo: string;
  descripcion: string | null;
  precio_mensual: number;
  precio_trimestral: number;
  precio_anual: number;
  max_residentes: number;
}

/** Suscripción vigente del conjunto, para saber qué plan está en curso. */
export interface SuscripcionActual {
  id: string;
  plan_id: string;
  tipo_periodo: string;
  estado: string;
  fecha_fin: string;
}

export interface RespuestaCheckout {
  checkout_url: string;
  referencia: string;
  monto: number;
  es_renovacion: boolean;
  plan: string;
}

export const precioDelPlan = (plan: Plan, periodo: TipoPeriodo): number =>
  periodo === "mensual"
    ? Number(plan.precio_mensual)
    : periodo === "trimestral"
      ? Number(plan.precio_trimestral)
      : Number(plan.precio_anual);
