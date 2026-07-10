import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    // @ts-expect-error - React 18/19 type collision in Monorepo
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#0f172a',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#8A1C14',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          headerTitle: 'Panel de Residente',
          tabBarIcon: ({ color, size }) => {
            // @ts-expect-error - React 18/19 vector icons compatibility
            return <Ionicons name="home-outline" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="notificaciones"
        options={{
          title: 'Comunicados',
          headerTitle: 'Comunicados y Avisos',
          tabBarIcon: ({ color, size }) => {
            // @ts-expect-error - React 18/19 vector icons compatibility
            return <Ionicons name="notifications-outline" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="misBalances"
        options={{
          title: 'Balances',
          headerTitle: 'Mis Saldos y Balances',
          tabBarIcon: ({ color, size }) => {
            // @ts-expect-error - React 18/19 vector icons compatibility
            return <Ionicons name="wallet-outline" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="misSolicitudes"
        options={{
          title: 'Solicitudes',
          headerTitle: 'Solicitudes y PQRs',
          tabBarIcon: ({ color, size }) => {
            // @ts-expect-error - React 18/19 vector icons compatibility
            return <Ionicons name="document-text-outline" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="miPerfil"
        options={{
          title: 'Mi Perfil',
          headerTitle: 'Mi Cuenta',
          tabBarIcon: ({ color, size }) => {
            // @ts-expect-error - React 18/19 vector icons compatibility
            return <Ionicons name="person-outline" size={size} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
