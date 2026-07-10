import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface BalancesFiltersProps {
  sortBy: 'recent' | 'oldest';
  setSortBy: (val: 'recent' | 'oldest') => void;
  type: 'all' | 'PAGO' | 'CARGO';
  setType: (val: 'all' | 'PAGO' | 'CARGO') => void;
}

export function BalancesFilters({ sortBy, setSortBy, type, setType }: BalancesFiltersProps) {
  return (
    <View style={styles.container}>
      {/* Filtro por Tipo de Movimiento */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Tipo de Movimiento</Text>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentBtn, type === 'all' && styles.activeSegmentBtn]}
            onPress={() => setType('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, type === 'all' && styles.activeSegmentText]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, type === 'CARGO' && styles.activeSegmentBtn]}
            onPress={() => setType('CARGO')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, type === 'CARGO' && styles.activeSegmentText]}>
              Cargos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, type === 'PAGO' && styles.activeSegmentBtn]}
            onPress={() => setType('PAGO')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, type === 'PAGO' && styles.activeSegmentText]}>
              Pagos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtro por Ordenación */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Orden cronológico</Text>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentBtn, sortBy === 'recent' && styles.activeSegmentBtn]}
            onPress={() => setSortBy('recent')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, sortBy === 'recent' && styles.activeSegmentText]}>
              Más reciente
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, sortBy === 'oldest' && styles.activeSegmentBtn]}
            onPress={() => setSortBy('oldest')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, sortBy === 'oldest' && styles.activeSegmentText]}>
              Más antiguo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 2,
    gap: 2,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeSegmentBtn: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  segmentText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  activeSegmentText: {
    color: '#8A1C14',
    fontWeight: 'bold',
  },
});
