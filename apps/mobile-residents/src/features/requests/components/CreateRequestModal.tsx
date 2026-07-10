import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../../../components/common/CustomInput';
import { CustomSelect } from '../../../components/common/CustomSelect';
import { CustomButton } from '../../../components/common/CustomButton';

interface CreateRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    titulo_solicitud: string;
    descripcion: string;
    solicitud_tipo: string;
    ubicacion?: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export function CreateRequestModal({
  visible,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateRequestModalProps) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const tipoOptions = [
    { label: 'Mantenimiento', value: 'Mantenimiento' },
    { label: 'Seguridad', value: 'Seguridad' },
    { label: 'Administración', value: 'Administración' },
    { label: 'Parqueaderos', value: 'Parqueaderos' },
    { label: 'Otros', value: 'Otros' },
  ];

  const handleClose = () => {
    // Resetear formulario
    setTitulo('');
    setDescripcion('');
    setTipo('');
    setUbicacion('');
    onClose();
  };

  const handleRadicar = async () => {
    if (!titulo.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa un título para la solicitud.');
      return;
    }
    if (!tipo) {
      Alert.alert('Campo requerido', 'Por favor selecciona el tipo de solicitud.');
      return;
    }
    if (!descripcion.trim()) {
      Alert.alert('Campo requerido', 'Por favor detalla tu requerimiento en la descripción.');
      return;
    }

    try {
      await onSubmit({
        titulo_solicitud: titulo.trim(),
        descripcion: descripcion.trim(),
        solicitud_tipo: tipo,
        ubicacion: ubicacion.trim() || undefined,
      });

      Alert.alert('Solicitud radicada', 'Tu requerimiento ha sido registrado en el sistema exitosamente.');
      handleClose();
    } catch (err: any) {
      console.error('Error al radicar solicitud:', err);
      Alert.alert('Error', err.message || 'No se pudo radicar la solicitud en este momento.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Radicar Nueva Solicitud</Text>
              <TouchableOpacity onPress={handleClose} activeOpacity={0.7} style={styles.closeBtn}>
                {/* @ts-expect-error - React 18/19 vector icons compatibility */}
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
              {/* Formulario */}
              <CustomInput
                label="Título de la Solicitud"
                placeholder="Ej. Filtración en el techo de sala"
                value={titulo}
                onChangeText={setTitulo}
              />

              <CustomSelect
                label="Tipo de Solicitud"
                placeholder="Selecciona el tipo de requerimiento"
                options={tipoOptions}
                selectedValue={tipo}
                onSelect={setTipo}
              />

              <CustomInput
                label="Ubicación / Detalles específicos (Opcional)"
                placeholder="Ej. Torre B Apto 502, Parqueadero 25"
                value={ubicacion}
                onChangeText={setUbicacion}
              />

              <CustomInput
                label="Descripción del Requerimiento"
                placeholder="Escribe detalladamente qué sucede o qué necesitas..."
                value={descripcion}
                onChangeText={setDescripcion}
                multiline={true}
                numberOfLines={4}
                style={styles.textArea}
              />

              {/* Botón */}
              <CustomButton
                title="Radicar Solicitud"
                onPress={handleRadicar}
                loading={isSubmitting}
                style={styles.submitBtn}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  keyboardContainer: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '65%',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 2,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: 10,
  },
});
