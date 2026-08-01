import { useEffect } from 'react';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import { useAuthStore } from '../../../stores/authStore';

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID || '84ebf9ec-0ab7-4607-ad72-b5a1687d7517';

export function useOneSignal() {
  // Inicialización de OneSignal
  const initOneSignal = () => {
    try {
      // Habilitar logs en modo desarrollo para depuración
      if (__DEV__) {
        OneSignal.Debug.setLogLevel(LogLevel.Verbose);
      }
      
      console.log('Inicializando OneSignal con App ID:', ONESIGNAL_APP_ID);
      OneSignal.initialize(ONESIGNAL_APP_ID);

      // Registrar el listener de clics en notificaciones
      OneSignal.Notifications.addEventListener('click', (event) => {
        console.log('Notificación cliqueada por el usuario:', event.notification);
        const data = event.notification.additionalData as any;
        const title = event.notification.title?.toLowerCase() || '';
        const body = event.notification.body?.toLowerCase() || '';

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
          console.log('[OneSignal] Clic en notificación calificada. Seteando redirección pendiente...');
          useAuthStore.getState().setPendingRedirectRoute('/(tabs)/notificaciones');
        }
      });
    } catch (error) {
      console.error('Error inicializando OneSignal:', error);
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
