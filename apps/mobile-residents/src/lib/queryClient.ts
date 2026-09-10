import { QueryClient } from '@tanstack/react-query';

/**
 * El cliente de React Query, en su propio módulo y no dentro de `_layout.tsx`.
 *
 * Existe aquí porque los listeners de OneSignal necesitan invalidar consultas y se registran
 * **fuera** del `QueryClientProvider`: `useOneSignal()` se llama en el cuerpo de `RootLayout`,
 * mientras que el proveedor vive en su JSX. Allí `useQueryClient()` no encuentra contexto.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      // Las pantallas de pestañas no se desmontan, así que `refetchOnMount` no vuelve a dispararse
      // nunca. Quien refresca es `useFocusEffect` en cada pantalla y la invalidación desde los
      // listeners de OneSignal.
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Marca como caducadas las consultas que dependen de lo que llega por notificación.
 *
 * Se invalida **por prefijo**, sin el token: las claves lo incluyen, y así un refresco de sesión
 * no deja entradas viejas sin invalidar.
 */
export function invalidarPorNotificacion() {
  queryClient.invalidateQueries({ queryKey: ['notifications'] });
  queryClient.invalidateQueries({ queryKey: ['dashboard'] });
}
