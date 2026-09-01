import { useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useAuthStore } from '../../../stores/authStore';

const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.50.5:3001';

/**
 * Descarga la cuenta de cobro de un periodo.
 *
 * El PDF lo arma el servidor y devuelve un enlace firmado que se abre con `Linking`, el mismo
 * camino del botón de pago. Así no hacen falta `expo-print` ni `expo-file-system`, que son
 * dependencias nativas: seguiría funcionando en Expo Go y no obliga a un development build.
 */
export function useCuentaCobro() {
  const token = useAuthStore((state) => state.session?.access_token);
  const [descargando, setDescargando] = useState<string | null>(null);

  const descargar = async (periodo: string) => {
    if (!token) {
      Alert.alert('Sesión', 'Vuelve a iniciar sesión para descargar tu cuenta de cobro.');
      return;
    }

    setDescargando(periodo);
    try {
      const respuesta = await fetch(`${apiUrl}/api/v1/residents/cuenta-cobro`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodo }),
      });

      const json = await respuesta.json().catch(() => null);

      if (!respuesta.ok) {
        // Los mensajes del servidor están escritos para leerse tal cual.
        Alert.alert('No se pudo generar', json?.error || 'Inténtalo de nuevo más tarde.');
        return;
      }

      const url = json?.data?.url;
      if (!url) {
        Alert.alert('No se pudo generar', 'El servidor no devolvió el documento.');
        return;
      }

      const abre = await Linking.canOpenURL(url);
      if (!abre) {
        Alert.alert('No se pudo abrir', 'Tu teléfono no tiene con qué abrir el documento.');
        return;
      }

      await Linking.openURL(url);
    } catch (error: any) {
      console.error('Error al descargar la cuenta de cobro:', error);
      Alert.alert('Error', 'No se pudo conectar para generar tu cuenta de cobro.');
    } finally {
      setDescargando(null);
    }
  };

  return { descargar, descargando };
}
