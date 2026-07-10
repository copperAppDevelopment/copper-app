import React from 'react';
import { StyleSheet, Text, View, Linking, Alert, TouchableOpacity } from 'react-native';
import { CustomCard } from '../../../components/common/CustomCard';

interface BalancesSummaryCardProps {
  saldoTotal?: number;
  saldoFavor?: number;
  saldoContra?: number;
  proximoVencimiento?: string | null;
  ultimoPago?: string | null;
  linkPago?: string | null;
}

export function BalancesSummaryCard({
  saldoTotal = 0,
  saldoFavor = 0,
  saldoContra = 0,
  proximoVencimiento,
  ultimoPago,
  linkPago,
}: BalancesSummaryCardProps) {
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
    <CustomCard style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>Saldo a Pagar</Text>
      <Text style={styles.balanceAmount}>
        $ {saldoTotal.toLocaleString('es-CO')} COP
      </Text>
      
      {proximoVencimiento && (
        <Text style={styles.dueDate}>Vence el: {proximoVencimiento}</Text>
      )}

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
          <Text style={styles.payBtnText}>Pagar en Línea (PSE)</Text>
        </TouchableOpacity>
      )}
    </CustomCard>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  balanceTitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f172a',
    marginVertical: 10,
  },
  dueDate: {
    fontSize: 13,
    color: '#b91c1c',
    fontWeight: '600',
    marginBottom: 16,
  },
  subBalancesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    paddingVertical: 12,
    marginBottom: 12,
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
    fontStyle: 'italic',
    marginBottom: 16,
  },
  payBtn: {
    backgroundColor: '#8A1C14',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  payBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
