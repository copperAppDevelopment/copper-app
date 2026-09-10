import { useEffect } from 'react';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import type { NotificationClickEvent, NotificationWillDisplayEvent } from 'react-native-onesignal';
import { useAuthStore } from '../../../stores/authStore';
import { invalidarPorNotificacion } from '../../../lib/queryClient';

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID || '84ebf9ec-0ab7-4607-ad72-b5a1687d7517';

/**
 * Llega una notificación con la app abierta.
 *
 * Solo caduca las consultas para que la lista se actualice sin que el usuario haga nada. **No se
 * llama a `event.preventDefault()`**: registrar el listener no impide que el aviso se muestre,
 * pero `preventDefault()` sí lo suprimiría.
 */
const alRecibirEnPrimerPlano = (_event: NotificationWillDisplayEvent) => {
  invalidarPorNotificacion();
};

const alTocarNotificacion = (event: NotificationClickEvent) => {
  const data = event.notification.additionalData as any;
  const title = event.notification.title?.toLowerCase() || '';
  const body = event.notification.body?.toLowerCase() || '';

  // Quien la toca viene a leerla: lo primero es que no encuentre la lista vieja.
  invalidarPorNotificacion();

  // Criterio de redirección calificada a Comunicados (Visitas / Envíos)
  const isVisitaOrEnvio =
    (data && (data.id_visita || data.type === 'visita' || data.type === 'envio')) ||
    title.includes('visita') ||
    title.includes('envio') ||
    title.includes('envío') ||
    body.includes('visita') ||
    body.includes('envio') ||
    body.includes('envío');

  if (isVisitaOrEnvio) {
    useAuthStore.getState().setPendingRedirectRoute('/(tabs)/notificaciones');
  }
};

export function useOneSignal() {
  /** Inicializa OneSignal y devuelve la función que quita sus listeners. */
  const initOneSignal = () => {
    try {
      // Habilitar logs en modo desarrollo para depuración
      if (__DEV__) {
        OneSignal.Debug.setLogLevel(LogLevel.Verbose);
      }

      console.log('Inicializando OneSignal con App ID:', ONESIGNAL_APP_ID);
      OneSignal.initialize(ONESIGNAL_APP_ID);

      OneSignal.Notifications.addEventListener('click', alTocarNotificacion);
      OneSignal.Notifications.addEventListener('foregroundWillDisplay', alRecibirEnPrimerPlano);

      return () => {
        OneSignal.Notifications.removeEventListener('click', alTocarNotificacion);
        OneSignal.Notifications.removeEventListener('foregroundWillDisplay', alRecibirEnPrimerPlano);
      };
    } catch (error) {
      console.error('Error inicializando OneSignal:', error);
      return undefined;
    }
  };

  // Vincular usuario al iniciar sesión
  const loginUser = async (userId: string, rol: string) => {
    try {
      console.log(`Vinculando dispositivo en OneSignal. ExternalID: ${userId}, Rol: ${rol}`);
      
      // 1. Iniciar sesión en OneSignal con el userId de Supabase como External ID
      OneSignal.login(userId);
      
      // 2. Solicitar permisos de notificación de forma proactiva
      OneSignal.Notifications.requestPermission(true);
      
      // 3. Sincronizar tags de segmentación (rol = 'residente')
      OneSignal.User.addTag('rol', rol);
    } catch (error) {
      console.error('Error vinculando usuario en OneSignal:', error);
    }
  };

  // Desvincular usuario al cerrar sesión
  const logoutUser = () => {
    try {
      console.log('Cerrando sesión en OneSignal...');
      OneSignal.logout();
    } catch (error) {
      console.error('Error desvinculando usuario en OneSignal:', error);
    }
  };

  return {
    initOneSignal,
    loginUser,
    logoutUser,
  };
}
