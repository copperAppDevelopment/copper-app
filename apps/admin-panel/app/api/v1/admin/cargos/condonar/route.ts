import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';

const PATRON_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Que el motivo sea un motivo: «ok» o «acuerdo» no le explican nada a quien lo lea en un año. */
const MINIMO_MOTIVO = 10;

/**
 * POST: condona lo que un cargo todavía debe.
 *
 * Se perdona solo el saldo pendiente: lo ya abonado se queda como pagado. La RPC
 * `condonar_cargo` es la que calcula ese saldo y la que rechaza lo que no procede —un cargo de
 * otro conjunto, uno ya condonado, uno que no debe nada—, porque es la última frontera.
 *
 * Quién condona sale del token, nunca del cuerpo: es un registro de auditoría sobre dinero.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body, user }) => {
  const cargoId = String(body.cargo_id ?? '').trim();
  const motivo = String(body.motivo ?? '').trim();

  if (!PATRON_UUID.test(cargoId)) {
    return fail('Falta el cargo', 400);
  }

  if (motivo.length < MINIMO_MOTIVO) {
    return fail(`Explica el motivo de la condonación (al menos ${MINIMO_MOTIVO} caracteres)`, 400);
  }

  const { data, error } = await supabaseAdmin.rpc('condonar_cargo', {
    p_cargo_id: cargoId,
    p_conjunto_id: conjuntoId,
    p_motivo: motivo,
    p_usuario: user.id,
  });

  if (error) {
    // Los mensajes de la RPC están escritos para mostrarse tal cual.
    console.error('Error al condonar el cargo:', error);
    return fail(error.message, 400);
  }

  return ok({ condonado: Number(data ?? 0) });
});
