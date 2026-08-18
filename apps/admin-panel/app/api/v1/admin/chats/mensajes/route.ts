import { withAdminConjunto, ok, fail } from '@/lib/apiHandler';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { conjuntoDelChat, buscarChat } from '@/lib/chatServidor';
import { MIMES_CHAT, MAX_BYTES_CHAT } from '@/lib/chats';

const BUCKET = 'chat_files';

function sanearNombre(nombre: string): string {
  return nombre.normalize('NFD').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
}

/**
 * POST: Responder una conversación desde el panel.
 *
 * El trigger `trg_chat_notificacion` se encarga del push al residente, y `trg_chat_touch`
 * de reordenar la lista: aquí solo se inserta el mensaje.
 */
export const POST = withAdminConjunto(
  async ({ user, body }) => {
    const form = body as FormData;
    const chatId = String(form.get('chat_id') ?? '');
    const contenido = String(form.get('content') ?? '').trim();
    const archivo = form.get('archivo');

    const chat = await buscarChat(chatId);

    if (chat.estado === 'Finalizado') {
      return fail('Esta conversación está finalizada y no acepta nuevos mensajes', 409);
    }

    const hayArchivo = archivo instanceof File && archivo.size > 0;

    if (!contenido && !hayArchivo) {
      return fail('El mensaje está vacío', 400);
    }

    let messageType = 'text';
    let filePath: string | null = null;

    if (hayArchivo) {
      const file = archivo as File;

      if (file.size > MAX_BYTES_CHAT) {
        return fail('El archivo supera el límite de 10 MB', 400);
      }

      if (!MIMES_CHAT.includes(file.type)) {
        return fail('Solo se admiten imágenes (JPG, PNG, WEBP) o PDF', 400);
      }

      messageType = file.type.startsWith('image/') ? 'image' : 'file';

      // Mismas carpetas que usa el móvil, para que ambos lean del mismo sitio.
      const carpeta = messageType === 'image' ? 'imagenes' : 'archivo';
      filePath = `${carpeta}/${Date.now()}_${sanearNombre(file.name)}`;

      const { error: errorSubida } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(filePath, file, { contentType: file.type, upsert: false });

      if (errorSubida) {
        console.error('Error al subir el adjunto del chat:', errorSubida);
        return fail('No se pudo subir el archivo adjunto', 500);
      }
    }

    const { data: mensaje, error } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        chat_id: chatId,
        sender_id: user.id,
        content: contenido || null,
        message_type: messageType,
        file_name: filePath,
      })
      .select()
      .single();

    if (error) {
      if (filePath) {
        await supabaseAdmin.storage.from(BUCKET).remove([filePath]);
      }
      console.error('Error al enviar el mensaje:', error);
      return fail('Error interno al enviar el mensaje', 500);
    }

    // El residente abre el chat sin destinatario; queda a cargo del primero que responde.
    if (!chat.receptor_id) {
      await supabaseAdmin.from('chats').update({ receptor_id: user.id }).eq('id', chatId);
    }

    // Responder es haber leído lo anterior.
    await supabaseAdmin
      .from('chats')
      .update({ admin_ultima_lectura: new Date().toISOString() })
      .eq('id', chatId);

    return ok(mensaje, 201);
  },
  { formData: true, resolverConjunto: conjuntoDelChat }
);
