import { supabaseAdmin } from './supabaseAdmin';
import { ErrorHttp } from './apiHandler';

/**
 * Lee el chat o corta. Las tres rutas de `admin/chats/**` resuelven el conjunto desde la
 * fila del chat, no de lo que mande el cliente, así que comparten este acceso.
 */
export async function buscarChat(chatId: unknown) {
  if (!chatId) {
    throw new ErrorHttp('Falta el chat_id', 400);
  }

  const { data: chat } = await supabaseAdmin
    .from('chats')
    .select('id, conjunto_id, estado, receptor_id')
    .eq('id', chatId as string)
    .maybeSingle();

  if (!chat) {
    throw new ErrorHttp('No se encontró la conversación', 404);
  }

  return chat;
}

/** Resolver de `withAdminConjunto` para las rutas de chat. */
export const conjuntoDelChat = async (body: any) =>
  (await buscarChat(body?.chat_id ?? (body as FormData)?.get?.('chat_id'))).conjunto_id;
