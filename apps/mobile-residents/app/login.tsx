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
import { useAuthStore } from '../src/stores/authStore';
import { CustomCard } from '../src/components/common/CustomCard';
import { CustomInput } from '../src/components/common/CustomInput';
import { CustomButton } from '../src/components/common/CustomButton';

const logoSource = require('../assets/logo-copper.png');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Iniciar sesión con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        Alert.alert('Error de acceso', authError.message || 'Credenciales incorrectas.');
        setLoading(false);
        return;
      }

      const authUser = authData?.user;
      const session = authData?.session;

      if (!authUser || !session) {
        Alert.alert('Error', 'No se pudo iniciar la sesión.');
        setLoading(false);
        return;
      }

      // 2️⃣ Consultar el perfil público del residente
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (profileError || !profile) {
        console.error('Error cargando perfil público:', profileError);
        await supabase.auth.signOut();
        Alert.alert('Error', 'No se pudo encontrar tu perfil de usuario.');
        setLoading(false);
        return;
      }

      // 3️⃣ Validar que la cuenta del usuario no esté inhabilitada (estado === false)
      if (profile.estado === false) {
        await supabase.auth.signOut();
        Alert.alert(
          'Acceso denegado',
          'Tu cuenta se encuentra inactiva. Por favor, comunícate con el administrador de tu conjunto.'
        );
        setLoading(false);
        return;
      }

      // 4️⃣ Consultar el registro de residente
      const { data: residente, error: residenteError } = await supabase
        .from('residentes')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (residenteError || !residente) {
        console.error('Error cargando perfil de residente:', residenteError);
        await supabase.auth.signOut();
        Alert.alert('Error de rol', 'Tu usuario no está registrado como residente de ningún conjunto.');
        setLoading(false);
        return;
      }

      // 5️⃣ Cargar sesión e IDs en el Zustand store (AppState)
      login(
        session,
        {
          id: profile.id,
          nombres: profile.nombres,
          apellidos: profile.apellidos,
          documento: profile.documento,
          tipo_documento: profile.tipo_documento,
          email: profile.email,
          estado: profile.estado,
        },
        {
          id: residente.id,
          conjunto_id: residente.conjunto_id,
          apartamento_id: residente.apartamento_id,
          activo: residente.activo,
        }
      );

      // Redirigir a Home
      router.replace('/(tabs)/home');

    } catch (error: any) {
      console.error('Error inesperado en login:', error);
      Alert.alert('Error', error.message || 'Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

        {/* Brand Header */}
        <View style={styles.headerContainer}>
          <Image
            source={logoSource}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Tu copropiedad en tu bolsillo</Text>
        </View>

        {/* Input Form Card */}
        <CustomCard>
          <Text style={styles.cardTitle}>Ingresa a tu cuenta</Text>

          <CustomInput
            label="Correo electrónico"
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <CustomInput
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />

          {/* Forgot Password (Mock) */}
          <TouchableOpacity style={styles.forgotBtn} onPress={() => { }}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <CustomButton
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={loading}
          />
        </CustomCard>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Eres nuevo en el conjunto?</Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerLink}>Regístrate en el conjunto</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Fondo Gris claro premium
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
    color: '#64748b', // Gris slate
    marginTop: 6,
    fontStyle: 'italic',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a', // Texto oscuro
    marginBottom: 20,
    textAlign: 'center',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#64748b',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    flexWrap: 'wrap',
    gap: 6,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
  registerLink: {
    color: '#8A1C14', // Crimson oficial de la marca
    fontWeight: 'bold',
    fontSize: 14,
  },
});
