import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, ScrollView, Alert } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../src/stores/authStore';
import { CircularNoticesCard } from '../../src/features/dashboard/components/CircularNoticesCard';

import { SkeletonLoader } from '../../src/components/common/SkeletonLoader';

const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.50.5:3001';

const fetchNotifications = async (token?: string) => {
  if (!token) return [];
  const response = await fetch(`${apiUrl}/api/v1/residents/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Error al cargar notificaciones');
  const json = await response.json();
  return json.data;
};

function NotificacionesSkeleton() {
  return (
    <View style={{ gap: 16 }}>
      {/* Título de esqueleto */}
      <SkeletonLoader.Rect width="50%" height={24} style={{ marginBottom: 8 }} />

      {/* Lista de tarjetas de comunicados */}
      <SkeletonLoader.Rect height={140} style={{ borderRadius: 12 }} />
      <SkeletonLoader.Rect height={140} style={{ borderRadius: 12 }} />
      <SkeletonLoader.Rect height={140} style={{ borderRadius: 12 }} />
    </View>
  );
}

export default function NotificacionesScreen() {
  const token = useAuthStore((state) => state.session?.access_token);
  const queryClient = useQueryClient();
  const [isScreenLoading, setIsScreenLoading] = useState(true);

  // React Query para notificaciones
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications', token],
    queryFn: () => fetchNotifications(token),
    enabled: !!token,
  });

  useEffect(() => {
    // Si la query ya no está cargando y los datos de notificación están listos en caché o cargados
    if (!isLoading && notifications !== undefined) {
      const timer = setTimeout(() => {
        setIsScreenLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, notifications]);

  // Función para manejar la aprobación / rechazo de visitas
  const handleVisitAction = async (visitaId: string, estado: 'aprobado' | 'rechazado') => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/residents/visits`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          visitaId,
          estado,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo actualizar el estado de la visita.');
      }

      Alert.alert(
        'Acción procesada',
        estado === 'aprobado'
          ? 'Has autorizado el ingreso de la visita.'
          : 'Has rechazado el ingreso de la visita.'
      );

      // Invalidar las queries para refrescar la interfaz (Dashboard y Notificaciones)
      await queryClient.invalidateQueries({ queryKey: ['notifications', token] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard', token] });

    } catch (err: any) {
      console.error('Error al procesar acción de visita:', err);
      Alert.alert('Error', err.message || 'Ocurrió un error inesperado al procesar la visita.');
    }
  };

  const showSkeleton = isScreenLoading && !error;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      {showSkeleton ? (
        <NotificacionesSkeleton />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudieron cargar los comunicados.</Text>
        </View>
      ) : (
        <CircularNoticesCard
          notifications={notifications || []}
          showActions={true}
          onActionPress={handleVisitAction}
          title="Historial de Comunicados"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  loaderText: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
