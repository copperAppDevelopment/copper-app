import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Hooks y Componentes de Solicitudes (PQRs)
import { useRequestsData } from '../../src/features/requests/hooks/useRequestsData';
import { RequestsList, RequestItem } from '../../src/features/requests/components/RequestsList';
import { CreateRequestModal } from '../../src/features/requests/components/CreateRequestModal';
import { getRequestStatusConfig } from '../../src/features/dashboard/utils/statusHelpers';

import { SkeletonLoader } from '../../src/components/common/SkeletonLoader';

function SolicitudesSkeleton() {
  return (
    <View style={{ gap: 16 }}>
      {/* Carrusel de filtros simulados */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        <SkeletonLoader.Rect width={100} height={70} style={{ borderRadius: 12 }} />
        <SkeletonLoader.Rect width={100} height={70} style={{ borderRadius: 12 }} />
        <SkeletonLoader.Rect width={100} height={70} style={{ borderRadius: 12 }} />
        <SkeletonLoader.Rect width={100} height={70} style={{ borderRadius: 12 }} />
      </ScrollView>

      {/* Listado de PQRs simulado */}
      <SkeletonLoader.Rect height={100} style={{ borderRadius: 12 }} />
      <SkeletonLoader.Rect height={100} style={{ borderRadius: 12 }} />
      <SkeletonLoader.Rect height={100} style={{ borderRadius: 12 }} />
    </View>
  );
}

type EstadoTipo = 'todos' | 'pendientes' | 'asignadas' | 'en_proceso' | 'completadas' | 'canceladas';

export default function MisSolicitudesScreen() {
  const router = useRouter();
  const { requests, isLoading, error, createRequest, isCreating } = useRequestsData();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState<EstadoTipo>('todos');
  const [isScreenLoading, setIsScreenLoading] = useState(true);

  const requestsList = requests || [];

  useEffect(() => {
    // Si la query ya no está cargando y los datos de solicitudes están listos en caché o cargados
    if (!isLoading && requests !== undefined) {
      const timer = setTimeout(() => {
        setIsScreenLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, requests]);

  // Calcular contadores por estado a partir de los datos cargados
  const contadores = useMemo(() => {
    const counts = {
      todos: requestsList.length,
      pendientes: 0,
      asignadas: 0,
      en_proceso: 0,
      completadas: 0,
      canceladas: 0,
    };

    requestsList.forEach((req: RequestItem) => {
      if (req.estado && req.estado in counts) {
        counts[req.estado as keyof typeof counts] += 1;
      }
    });

    return counts;
  }, [requestsList]);

  // Filtrar solicitudes localmente según el estado seleccionado
  const requestsFiltrados = useMemo(() => {
    if (selectedEstado === 'todos') return requestsList;
    return requestsList.filter((req: RequestItem) => req.estado === selectedEstado);
  }, [requestsList, selectedEstado]);

  const showSkeleton = isScreenLoading && !error;

  const estadosConfig: { key: EstadoTipo; label: string; icon: string }[] = [
    { key: 'todos', label: 'Todas', icon: 'list' },
    { key: 'pendientes', label: 'Pendiente', icon: 'time-outline' },
    { key: 'asignadas', label: 'Asignada', icon: 'person-outline' },
    { key: 'en_proceso', label: 'En Proceso', icon: 'construct-outline' },
    { key: 'completadas', label: 'Completada', icon: 'checkmark-circle-outline' },
    { key: 'canceladas', label: 'Cancelada', icon: 'close-circle-outline' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Cabecera / Botón de Acción destacado */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Gestión de PQRs</Text>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.chatHistoryBtn}
              onPress={() => router.push('/(tabs)/soporte')}
              activeOpacity={0.8}
            >
              {/* @ts-expect-error - React 18/19 vector icons compatibility */}
              <Ionicons name="chatbubbles-outline" size={16} color="#8A1C14" style={styles.btnIcon} />
              <Text style={styles.chatHistoryText}>Chats</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingActionBtn}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              {/* @ts-expect-error - React 18/19 vector icons compatibility */}
              <Ionicons name="add" size={16} color="#ffffff" style={styles.btnIcon} />
              <Text style={styles.floatingActionText}>Radicar PQR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showSkeleton ? (
          <SolicitudesSkeleton />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No se pudieron cargar tus solicitudes.</Text>
          </View>
        ) : (
          <>
            {/* Filtros e Indicadores por Estado */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
            >
              {estadosConfig.map((item) => {
                const isSelected = selectedEstado === item.key;
                const statusCfg = item.key !== 'todos' ? getRequestStatusConfig(item.key) : null;
                const countValue = contadores[item.key] || 0;

                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.filterCard,
                      isSelected && styles.selectedFilterCard,
                      isSelected && statusCfg && { borderColor: statusCfg.textColor },
                    ]}
                    onPress={() => setSelectedEstado(item.key)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.filterCardHeader}>
                      {/* @ts-expect-error - React 18/19 vector icons compatibility */}
                      <Ionicons
                        name={item.icon as any}
                        size={16}
                        color={isSelected ? (statusCfg?.textColor || '#8A1C14') : '#64748b'}
                      />
                      <Text style={[styles.filterBadge, isSelected ? { backgroundColor: statusCfg?.bgColor || '#fee2e2', color: statusCfg?.textColor || '#8A1C14' } : styles.inactiveBadge]}>
                        {countValue}
                      </Text>
                    </View>
                    <Text style={[styles.filterLabel, isSelected && styles.selectedFilterLabel]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Listado de solicitudes filtrado */}
            <RequestsList requests={requestsFiltrados || []} />
          </>
        )}
      </ScrollView>

      {/* Modal flotante de radicación */}
      <CreateRequestModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={createRequest}
        isSubmitting={isCreating}
      />
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  floatingActionBtn: {
    flexDirection: 'row',
    backgroundColor: '#8A1C14',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#8A1C14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  btnIcon: {
    marginRight: 4,
  },
  floatingActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filtersScroll: {
    paddingBottom: 20,
    gap: 10,
  },
  filterCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    minWidth: 100,
    justifyContent: 'space-between',
    height: 70,
  },
  selectedFilterCard: {
    borderColor: '#8A1C14',
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  inactiveBadge: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
  },
  filterLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 4,
  },
  selectedFilterLabel: {
    color: '#0f172a',
    fontWeight: 'bold',
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
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  chatHistoryBtn: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#8A1C14',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  chatHistoryText: {
    color: '#8A1C14',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
