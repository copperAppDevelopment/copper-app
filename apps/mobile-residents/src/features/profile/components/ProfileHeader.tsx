import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://javsddqiuzzigbhygrtp.supabase.co';

interface ProfileHeaderProps {
  nombres?: string | null;
  apellidos?: string | null;
  fotoUrl?: string | null;
  onPhotoSelected: (base64: string, filename: string) => Promise<void>;
  isUploading?: boolean;
}

export function ProfileHeader({
  nombres = '',
  apellidos = '',
  fotoUrl,
  onPhotoSelected,
  isUploading = false,
}: ProfileHeaderProps) {
  const getInitials = () => {
    const fLetter = nombres?.[0] || '';
    const lLetter = apellidos?.[0] || '';
    return `${fLetter}${lLetter}`.toUpperCase() || 'R';
  };

  const handlePickImage = async () => {
    // Solicitar permisos de cámara/galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para poder cambiar tu foto de perfil.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      if (asset.base64) {
        const filename = asset.uri.split('/').pop() || 'profile.jpg';
        try {
          await onPhotoSelected(asset.base64, filename);
          Alert.alert('Éxito', 'Tu foto de perfil ha sido actualizada.');
        } catch (err: any) {
          Alert.alert('Error', err.message || 'No se pudo actualizar tu foto.');
        }
      }
    }
  };

  // Construir la URL completa del Storage de Supabase
  const imageUrl = fotoUrl ? `${supabaseUrl}/storage/v1/object/public/Profile/${fotoUrl}` : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.avatarWrapper}
        activeOpacity={0.8}
        onPress={handlePickImage}
        disabled={isUploading}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.initialsText}>{getInitials()}</Text>
          </View>
        )}

        {/* Overlay con ícono de cámara */}
        <View style={styles.cameraIconBadge}>
          {/* @ts-expect-error - React 18/19 vector icons compatibility */}
          <Ionicons name="camera" size={14} color="#ffffff" />
        </View>

        {isUploading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#ffffff" />
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.nameText}>
        {nombres} {apellidos}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    position: 'relative',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff1f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f43f5e',
  },
  initialsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8A1C14',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#8A1C14',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  roleText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
});
