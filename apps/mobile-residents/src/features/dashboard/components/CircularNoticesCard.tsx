import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CustomCard } from '../../../components/common/CustomCard';

export interface CircularNotice {
  id_notification: number | null;
  title: string | null;
  content: string | null;
  created_at: string | null;
  id_visita: string | null;
  estado_visita: 'pendiente' | 'aprobado' | 'rechazado' | null;
  leida: boolean | null;
}

interface CircularNoticesCardProps {
  notifications?: CircularNotice[];
  showActions?: boolean;
  onActionPress?: (visitaId: string, estado: 'aprobado' | 'rechazado') => Promise<void>;
  maxItems?: number; // Para limitar en el home
  title?: string; // Para personalizar el título del módulo
}

export function CircularNoticesCard({
  notifications = [],
  showActions = false,
  onActionPress,
  maxItems,
  title = 'Circulares y Novedades',
}: CircularNoticesCardProps) {
  const displayNotices = maxItems ? notifications.slice(0, maxItems) : notifications;
  
  // Estado local para controlar el loading de cada visita individual
  const [loadingVisits, setLoadingVisits] = useState<Record<string, boolean>>({});

  const handleAction = async (visitaId: string, estado: 'aprobado' | 'rechazado') => {
    if (!onActionPress) return;
    
    // Setear loading para esta visita
    setLoadingVisits((prev) => ({ ...prev, [visitaId]: true }));
    try {
      await onActionPress(visitaId, estado);
    } finally {
      // Remover loading
      setLoadingVisits((prev) => ({ ...prev, [visitaId]: false }));
    }
  };

  return (
    <CustomCard style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {displayNotices.length > 0 ? (
        displayNotices.map((item, idx) => {
          const key = item.id_notification || idx;
          const isPendingVisit = showActions && item.id_visita && item.estado_visita === 'pendiente';
          const isProcessedVisit = showActions && item.id_visita && item.estado_visita && item.estado_visita !== 'pendiente';
          const isLoading = item.id_visita ? !!loadingVisits[item.id_visita] : false;

          return (
            <View key={key} style={styles.notificationItem}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle} numberOfLines={1}>
                  {item.title || 'Circular Informativa'}
                </Text>
                <Text style={styles.notificationDate}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString('es-CO') : ''}
                </Text>
              </View>
              <Text style={styles.notificationBody}>
                {item.content || 'Sin descripción disponible.'}
              </Text>

              {/* Botones de Aceptar / Rechazar Visita */}
              {isPendingVisit && (
                <View style={styles.actionsContainer}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#8A1C14" style={styles.loader} />
                  ) : (
                    <>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.rejectBtn]}
                        onPress={() => handleAction(item.id_visita!, 'rechazado')}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.rejectBtnText}>Rechazar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.approveBtn]}
                        onPress={() => handleAction(item.id_visita!, 'aprobado')}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.approveBtnText}>Aceptar</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}

              {/* Feedback de estado de Visita ya procesada */}
              {isProcessedVisit && (
                <View style={styles.statusFeedbackContainer}>
                  <Text
                    style={[
                      styles.statusFeedbackText,
                      item.estado_visita === 'aprobado' ? styles.approvedText : styles.rejectedText,
                    ]}
                  >
                    {item.estado_visita === 'aprobado'
                      ? '✓ Ingreso de visita autorizado'
                      : '✗ Ingreso de visita rechazado'}
                  </Text>
                </View>
              )}

              {idx < displayNotices.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })
      ) : (
        <Text style={styles.emptyText}>No hay circulares recientes registradas.</Text>
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
  notificationItem: {
    paddingVertical: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 0.7,
  },
  notificationDate: {
    fontSize: 10,
    color: '#94a3b8',
  },
  notificationBody: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    lineHeight: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    borderColor: '#dc2626',
    backgroundColor: '#fff5f5',
  },
  rejectBtnText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: 'bold',
  },
  approveBtn: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  approveBtnText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loader: {
    paddingVertical: 6,
    marginRight: 10,
  },
  statusFeedbackContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  statusFeedbackText: {
    fontSize: 12,
    fontWeight: '600',
  },
  approvedText: {
    color: '#16a34a',
  },
  rejectedText: {
    color: '#dc2626',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 10,
  },
});
