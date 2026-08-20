import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from "../src/stores/authStore";
import { useOneSignal } from "../src/features/profile/hooks/useOneSignal";
import { supabase } from "../src/lib/supabase";

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
  const logout = useAuthStore((state) => state.logout);
  const pendingRedirectRoute = useAuthStore((state) => state.pendingRedirectRoute);
  const setPendingRedirectRoute = useAuthStore((state) => state.setPendingRedirectRoute);
  const router = useRouter();

  // 1. Escuchar los cambios de autenticación reales de Supabase al iniciar la app
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Evento de autenticación Supabase:', event);
      if (session) {
        // Si hay sesión en Supabase pero está desincronizada en Zustand, actualizamos la sesión
        const currentToken = useAuthStore.getState().session?.access_token;
        if (currentToken !== session.access_token) {
          useAuthStore.setState({ session });
        }
      } else {
        // Si no hay sesión activa en Supabase (expirada, cerrada o inválida), deslogueamos Zustand
        console.log('Sesión no válida o expirada en Supabase, cerrando sesión en la app...');
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Inicializar OneSignal una sola vez al montar el Layout
  useEffect(() => {
    initOneSignal();
  }, []);

  // 3. Sincronizar estado de sesión del usuario en OneSignal
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loginUser(user.id, 'residente');
    } else {
      logoutUser();
    }
  }, [isAuthenticated, user?.id]);

  // 4. Redirigir si el usuario está autenticado y hay una redirección de OneSignal pendiente
  useEffect(() => {
    if (isAuthenticated && pendingRedirectRoute) {
      console.log(`[RootLayout] Redirección detectada a: ${pendingRedirectRoute}. Procesando...`);
      
      const timer = setTimeout(() => {
        router.push(pendingRedirectRoute as any);
        setPendingRedirectRoute(null); // Consumir y limpiar redirección
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, pendingRedirectRoute]);

  // 5. Redirigir al login si el usuario se desautentica
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('[RootLayout] Usuario no autenticado, redirigiendo a login...');
      const timer = setTimeout(() => {
        router.replace('/login');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

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
        <Stack.Screen name="recuperar" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}