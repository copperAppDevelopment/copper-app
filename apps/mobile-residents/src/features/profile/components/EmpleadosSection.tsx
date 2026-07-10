import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomCard } from '../../../components/common/CustomCard';
import { CustomInput } from '../../../components/common/CustomInput';
import { CustomSelect } from '../../../components/common/CustomSelect';
import { CustomButton } from '../../../components/common/CustomButton';

interface Employee {
  id: number;
  nombres: string;
  apellidos: string | null;
  cargo: string | null;
  documento_ident: string;
  tipo_documento: string;
}

interface EmpleadosSectionProps {
  employees?: Employee[];
  onMutate: (payload: {
    action: 'create' | 'update' | 'delete';
    id?: number;
    nombres?: string;
    apellidos?: string;
    cargo?: string;
    documento_ident?: string;
    tipo_documento?: string;
  }) => Promise<any>;
}

export function EmpleadosSection({ employees = [], onMutate }: EmpleadosSectionProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);

  // Campos
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [cargo, setCargo] = useState('');
  const [docIdent, setDocIdent] = useState('');
  const [tipoDoc, setTipoDoc] = useState('');

  const cargoOptions = [
    { label: 'Aseador(a)', value: 'Aseador(a)' },
    { label: 'Cocinero(a)', value: 'Cocinero(a)' },
    { label: 'Jardinero(a)', value: 'Jardinero(a)' },
    { label: 'Otro', value: 'Otro' },
  ];

  const docTypes = [
    { label: 'Cédula de Ciudadanía (CC)', value: 'CC' },
    { label: 'Registro Civil (RC)', value: 'RC' },
    { label: 'Cédula de Extranjería (CE)', value: 'CE' },
    { label: 'Pasaporte (PA)', value: 'PA' },
    { label: 'NIT', value: 'NIT' },
  ];

  const handleOpenModal = (item?: Employee) => {
    if (item) {
      setEditingItem(item);
      setNombres(item.nombres);
      setApellidos(item.apellidos || '');
      setCargo(item.cargo || '');
      setDocIdent(item.documento_ident);
      setTipoDoc(item.tipo_documento);
    } else {
      setEditingItem(null);
      setNombres('');
      setApellidos('');
      setCargo('');
      setDocIdent('');
      setTipoDoc('');
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingItem(null);
  };

  const handleSave = async () => {
    if (!nombres.trim() || !cargo || !docIdent.trim() || !tipoDoc) {
      Alert.alert('Campos obligatorios', 'Nombres, Cargo, Documento y Tipo de Documento son requeridos.');
      return;
    }

    setLoading(true);
    try {
      if (editingItem) {
        await onMutate({
          action: 'update',
          id: editingItem.id,
          nombres: nombres.trim(),
          apellidos: apellidos.trim() || undefined,
          cargo,
          documento_ident: docIdent.trim(),
          tipo_documento: tipoDoc,
        });
      } else {
        await onMutate({
          action: 'create',
          nombres: nombres.trim(),
          apellidos: apellidos.trim() || undefined,
          cargo,
          documento_ident: docIdent.trim(),
          tipo_documento: tipoDoc,
        });
      }
      handleCloseModal();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo guardar la información.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item: Employee) => {
    Alert.alert(
      'Eliminar Empleado',
      `¿Estás seguro de que deseas eliminar el registro de ${item.nombres} ${item.apellidos || ''}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await onMutate({ action: 'delete', id: item.id });
            } catch (err: any) {
              Alert.alert('Error', err.message || 'No se pudo eliminar el registro.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Servicio Doméstico / Empleados</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => handleOpenModal()}
          activeOpacity={0.8}
        >
          {/* @ts-expect-error - React 18/19 vector icons compatibility */}
          <Ionicons name="add-circle-outline" size={18} color="#8A1C14" />
          <Text style={styles.addBtnText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {employees.length > 0 ? (
        employees.map((item) => (
          <CustomCard key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View>
                <Text style={styles.itemName}>
                  {item.nombres} {item.apellidos}
                </Text>
                <Text style={styles.itemDetails}>
                  Cargo: {item.cargo} • {item.tipo_documento}: {item.documento_ident}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleOpenModal(item)} style={styles.actionBtn}>
                  {/* @ts-expect-error - React 18/19 vector icons compatibility */}
                  <Ionicons name="create-outline" size={18} color="#64748b" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionBtn}>
                  {/* @ts-expect-error - React 18/19 vector icons compatibility */}
                  <Ionicons name="trash-outline" size={18} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>
          </CustomCard>
        ))
      ) : (
        <Text style={styles.emptyText}>No has registrado empleados de servicio.</Text>
      )}

      {/* Modal Crear / Editar */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Editar Empleado' : 'Agregar Empleado'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                {/* @ts-expect-error - React 18/19 vector icons compatibility */}
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalForm}>
              <CustomInput
                label="Nombres"
                placeholder="Nombres del empleado"
                value={nombres}
                onChangeText={setNombres}
              />
              <CustomInput
                label="Apellidos (Opcional)"
                placeholder="Apellidos del empleado"
                value={apellidos}
                onChangeText={setApellidos}
              />
              <CustomSelect
                label="Cargo"
                placeholder="Selecciona el cargo"
                options={cargoOptions}
                selectedValue={cargo}
                onSelect={setCargo}
              />
              <CustomSelect
                label="Tipo de Documento"
                placeholder="Selecciona el tipo"
                options={docTypes}
                selectedValue={tipoDoc}
                onSelect={setTipoDoc}
              />
              <CustomInput
                label="Número de Documento"
                placeholder="Ej. 10203040"
                value={docIdent}
                onChangeText={setDocIdent}
                keyboardType="numeric"
              />

              <CustomButton
                title={editingItem ? 'Guardar Cambios' : 'Registrar Empleado'}
                onPress={handleSave}
                loading={loading}
                style={styles.submitBtn}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addBtnText: {
    fontSize: 12,
    color: '#8A1C14',
    fontWeight: 'bold',
  },
  itemCard: {
    padding: 14,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  itemDetails: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  modalForm: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  submitBtn: {
    marginTop: 10,
  },
});
