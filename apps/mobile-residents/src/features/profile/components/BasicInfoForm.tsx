import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { CustomInput } from '../../../components/common/CustomInput';
import { CustomSelect } from '../../../components/common/CustomSelect';
import { CustomButton } from '../../../components/common/CustomButton';

interface BasicInfoFormProps {
  initialData: {
    nombres: string | null;
    apellidos: string | null;
    phone_number: string | null;
    tipo_documento: string;
    documento: string;
  };
  onSave: (payload: {
    nombres: string;
    apellidos: string;
    phone_number?: string;
    tipo_documento: string;
    documento: string;
  }) => Promise<void>;
  isSaving?: boolean;
}

export function BasicInfoForm({ initialData, onSave, isSaving = false }: BasicInfoFormProps) {
  const [nombres, setNombres] = useState(initialData.nombres || '');
  const [apellidos, setApellidos] = useState(initialData.apellidos || '');
  const [phone, setPhone] = useState(initialData.phone_number || '');
  const [tipoDoc, setTipoDoc] = useState(initialData.tipo_documento || 'CC');
  const [documento, setDocumento] = useState(initialData.documento || '');

  useEffect(() => {
    setNombres(initialData.nombres || '');
    setApellidos(initialData.apellidos || '');
    setPhone(initialData.phone_number || '');
    setTipoDoc(initialData.tipo_documento || 'CC');
    setDocumento(initialData.documento || '');
  }, [initialData]);

  const docTypes = [
    { label: 'Cédula de Ciudadanía (CC)', value: 'CC' },
    { label: 'Registro Civil (RC)', value: 'RC' },
    { label: 'Cédula de Extranjería (CE)', value: 'CE' },
    { label: 'Pasaporte (PA)', value: 'PA' },
    { label: 'NIT', value: 'NIT' },
  ];

  const handleSave = async () => {
    if (!nombres.trim() || !apellidos.trim()) {
      Alert.alert('Error', 'Nombres y Apellidos son requeridos.');
      return;
    }
    if (!documento.trim()) {
      Alert.alert('Error', 'El número de identificación (cédula) es requerido.');
      return;
    }

    try {
      await onSave({
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        phone_number: phone.trim() || undefined,
        tipo_documento: tipoDoc,
        documento: documento.trim(),
      });
      Alert.alert('Perfil actualizado', 'Tus datos básicos de perfil se actualizaron con éxito.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo guardar la información.');
    }
  };

  return (
    <View style={styles.container}>
      <CustomInput
        label="Nombres"
        placeholder="Ingresa tus nombres"
        value={nombres}
        onChangeText={setNombres}
      />
      
      <CustomInput
        label="Apellidos"
        placeholder="Ingresa tus apellidos"
        value={apellidos}
        onChangeText={setApellidos}
      />

      <CustomSelect
        label="Tipo de Documento"
        options={docTypes}
        selectedValue={tipoDoc}
        onSelect={setTipoDoc}
      />

      <CustomInput
        label="Número de Identificación"
        placeholder="Ingresa tu documento"
        value={documento}
        onChangeText={setDocumento}
        keyboardType="numeric"
      />

      <CustomInput
        label="Número de Teléfono"
        placeholder="Ej. 3001234567"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <CustomButton
        title="Guardar Cambios"
        onPress={handleSave}
        loading={isSaving}
        style={styles.saveBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  saveBtn: {
    marginTop: 12,
  },
});
