import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';

const PATRON_PERIODO = /^\d{4}-(0[1-9]|1[0-2])$/;
const PATRON_FECHA = /^\d{4}-\d{2}-\d{2}$/;

/**
 * POST: genera un cobro manual a un apartamento o a todo el conjunto.
 *
 * La RPC `crear_cobro_manual` ya valida por su cuenta lo que no puede delegar —pertenencia
 * del apartamento, formato del periodo, valor positivo—, porque es la última frontera. Lo
 * de aquí es para devolver un 400 legible en vez de un error de Postgres, y para cubrir lo
 * que la RPC no mira: que el concepto esté activo.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const conceptoCodigo = String(body.concepto_codigo ?? '').trim();
  const apartamentoId = String(body.apartamento_id ?? '').trim();
  const periodo = String(body.periodo ?? '').trim();
  const fechaVencimiento = String(body.fecha_vencimiento ?? '').trim();
  const valor = Number(body.valor);

  if (!conceptoCodigo) {
    return fail('Hay que elegir un concepto', 400);
  }

  if (!PATRON_PERIODO.test(periodo)) {
    return fail('El periodo debe tener el formato YYYY-MM', 400);
  }

  if (!PATRON_FECHA.test(fechaVencimiento)) {
    return fail('La fecha de vencimiento no es válida', 400);
  }

  // El peso colombiano no tiene céntimos y no hay input de moneda en el panel: un decimal
  // aquí acaba en un total que no cuadra con lo que se mostró al confirmar.
  if (!Number.isInteger(valor) || valor <= 0) {
    return fail('El valor debe ser un número entero mayor que cero', 400);
  }

  const { data: concepto } = await supabaseAdmin
    .from('conceptos_cobro')
    .select('id, codigo, activo')
    .eq('conjunto_id', conjuntoId)
    .eq('codigo', conceptoCodigo)
    .maybeSingle();

  if (!concepto) {
    return fail('Ese concepto no existe en este conjunto', 404);
  }

  // La RPC no mira `activo` a propósito, para no romper otros flujos: se filtra aquí.
  if (!concepto.activo) {
    return fail('Ese concepto está desactivado', 400);
  }

  const { data, error } = await supabaseAdmin.rpc('crear_cobro_manual', {
    p_conjunto_id: conjuntoId,
    p_concepto_codigo: conceptoCodigo,
    p_apartamento_id: apartamentoId || null,
    p_periodo: periodo,
    p_valor: valor,
    p_fecha_vencimiento: fechaVencimiento,
  } as any);

  if (error) {
    console.error('Error al generar el cobro manual:', error);
    return fail(error.message, 400);
  }

  const fila = (Array.isArray(data) ? data[0] : data) as
    | { creados: number; apartamentos: number }
    | undefined;

  const creados = fila?.creados ?? 0;
  const apartamentos = fila?.apartamentos ?? 0;

  return ok({
    creados,
    apartamentos,
    // Los que ya tenían este concepto en el periodo: el `on conflict do nothing` los saltó.
    omitidos: Math.max(apartamentos - creados, 0),
  }, 201);
});
