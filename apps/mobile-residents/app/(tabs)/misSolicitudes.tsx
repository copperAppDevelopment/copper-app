import React, { useState, useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Hooks y Componentes de Solicitudes (PQRs)
import { useRequestsData } from '../../src/features/requests/hooks/useRequestsData';
import { RequestsList, RequestItem } from '../../src/features/requests/components/RequestsList';
import { CreateRequestModal } from '../../src/features/requests/components/CreateRequestModal';
import { getRequestStatusConfig } from '../../src/features/dashboard/utils/statusHelpers';

type EstadoTipo = 'todos' | 'pendientes' | 'asignadas' | 'en_proceso' | 'completadas' | 'canceladas';

export default function MisSolicitudesScreen() {
  const { requests = [], isLoading, error, createRequest, isCreating } = useRequestsData();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState<EstadoTipo>('todos');

  // Calcular contadores por estado a partir de los datos cargados
  const contadores = useMemo(() => {
    const counts = {
      todos: requests.length,
      pendientes: 0,
      asignadas: 0,
      en_proceso: 0,
      completadas: 0,
      canceladas: 0,
    };

    requests.forEach((req: RequestItem) => {
      if (req.estado && req.estado in counts) {
        counts[req.estado as keyof typeof counts] += 1;
      }
    });

    return counts;
  }, [requests]);

  // Filtrar solicitudes localmente según el estado seleccionado
  const requestsFiltrados = useMemo(() => {
    if (selectedEstado === 'todos') return requests;
    return requests.filter((req: RequestItem) => req.estado === selectedEstado);
  }, [requests, selectedEstado]);

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
          <TouchableOpacity
            style={styles.floatingActionBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            {/* @ts-expect-error - React 18/19 vector icons compatibility */}
            <Ionicons name="add" size={20} color="#ffffff" style={styles.btnIcon} />
            <Text style={styles.floatingActionText}>Radicar PQR</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#8A1C14" />
            <Text style={styles.loaderText}>Cargando solicitudes...</Text>
          </View>
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
            <RequestsList requests={requestsFiltrados} />
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
});
