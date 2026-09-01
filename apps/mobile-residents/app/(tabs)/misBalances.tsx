import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text, ScrollView } from 'react-native';

// Hooks y Componentes de la Feature Balances
import { useBalancesData } from '../../src/features/balances/hooks/useBalancesData';
import { BalancesSummaryCard } from '../../src/features/balances/components/BalancesSummaryCard';
import { BalancesFilters } from '../../src/features/balances/components/BalancesFilters';
import { MovementHistoryCard } from '../../src/features/balances/components/MovementHistoryCard';
import { DescargarCuentaCobro } from '../../src/features/balances/components/DescargarCuentaCobro';

import { SkeletonLoader } from '../../src/components/common/SkeletonLoader';

function BalancesSkeleton() {
  return (
    <View style={{ gap: 16 }}>
      {/* Tarjeta de Resumen */}
      <SkeletonLoader.Rect height={180} style={{ borderRadius: 16 }} />

      {/* Barra de Filtros */}
      <SkeletonLoader.Rect height={50} style={{ borderRadius: 12 }} />

      {/* Historial de Movimientos */}
      <View style={styles.skeletonCard}>
        <SkeletonLoader.Rect width="50%" height={20} style={{ marginBottom: 16 }} />
        <SkeletonLoader.Rect height={50} style={{ borderRadius: 8, marginBottom: 8 }} />
        <SkeletonLoader.Rect height={50} style={{ borderRadius: 8, marginBottom: 8 }} />
        <SkeletonLoader.Rect height={50} style={{ borderRadius: 8 }} />
      </View>
    </View>
  );
}

export default function MisBalancesScreen() {
  const {
    indicators,
    history,
    sortBy,
    setSortBy,
    type,
    setType,
    isLoading,
  } = useBalancesData();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      {isLoading ? (
        <BalancesSkeleton />
      ) : (
        <>
          {/* Tarjeta de Resumen e Indicadores de Balances */}
          <BalancesSummaryCard
            saldoTotal={indicators?.saldo_total}
            saldoFavor={indicators?.saldo_a_favor}
            saldoContra={indicators?.saldo_en_contra}
            proximoVencimiento={indicators?.proximo_vencimiento}
            ultimoPago={indicators?.ultimo_pago}
            linkPago={indicators?.link_pago}
          />

          {/* Cuenta de cobro en PDF: los meses salen del propio historial */}
          <DescargarCuentaCobro history={history} />

          {/* Barra de Filtros interactiva */}
          <BalancesFilters
            sortBy={sortBy}
            setSortBy={setSortBy}
            type={type}
            setType={setType}
          />

          {/* Historial de Movimientos */}
          <MovementHistoryCard history={history} />
        </>
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
  skeletonCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
});
