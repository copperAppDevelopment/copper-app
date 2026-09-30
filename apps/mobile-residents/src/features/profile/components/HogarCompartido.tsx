import React from 'react';
import { StyleSheet, Text } from 'react-native';

/**
 * Vehículos, familiares, mascotas y empleados son del apartamento, no de quien los registró:
 * los ven y los editan todos sus residentes. Esto lo dice una vez por sección, para que nadie
 * se sorprenda al ver el carro de su compañero.
 */
export function AvisoHogar() {
  return (
    <Text style={styles.aviso}>Lo ven y lo editan todos los residentes de tu apartamento.</Text>
  );
}

export function RegistradoPor({ nombre }: { nombre?: string | null }) {
  if (!nombre) return null;
  return <Text style={styles.autor}>Registrado por {nombre}</Text>;
}

const styles = StyleSheet.create({
  aviso: {
    fontSize: 11,
    color: '#64748b',
    marginTop: -6,
    marginBottom: 12,
  },
  autor: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
});
