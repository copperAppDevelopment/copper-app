import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomCard } from '../../../components/common/CustomCard';
import { CustomInput } from '../../../components/common/CustomInput';
import { CustomSelect } from '../../../components/common/CustomSelect';
import { CustomButton } from '../../../components/common/CustomButton';
import { AvisoHogar, RegistradoPor } from './HogarCompartido';
import { estilosSeccion as styles } from './seccionHogarStyles';

interface Employee {
  id: number;
  nombres: string;
  apellidos: string | null;
  cargo: string | null;
  documento_ident: string;
  tipo_documento: string;
  registrado_por_nombre?: string | null;
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
      `¿Seguro que deseas eliminar el registro de ${item.nombres} ${item.apellidos || ''}? Se quita para todos los residentes del apartamento.`,
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
          <Ionicons name="add-circle-outline" size={18} color="#8A1C14" />
          <Text style={styles.addBtnText}>Agregar</Text>
        </TouchableOpacity>
      </View>
      <AvisoHogar />

      {employees.length > 0 ? (
        employees.map((item) => (
          <CustomCard key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View>
                <Text style={styles.itemTitulo}>
                  {item.nombres} {item.apellidos}
                </Text>
                <Text style={styles.itemDetails}>
                  Cargo: {item.cargo} • {item.tipo_documento}: {item.documento_ident}
                </Text>
                <RegistradoPor nombre={item.registrado_por_nombre} />
              </View>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleOpenModal(item)} style={styles.actionBtn}>
                  <Ionicons name="create-outline" size={18} color="#64748b" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionBtn}>
                  <Ionicons name="trash-outline" size={18} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>
          </CustomCard>
        ))
      ) : (
        <Text style={styles.emptyText}>Tu apartamento no tiene empleados de servicio registrados.</Text>
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
