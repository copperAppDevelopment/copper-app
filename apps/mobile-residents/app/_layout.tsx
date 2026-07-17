import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from "../src/stores/authStore";
import { useOneSignal } from "../src/features/profile/hooks/useOneSignal";

// Crear cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { initOneSignal, loginUser, logoutUser } = useOneSignal();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // 1. Inicializar OneSignal una sola vez al montar el Layout
  useEffect(() => {
    initOneSignal();
  }, []);

  // 2. Sincronizar estado de sesión del usuario en OneSignal
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loginUser(user.id, 'residente');
    } else {
      logoutUser();
    }
  }, [isAuthenticated, user?.id]);
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      {/* @ts-expect-error - React 18/19 type collision workaround */}
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#0f172a',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#f8fafc',
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}