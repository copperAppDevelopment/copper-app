import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';

/**
 * POST: registra un envío.
 *
 * Igual que las visitas: la RPC `crear_envio` inserta el envío y la notificación, y el
 * trigger de `notifications` manda el push. El envío nace siempre `pendiente`.
 */
export const POST = withAdminConjunto(
  async ({ user, conjuntoId, body }) => {
    const apartamentoId = String(body.apartamento_id ?? '').trim();
    const empresa = String(body.empresa_mensajeria ?? '').trim();

    if (!apartamentoId) return fail('Hay que elegir el apartamento', 400);
    if (!empresa) return fail('La empresa de mensajería es obligatoria', 400);

    const { data: apartamento } = await supabaseAdmin
      .from('apartamentos')
      .select('id, conjunto_id')
      .eq('id', apartamentoId)
      .maybeSingle();

    if (!apartamento || apartamento.conjunto_id !== conjuntoId) {
      return fail('El apartamento no pertenece a este conjunto', 404);
    }

    const { data, error } = await supabaseAdmin.rpc('crear_envio', {
      p_apartamento_id: apartamentoId,
      p_empresa_mensajeria: empresa,
      p_observaciones: String(body.observaciones ?? '').trim() || null,
      p_enviado_por: user.id,
    } as any);

    if (error) {
      console.error('Error al registrar el envío:', error);
      return fail(error.message, 400);
    }

    return ok({ envio_id: data }, 201);
  },
  { roles: ['Admin', 'Recepcion'] }
);
