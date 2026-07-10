import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { CustomCard } from '../../../components/common/CustomCard';
import { getRequestStatusConfig } from '../../dashboard/utils/statusHelpers';

export interface RequestItem {
  id_solicitud: string | null;
  titulo: string | null;
  descripcion: string | null;
  estado: 'pendientes' | 'asignadas' | 'en_proceso' | 'completadas' | 'canceladas' | null;
  prioridad: 'baja' | 'media' | 'alta' | null;
  fecha_solicitud: string | null;
  tipo_solicitud: string | null;
  ubicacion: string | null;
}

interface RequestsListProps {
  requests?: RequestItem[];
}

export function RequestsList({ requests = [] }: RequestsListProps) {
  if (requests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No has radicado ninguna solicitud.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: RequestItem }) => {
    const statusCfg = getRequestStatusConfig(item.estado || 'pendientes');
    const dateFormatted = item.fecha_solicitud
      ? new Date(item.fecha_solicitud).toLocaleDateString('es-CO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    return (
      <CustomCard style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {item.titulo || 'Solicitud de Atención'}
          </Text>
          <View style={[styles.badge, { backgroundColor: statusCfg.bgColor }]}>
            <Text style={[styles.badgeText, { color: statusCfg.textColor }]}>
              {statusCfg.label}
            </Text>
          </View>
        </View>

        <Text style={styles.type}>Tipo: {item.tipo_solicitud || 'General'}</Text>
        
        {item.ubicacion && (
          <Text style={styles.location}>Ubicación: {item.ubicacion}</Text>
        )}

        <Text style={styles.description}>{item.descripcion}</Text>

        <View style={styles.footer}>
          <Text style={styles.date}>{dateFormatted}</Text>
          {item.prioridad && (
            <Text style={[styles.priority, styles[item.prioridad]]}>
              Prioridad: {item.prioridad.toUpperCase()}
            </Text>
          )}
        </View>
      </CustomCard>
    );
  };

  return (
    <FlatList
      data={requests}
      keyExtractor={(item, index) => item.id_solicitud || index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      scrollEnabled={false} // Se maneja el scroll en la vista contenedora
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    padding: 16,
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 0.7,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  type: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  location: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: '#334155',
    marginTop: 8,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
  date: {
    fontSize: 10,
    color: '#94a3b8',
  },
  priority: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  baja: {
    color: '#475569',
  },
  media: {
    color: '#b45309',
  },
  alta: {
    color: '#b91c1c',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
  },
});
