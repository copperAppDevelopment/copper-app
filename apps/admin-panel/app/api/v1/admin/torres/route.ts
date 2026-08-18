import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';
import { crearTorresDeConjunto, mensajeDeError, motivoInvalido } from '@/lib/torresServidor';
import { MAX_APTOS_PISO } from '@/lib/torres';

/**
 * Comprueba que la torre es del conjunto que el llamante administra.
 *
 * `withAdminConjunto` valida el `conjunto_id` **que viene en el cuerpo**, así que sin esto
 * un administrador podría tocar torres ajenas mandando su propio conjunto junto a un
 * `torre_id` de otro.
 */
async function torreDelConjunto(torreId: string, conjuntoId: string) {
  if (!torreId) throw new Error('Falta el identificador de la torre');

  const { data } = await supabaseAdmin
    .from('torres')
    .select('id, nombre, conjunto_id')
    .eq('id', torreId)
    .maybeSingle();

  return data && data.conjunto_id === conjuntoId ? data : null;
}

/** POST: crea, amplía, ajusta o elimina torres del conjunto. */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const accion = String(body.accion ?? '');

  if (accion === 'crear') {
    const borradores = Array.isArray(body.torres) ? body.torres : [];
    if (borradores.length === 0) {
      return fail('No se recibió ninguna torre', 400);
    }

    const invalido = motivoInvalido(borradores);
    if (invalido) return fail(invalido, 400);

    const resultado = await crearTorresDeConjunto(conjuntoId, borradores);

    if (resultado.creadas === 0) {
      return fail(resultado.fallidas[0]?.motivo ?? 'No se pudo crear la torre', 400);
    }

    return ok(resultado, 201);
  }

  if (accion === 'agregar_pisos') {
    const torre = await torreDelConjunto(String(body.torre_id ?? ''), conjuntoId);
    if (!torre) return fail('Esa torre no pertenece a este conjunto', 404);

    const { data, error } = await supabaseAdmin.rpc('agregar_pisos_a_torre', {
      p_torre_id: torre.id,
      p_pisos_nuevos: Number(body.pisos_nuevos),
      p_aptos_por_piso: Number(body.aptos_por_piso),
    } as any);

    if (error) return fail(mensajeDeError(error), 400);

    return ok({ apartamentos_creados: data });
  }

  if (accion === 'ajustar_piso') {
    const torre = await torreDelConjunto(String(body.torre_id ?? ''), conjuntoId);
    if (!torre) return fail('Esa torre no pertenece a este conjunto', 404);

    const pisoId = String(body.torre_piso_id ?? '');

    // El piso llega por separado del `torre_id`: hay que confirmar que es de esa torre y
    // no de una cualquiera del sistema.
    const { data: piso } = await supabaseAdmin
      .from('torre_pisos')
      .select('id, torre_id')
      .eq('id', pisoId)
      .maybeSingle();

    if (!piso || piso.torre_id !== torre.id) {
      return fail('Ese piso no pertenece a la torre', 404);
    }

    const objetivo = Number(body.aptos_objetivo);
    if (!Number.isInteger(objetivo) || objetivo < 0 || objetivo > MAX_APTOS_PISO) {
      return fail(`Los apartamentos del piso deben estar entre 0 y ${MAX_APTOS_PISO}`, 400);
    }

    const { data, error } = await supabaseAdmin.rpc('ajustar_apartamentos_de_piso', {
      p_torre_piso_id: pisoId,
      p_aptos_objetivo: objetivo,
    } as any);

    if (error) return fail(mensajeDeError(error), 409);

    return ok(data);
  }

  if (accion === 'eliminar') {
    const torre = await torreDelConjunto(String(body.torre_id ?? ''), conjuntoId);
    if (!torre) return fail('Esa torre no pertenece a este conjunto', 404);

    const { data, error } = await supabaseAdmin.rpc('eliminar_torre_si_vacia', {
      p_torre_id: torre.id,
    } as any);

    // La RPC rechaza si le cuelgan apartamentos; no es un error del servidor, es un
    // conflicto que el administrador tiene que resolver.
    if (error) return fail(mensajeDeError(error), 409);

    return ok({ pisos_eliminados: data });
  }

  return fail('Acción no reconocida', 400);
});
