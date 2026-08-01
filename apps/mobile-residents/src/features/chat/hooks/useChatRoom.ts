import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string | null;
  message_type: string;
  file_name: string | null;
  created_at: string | null;
}

export interface ChatInfo {
  id: string;
  asunto: string;
  residente_id: string;
  conjunto_id: string;
  estado: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useChatRoom(chatId: string) {
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Cargar historial inicial y datos del chat
  useEffect(() => {
    if (!chatId || !user?.id) return;

    const loadChatData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Cargar información del chat
        const { data: chatData, error: chatError } = await supabase
          .from('chats')
          .select('*')
          .eq('id', chatId)
          .single();

        if (chatError) throw chatError;
        setChatInfo(chatData as ChatInfo);

        // Cargar historial de mensajes
        const { data: messageData, error: messageError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });

        if (messageError) throw messageError;
        setMessages(messageData as ChatMessage[]);
      } catch (err: any) {
        console.error('Error cargando chat:', err);
        setError(err.message || 'Error al cargar la sala de chat');
      } finally {
        setIsLoading(false);
      }
    };

    loadChatData();
  }, [chatId, user?.id]);

  // 2. Suscripción en tiempo real usando Supabase Realtime
  useEffect(() => {
    if (!chatId) return;

    console.log(`Subscribiéndose a canal en tiempo real para chat: ${chatId}`);

    const channel = supabase
      .channel(`room:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            // Evitar duplicados si el mensaje ya fue agregado localmente de forma optimista
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe((status) => {
        console.log(`Estado suscripción realtime chat ${chatId}:`, status);
      });

    return () => {
      console.log(`Limpiando suscripción realtime para chat: ${chatId}`);
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  // 3. Subir archivo a Supabase Storage
  const uploadFile = async (
    uri: string,
    type: 'image' | 'file',
    fileName: string
  ): Promise<string> => {
    const folder = type === 'image' ? 'imagenes' : 'archivo';
    const cleanFileName = `${Date.now()}_${fileName.replace(/\s+/g, '_')}`;
    const storagePath = `${folder}/${cleanFileName}`;

    // Determinar el MIME type correcto
    let mimeType = 'application/octet-stream';
    if (type === 'image') {
      mimeType = 'image/jpeg';
    } else if (fileName.endsWith('.pdf')) {
      mimeType = 'application/pdf';
    }

    // Objeto compatible con el serializador Multipart de React Native
    const file = {
      uri,
      name: cleanFileName,
      type: mimeType,
    } as any;

    const { error: uploadError } = await supabase.storage
      .from('chat_files')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error subiendo archivo a Supabase Storage:', uploadError);
      throw uploadError;
    }

    return storagePath;
  };

  // 4. Enviar Mensaje
  const sendMessage = async (
    content: string | null,
    attachment?: { uri: string; type: 'image' | 'file'; name: string }
  ) => {
    if (!chatId || !user?.id) return;
    if (chatInfo?.estado === 'Finalizado') {
      alert('Esta conversación está finalizada y no acepta nuevos mensajes.');
      return;
    }

    setIsSending(true);
    try {
      let messageType = 'text';
      let filePath: string | null = null;

      // Si hay un adjunto, subirlo primero
      if (attachment) {
        messageType = attachment.type;
        filePath = await uploadFile(attachment.uri, attachment.type, attachment.name);
      }

      // Insertar en la tabla chat_messages
      const { data: newMsg, error: sendError } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content: content,
          message_type: messageType,
          file_name: filePath,
        })
        .select()
        .single();

      if (sendError) throw sendError;

      // Actualizar estado local optimistamente si la suscripción realtime aún no lo ha inyectado
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg as ChatMessage];
      });

      // Actualizar el timestamp del chat para ordenarlo al principio en el historial
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

    } catch (err: any) {
      console.error('Error al enviar mensaje:', err);
      alert(err.message || 'No se pudo enviar el mensaje.');
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    chatInfo,
    isLoading,
    isSending,
    error,
    sendMessage,
  };
}
