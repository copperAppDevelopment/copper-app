import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useChats } from '../hooks/useChats';

interface CreateChatModalProps {
  visible: boolean;
  onClose: () => void;
  onChatCreated: (chatId: string) => void;
}

export function CreateChatModal({ visible, onClose, onChatCreated }: CreateChatModalProps) {
  const [asunto, setAsunto] = useState('');
  const { createChat, isCreatingChat } = useChats();

  const handleCreate = async () => {
    if (!asunto.trim()) {
      Alert.alert('Campo requerido', 'Por favor escribe el asunto o motivo de tu consulta.');
      return;
    }

    try {
      const newChat = await createChat(asunto.trim());
      setAsunto('');
      onClose();
      if (newChat?.id) {
        onChatCreated(newChat.id);
      }
    } catch (err: any) {
      console.error('Error creando conversación:', err);
      Alert.alert('Error', err.message || 'No se pudo crear la conversación. Inténtalo de nuevo.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Nueva Conversación</Text>
          <Text style={styles.subtitle}>Escribe el asunto de tu consulta o inconveniente técnico.</Text>

          <TextInput
            style={styles.input}
            placeholder="Ej: Inconveniente con el pago de administración..."
            placeholderTextColor="#94a3b8"
            value={asunto}
            onChangeText={setAsunto}
            multiline
            numberOfLines={3}
            maxLength={150}
            editable={!isCreatingChat}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={onClose}
              disabled={isCreatingChat}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.createBtn]}
              onPress={handleCreate}
              disabled={isCreatingChat}
              activeOpacity={0.8}
            >
              {isCreatingChat ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.createBtnText}>Iniciar Chat</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    minHeight: 80,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    fontSize: 14,
    color: '#0f172a',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  createBtn: {
    backgroundColor: '#8A1C14',
  },
  createBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
