/**
 * Acceso al conjunto seleccionado.
 *
 * Se guarda en localStorage porque el panel usa el cliente de supabase-js (no @supabase/ssr),
 * cuya sesión también vive en el navegador: no hay sesión en cookies que el servidor pueda leer.
 * Todo acceso a estas claves debe pasar por aquí — antes estaban repetidas en 8 archivos.
 */

const KEY_ID = "selected_conjunto_id";
const KEY_NOMBRE = "selected_conjunto_nombre";
const KEY_FOTO = "selected_conjunto_foto";

export interface ConjuntoSeleccionado {
  id: string;
  nombre: string;
  foto: string;
}

/** Forma que devuelven `vista_mis_conjuntos_seleccion` y la pantalla de selección. */
export interface ConjuntoSeleccionable {
  conjunto_id: string | null;
  nombre: string | null;
  foto_url: string | null;
}

/**
 * Devuelve el conjunto seleccionado, o `null` si no hay ninguno.
 * Null explícito en vez de la cadena vacía que antes se propagaba por las páginas.
 */
export function getConjuntoSeleccionado(): ConjuntoSeleccionado | null {
  if (typeof window === "undefined") return null;

  const id = localStorage.getItem(KEY_ID);
  if (!id) return null;

  return {
    id,
    // El nombre de algún conjunto trae espacios sobrantes en la base.
    nombre: (localStorage.getItem(KEY_NOMBRE) || "Conjunto Residencial").trim(),
    foto: localStorage.getItem(KEY_FOTO) || "",
  };
}

export function setConjuntoSeleccionado(conjunto: ConjuntoSeleccionable): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(KEY_ID, conjunto.conjunto_id || "");
  localStorage.setItem(KEY_NOMBRE, conjunto.nombre || "");
  localStorage.setItem(KEY_FOTO, conjunto.foto_url || "");
}

export function clearConjuntoSeleccionado(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(KEY_ID);
  localStorage.removeItem(KEY_NOMBRE);
  localStorage.removeItem(KEY_FOTO);
}
