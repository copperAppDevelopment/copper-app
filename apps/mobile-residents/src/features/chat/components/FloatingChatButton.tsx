import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CreateChatModal } from './CreateChatModal';

export function FloatingChatButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleChatCreated = (chatId: string) => {
    // Redirigir a la pantalla de la sala de chat
    router.push({
      pathname: '/chatRoom',
      params: { chatId },
    });
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.95}
      >
        {/* @ts-expect-error - React 18/19 vector icons compatibility */}
        <Ionicons name="chatbubble-ellipses" size={20} color="#ffffff" />
      </TouchableOpacity>

      <CreateChatModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onChatCreated={handleChatCreated}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8A1C14', // Color insignia burdeos de CopperApp
    justifyContent: 'center',
    alignItems: 'center',
    // Sombras premium
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 9999, // Asegura que se dibuje por encima de cualquier layout
  },
});
