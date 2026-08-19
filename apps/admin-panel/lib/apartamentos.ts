import { supabase } from "./supabaseClient";

/**
 * Lista de apartamentos de un conjunto para alimentar selectores.
 *
 * Vive en `lib/` y no dentro de un feature porque la necesitan varios (recaudos,
 * comunicados) y la convención del README prohíbe que un feature importe a otro.
 */
export interface ApartamentoOpcion {
  id: string;
  numero_apartamento: string;
  /** Lo usa el selector de residentes para marcar los apartamentos ya ocupados. */
  ocupado: boolean;
  /** Nombre de la torre, si el conjunto se organiza por torres. */
  torre: string | null;
}

/**
 * Clave con la que se ordenan los apartamentos: torre, luego piso, luego número.
 *
 * Hace falta porque `numero_apartamento_num` no distingue torres: el trigger
 * `set_numero_apartamento_num` guarda el número quitando lo no numérico, así que `A-101`
 * y `B-101` valen ambos 101 y las dos torres salen entremezcladas.
 *
 * Se calcula aquí y no en la consulta porque PostgREST no ordena las filas padre por una
 * columna de una tabla embebida (`torres.nombre`), y las listas se ordenan y paginan en
 * memoria de todos modos.
 *
 * Sin torres, todas las claves comparten prefijo y el orden queda igual que antes.
 */
export function claveOrden(
  torre: string | null,
  piso: number | null,
  numero: number | null,
  texto: string
): string {
  // `~` ordena después de cualquier letra o dígito: los apartamentos sin torre van al
  // final en vez de colarse entre las torres.
  const nombreTorre = (torre ?? "~").padEnd(16).slice(0, 16);
  return [
    nombreTorre,
    String(piso ?? 0).padStart(3, "0"),
    String(numero ?? 0).padStart(6, "0"),
    texto,
  ].join("|");
}

/** Etiqueta del selector: con torre cuando la hay, porque el número solo no basta. */
export const etiquetaApartamento = (opcion: ApartamentoOpcion) =>
  opcion.torre ? `${opcion.numero_apartamento} · ${opcion.torre}` : opcion.numero_apartamento;

export async function listarOpcionesApartamento(conjuntoId: string): Promise<ApartamentoOpcion[]> {
  const { data } = await supabase
    .from("apartamentos")
    .select("id, numero_apartamento, numero_apartamento_num, ocupado, torres(nombre), torre_pisos(piso)")
    .eq("conjunto_id", conjuntoId)
    // Ordena por el número real, no por su texto: así 10 va después de 9. El orden final
    // lo fija `claveOrden`, que además separa por torre.
    .order("numero_apartamento_num", { ascending: true });

  return ((data as any[]) || [])
    .map(fila => ({
      opcion: {
        id: fila.id,
        numero_apartamento: fila.numero_apartamento,
        ocupado: fila.ocupado,
        torre: fila.torres?.nombre ?? null,
      } as ApartamentoOpcion,
      clave: claveOrden(
        fila.torres?.nombre ?? null,
        fila.torre_pisos?.piso ?? null,
        fila.numero_apartamento_num,
        fila.numero_apartamento
      ),
    }))
    .sort((a, b) => a.clave.localeCompare(b.clave))
    .map(x => x.opcion);
}
