import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useChats } from '../../src/features/chat/hooks/useChats';
import { Ionicons } from '@expo/vector-icons';

interface ChatItemProps {
  chat: any;
  onPress: () => void;
}

function ChatItem({ chat, onPress }: ChatItemProps) {
  const isFinalizado = chat.estado === 'Finalizado';
  
  // Formatear la fecha de forma amigable
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.asunto} numberOfLines={1}>
          {chat.asunto || 'Sin asunto'}
        </Text>
        <View style={[styles.badge, isFinalizado ? styles.badgeFinalizado : styles.badgeActivo]}>
          <Text style={[styles.badgeText, isFinalizado ? styles.badgeTextFinalizado : styles.badgeTextActivo]}>
            {chat.estado || 'Activo'}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        {/* @ts-expect-error - React 18/19 vector icons compatibility */}
        <Ionicons name="chatbox-ellipses-outline" size={16} color="#64748b" style={styles.msgIcon} />
        <Text style={styles.lastMsg} numberOfLines={1}>
          {chat.ultimo_mensaje || 'No hay mensajes en esta conversación.'}
        </Text>
      </View>

      {chat.ultimo_mensaje_fecha && (
        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>{formatDate(chat.ultimo_mensaje_fecha)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

import { SkeletonLoader } from '../../src/components/common/SkeletonLoader';

function SoporteSkeleton() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <SkeletonLoader.Rect height={90} style={{ borderRadius: 12 }} />
      <SkeletonLoader.Rect height={90} style={{ borderRadius: 12 }} />
      <SkeletonLoader.Rect height={90} style={{ borderRadius: 12 }} />
    </View>
  );
}

export default function SoporteScreen() {
  const router = useRouter();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useChats();

  // Aplanar las páginas de datos devueltas por useInfiniteQuery
  const chatsList = data?.pages.flatMap((page) => page.data) || [];

  const handleChatPress = (chatId: string) => {
    router.push({
      pathname: '/chatRoom',
      params: { chatId },
    });
  };

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        {/* @ts-expect-error - React 18/19 vector icons compatibility */}
        <Ionicons name="alert-circle-outline" size={48} color="#dc2626" />
        <Text style={styles.errorText}>Ocurrió un error al cargar las consultas.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryBtnText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <SoporteSkeleton />
      ) : (
        <FlatList
          data={chatsList}
          keyExtractor={(item, idx) => item.chat_id || idx.toString()}
          renderItem={({ item }) => (
            <ChatItem
              chat={item}
              onPress={() => handleChatPress(item.chat_id!)}
            />
          )}
          contentContainerStyle={styles.listContent}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                {/* @ts-expect-error - React 18/19 vector icons compatibility */}
                <Ionicons name="chatbubbles-outline" size={64} color="#94a3b8" />
              </View>
              <Text style={styles.emptyTitle}>¿Necesitas soporte?</Text>
              <Text style={styles.emptyDescription}>
                Inicia una conversación de soporte técnico haciendo clic en el botón flotante de chat en la parte inferior derecha.
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#8A1C14" />
              </View>
            ) : null
          }
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Espacio para que el FAB no tape el último elemento
  },
  chatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  asunto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 12,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  badgeActivo: {
    backgroundColor: '#f0fdf4',
  },
  badgeFinalizado: {
    backgroundColor: '#f1f5f9',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextActivo: {
    color: '#16a34a',
  },
  badgeTextFinalizado: {
    color: '#64748b',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  msgIcon: {
    marginRight: 6,
  },
  lastMsg: {
    fontSize: 13,
    color: '#475569',
    flex: 1,
  },
  cardFooter: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
  dateText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: '#8A1C14',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLoader: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});
