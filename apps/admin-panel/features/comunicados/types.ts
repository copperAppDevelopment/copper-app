/**
 * Espejo de los enums `tipo_comunicado_enum` y `tipo_novedad_enum` de la base.
 * Si se agrega un valor allá, hay que agregarlo aquí y regenerar `@copper/database`.
 */
export type TipoComunicado = "Comunicado" | "Reporte";
export type TipoNovedad = "Pagos" | "Multas" | "Balances" | "Novedad";

export const TIPOS_COMUNICADO: TipoComunicado[] = ["Comunicado", "Reporte"];
export const TIPOS_NOVEDAD: TipoNovedad[] = ["Pagos", "Multas", "Balances", "Novedad"];

export const OPCIONES_TIPO = TIPOS_COMUNICADO.map(v => ({ value: v, label: v }));
export const OPCIONES_NOVEDAD = TIPOS_NOVEDAD.map(v => ({ value: v, label: v }));

/** Guardas para validar lo que llega por `FormData`, que siempre es `string`. */
export const esTipoComunicado = (valor: string): valor is TipoComunicado =>
  (TIPOS_COMUNICADO as string[]).includes(valor);

export const esTipoNovedad = (valor: string): valor is TipoNovedad =>
  (TIPOS_NOVEDAD as string[]).includes(valor);

/** Lo que acepta el bucket `comunicados`; la ruta valida lo mismo del lado servidor. */
export const MIMES_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
export const ACCEPT_ADJUNTO = ".jpg,.jpeg,.png,.webp,.pdf";
export const MAX_BYTES_ADJUNTO = 10 * 1024 * 1024;

export interface NuevoComunicado {
  tipo: TipoComunicado;
  tipo_novedad: TipoNovedad;
  titulo: string;
  descripcion: string;
  /** Vacío significa «todo el conjunto». */
  apartamento_id: string;
}
