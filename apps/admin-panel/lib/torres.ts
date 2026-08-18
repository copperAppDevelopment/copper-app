/**
 * Nomenclatura y límites de las torres.
 *
 * Vive en `lib/` porque lo comparten el módulo de torres, el de conjuntos (que las crea
 * durante el alta) y las rutas de API, y una feature nunca importa de otra.
 *
 * La numeración tiene que estar definida en un solo sitio: si el cliente previsualiza una
 * cosa y la RPC genera otra, el administrador descubre la diferencia cuando ya tiene 200
 * apartamentos mal numerados.
 */

export const MAX_PISOS = 50;
export const MAX_APTOS_PISO = 20;
/** Tope por torre, el mismo que usa la generación masiva sin torres. */
export const MAX_APTOS_TORRE = 500;

/** Un prefijo con guion daría `A--101`; uno vacío, `-101`. */
export const PATRON_PREFIJO = /^[A-Z0-9]{1,4}$/;

/**
 * Número del apartamento: `PREFIJO-<piso·100 + índice>`, o sea `A-101`, `A-102`, `A-201`.
 *
 * A partir del piso 10 son cuatro dígitos (`A-1001`), y con más de 99 apartamentos por
 * piso la fórmula sería ambigua — de ahí el tope de `MAX_APTOS_PISO`.
 *
 * Es exactamente lo que hace la RPC `crear_torre_con_pisos`; cambiar una obliga a cambiar
 * la otra.
 */
export const numeroApartamento = (prefijo: string, piso: number, indice: number) =>
  `${prefijo.toUpperCase()}-${piso * 100 + indice}`;

export interface BorradorTorre {
  nombre: string;
  prefijo: string;
  num_pisos: string;
  aptos_por_piso: string;
}

export const TORRE_VACIA: BorradorTorre = {
  nombre: "",
  prefijo: "",
  num_pisos: "",
  aptos_por_piso: "",
};

/** Los primeros números que se generarían, para enseñarlos antes de confirmar. */
export function previsualizarNumeracion(borrador: BorradorTorre, cuantos = 6): string[] {
  const pisos = Number(borrador.num_pisos);
  const porPiso = Number(borrador.aptos_por_piso);

  if (!borrador.prefijo || !Number.isInteger(pisos) || !Number.isInteger(porPiso)) return [];
  if (pisos < 1 || porPiso < 1) return [];

  const numeros: string[] = [];
  for (let piso = 1; piso <= pisos && numeros.length < cuantos; piso++) {
    for (let i = 1; i <= porPiso && numeros.length < cuantos; i++) {
      numeros.push(numeroApartamento(borrador.prefijo, piso, i));
    }
  }
  return numeros;
}

export const totalApartamentos = (borrador: BorradorTorre) =>
  Number(borrador.num_pisos) * Number(borrador.aptos_por_piso) || 0;

/**
 * Valida un borrador. Devuelve el motivo del rechazo, o `null` si está bien.
 *
 * Las mismas reglas las repite la RPC: esto es para dar un mensaje inmediato, no la
 * frontera de verdad.
 */
export function validarBorrador(borrador: BorradorTorre): string | null {
  if (!borrador.nombre.trim()) return "El nombre de la torre es obligatorio";

  if (!PATRON_PREFIJO.test(borrador.prefijo.trim().toUpperCase())) {
    return "El prefijo debe tener entre 1 y 4 letras o dígitos, sin espacios ni signos";
  }

  const pisos = Number(borrador.num_pisos);
  if (!Number.isInteger(pisos) || pisos < 1 || pisos > MAX_PISOS) {
    return `El número de pisos debe estar entre 1 y ${MAX_PISOS}`;
  }

  const porPiso = Number(borrador.aptos_por_piso);
  if (!Number.isInteger(porPiso) || porPiso < 1 || porPiso > MAX_APTOS_PISO) {
    return `Los apartamentos por piso deben estar entre 1 y ${MAX_APTOS_PISO}`;
  }

  if (pisos * porPiso > MAX_APTOS_TORRE) {
    return `La torre generaría ${pisos * porPiso} apartamentos y el máximo es ${MAX_APTOS_TORRE}`;
  }

  return null;
}

/** Valida una lista, incluidos los choques de nombre y prefijo entre borradores. */
export function validarBorradores(borradores: BorradorTorre[]): string | null {
  const nombres = new Set<string>();
  const prefijos = new Set<string>();

  for (const borrador of borradores) {
    const motivo = validarBorrador(borrador);
    if (motivo) return motivo;

    const nombre = borrador.nombre.trim().toLowerCase();
    const prefijo = borrador.prefijo.trim().toUpperCase();

    if (nombres.has(nombre)) return `Hay dos torres llamadas «${borrador.nombre.trim()}»`;
    if (prefijos.has(prefijo)) return `Hay dos torres con el prefijo «${prefijo}»`;

    nombres.add(nombre);
    prefijos.add(prefijo);
  }

  return null;
}
