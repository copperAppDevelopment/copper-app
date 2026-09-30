import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomCard } from '../../../components/common/CustomCard';
import { CustomInput } from '../../../components/common/CustomInput';
import { CustomSelect } from '../../../components/common/CustomSelect';
import { CustomButton } from '../../../components/common/CustomButton';
import { AvisoHogar, RegistradoPor } from './HogarCompartido';
import { estilosSeccion as styles } from './seccionHogarStyles';

interface Vehicle {
  id: number;
  marca: string;
  modelo: string | null;
  placa: string | null;
  color: string | null;
  tipo_vehiculo: string | null;
  registrado_por_nombre?: string | null;
}

interface VehiculosSectionProps {
  vehicles?: Vehicle[];
  onMutate: (payload: {
    action: 'create' | 'update' | 'delete';
    id?: number;
    marca?: string;
    modelo?: string;
    placa?: string;
    color?: string;
    tipo_vehiculo?: string;
  }) => Promise<any>;
}

export function VehiculosSection({ vehicles = [], onMutate }: VehiculosSectionProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);

  // Campos
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [color, setColor] = useState('');
  const [tipo, setTipo] = useState('');

  const tipoOptions = [
    { label: 'Carro', value: 'Carro' },
    { label: 'Moto', value: 'Moto' },
    { label: 'Otro', value: 'Otro' },
  ];

  const handleOpenModal = (item?: Vehicle) => {
    if (item) {
      setEditingItem(item);
      setMarca(item.marca);
      setModelo(item.modelo || '');
      setPlaca(item.placa || '');
      setColor(item.color || '');
      setTipo(item.tipo_vehiculo || '');
    } else {
      setEditingItem(null);
      setMarca('');
      setModelo('');
      setPlaca('');
      setColor('');
      setTipo('');
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingItem(null);
  };

  const handleSave = async () => {
    if (!marca.trim() || !placa.trim() || !tipo) {
      Alert.alert('Campos obligatorios', 'Marca, Placa y Tipo de Vehículo son requeridos.');
      return;
    }

    setLoading(true);
    try {
      if (editingItem) {
        await onMutate({
          action: 'update',
          id: editingItem.id,
          marca: marca.trim(),
          modelo: modelo.trim() || undefined,
          placa: placa.trim().toUpperCase(),
          color: color.trim() || undefined,
          tipo_vehiculo: tipo,
        });
      } else {
        await onMutate({
          action: 'create',
          marca: marca.trim(),
          modelo: modelo.trim() || undefined,
          placa: placa.trim().toUpperCase(),
          color: color.trim() || undefined,
          tipo_vehiculo: tipo,
        });
      }
      handleCloseModal();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo guardar la información.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item: Vehicle) => {
    Alert.alert(
      'Eliminar Vehículo',
      `¿Seguro que deseas eliminar el vehículo con placa ${item.placa}? Se quita para todos los residentes del apartamento.`,
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
        <Text style={styles.sectionTitle}>Vehículos Registrados</Text>
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

      {vehicles.length > 0 ? (
        vehicles.map((item) => (
          <CustomCard key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View>
                <Text style={styles.itemTitulo}>{item.placa}</Text>
                <Text style={styles.itemDetails}>
                  {item.tipo_vehiculo} • {item.marca}
                  {item.modelo ? ` (${item.modelo})` : ''}
                  {item.color ? ` • Color: ${item.color}` : ''}
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
        <Text style={styles.emptyText}>Tu apartamento no tiene vehículos registrados.</Text>
      )}

      {/* Modal Crear / Editar */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Editar Vehículo' : 'Agregar Vehículo'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalForm}>
              <CustomSelect
                label="Tipo de Vehículo"
                placeholder="Selecciona el tipo"
                options={tipoOptions}
                selectedValue={tipo}
                onSelect={setTipo}
              />
              <CustomInput
                label="Placa"
                placeholder="Ej. ABC123"
                value={placa}
                onChangeText={setPlaca}
                autoCapitalize="characters"
              />
              <CustomInput
                label="Marca"
                placeholder="Ej. Mazda, Chevrolet"
                value={marca}
                onChangeText={setMarca}
              />
              <CustomInput
                label="Modelo (Opcional)"
                placeholder="Ej. 2023, CX-30"
                value={modelo}
                onChangeText={setModelo}
              />
              <CustomInput
                label="Color (Opcional)"
                placeholder="Ej. Gris, Rojo"
                value={color}
                onChangeText={setColor}
              />

              <CustomButton
                title={editingItem ? 'Guardar Cambios' : 'Registrar Vehículo'}
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
