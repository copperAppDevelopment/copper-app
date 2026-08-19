import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';

const PATRON_PERIODO = /^\d{4}-(0[1-9]|1[0-2])$/;

/**
 * POST: deshace un cobro manual completo (un periodo y un concepto).
 *
 * La RPC solo borra cargos con `origen = 'manual'`, sin solicitud y **sin ningún pago
 * aplicado**. Lo último no es un escrúpulo: `cargos_recaudos.cargo_id` es ON DELETE
 * CASCADE, así que borrar un cargo ya pagado se llevaría el registro de aplicación y el
 * dinero del recaudo desaparecería del estado de cuenta.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const conceptoCodigo = String(body.concepto_codigo ?? '').trim();
  const periodo = String(body.periodo ?? '').trim();

  if (!conceptoCodigo) {
    return fail('Falta el concepto', 400);
  }

  if (!PATRON_PERIODO.test(periodo)) {
    return fail('El periodo debe tener el formato YYYY-MM', 400);
  }

  const { data, error } = await supabaseAdmin.rpc('revertir_cobro_manual', {
    p_conjunto_id: conjuntoId,
    p_concepto_codigo: conceptoCodigo,
    p_periodo: periodo,
  } as any);

  if (error) {
    console.error('Error al revertir el cobro manual:', error);
    return fail(error.message, 400);
  }

  const fila = (Array.isArray(data) ? data[0] : data) as
    | { eliminados: number; bloqueados: number }
    | undefined;

  return ok({
    eliminados: fila?.eliminados ?? 0,
    bloqueados: fila?.bloqueados ?? 0,
  });
});
