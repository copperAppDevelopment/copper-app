import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';

import { SkeletonLoader } from '../../src/components/common/SkeletonLoader';

// Hooks y Componentes de la Feature Dashboard
import { useDashboardData } from '../../src/features/dashboard/hooks/useDashboardData';
import { WelcomeCard } from '../../src/features/dashboard/components/WelcomeCard';
import { BalanceSummaryCard } from '../../src/features/dashboard/components/BalanceSummaryCard';
import { ConceptDetailsCard } from '../../src/features/dashboard/components/ConceptDetailsCard';
import { CircularNoticesCard } from '../../src/features/dashboard/components/CircularNoticesCard';
import { RecentRequestsCard } from '../../src/features/dashboard/components/RecentRequestsCard';

const logoSource = require('../../assets/logo-copper.png');

function HomeSkeleton() {
  return (
    <View style={{ gap: 16 }}>
      {/* Saludo y Copropiedad */}
      <View style={styles.skeletonCard}>
        <SkeletonLoader.Rect width="40%" height={20} />
        <SkeletonLoader.Rect width="80%" height={28} style={{ marginTop: 8 }} />
        <SkeletonLoader.Rect width="60%" height={16} style={{ marginTop: 8 }} />
      </View>

      {/* Balance general de cuenta */}
      <SkeletonLoader.Rect height={160} style={{ borderRadius: 16 }} />

      {/* Desglose de cobros detallado */}
      <SkeletonLoader.Rect height={140} style={{ borderRadius: 16 }} />

      {/* Circulares administrativas */}
      <SkeletonLoader.Rect height={130} style={{ borderRadius: 16 }} />

      {/* Estado de PQRs */}
      <SkeletonLoader.Rect height={120} style={{ borderRadius: 16 }} />
    </View>
  );
}

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

      {isLoading ? (
        <HomeSkeleton />
      ) : (
        <>
          {/* Saludo y Copropiedad */}
          <WelcomeCard
            userName={user?.nombres || undefined}
            conjuntoNombre={dashboard?.conjunto_nombre || undefined}
            apartamentoInfo={getApartamentoInfo()}
          />

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
  skeletonCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
});
