import React, { useRef, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
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

  // `onBarcodeScanned` se dispara por fotograma mientras la cámara enfoca el código, así que sin
  // esta guarda se encadenan varias alertas por un solo escaneo.
  const leyendo = useRef(false);

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
    
    leyendo.current = false;
    setShowScanner(true);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (leyendo.current) return;
    leyendo.current = true;

    // El identificador se guarda pero no se muestra: al residente no le dice nada y solo invita
    // a manipularlo. Quien comprueba que el conjunto existe es el servidor, al registrar.
    setConjuntoId(data.trim());
    setShowScanner(false);
  };

  const cerrarScanner = () => {
    leyendo.current = true;
    setShowScanner(false);
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
      !confirmarContrasena
    ) {
      Alert.alert('Campos incompletos', 'Por favor diligencia todos los campos del formulario.');
      return;
    }

    // Aparte del resto: ya no es un campo que se olvide llenar, sino un paso que falta hacer.
    if (!conjuntoId) {
      Alert.alert(
        'Falta vincular el conjunto',
        'Escanea el código QR que te entrega la administración de tu conjunto.'
      );
      return;
    }

    if (contrasena !== confirmarContrasena) {
      Alert.alert('Contraseñas no coinciden', 'La contraseña y su confirmación deben ser idénticas.');
      return;
    }

    // Ocho, como el panel y como la pantalla de recuperación: si aquí se aceptaran seis, el
    // residente no podría volver a poner su propia contraseña al recuperarla.
    if (contrasena.length < 8) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener mínimo 8 caracteres.');
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

      // El registro deja al residente sin apartamento: se lo asigna un administrador desde el
      // panel. Decirle «ya puedes iniciar sesión» sería falso, porque hasta entonces no entra.
      Alert.alert(
        '¡Registro exitoso!',
        'Tu cuenta quedó creada. El administrador de tu conjunto debe asignarte un apartamento; hasta entonces no podrás entrar a la app. Te recomendamos avisarle que ya te registraste.',
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

          {/* Vinculación del conjunto por QR */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vincular Conjunto *</Text>

            {conjuntoId ? (
              <View style={styles.qrVinculado}>
                <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                <Text style={styles.qrVinculadoTexto}>Conjunto vinculado</Text>
                <TouchableOpacity onPress={handleOpenScanner}>
                  <Text style={styles.qrRepetir}>Escanear otro</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <TouchableOpacity style={styles.qrBtn} onPress={handleOpenScanner}>
                  <Ionicons name="qr-code-outline" size={18} color="#ffffff" />
                  <Text style={styles.qrBtnText}>Escanear QR del conjunto</Text>
                </TouchableOpacity>
                <Text style={styles.qrAyuda}>
                  Pídele el código QR a la administración de tu conjunto.
                </Text>
              </>
            )}
          </View>

          <CustomInput
            label="Contraseña *"
            placeholder="Mínimo 8 caracteres"
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
          <CameraView
            style={StyleSheet.absoluteFill}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerOutline} />
            <Text style={styles.scannerTip}>Encuadra el código QR del conjunto</Text>
            <TouchableOpacity style={styles.closeScannerBtn} onPress={cerrarScanner}>
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
  qrBtn: {
    backgroundColor: '#8A1C14',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  qrAyuda: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
    marginLeft: 4,
  },
  qrVinculado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  qrVinculadoTexto: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#166534',
  },
  qrRepetir: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8A1C14',
    textDecorationLine: 'underline',
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
    // React Native 0.85 quitó `StyleSheet.absoluteFillObject`; `absoluteFill` es un estilo
    // registrado y no se puede desparramar, así que aquí van las propiedades tal cual.
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
