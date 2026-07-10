import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../src/stores/authStore.js';

// Función para simular petición de red (en el futuro consumirá Next.js API /api/v1/health)
const fetchApiHealth = async () => {
  // Simular latencia de red
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  return {
    status: 'Conectado',
    serverTime: new Date().toLocaleTimeString(),
    alerts: 2,
  };
};

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  const { data: apiStatus, isLoading, error } = useQuery({
    queryKey: ['apiHealth'],
    queryFn: fetchApiHealth,
    refetchInterval: 10000, // Refrescar cada 10 segundos
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.welcomeText}>¡Hola, {user?.name || 'Residente'}!</Text>
        <Text style={styles.apartmentText}>{user?.apartment || 'Copropiedad'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Estado de Conexión del Backend</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fbbf24" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>Error al conectar con la API</Text>
        ) : (
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Servidor Next.js:</Text>
            <Text style={styles.statusValue}>{apiStatus?.status}</Text>
            <Text style={styles.timeText}>Última consulta: {apiStatus?.serverTime}</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Novedades de la Copropiedad</Text>
        <Text style={styles.infoText}>
          • Asamblea general programada para el próximo sábado a las 9:00 AM.
        </Text>
        <Text style={styles.infoText}>
          • Mantenimiento preventivo de ascensores finalizado con éxito.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 20,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  apartmentText: {
    fontSize: 14,
    color: '#fbbf24',
    marginTop: 4,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  loader: {
    marginVertical: 10,
  },
  statusContainer: {
    marginTop: 4,
  },
  statusLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  statusValue: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  timeText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  infoText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
});
