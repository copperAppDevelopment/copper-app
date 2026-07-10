import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomCard } from '../../../components/common/CustomCard';

interface WelcomeCardProps {
  userName?: string;
  conjuntoNombre?: string;
  apartamentoInfo?: string;
}

export function WelcomeCard({ userName, conjuntoNombre, apartamentoInfo }: WelcomeCardProps) {
  return (
    <CustomCard style={styles.welcomeCard}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>¡Hola, {userName || 'Residente'}!</Text>
        <Text style={styles.apartmentText}>
          {conjuntoNombre || 'Copropiedad'} • {apartamentoInfo || 'Apartamento'}
        </Text>
      </View>
      {/* @ts-expect-error - React 18/19 vector icons compatibility */}
      <Ionicons name="sparkles" size={24} color="#8A1C14" />
    </CustomCard>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 18,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  apartmentText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
});
