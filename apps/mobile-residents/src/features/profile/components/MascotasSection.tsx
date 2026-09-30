import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomCard } from '../../../components/common/CustomCard';
import { CustomInput } from '../../../components/common/CustomInput';
import { CustomSelect } from '../../../components/common/CustomSelect';
import { CustomButton } from '../../../components/common/CustomButton';
import { AvisoHogar, RegistradoPor } from './HogarCompartido';
import { estilosSeccion as styles } from './seccionHogarStyles';

interface Pet {
  id: number;
  nombre: string;
  raza: string | null;
  especie: string | null;
  tamano: string | null;
  registrado_por_nombre?: string | null;
}

interface MascotasSectionProps {
  pets?: Pet[];
  onMutate: (payload: {
    action: 'create' | 'update' | 'delete';
    id?: number;
    nombre?: string;
    raza?: string;
    especie?: string;
    tamano?: string;
  }) => Promise<any>;
}

export function MascotasSection({ pets = [], onMutate }: MascotasSectionProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(false);

  // Campos
  const [nombre, setNombre] = useState('');
  const [raza, setRaza] = useState('');
  const [especie, setEspecie] = useState('');
  const [tamano, setTamano] = useState('');

  const especieOptions = [
    { label: 'Perro', value: 'Perro' },
    { label: 'Gato', value: 'Gato' },
    { label: 'Ave', value: 'Ave' },
    { label: 'Otro', value: 'Otro' },
  ];

  const tamanoOptions = [
    { label: 'Pequeño', value: 'Pequeño' },
    { label: 'Mediano', value: 'Mediano' },
    { label: 'Grande', value: 'Grande' },
  ];

  const handleOpenModal = (item?: Pet) => {
    if (item) {
      setEditingItem(item);
      setNombre(item.nombre);
      setRaza(item.raza || '');
      setEspecie(item.especie || '');
      setTamano(item.tamano || '');
    } else {
      setEditingItem(null);
      setNombre('');
      setRaza('');
      setEspecie('');
      setTamano('');
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingItem(null);
  };

  const handleSave = async () => {
    if (!nombre.trim() || !especie || !tamano) {
      Alert.alert('Campos obligatorios', 'Nombre, Especie y Tamaño son requeridos.');
      return;
    }

    setLoading(true);
    try {
      if (editingItem) {
        await onMutate({
          action: 'update',
          id: editingItem.id,
          nombre: nombre.trim(),
          raza: raza.trim() || undefined,
          especie,
          tamano,
        });
      } else {
        await onMutate({
          action: 'create',
          nombre: nombre.trim(),
          raza: raza.trim() || undefined,
          especie,
          tamano,
        });
      }
      handleCloseModal();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo guardar la información.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item: Pet) => {
    Alert.alert(
      'Eliminar Mascota',
      `¿Seguro que deseas eliminar a ${item.nombre} de las mascotas del apartamento? Se quita para todos sus residentes.`,
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
        <Text style={styles.sectionTitle}>Mascotas y Animales</Text>
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

      {pets.length > 0 ? (
        pets.map((item) => (
          <CustomCard key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View>
                <Text style={styles.itemTitulo}>{item.nombre}</Text>
                <Text style={styles.itemDetails}>
                  {item.especie} • Tamaño: {item.tamano}
                  {item.raza ? ` • Raza: ${item.raza}` : ''}
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
        <Text style={styles.emptyText}>Tu apartamento no tiene mascotas registradas.</Text>
      )}

      {/* Modal Crear / Editar */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Editar Mascota' : 'Agregar Mascota'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalForm}>
              <CustomInput
                label="Nombre de la Mascota"
                placeholder="Ej. Bruno, Lulú"
                value={nombre}
                onChangeText={setNombre}
              />
              <CustomSelect
                label="Especie"
                placeholder="Selecciona la especie"
                options={especieOptions}
                selectedValue={especie}
                onSelect={setEspecie}
              />
              <CustomSelect
                label="Tamaño"
                placeholder="Selecciona el tamaño"
                options={tamanoOptions}
                selectedValue={tamano}
                onSelect={setTamano}
              />
              <CustomInput
                label="Raza (Opcional)"
                placeholder="Ej. Criollo, Golden Retriever"
                value={raza}
                onChangeText={setRaza}
              />

              <CustomButton
                title={editingItem ? 'Guardar Cambios' : 'Registrar Mascota'}
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
