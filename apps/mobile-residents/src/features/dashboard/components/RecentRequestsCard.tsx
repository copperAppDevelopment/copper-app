import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CustomCard } from '../../../components/common/CustomCard';
import { getRequestStatusConfig } from '../utils/statusHelpers';

interface Solicitud {
  id: string;
  titulo_solicitud: string;
  solicitud_estado: string;
  created_at: string | null | undefined;
}

interface RecentRequestsCardProps {
  requests?: Solicitud[];
}

export function RecentRequestsCard({ requests = [] }: RecentRequestsCardProps) {
  const displayRequests = requests.slice(0, 2);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Sin fecha';
    
    // Normalizar formato de fecha para Hermes (motor de JS de React Native)
    let normalized = dateStr;
    if (!dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.includes('-')) {
      normalized = dateStr.replace(' ', 'T') + 'Z';
    } else if (dateStr.includes(' ')) {
      normalized = dateStr.replace(' ', 'T');
    }

    try {
      const date = new Date(normalized);
      if (isNaN(date.getTime())) return 'Sin fecha';
      return date.toLocaleDateString('es-CO');
    } catch (e) {
      return 'Sin fecha';
    }
  };

  return (
    <CustomCard style={styles.card}>
      <Text style={styles.sectionTitle}>Mis Solicitudes Recientes</Text>
      {displayRequests.length > 0 ? (
        displayRequests.map((item, idx) => {
          const statusCfg = getRequestStatusConfig(item.solicitud_estado);
          
          return (
            <View key={item.id || idx} style={styles.requestItem}>
              <View style={styles.requestHeader}>
                <Text style={styles.requestTitle} numberOfLines={1}>
                  {item.titulo_solicitud}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: statusCfg.bgColor }]}>
                  <Text style={[styles.statusBadgeText, { color: statusCfg.textColor }]}>
                    {statusCfg.label}
                  </Text>
                </View>
              </View>
              <Text style={styles.requestDate}>
                Radicado: {formatDate(item.created_at)}
              </Text>
              {idx < displayRequests.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })
      ) : (
        <Text style={styles.emptyText}>No tienes solicitudes radicadas.</Text>
      )}
    </CustomCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 6,
  },
  requestItem: {
    paddingVertical: 8,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 0.65,
  },
  requestDate: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 10,
  },
});
