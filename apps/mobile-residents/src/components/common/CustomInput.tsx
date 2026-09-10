import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomInputProps extends TextInputProps {
  label?: string;
  hint?: string;
  containerStyle?: ViewStyle;
}

/**
 * Cuando recibe `secureTextEntry` dibuja solo el botón de mostrar/ocultar y se encarga del
 * estado. Va aquí y no en cada pantalla para que las cinco casillas de contraseña de la app
 * —entrar, registro y recuperación— se comporten igual sin repetir nada.
 */
export function CustomInput({
  label,
  hint,
  containerStyle,
  style,
  placeholderTextColor = '#64748b',
  secureTextEntry,
  ...props
}: CustomInputProps) {
  const [visible, setVisible] = useState(false);
  const esPassword = Boolean(secureTextEntry);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View>
        <TextInput
          style={[styles.input, esPassword && styles.inputConBoton, style]}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={esPassword && !visible}
          {...props}
        />

        {esPassword && (
          <TouchableOpacity
            style={styles.botonOjo}
            onPress={() => setVisible((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            // El icono es pequeño para el dedo: se amplía el área sensible sin agrandarlo.
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#64748b"
            />
          </TouchableOpacity>
        )}
      </View>

      {hint && <Text style={styles.hint}>{hint}</Text>}
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
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#0f172a',
    fontSize: 14,
  },
  inputConBoton: {
    // Sitio para el ojo, para que el texto largo no pase por debajo.
    paddingRight: 48,
  },
  botonOjo: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  hint: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 3,
    marginLeft: 4,
  },
});
