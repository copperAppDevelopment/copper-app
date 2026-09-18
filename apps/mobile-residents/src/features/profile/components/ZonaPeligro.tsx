import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomAlert } from '../../../components/common/CustomAlert';

/**
 * A diferencia de las URLs del panel, cuyo respaldo es la IP de desarrollo, aquí el valor por
 * defecto correcto es producción: la página de eliminación es la misma para todos.
 */
const LANDING_URL = process.env.EXPO_PUBLIC_LANDING_URL || 'https://copperapp.co';

export interface ZonaPeligroProps {
  nombres?: string | null;
  apellidos?: string | null;
  email?: string | null;
  telefono?: string | null;
  conjunto?: string | null;
}

/**
 * Arma el enlace a /eliminar-cuenta con el formulario precargado.
 *
 * Los datos van en el fragmento (`#`) y no en la query: el navegador nunca envía el fragmento
 * al servidor, así que nombre, correo y teléfono no quedan en los logs del hosting. La landing
 * los borra de la barra en cuanto los lee.
 *
 * Se codifica a mano con `encodeURIComponent` y no con `URLSearchParams`, cuya implementación en
 * React Native ha sido incompleta. Importa para los correos con `+`: sin codificar,
 * `juan+1@x.co` llegaría como `juan 1@x.co`.
 */
function enlaceEliminacion(datos: ZonaPeligroProps): string {
  const campos: [string, string | null | undefined][] = [
    ['nombre', datos.nombres],
    ['apellido', datos.apellidos],
    ['email', datos.email],
    ['telefono', datos.telefono],
    ['conjunto', datos.conjunto],
  ];

  const fragmento = campos
    .filter(([, valor]) => valor && valor.trim())
    .map(([clave, valor]) => `${clave}=${encodeURIComponent(valor!.trim())}`)
    .join('&');

  const base = `${LANDING_URL.replace(/\/+$/, '')}/eliminar-cuenta`;
  return fragmento ? `${base}#${fragmento}` : base;
}

export function ZonaPeligro(props: ZonaPeligroProps) {
  const [confirmando, setConfirmando] = useState(false);

  const abrir = async () => {
    setConfirmando(false);
    const url = enlaceEliminacion(props);

    try {
      await Linking.openURL(url);
    } catch {
      // Sin navegador predeterminado, o con uno que rechaza el enlace: que al menos sepa a dónde ir.
      Alert.alert(
        'No se pudo abrir el navegador',
        `Puedes solicitar la eliminación desde ${LANDING_URL.replace(/^https?:\/\//, '')}/eliminar-cuenta`
      );
    }
  };

  return (
    <View style={styles.tarjeta}>
      <View style={styles.encabezado}>
        <Ionicons name="warning-outline" size={16} color="#b91c1c" />
        <Text style={styles.titulo}>Zona de peligro</Text>
      </View>

      <Text style={styles.texto}>
        Puedes pedir que eliminemos tu cuenta y tus datos personales. El administrador de tu
        conjunto la procesa a mano.
      </Text>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => setConfirmando(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        <Ionicons name="trash-outline" size={16} color="#b91c1c" />
        <Text style={styles.botonTexto}>Solicitar eliminación de cuenta</Text>
      </TouchableOpacity>

      {/* Antes de sacar al residente de la app, lo que va a pasar: que no se entere en la web. */}
      <CustomAlert
        visible={confirmando}
        title="Eliminar tu cuenta"
        message={
          'Se abrirá la página de solicitud en tu navegador, con tus datos ya diligenciados.\n\n' +
          'El administrador de tu conjunto tiene hasta 5 días hábiles para procesarla.\n\n' +
          'Tu historial de pagos se conserva por ley, vinculado al apartamento y no a ti.'
        }
        type="confirm"
        confirmText="Continuar"
        cancelText="Cancelar"
        isDestructive
        onConfirm={abrir}
        onCancel={() => setConfirmando(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 16,
    marginTop: 24,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#b91c1c',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  texto: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 14,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#b91c1c',
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#fef2f2',
  },
  botonTexto: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#b91c1c',
  },
});
