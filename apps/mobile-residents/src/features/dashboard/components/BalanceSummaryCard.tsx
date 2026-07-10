import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native';
import { CustomCard } from '../../../components/common/CustomCard';

interface BalanceSummaryCardProps {
  saldoTotal?: number;
  saldoFavor?: number;
  saldoContra?: number;
  proximoVencimiento?: string | null;
  ultimoPago?: string | null;
  linkPago?: string | null;
}

export function BalanceSummaryCard({
  saldoTotal = 0,
  saldoFavor = 0,
  saldoContra = 0,
  proximoVencimiento,
  ultimoPago,
  linkPago,
}: BalanceSummaryCardProps) {
  const handlePay = () => {
    if (linkPago) {
      Linking.openURL(linkPago).catch(() => {
        Alert.alert('Error', 'No se pudo abrir la pasarela de pago.');
      });
    } else {
      Alert.alert('Pagos en línea', 'No hay un enlace de pago configurado en la administración.');
    }
  };

  return (
    <CustomCard style={styles.card}>
      <Text style={styles.sectionTitle}>Estado de Cuenta</Text>
      
      <View style={styles.mainBalanceContainer}>
        <Text style={styles.balanceLabel}>Saldo Pendiente Total</Text>
        <Text style={styles.balanceValue}>
          $ {saldoTotal.toLocaleString('es-CO')} COP
        </Text>
        {proximoVencimiento && (
          <Text style={styles.dueDateText}>Vence el: {proximoVencimiento}</Text>
        )}
      </View>

      <View style={styles.subBalancesRow}>
        <View style={styles.subBalanceItem}>
          <Text style={styles.subBalanceLabel}>A Favor (-)</Text>
          <Text style={[styles.subBalanceValue, styles.favorText]}>
            $ {saldoFavor.toLocaleString('es-CO')}
          </Text>
        </View>
        <View style={styles.subBalanceItem}>
          <Text style={styles.subBalanceLabel}>En Contra (+)</Text>
          <Text style={[styles.subBalanceValue, styles.contraText]}>
            $ {saldoContra.toLocaleString('es-CO')}
          </Text>
        </View>
      </View>

      {ultimoPago && (
        <Text style={styles.lastPaymentText}>Último pago registrado: {ultimoPago}</Text>
      )}

      {saldoTotal > 0 && (
        <TouchableOpacity style={styles.payBtn} activeOpacity={0.8} onPress={handlePay}>
          <Text style={styles.payBtnText}>Pagar cuota en línea</Text>
        </TouchableOpacity>
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
  mainBalanceContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    marginVertical: 6,
  },
  dueDateText: {
    fontSize: 12,
    color: '#b91c1c',
    fontWeight: '600',
  },
  subBalancesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    paddingVertical: 12,
    marginVertical: 8,
  },
  subBalanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  subBalanceLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  subBalanceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  favorText: {
    color: '#16a34a',
  },
  contraText: {
    color: '#b91c1c',
  },
  lastPaymentText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  payBtn: {
    backgroundColor: '#8A1C14',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  payBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
