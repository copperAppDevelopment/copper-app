import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  ViewStyle,
} from 'react-native';

interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string;
  options: SelectOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  hint?: string;
  containerStyle?: ViewStyle;
}

export function CustomSelect({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder = 'Selecciona una opción',
  hint,
  containerStyle,
}: CustomSelectProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleOptionPress = (value: string) => {
    onSelect(value);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.selectButton}
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            styles.selectButtonText,
            !selectedOption && styles.placeholderText,
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.arrowIcon}>▼</Text>
      </TouchableOpacity>

      {hint && <Text style={styles.hint}>{hint}</Text>}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Selecciona'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Listo</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === selectedValue && styles.selectedOptionItem,
                  ]}
                  onPress={() => handleOptionPress(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === selectedValue && styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === selectedValue && (
                    <Text style={styles.checkmarkIcon}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectButtonText: {
    fontSize: 14,
    color: '#0f172a',
  },
  placeholderText: {
    color: '#64748b',
  },
  arrowIcon: {
    fontSize: 10,
    color: '#64748b',
  },
  hint: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 3,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // Overlay sutil y premium
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '50%',
    paddingBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8A1C14', // Crimson oficial
  },
  optionsList: {
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#f8fafc',
  },
  selectedOptionItem: {
    backgroundColor: '#fff1f2', // Fondo Crimson ultra sutil para selección
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#334155',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#8A1C14',
  },
  checkmarkIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8A1C14',
  },
});
