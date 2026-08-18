import { supabase } from "@/lib/supabaseClient";
import { postConAuth, postFormConAuth } from "@/lib/apiClient";
import type { Chat, Mensaje } from "./types";
import type { EstadoChat } from "@/lib/chats";

const BUCKET = "chat_files";
/** Una hora: sobra para ver un adjunto y evita re-firmar en cada render. */
const SEGUNDOS_FIRMA = 3600;

/**
 * En FlutterFlow esta consulta no filtraba por conjunto y cada admin veía los chats de
 * todos. La vista ya expone `conjunto_id`, así que basta con usarlo.
 */
export async function listarChats(conjuntoId: string): Promise<Chat[]> {
  const { data, error } = await supabase
    .from("vista_chats_usuario")
    .select("*")
    .eq("conjunto_id", conjuntoId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data as unknown as Chat[]) || [];
}

export async function listarMensajes(chatId: string): Promise<Mensaje[]> {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as Mensaje[]) || [];
}

/** El bucket es privado: los adjuntos solo se ven con una URL firmada. */
export async function firmarAdjunto(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SEGUNDOS_FIRMA);

  if (error) {
    console.error("No se pudo firmar el adjunto:", error);
    return null;
  }
  return data?.signedUrl ?? null;
}

export function enviarMensaje(chatId: string, contenido: string, archivo: File | null) {
  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("content", contenido);
  if (archivo) form.append("archivo", archivo);
  return postFormConAuth("/api/v1/admin/chats/mensajes", form);
}

export function marcarLeido(chatId: string) {
  return postConAuth("/api/v1/admin/chats/leer", { chat_id: chatId });
}

export function cambiarEstado(chatId: string, estado: EstadoChat) {
  return postConAuth("/api/v1/admin/chats/estado", { chat_id: chatId, estado });
}
