import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatRoom, ChatMessage } from '../src/features/chat/hooks/useChatRoom';
import { useAdjuntosFirmados } from '../src/features/chat/hooks/useAdjuntosFirmados';
import { useAuthStore } from '../src/stores/authStore';
import { SkeletonLoader } from '../src/components/common/SkeletonLoader';
import { ScrollView } from 'react-native';

const formatTime = (dateStr: string | null) => {
  if (!dateStr) return '';
  
  // Dividir la cadena para buscar offsets de zona horaria (+ o -) únicamente en la parte de la hora, ignorando los guiones del YYYY-MM-DD
  const parts = dateStr.split(/[T\s]/);
  const timePart = parts[1] || '';
  
  let normalized = dateStr;
  if (!dateStr.endsWith('Z') && !timePart.includes('+') && !timePart.includes('-')) {
    normalized = dateStr.replace(' ', 'T') + 'Z';
  }
  
  try {
    const date = new Date(normalized);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return '';
  }
};

function ChatRoomSkeleton() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      {/* Header Esqueleto */}
      {/* @ts-expect-error - React 18/19 safe area view compatibility */}
      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} disabled>
            {/* @ts-expect-error - React 18/19 vector icons compatibility */}
            <Ionicons name="arrow-back" size={24} color="#94a3b8" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <SkeletonLoader.Rect width="50%" height={16} style={{ marginBottom: 4 }} />
            <SkeletonLoader.Rect width="30%" height={10} />
          </View>
        </View>
      </SafeAreaView>

      {/* Feed simulado de burbujas */}
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Recibido */}
        <View style={{ alignSelf: 'flex-start', width: '65%' }}>
          <SkeletonLoader.Rect height={50} style={{ borderRadius: 16, borderBottomLeftRadius: 4 }} />
        </View>
        
        {/* Enviado */}
        <View style={{ alignSelf: 'flex-end', width: '50%' }}>
          <SkeletonLoader.Rect height={40} style={{ borderRadius: 16, borderBottomRightRadius: 4 }} />
        </View>

        {/* Enviado */}
        <View style={{ alignSelf: 'flex-end', width: '70%' }}>
          <SkeletonLoader.Rect height={70} style={{ borderRadius: 16, borderBottomRightRadius: 4 }} />
        </View>

        {/* Recibido */}
        <View style={{ alignSelf: 'flex-start', width: '55%' }}>
          <SkeletonLoader.Rect height={55} style={{ borderRadius: 16, borderBottomLeftRadius: 4 }} />
        </View>
      </ScrollView>

      {/* Pie de página esqueleto */}
      <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: '#e2e8f0', backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <SkeletonLoader.Circle size={36} />
        <SkeletonLoader.Circle size={36} />
        <SkeletonLoader.Rect height={40} style={{ flex: 1, borderRadius: 20 }} />
      </View>
    </View>
  );
}

