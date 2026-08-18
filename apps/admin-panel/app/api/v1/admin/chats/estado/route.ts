import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { conjuntoDelChat } from '@/lib/chatServidor';
import { esEstadoChat } from '@/lib/chats';

/**
 * POST: Reabrir o finalizar una conversación.
 *
 * El móvil bloquea el envío cuando el estado es exactamente 'Finalizado', y el enum de la
 * base garantiza que no pueda quedar en ninguna otra forma.
 */
export const POST = withAdminConjunto(
  async ({ body }) => {
    const estado = String(body.estado ?? '');

    if (!esEstadoChat(estado)) {
      return fail('El estado no es válido', 400);
    }

    const { error } = await supabaseAdmin
      .from('chats')
      .update({ estado })
      .eq('id', body.chat_id);

    if (error) {
      console.error('Error al cambiar el estado del chat:', error);
      return fail('No se pudo cambiar el estado', 500);
    }

    return ok({ chat_id: body.chat_id, estado });
  },
  { resolverConjunto: conjuntoDelChat }
);
