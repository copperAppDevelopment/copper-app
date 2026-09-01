import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { CustomCard } from '../src/components/common/CustomCard';
import { CustomInput } from '../src/components/common/CustomInput';
import { CustomButton } from '../src/components/common/CustomButton';

const logoSource = require('../assets/logo-copper.png');

const MINIMO_PASSWORD = 8;

/**
 * Recuperación de contraseña con el OTP de 6 dígitos de Supabase, el mismo que usa el panel.
 *
 * Por código y no por enlace a propósito: un enlace exigiría deep links y registrar la URL de
 * retorno en el dashboard por cada entorno. La plantilla «Reset Password» del dashboard debe
 * usar `{{ .Token }}` para que el código llegue.
 */
export default function RecuperarScreen() {
  const router = useRouter();
  const [paso, setPaso] = useState<'solicitar' | 'confirmar'>('solicitar');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [repetida, setRepetida] = useState('');
  const [loading, setLoading] = useState(false);

  const solicitar = async () => {
    const limpio = email.trim().toLowerCase();

    if (!limpio || !limpio.includes('@')) {
      Alert.alert('Correo inválido', 'Escribe el correo con el que entras a la app.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(limpio);
      if (error) {
        Alert.alert('Error', error.message || 'No se pudo enviar el código.');
        return;
      }

      // Supabase responde igual exista o no la cuenta, y el mensaje lo respeta: decir que el
      // correo no está registrado convertiría esta pantalla en un verificador de correos.
      setEmail(limpio);
      setPaso('confirmar');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo enviar el código.');
    } finally {
      setLoading(false);
    }
  };

  const confirmar = async () => {
    if (codigo.length !== 6) {
      Alert.alert('Código incompleto', 'El código tiene 6 dígitos.');
      return;
    }

    if (password.length < MINIMO_PASSWORD) {
      Alert.alert('Contraseña corta', `Debe tener al menos ${MINIMO_PASSWORD} caracteres.`);
      return;
    }

    if (password !== repetida) {
      Alert.alert('No coinciden', 'Las dos contraseñas deben ser iguales.');
      return;
    }

    setLoading(true);
    try {
      const { error: errorOtp } = await supabase.auth.verifyOtp({
        email,
        token: codigo,
        type: 'recovery',
      });

      if (errorOtp) {
        Alert.alert('Código inválido', 'El código no es válido o ya expiró.');
        return;
      }

      const { error: errorPassword } = await supabase.auth.updateUser({ password });
      if (errorPassword) {
        Alert.alert('Error', errorPassword.message || 'No se pudo cambiar la contraseña.');
        return;
      }

      // `verifyOtp` deja una sesión abierta que se saltaría las comprobaciones del login
      // —residente activo, conjunto con servicio—, así que se cierra y se vuelve a entrar.
      await supabase.auth.signOut();

      Alert.alert('Listo', 'Tu contraseña quedó actualizada. Entra con ella.', [
        { text: 'Entendido', onPress: () => router.replace('/login') },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const esSolicitud = paso === 'solicitar';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

        <View style={styles.headerContainer}>
          <Image source={logoSource} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.tagline}>Recupera el acceso a tu cuenta</Text>
        </View>

        <CustomCard>
          {esSolicitud ? (
            <>
              <Text style={styles.cardTitle}>¿Olvidaste tu contraseña?</Text>
              <Text style={styles.explicacion}>
                Escribe tu correo y te enviamos un código de 6 dígitos para que elijas una nueva.
              </Text>

              <CustomInput
                label="Correo electrónico"
                placeholder="ejemplo@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
                value={email}
                onChangeText={setEmail}
              />

              <CustomButton title="Enviar código" onPress={solicitar} loading={loading} />
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>Revisa tu correo</Text>
              <Text style={styles.explicacion}>
                Si {email} está registrado, el código ya está en la bandeja de entrada.
              </Text>

              <CustomInput
                label="Código de 6 dígitos"
                placeholder="000000"
                keyboardType="number-pad"
                maxLength={6}
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                autoFocus
                value={codigo}
                onChangeText={(texto) => setCodigo(texto.replace(/\D/g, ''))}
                style={styles.codigoInput}
              />

              <CustomInput
                label="Contraseña nueva"
                placeholder="••••••••"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                hint={`Mínimo ${MINIMO_PASSWORD} caracteres.`}
              />

              <CustomInput
                label="Repite la contraseña"
                placeholder="••••••••"
                secureTextEntry
                autoCapitalize="none"
                value={repetida}
                onChangeText={setRepetida}
              />

              <CustomButton title="Cambiar contraseña" onPress={confirmar} loading={loading} />

              <TouchableOpacity
                style={styles.secundario}
                disabled={loading}
                onPress={() => { setCodigo(''); setPaso('solicitar'); }}
              >
                <Text style={styles.secundarioText}>Usar otro correo o pedir el código de nuevo</Text>
              </TouchableOpacity>
            </>
          )}
        </CustomCard>

        <View style={styles.footer}>
          <TouchableOpacity disabled={loading} onPress={() => router.replace('/login')}>
            <Text style={styles.volverLink}>Volver a iniciar sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 160,
    height: 70,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    fontStyle: 'italic',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  explicacion: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 19,
  },
  codigoInput: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 8,
    textAlign: 'center',
  },
  secundario: {
    alignSelf: 'center',
    marginTop: 16,
  },
  secundarioText: {
    color: '#64748b',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  volverLink: {
    color: '#8A1C14',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
