import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';

// Hooks y Componentes de la Feature Dashboard
import { useDashboardData } from '../../src/features/dashboard/hooks/useDashboardData';
import { WelcomeCard } from '../../src/features/dashboard/components/WelcomeCard';
import { BalanceSummaryCard } from '../../src/features/dashboard/components/BalanceSummaryCard';
import { ConceptDetailsCard } from '../../src/features/dashboard/components/ConceptDetailsCard';
import { CircularNoticesCard } from '../../src/features/dashboard/components/CircularNoticesCard';
import { RecentRequestsCard } from '../../src/features/dashboard/components/RecentRequestsCard';

const logoSource = require('../../assets/logo-copper.webp');

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const residente = useAuthStore((state) => state.residente);

  // Cargamos los datos limpios y el estado de loading de nuestro Hook modular
  const { dashboard, balances, notifications, requests, isLoading } = useDashboardData();

  const getApartamentoInfo = () => {
    if (dashboard?.numero_apartamento) {
      if (dashboard.direccion_apartamento) {
        return `Apt. ${dashboard.numero_apartamento} (${dashboard.direccion_apartamento})`;
      }
      return `Apt. ${dashboard.numero_apartamento}`;
    }
    return undefined;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      {/* Logo corporativo en el header centrado */}
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Image
              source={logoSource}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          ),
          headerTitleAlign: 'center',
        }}
      />

      {/* Saludo y Copropiedad */}
      <WelcomeCard
        userName={user?.nombres || undefined}
        conjuntoNombre={dashboard?.conjunto_nombre || undefined}
        apartamentoInfo={getApartamentoInfo()}
      />

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#8A1C14" />
          <Text style={styles.loaderText}>Cargando información del conjunto...</Text>
        </View>
      ) : (
        <>
          {/* Balance general de cuenta */}
          <BalanceSummaryCard
            saldoTotal={dashboard?.saldo_total}
            saldoFavor={dashboard?.saldo_a_favor}
            saldoContra={dashboard?.saldo_en_contra}
            proximoVencimiento={dashboard?.proximo_vencimiento}
            ultimoPago={dashboard?.ultimo_pago}
            linkPago={dashboard?.link_pago}
          />

          {/* Desglose de cobros detallado por conceptos */}
          <ConceptDetailsCard balances={balances} />

          {/* Circulares administrativas */}
          <CircularNoticesCard notifications={notifications} maxItems={2} />

          {/* Estado de PQRs y solicitudes radicadas */}
          <RecentRequestsCard requests={requests} />
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
  headerLogo: {
    width: 90,
    height: 36,
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
