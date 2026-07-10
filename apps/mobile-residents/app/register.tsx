import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CustomCard } from '../src/components/common/CustomCard';
import { CustomInput } from '../src/components/common/CustomInput';
import { CustomButton } from '../src/components/common/CustomButton';
import { CustomSelect } from '../src/components/common/CustomSelect';

const tipoDocumentoOptions = [
  { label: 'Cédula de Ciudadanía (CC)', value: 'CC' },
  { label: 'Tarjeta de Identidad (TI)', value: 'TI' },
  { label: 'Cédula de Extranjería (CE)', value: 'CE' },
  { label: 'NIT', value: 'NIT' },
  { label: 'Pasaporte (PA)', value: 'PA' },
];

export default function RegisterScreen() {
  const router = useRouter();
  
  // Campos del formulario
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('CC');
  const [documento, setDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [conjuntoId, setConjuntoId] = useState('');

  // Estados de control
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  
  // Permisos de Cámara
  const [permission, requestPermission] = useCameraPermissions();

  const handleOpenScanner = async () => {
    if (!permission) {
      // Cargando permisos
      return;
    }
    
    if (!permission.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        Alert.alert(
          'Permiso denegado',
          'Se requiere acceso a la cámara para escanear el código QR del conjunto.'
        );
        return;
      }
    }
    
    setShowScanner(true);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    // Al escanear con éxito, extraemos el código y cerramos la cámara
    setConjuntoId(data.trim());
    setShowScanner(false);
    Alert.alert('Código QR escaneado', 'Conjunto vinculado exitosamente.');
  };

  const handleRegister = async () => {
    // 1️⃣ Validar campos obligatorios
    if (
      !nombres ||
      !apellidos ||
      !tipoDocumento ||
      !documento ||
      !email ||
      !contrasena ||
      !confirmarContrasena ||
      !conjuntoId
    ) {
      Alert.alert('Campos incompletos', 'Por favor diligencia todos los campos del formulario.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      Alert.alert('Contraseñas no coinciden', 'La contraseña y su confirmación deben ser idénticas.');
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // 2️⃣ Invocar endpoint de registro seguro en Next.js
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.50.5:3001'; // Cambiar a la IP de desarrollo local de tu máquina para pruebas físicas
      
      const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          tipo_documento: tipoDocumento,
          documento: documento.trim(),
          email: email.trim().toLowerCase(),
          contrasena,
          conjunto_id: conjuntoId.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error en el servidor al registrarse.');
      }

      // Registro exitoso
      Alert.alert(
        '¡Registro Exitoso!',
        'Tu usuario ha sido registrado. Ya puedes iniciar sesión con tus credenciales.',
        [
          {
            text: 'Aceptar',
            onPress: () => router.replace('/login'),
          },
        ]
      );

    } catch (error: any) {
      console.error('Error en registro:', error);
      Alert.alert('Error de registro', error.message || 'No se pudo completar el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* Brand Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Registro de Residente</Text>
          <Text style={styles.subtitle}>Únete a la administración moderna de tu copropiedad</Text>
        </View>

        {/* Input Form Card */}
        <CustomCard>
          
          <CustomInput
            label="Nombres *"
            placeholder="Nombres del residente"
            value={nombres}
            onChangeText={setNombres}
          />

          <CustomInput
            label="Apellidos *"
            placeholder="Apellidos del residente"
            value={apellidos}
            onChangeText={setApellidos}
          />

          {/* Tipo de Documento Row */}
          <View style={styles.row}>
            <CustomSelect
              label="Tipo Doc. *"
              options={tipoDocumentoOptions}
              selectedValue={tipoDocumento}
              onSelect={setTipoDocumento}
              containerStyle={{ flex: 0.38 }}
            />

            <CustomInput
              label="Documento *"
              placeholder="Número de documento"
              keyboardType="numeric"
              value={documento}
              onChangeText={setDocumento}
              containerStyle={{ flex: 0.58 }}
            />
          </View>

          <CustomInput
            label="Correo electrónico *"
            placeholder="residente@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* QR Scan & Link Section */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vincular Conjunto (ID / QR) *</Text>
            <View style={styles.qrRow}>
              <CustomInput
                placeholder="UUID del conjunto"
                autoCapitalize="none"
                value={conjuntoId}
                onChangeText={setConjuntoId}
                containerStyle={{ flex: 1, marginRight: 10, marginBottom: 0 }}
              />
              <TouchableOpacity style={styles.qrBtn} onPress={handleOpenScanner}>
                <Text style={styles.qrBtnText}>Escanear QR</Text>
              </TouchableOpacity>
            </View>
          </View>

          <CustomInput
            label="Contraseña *"
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            autoCapitalize="none"
            value={contrasena}
            onChangeText={setContrasena}
          />

          <CustomInput
            label="Confirmar Contraseña *"
            placeholder="Confirma tu contraseña"
            secureTextEntry
            autoCapitalize="none"
            value={confirmarContrasena}
            onChangeText={setConfirmarContrasena}
          />

          {/* Submit Button */}
          <CustomButton
            title="Registrarse"
            onPress={handleRegister}
            loading={loading}
          />
        </CustomCard>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={styles.loginLink}>Inicia Sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Camera / QR Code Scanner Modal */}
      <Modal visible={showScanner} animationType="slide" transparent={false}>
        <View style={styles.scannerContainer}>
          {/* @ts-expect-error - React 18/19 typings collision workaround */}
          <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerOutline} />
            <Text style={styles.scannerTip}>Encuadra el código QR del conjunto</Text>
            <TouchableOpacity style={styles.closeScannerBtn} onPress={() => setShowScanner(false)}>
              <Text style={styles.closeScannerText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  inputGroup: {
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
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qrBtn: {
    backgroundColor: '#8A1C14',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
    gap: 6,
  },
  footerText: {
    color: '#64748b',
    fontSize: 13,
  },
  loginLink: {
    color: '#8A1C14',
    fontWeight: 'bold',
    fontSize: 13,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scannerOutline: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#ef4444',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scannerTip: {
    color: '#ffffff',
    marginTop: 24,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeScannerBtn: {
    marginTop: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  closeScannerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
