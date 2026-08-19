import { supabase } from "./supabaseClient";

/**
 * Catálogo DANE de departamentos y municipios de Colombia (`ubicaciones`, 1.122 filas).
 *
 * `conjuntos.codigo_municipio` tiene FK a esta tabla, así que el código no puede teclearse
 * a mano: hay que elegirlo de aquí o la inserción falla.
 *
 * **Todo se maneja como texto.** El código de Medellín es `05001` y el de su departamento
 * `05`: un `Number()` o un `parseInt` los convertiría en `5001` y `5`, y romperían la
 * clave foránea.
 */

export interface Departamento {
  codigo_departamento: string;
  nombre_departamento: string;
}

export interface Municipio {
  codigo_municipio: string;
  nombre_municipio: string;
  codigo_departamento: string;
  nombre_departamento: string;
}

/**
 * Los 33 departamentos.
 *
 * Sale de `vista_departamentos` y no de un `select distinct` sobre `ubicaciones` porque
 * PostgREST no sabe hacer DISTINCT, y traerse las 1.122 filas para agrupar en el cliente
 * choca con su límite de 1.000, que **trunca sin devolver error**: faltarían municipios y
 * no habría ni un aviso.
 */
let cacheDepartamentos: Departamento[] | null = null;

export async function listarDepartamentos(): Promise<Departamento[]> {
  if (cacheDepartamentos) return cacheDepartamentos;

  const { data, error } = await supabase
    .from("vista_departamentos")
    .select("codigo_departamento, nombre_departamento")
    .order("nombre_departamento", { ascending: true });

  if (error) throw error;

  cacheDepartamentos = (data as Departamento[]) || [];
  return cacheDepartamentos;
}

/** Los municipios de un departamento. El mayor tiene 125: cabe de sobra en el límite. */
export async function listarMunicipios(codigoDepartamento: string): Promise<Municipio[]> {
  if (!codigoDepartamento) return [];

  const { data, error } = await supabase
    .from("ubicaciones")
    .select("codigo_municipio, nombre_municipio, codigo_departamento, nombre_departamento")
    .eq("codigo_departamento", codigoDepartamento)
    .order("nombre_municipio", { ascending: true });

  if (error) throw error;
  return (data as Municipio[]) || [];
}

/**
 * Una ubicación por su código.
 *
 * Hace falta al editar un conjunto: la fila guarda `codigo_municipio` pero no el
 * departamento, y sin él no se puede preseleccionar el primer desplegable ni cargar su
 * lista de municipios.
 */
export async function obtenerUbicacion(codigoMunicipio: string): Promise<Municipio | null> {
  if (!codigoMunicipio) return null;

  const { data, error } = await supabase
    .from("ubicaciones")
    .select("codigo_municipio, nombre_municipio, codigo_departamento, nombre_departamento")
    .eq("codigo_municipio", codigoMunicipio)
    .maybeSingle();

  if (error) throw error;
  return (data as Municipio) || null;
}
