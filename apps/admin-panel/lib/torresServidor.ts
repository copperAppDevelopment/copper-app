import { supabaseAdmin } from './supabaseAdmin';
import { validarBorradores } from './torres';
import type { BorradorTorre } from './torres';

/**
 * Creación de torres desde el servidor.
 *
 * Vive aparte porque la usan dos rutas: la de torres y la de conjuntos, que las crea en el
 * mismo POST del alta. Sin esto, `admin/conjuntos/route.ts` pasaría de las 300 líneas.
 */

export interface ResultadoTorres {
  creadas: number;
  /** Motivo de cada torre que no se pudo crear, en el orden en que venían. */
  fallidas: { nombre: string; motivo: string }[];
}

/**
 * Crea las torres de un conjunto, una llamada a la RPC por torre.
 *
 * No hay transacción que las envuelva a todas a propósito: cada torre sí es atómica
 * —`crear_torre_con_pisos` hace torre, pisos y apartamentos de una vez—, pero si la
 * tercera de cinco falla, tiene más sentido conservar las dos buenas y decir cuál falló
 * que deshacerlo todo. Quien llama decide qué hacer con `fallidas`.
 */
export async function crearTorresDeConjunto(
  conjuntoId: string,
  borradores: BorradorTorre[]
): Promise<ResultadoTorres> {
  const resultado: ResultadoTorres = { creadas: 0, fallidas: [] };

  for (const borrador of borradores) {
    const { error } = await supabaseAdmin.rpc('crear_torre_con_pisos', {
      p_conjunto_id: conjuntoId,
      p_nombre: borrador.nombre.trim(),
      p_prefijo: borrador.prefijo.trim().toUpperCase(),
      p_num_pisos: Number(borrador.num_pisos),
      p_aptos_por_piso: Number(borrador.aptos_por_piso),
      p_direccion_base: null,
    } as any);

    if (error) {
      console.error(`Error al crear la torre ${borrador.nombre}:`, error);
      resultado.fallidas.push({
        nombre: borrador.nombre.trim(),
        motivo: mensajeDeError(error),
      });
    } else {
      resultado.creadas += 1;
    }
  }

  return resultado;
}

/**
 * Traduce el error de Postgres a algo que el administrador entienda.
 *
 * Las RPC lanzan `raise exception` con textos ya redactados, así que se dejan pasar; solo
 * hay que cubrir los índices únicos, que llegan con la jerga del motor.
 */
export function mensajeDeError(error: { message?: string; code?: string }): string {
  const texto = error?.message ?? 'Error desconocido';

  if (error?.code === '23505') {
    if (texto.includes('torres_conjunto_nombre_uq')) {
      return 'Ya existe una torre con ese nombre en el conjunto';
    }
    if (texto.includes('torres_conjunto_prefijo_uq')) {
      return 'Ya existe una torre con ese prefijo en el conjunto';
    }
    return 'Ya existe un registro con esos datos';
  }

  return texto;
}

/** Valida antes de tocar nada, para que el caso normal no llegue nunca a un fallo parcial. */
export function motivoInvalido(borradores: BorradorTorre[]): string | null {
  return validarBorradores(borradores);
}

/** Lee los borradores que viajan como JSON dentro del `FormData` del alta de conjunto. */
export function leerBorradores(crudo: string): BorradorTorre[] {
  if (!crudo) return [];

  try {
    const lista = JSON.parse(crudo);
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}
