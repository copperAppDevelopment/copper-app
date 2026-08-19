import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';

/**
 * POST: marca un envío como entregado y deja constancia de quién lo recibió.
 *
 * El `conjunto_id` sale del propio envío: si lo eligiera el cliente, bastaría con mandar el
 * conjunto propio y el id de un envío ajeno.
 */
export const POST = withAdminConjunto(
  async ({ user, body }) => {
    const envioId = String(body.envio_id ?? '');
    const recibidoPor = String(body.recibido_por ?? '').trim();

    if (!recibidoPor) {
      return fail('Hay que indicar quién recibió el paquete', 400);
    }

    // Condicionado a que siga pendiente: hace idempotente el doble clic del portero, que
    // en una portería es el escenario más probable de todos.
    const { data: actualizado, error } = await supabaseAdmin
      .from('envios')
      .update({
        estado: 'entregado',
        fecha_entrega: new Date().toISOString(),
        entregado_por: user.id,
        recibido_por: recibidoPor,
      } as any)
      .eq('id', envioId)
      .eq('estado', 'pendiente')
      .select('id');

    if (error) {
      console.error('Error al entregar el envío:', error);
      return fail('No se pudo actualizar el envío', 500);
    }

    if (!actualizado || actualizado.length === 0) {
      return fail('Este envío ya fue entregado', 409);
    }

    return ok({ envio_id: envioId });
  },
  {
    roles: ['Admin', 'Recepcion'],
    resolverConjunto: async (body) => {
      const { data } = await supabaseAdmin
        .from('vista_envios_recepcion')
        .select('conjunto_id')
        .eq('id', String(body?.envio_id ?? ''))
        .maybeSingle();

      return data?.conjunto_id ?? null;
    },
  }
);
