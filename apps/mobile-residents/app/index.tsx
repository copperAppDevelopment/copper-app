import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore.js';

export default function WelcomeScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleMockLogin = () => {
    // Simular inicio de sesión exitoso con Zustand
    login('mock-jwt-token', {
      id: 'res-101',
      name: 'Daniel Felipe',
      email: 'daniel@example.com',
      apartment: 'Torre A - Apto 302',
    });
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Copper Residents</Text>
        <Text style={styles.subtitle}>Tu copropiedad en tu bolsillo</Text>
      </View>

      <View style={styles.content}>
        <Pressable style={styles.button} onPress={handleMockLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión (Demo)</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#d97706',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
