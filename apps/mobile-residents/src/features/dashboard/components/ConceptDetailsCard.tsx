import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CustomCard } from '../../../components/common/CustomCard';

interface BalanceConcept {
  concepto_id: string | null;
  nombre: string | null;
  saldo: number | null;
  total_cargos: number | null;
  total_pagado: number | null;
}

interface ConceptDetailsCardProps {
  balances?: BalanceConcept[];
}

export function ConceptDetailsCard({ balances = [] }: ConceptDetailsCardProps) {
  if (balances.length === 0) return null;

  return (
    <CustomCard style={styles.card}>
      <Text style={styles.sectionTitle}>Desglose por Concepto</Text>
      {balances.map((item, idx) => (
        <View key={item.concepto_id || idx}>
          <View style={styles.conceptRow}>
            <View style={styles.leftContainer}>
              <Text style={styles.conceptName}>{item.nombre || 'Concepto General'}</Text>
              <Text style={styles.conceptDetail}>
                Facturado: ${(item.total_cargos || 0).toLocaleString('es-CO')} | Abonado: ${(item.total_pagado || 0).toLocaleString('es-CO')}
              </Text>
            </View>
            <Text style={[styles.conceptBalance, (item.saldo || 0) > 0 ? styles.contraText : styles.favorText]}>
              $ {(item.saldo || 0).toLocaleString('es-CO')}
            </Text>
          </View>
          {idx < balances.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
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
  conceptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  leftContainer: {
    flex: 0.75,
  },
  conceptName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  conceptDetail: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  conceptBalance: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 0.25,
    textAlign: 'right',
  },
  favorText: {
    color: '#16a34a',
  },
  contraText: {
    color: '#b91c1c',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
});
