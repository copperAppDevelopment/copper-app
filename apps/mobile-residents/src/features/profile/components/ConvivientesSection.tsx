import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomCard } from '../../../components/common/CustomCard';
import { CustomInput } from '../../../components/common/CustomInput';
import { CustomSelect } from '../../../components/common/CustomSelect';
import { CustomButton } from '../../../components/common/CustomButton';

interface Conviviente {
  id: number;
  nombres: string;
  apellidos: string;
  parentesco: string;
  fecha_nacimiento: string | null;
}

interface ConvivientesSectionProps {
  convivientes?: Conviviente[];
  onMutate: (payload: {
    action: 'create' | 'update' | 'delete';
    id?: number;
    nombres?: string;
    apellidos?: string;
    parentesco?: string;
    fecha_nacimiento?: string;
  }) => Promise<any>;
}

export function ConvivientesSection({ convivientes = [], onMutate }: ConvivientesSectionProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Conviviente | null>(null);
  const [loading, setLoading] = useState(false);

  // Campos de formulario
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [fechaNac, setFechaNac] = useState('');

  const parentescoOptions = [
    { label: 'Padre', value: 'Padre' },
    { label: 'Madre', value: 'Madre' },
    { label: 'Hermano/a', value: 'hermano/a' },
    { label: 'Hijo/a', value: 'hijo/a' },
    { label: 'Cónyuge', value: 'cónyuge' },
    { label: 'Otro', value: 'otro' },
  ];

  const handleOpenModal = (item?: Conviviente) => {
    if (item) {
      setEditingItem(item);
      setNombres(item.nombres);
      setApellidos(item.apellidos);
      setParentesco(item.parentesco);
      setFechaNac(item.fecha_nacimiento || '');
    } else {
      setEditingItem(null);
      setNombres('');
      setApellidos('');
      setParentesco('');
      setFechaNac('');
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingItem(null);
  };

  const handleSave = async () => {
    if (!nombres.trim() || !apellidos.trim() || !parentesco) {
      Alert.alert('Campos obligatorios', 'Nombres, Apellidos y Parentesco son requeridos.');
      return;
    }

    setLoading(true);
    try {
      if (editingItem) {
        await onMutate({
          action: 'update',
          id: editingItem.id,
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          parentesco,
          fecha_nacimiento: fechaNac.trim() || undefined,
        });
      } else {
        await onMutate({
          action: 'create',
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          parentesco,
          fecha_nacimiento: fechaNac.trim() || undefined,
        });
      }
      handleCloseModal();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo guardar la información.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item: Conviviente) => {
    Alert.alert(
      'Eliminar Familiar',
      `¿Estás seguro de que deseas eliminar a ${item.nombres} ${item.apellidos} de la lista de convivientes?`,
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
        <Text style={styles.sectionTitle}>Núcleo Conviviente</Text>
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

      {convivientes.length > 0 ? (
        convivientes.map((item) => (
          <CustomCard key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View>
                <Text style={styles.itemName}>
                  {item.nombres} {item.apellidos}
                </Text>
                <Text style={styles.itemDetails}>
                  Parentesco: {item.parentesco}
                  {item.fecha_nacimiento ? ` • Nacimiento: ${item.fecha_nacimiento.split('T')[0]}` : ''}
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
        <Text style={styles.emptyText}>No has registrado familiares convivientes.</Text>
      )}

      {/* Modal de Crear / Editar */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Editar Familiar' : 'Agregar Familiar'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                {/* @ts-expect-error - React 18/19 vector icons compatibility */}
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalForm}>
              <CustomInput
                label="Nombres"
                placeholder="Nombres del familiar"
                value={nombres}
                onChangeText={setNombres}
              />
              <CustomInput
                label="Apellidos"
                placeholder="Apellidos del familiar"
                value={apellidos}
                onChangeText={setApellidos}
              />
              <CustomSelect
                label="Parentesco"
                placeholder="Selecciona el parentesco"
                options={parentescoOptions}
                selectedValue={parentesco}
                onSelect={setParentesco}
              />
              <CustomInput
                label="Fecha de Nacimiento (Opcional)"
                placeholder="AAAA-MM-DD"
                value={fechaNac}
                onChangeText={setFechaNac}
              />

              <CustomButton
                title={editingItem ? 'Guardar Cambios' : 'Registrar Familiar'}
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
