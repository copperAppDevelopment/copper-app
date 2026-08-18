import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/stores/authStore';
import { supabase } from '../../src/lib/supabase';
import { CustomButton } from '../../src/components/common/CustomButton';

// Profile Feature Components & Hooks
import { useProfileData } from '../../src/features/profile/hooks/useProfileData';
import { ProfileHeader } from '../../src/features/profile/components/ProfileHeader';
import { BasicInfoForm } from '../../src/features/profile/components/BasicInfoForm';
import { ConvivientesSection } from '../../src/features/profile/components/ConvivientesSection';
import { VehiculosSection } from '../../src/features/profile/components/VehiculosSection';
import { MascotasSection } from '../../src/features/profile/components/MascotasSection';
import { EmpleadosSection } from '../../src/features/profile/components/EmpleadosSection';

import { SkeletonLoader } from '../../src/components/common/SkeletonLoader';
import { CustomAlert } from '../../src/components/common/CustomAlert';

function ProfileHeaderSkeleton() {
  return (
    <View style={styles.headerSkeletonContainer}>
      <SkeletonLoader.Circle size={90} style={{ alignSelf: 'center', marginBottom: 12 }} />
      <SkeletonLoader.Rect width="50%" height={20} style={{ alignSelf: 'center', marginBottom: 8 }} />
      <SkeletonLoader.Rect width="35%" height={14} style={{ alignSelf: 'center' }} />
    </View>
  );
}

function ProfileContentSkeleton() {
  return (
    <View style={{ gap: 16 }}>
      {/* Campos de formulario simulados */}
      <SkeletonLoader.Rect height={50} style={{ borderRadius: 8 }} />
      <SkeletonLoader.Rect height={50} style={{ borderRadius: 8 }} />
      <SkeletonLoader.Rect height={50} style={{ borderRadius: 8 }} />
      <SkeletonLoader.Rect height={50} style={{ borderRadius: 8 }} />

      {/* Info de apartamento simulada */}
      <SkeletonLoader.Rect height={110} style={{ borderRadius: 12, marginTop: 8 }} />
    </View>
  );
}

type ActiveTab = 'datos' | 'familia' | 'vehiculos' | 'mascotas' | 'servicios';

export default function MiPerfilScreen() {
  const logout = useAuthStore((state) => state.logout);
  const {
    profile,
    isLoading,
    error,
    updateProfile,
    isUpdatingProfile,
    uploadPhoto,
    isUploadingPhoto,
    convivienteMutate,
    vehicleMutate,
    petMutate,
    employeeMutate,
  } = useProfileData();

  const [activeTab, setActiveTab] = useState<ActiveTab>('datos');
  const [isLogoutAlertVisible, setIsLogoutAlertVisible] = useState(false);

  const getApartamentoInfo = () => {
    const dashboard = profile?.dashboard;
    if (dashboard?.numero_apartamento) {
      if (dashboard.direccion_apartamento) {
        return `Apt. ${dashboard.numero_apartamento} (${dashboard.direccion_apartamento})`;
      }
      return `Apt. ${dashboard.numero_apartamento}`;
    }
    return 'Sin asignar';
  };

  const handleLogout = () => {
    setIsLogoutAlertVisible(true);
  };

  const confirmLogout = async () => {
    setIsLogoutAlertVisible(false);
    try {
      await supabase.auth.signOut();
      logout();
    } catch (err) {
      console.error('Error cerrando sesión:', err);
    }
  };

  const handlePhotoUpload = async (base64: string, filename: string) => {
    await uploadPhoto({ fileBase64: base64, filename });
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar el perfil del residente.</Text>
      </View>
    );
  }

  const { user, residente, convivientes, vehiculos, mascotas, empleados } = profile || {
    user: null,
    residente: null,
    convivientes: [],
    vehiculos: [],
    mascotas: [],
    empleados: [],
  };

  const tabItems: { key: ActiveTab; label: string; icon: string }[] = [
    { key: 'datos', label: 'Datos', icon: 'person-outline' },
    { key: 'familia', label: 'Familia', icon: 'people-outline' },
    { key: 'vehiculos', label: 'Vehículos', icon: 'car-outline' },
    { key: 'mascotas', label: 'Mascotas', icon: 'paw-outline' },
    { key: 'servicios', label: 'Servicios', icon: 'briefcase-outline' },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Header con avatar e imagen interactiva */}
      {isLoading ? (
        <ProfileHeaderSkeleton />
      ) : (
        <ProfileHeader
          nombres={user?.nombres}
          apellidos={user?.apellidos}
          fotoUrl={user?.foto_url}
          onPhotoSelected={handlePhotoUpload}
          isUploading={isUploadingPhoto}
        />
      )}

      {/* 2. Barra de Pestañas Deslizables (Siempre visible) */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {tabItems.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabButton, isActive && styles.activeTabButton]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                {/* @ts-expect-error - React 18/19 vector icons compatibility */}
                <Ionicons
                  name={tab.icon as any}
                  size={16}
                  color={isActive ? '#8A1C14' : '#64748b'}
                  style={styles.tabIcon}
                />
                <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Contenedor de Contenido Dinámico */}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {isLoading ? (
          <ProfileContentSkeleton />
        ) : (
          <>
            {activeTab === 'datos' && (
              <BasicInfoForm
                initialData={{
                  nombres: user?.nombres,
                  apellidos: user?.apellidos,
                  phone_number: user?.phone_number,
                  tipo_documento: user?.tipo_documento || 'CC',
                  documento: user?.documento || '',
                }}
                onSave={updateProfile}
                isSaving={isUpdatingProfile}
              />
            )}

            {activeTab === 'familia' && (
              <ConvivientesSection
                convivientes={convivientes}
                onMutate={(payload) => convivienteMutate(payload)}
              />
            )}

            {activeTab === 'vehiculos' && (
              <VehiculosSection
                vehicles={vehiculos}
                onMutate={(payload) => vehicleMutate(payload)}
              />
            )}

            {activeTab === 'mascotas' && (
              <MascotasSection
                pets={mascotas}
                onMutate={(payload) => petMutate(payload)}
              />
            )}

            {activeTab === 'servicios' && (
              <EmpleadosSection
                employees={empleados}
                onMutate={(payload) => employeeMutate(payload)}
              />
            )}

            {/* Info adicional del residente */}
            <View style={styles.apartmentCard}>
              <Text style={styles.apartmentTitle}>Conjunto & Apartamento</Text>
              <View style={styles.apartmentDetails}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Conjunto:</Text>
                  <Text style={styles.infoValue}>
                    {profile?.dashboard?.conjunto_nombre || 'Conjunto Residencial'}
                  </Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Apartamento / Casa:</Text>
                  <Text style={styles.infoValue}>
                    {getApartamentoInfo()}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* 4. Botón de Logout (Fuera del Skeleton, siempre interactivo) */}
        <CustomButton
          title="Cerrar Sesión"
          style={styles.logoutBtn}
          onPress={handleLogout}
        />
      </ScrollView>

      {/* Alerta de confirmación de logout */}
      <CustomAlert
        visible={isLogoutAlertVisible}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas salir de tu cuenta?"
        type="confirm"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        isDestructive
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerSkeletonContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loaderText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorText: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  tabsWrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 10,
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  activeTabButton: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#f43f5e',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  activeTabLabel: {
    color: '#8A1C14',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  apartmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  apartmentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  apartmentDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 6,
  },
  logoutBtn: {
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
  },
});
