import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CustomCard } from '../../../components/common/CustomCard';

interface Movement {
  periodo: string | null;
  fecha_movimiento: string | null;
  fecha_vencimiento: string | null;
  movimiento_tipo: string | null;
  concepto_cargo: string | null;
  origen_pago: string | null;
  debito: number | null;
  credito: number | null;
}

interface MovementHistoryCardProps {
  history?: Movement[];
}

export function MovementHistoryCard({ history = [] }: MovementHistoryCardProps) {
  return (
    <CustomCard style={styles.card}>
      <Text style={styles.sectionTitle}>Historial de Movimientos</Text>
      
      {history.length > 0 ? (
        history.map((item, idx) => {
          const isPago = item.movimiento_tipo === 'PAGO';
          const title = isPago
            ? `Abono de Administración (${item.origen_pago || 'PSE'})`
            : item.concepto_cargo || 'Cargo de Administración';
            
          const amount = isPago
            ? `+ $ ${(item.credito || 0).toLocaleString('es-CO')}`
            : `- $ ${(item.debito || 0).toLocaleString('es-CO')}`;

          return (
            <View key={idx}>
              <View style={styles.historyItem}>
                <View style={styles.leftContainer}>
                  <Text style={styles.itemTitle}>{title}</Text>
                  <Text style={styles.itemMeta}>Periodo: {item.periodo}</Text>
                  {item.fecha_movimiento && (
                    <Text style={styles.itemDate}>
                      Fecha: {new Date(item.fecha_movimiento).toLocaleString('es-CO')}
                    </Text>
                  )}
                </View>
                <Text style={[styles.itemAmount, isPago ? styles.pagoText : styles.cargoText]}>
                  {amount}
                </Text>
              </View>
              {idx < history.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No se encontraron movimientos con los filtros seleccionados.</Text>
        </View>
      )}
    </CustomCard>
  );
}

const styles = StyleSheet.create({
  card: {
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
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  leftContainer: {
    flex: 0.7,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  itemMeta: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  itemDate: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 0.3,
    textAlign: 'right',
  },
  pagoText: {
    color: '#16a34a',
  },
  cargoText: {
    color: '#b91c1c',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
  },
});