export default function ChatRoomScreen() {
  const insets = useSafeAreaInsets();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const {
    messages,
    chatInfo,
    isLoading,
    isSending,
    sendMessage,
  } = useChatRoom(chatId || '');

  // El bucket `chat_files` es privado: los adjuntos solo se abren con una URL firmada.
  const adjuntos = useAdjuntosFirmados(messages);

  const [text, setText] = useState('');
  const [pendingAttachment, setPendingAttachment] = useState<{
    uri: string;
    type: 'image' | 'file';
    name: string;
  } | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScreenLoading, setIsScreenLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsScreenLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Auto-scroll al fondo cuando llegan mensajes nuevos
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleBack = () => {
    router.back();
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos para poder enviar imágenes.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setPendingAttachment({
          uri: asset.uri,
          type: 'image',
          name: asset.fileName || `foto_${Date.now()}.jpg`,
        });
      }
    } catch (err) {
      console.error('Error seleccionando imagen:', err);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara para poder tomar fotos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setPendingAttachment({
          uri: asset.uri,
          type: 'image',
          name: asset.fileName || `camara_${Date.now()}.jpg`,
        });
      }
    } catch (err) {
      console.error('Error tomando foto:', err);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setPendingAttachment({
          uri: asset.uri,
          type: 'file',
          name: asset.name || `archivo_${Date.now()}`,
        });
      }
    } catch (err) {
      console.error('Error seleccionando documento:', err);
    }
  };

  const handleSend = async () => {
    if (!text.trim() && !pendingAttachment) return;

    const messageContent = text.trim() || null;
    const attachmentToSend = pendingAttachment || undefined;

    // Limpiar entrada optimistamente
    setText('');
    setPendingAttachment(null);

    try {
      await sendMessage(messageContent, attachmentToSend);
    } catch (err) {
      // Si falla, restaurar el texto
      if (messageContent) setText(messageContent);
      if (attachmentToSend) setPendingAttachment(attachmentToSend);
    }
  };

  const handleAttachmentPress = (msg: ChatMessage) => {
    if (!msg.file_name) return;
    const signedUrl = adjuntos[msg.file_name];

    if (!signedUrl) {
      Alert.alert('Un momento', 'El archivo todavía se está preparando. Inténtalo de nuevo.');
      return;
    }

    if (msg.message_type === 'image') {
      setSelectedImage(signedUrl);
    } else {
      Linking.openURL(signedUrl).catch((err) => {
        console.error('Error al abrir URL:', err);
        Alert.alert('Error', 'No se pudo abrir el archivo adjunto.');
      });
    }
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.sender_id === user?.id;
    const isImage = item.message_type === 'image';
    const isFile = item.message_type === 'file';

    return (
      <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.theirMessageWrapper]}>
        <View style={[styles.messageBubble, isMe ? styles.myMessageBubble : styles.theirMessageBubble]}>
          
          {/* Si es Imagen */}
          {isImage && item.file_name && adjuntos[item.file_name] && (
            <TouchableOpacity
              onPress={() => handleAttachmentPress(item)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: adjuntos[item.file_name] }}
                style={styles.messageImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}

          {/* Si es Archivo */}
          {isFile && item.file_name && (
            <TouchableOpacity
              style={styles.fileContainer}
              onPress={() => handleAttachmentPress(item)}
              activeOpacity={0.8}
            >
              {/* @ts-expect-error - React 18/19 vector icons compatibility */}
              <Ionicons name="document-attach-outline" size={24} color={isMe ? '#ffffff' : '#8A1C14'} />
              <Text style={[styles.fileText, isMe ? styles.myFileText : styles.theirFileText]} numberOfLines={1}>
                {item.file_name.split('/').pop() || 'Descargar archivo'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Texto del mensaje */}
          {item.content ? (
            <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
              {item.content}
            </Text>
          ) : null}

          {/* Hora */}
          <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.theirTimeText]}>
            {formatTime(item.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  if (isScreenLoading) {
    return <ChatRoomSkeleton />;
  }

  const isChatFinalizado = chatInfo?.estado === 'Finalizado';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header envuelto en SafeAreaView para evitar que se meta debajo del notch */}
      {/* @ts-expect-error - React 18/19 safe area view compatibility */}
      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            {/* @ts-expect-error - React 18/19 vector icons compatibility */}
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {chatInfo?.asunto || 'Chat de Soporte'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isChatFinalizado ? 'Conversación Finalizada' : 'Soporte en línea'}
            </Text>
          </View>
          <View style={[styles.statusIndicator, isChatFinalizado ? styles.statusFinalizado : styles.statusActivo]} />
        </View>
      </SafeAreaView>

      {/* Feed de mensajes */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyFeedContainer}>
            {/* @ts-expect-error - React 18/19 vector icons compatibility */}
            <Ionicons name="chatbubbles-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyFeedTitle}>¡Comienza la conversación!</Text>
            <Text style={styles.emptyFeedText}>Escribe un mensaje de consulta o adjunta un archivo para que el administrador te asista.</Text>
          </View>
        }
      />

      {/* Previsualizador de Adjunto Pendiente */}
      {pendingAttachment && (
        <View style={styles.previewContainer}>
          {pendingAttachment.type === 'image' ? (
            <Image source={{ uri: pendingAttachment.uri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.filePreviewBadge}>
              {/* @ts-expect-error - React 18/19 vector icons compatibility */}
              <Ionicons name="document" size={28} color="#8A1C14" />
            </View>
          )}
          <View style={styles.previewInfo}>
            <Text style={styles.previewName} numberOfLines={1}>
              {pendingAttachment.name}
            </Text>
            <Text style={styles.previewType}>Listo para enviar</Text>
          </View>
          <TouchableOpacity
            style={styles.clearPreviewBtn}
            onPress={() => setPendingAttachment(null)}
          >
            {/* @ts-expect-error - React 18/19 vector icons compatibility */}
            <Ionicons name="close-circle" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
      )}

      {/* Sección inferior de Entrada */}
      {isChatFinalizado ? (
        <View style={styles.finalizadoContainer}>
          {/* @ts-expect-error - React 18/19 vector icons compatibility */}
          <Ionicons name="lock-closed" size={16} color="#64748b" style={styles.lockIcon} />
          <Text style={styles.finalizadoText}>
            Esta conversación ha sido finalizada y no acepta nuevos mensajes.
          </Text>
        </View>
      ) : (
        <View style={styles.inputBar}>
          {/* Botón Adjuntos */}
          <View style={styles.attachmentButtons}>
            <TouchableOpacity style={styles.attachmentBtn} onPress={handleTakePhoto} disabled={isSending}>
              {/* @ts-expect-error - React 18/19 vector icons compatibility */}
              <Ionicons name="camera-outline" size={22} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachmentBtn} onPress={handlePickImage} disabled={isSending}>
              {/* @ts-expect-error - React 18/19 vector icons compatibility */}
              <Ionicons name="image-outline" size={22} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachmentBtn} onPress={handlePickDocument} disabled={isSending}>
              {/* @ts-expect-error - React 18/19 vector icons compatibility */}
              <Ionicons name="document-outline" size={22} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Entrada de texto */}
          <TextInput
            style={styles.textInput}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#94a3b8"
            value={text}
            onChangeText={setText}
            multiline
            editable={!isSending}
          />

          {/* Botón de Enviar */}
          <TouchableOpacity
            style={[styles.sendBtn, (!text.trim() && !pendingAttachment) || isSending ? styles.sendBtnDisabled : null]}
            onPress={handleSend}
            disabled={(!text.trim() && !pendingAttachment) || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              // @ts-expect-error - React 18/19 vector icons compatibility
              <Ionicons name="send" size={18} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Modal Zoom Imagen */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={styles.zoomContainer}>
          <TouchableOpacity style={styles.closeZoomBtn} onPress={() => setSelectedImage(null)}>
            {/* @ts-expect-error - React 18/19 vector icons compatibility */}
            <Ionicons name="close" size={32} color="#ffffff" />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.zoomedImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  safeHeader: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  header: {
    height: 56,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backBtn: {
    paddingRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  statusActivo: {
    backgroundColor: '#22c55e',
  },
  statusFinalizado: {
    backgroundColor: '#94a3b8',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%',
  },
  myMessageWrapper: {
    justifyContent: 'flex-end',
  },
  theirMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  myMessageBubble: {
    backgroundColor: '#8A1C14', // Burdeos corporativo
    borderBottomRightRadius: 2,
  },
  theirMessageBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#ffffff',
  },
  theirMessageText: {
    color: '#0f172a',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 6,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 6,
    maxWidth: 220,
  },
  fileText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  myFileText: {
    color: '#ffffff',
  },
  theirFileText: {
    color: '#8A1C14',
  },
  timeText: {
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  myTimeText: {
    color: 'rgba(255,255,255,0.7)',
  },
  theirTimeText: {
    color: '#94a3b8',
  },
  inputBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  attachmentButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  attachmentBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8A1C14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
  previewContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imagePreview: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  filePreviewBadge: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  previewType: {
    fontSize: 11,
    color: '#16a34a',
    marginTop: 2,
  },
  clearPreviewBtn: {
    padding: 4,
  },
  finalizadoContainer: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  lockIcon: {
    marginTop: 1,
  },
  finalizadoText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
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
  emptyFeedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyFeedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyFeedText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
  },
  zoomContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeZoomBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  zoomedImage: {
    width: '100%',
    height: '80%',
  },
});
