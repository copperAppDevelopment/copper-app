import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { conjuntoDelChat } from '@/lib/chatServidor';

/** POST: Marca como leídos los mensajes del residente hasta este momento. */
export const POST = withAdminConjunto(
  async ({ body }) => {
    const { error } = await supabaseAdmin
      .from('chats')
      .update({ admin_ultima_lectura: new Date().toISOString() })
      .eq('id', body.chat_id);

    if (error) {
      console.error('Error al marcar el chat como leído:', error);
      return fail('No se pudo marcar como leído', 500);
    }

    return ok({ chat_id: body.chat_id });
  },
  { resolverConjunto: conjuntoDelChat }
);
