/** Fila de `vista_gestion_torres`, ampliada con el prefijo que sale de la tabla. */
export interface TorreListado {
  id: string;
  conjunto_id: string;
  nombre_torre: string;
  /** Con el que se numeran sus apartamentos: `A` → `A-101`. */
  prefijo: string | null;
  pisos: number | null;
  aptos_por_piso: number | null;
  /** Lo cuenta la vista en vivo, no la columna `torres.total_apartamentos`. */
  total_apartamentos: number;
}

export interface PisoTorre {
  id: string;
  torre_id: string;
  piso: number;
  aptos_en_piso: number | null;
  /** Apartamentos que realmente cuelgan del piso, que puede diferir de `aptos_en_piso`. */
  apartamentos: number;
}

export interface ResultadoAjuste {
  creados: number;
  eliminados: number;
}
