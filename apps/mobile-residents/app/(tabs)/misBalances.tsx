import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text, ScrollView } from 'react-native';

// Hooks y Componentes de la Feature Balances
import { useBalancesData } from '../../src/features/balances/hooks/useBalancesData';
import { BalancesSummaryCard } from '../../src/features/balances/components/BalancesSummaryCard';
import { BalancesFilters } from '../../src/features/balances/components/BalancesFilters';
import { MovementHistoryCard } from '../../src/features/balances/components/MovementHistoryCard';

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
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#8A1C14" />
          <Text style={styles.loaderText}>Cargando información financiera...</Text>
        </View>
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
});
