import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';

const PAGE_SIZE = 10;

export function useChats() {
  const user = useAuthStore((state) => state.user);
  const residente = useAuthStore((state) => state.residente);
  const queryClient = useQueryClient();

  const fetchChats = async ({ pageParam = 0 }) => {
    if (!residente?.id) return { data: [], nextPage: null };

    const from = pageParam * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    // Consultamos la vista vista_chats_usuario filtrando por el residente_id
    const { data, error } = await supabase
      .from('vista_chats_usuario')
      .select('*')
      .eq('residente_id', residente.id)
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching chats from vista_chats_usuario:', error);
      throw error;
    }

    const hasNext = data.length === PAGE_SIZE;
    return {
      data: data || [],
      nextPage: hasNext ? pageParam + 1 : null,
    };
  };

  const chatsQuery = useInfiniteQuery({
    queryKey: ['chats', residente?.id],
    queryFn: fetchChats,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!residente?.id,
  });

  const createChatMutation = useMutation({
    mutationFn: async (asunto: string) => {
      if (!user?.id) throw new Error('Usuario no autenticado');

      // 1. Obtener el conjunto_id del residente
      const { data: residente, error: resError } = await supabase
        .from('residentes')
        .select('id, conjunto_id')
        .eq('user_id', user.id)
        .single();

      if (resError || !residente) {
        throw new Error('No se encontró la información del conjunto del residente.');
      }

      // 2. Crear la conversación en la tabla chats
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({
          asunto,
          residente_id: residente.id,
          conjunto_id: residente.conjunto_id,
          estado: 'Activo',
        })
        .select()
        .single();

      if (chatError) {
        console.error('Error al crear el chat:', chatError);
        throw chatError;
      }

      return newChat;
    },
    onSuccess: () => {
      // Refrescar lista de chats
      queryClient.invalidateQueries({ queryKey: ['chats', residente?.id] });
    },
  });

  return {
    ...chatsQuery,
    createChat: createChatMutation.mutateAsync,
    isCreatingChat: createChatMutation.isPending,
  };
}
