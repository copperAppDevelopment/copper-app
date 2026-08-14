import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, okCon, fail } from '@/lib/apiHandler';

const MAX_CANTIDAD = 500;

/**
 * POST: Generación masiva de apartamentos mediante la RPC
 * `generar_apartamentos_sin_torres(payload jsonb)`.
 *
 * La RPC no es idempotente: siempre numera desde 1, no borra nada y la tabla no tiene
 * constraint único en (conjunto_id, numero_apartamento). Llamarla sobre un conjunto que
 * ya tiene apartamentos produce duplicados imposibles de distinguir. Por eso aquí se
 * exige que el conjunto esté vacío; el botón deshabilitado en la UI no basta, porque
 * esta ruta es alcanzable directamente.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const { prefijo, cantidad, direccion_base } = body;

  const prefijoLimpio = typeof prefijo === 'string' ? prefijo.trim() : '';
  if (!prefijoLimpio) {
    return fail('El prefijo es obligatorio', 400);
  }

  // Con cantidad nula o <= 0 la RPC no inserta nada y no reporta error.
  const cantidadNum = Number(cantidad);
  if (!Number.isInteger(cantidadNum) || cantidadNum < 1 || cantidadNum > MAX_CANTIDAD) {
    return fail(`La cantidad debe ser un número entero entre 1 y ${MAX_CANTIDAD}`, 400);
  }

  const { count, error: errorConteo } = await supabaseAdmin
    .from('apartamentos')
    .select('id', { count: 'exact', head: true })
    .eq('conjunto_id', conjuntoId);

  if (errorConteo) {
    console.error('Error al contar apartamentos existentes:', errorConteo);
    return fail('Error interno al validar el conjunto', 500);
  }

  if ((count ?? 0) > 0) {
    return fail(
      `El conjunto ya tiene ${count} apartamentos. La generación masiva solo está disponible en un conjunto vacío, porque numera siempre desde 1 y crearía duplicados.`,
      409
    );
  }

  const { data, error } = await supabaseAdmin.rpc('generar_apartamentos_sin_torres', {
    payload: {
      conjunto_id: conjuntoId,
      prefijo: prefijoLimpio,
      cantidad: cantidadNum,
      direccion_base: typeof direccion_base === 'string' ? direccion_base.trim() : '',
    },
  } as any);

  if (error) {
    console.error('Error al generar apartamentos:', error);
    return fail('Error interno al generar los apartamentos', 500);
  }

  const generados = Array.isArray(data) ? data.length : 0;

  return okCon({ data, message: `Se generaron ${generados} apartamentos.` }, 201);
});
