import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'info' | 'confirm' | 'error' | 'success';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
}

export function CustomAlert({
  visible,
  title,
  message,
  type = 'info',
  confirmText,
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  isDestructive = false,
}: CustomAlertProps) {
  
  // Determinar icono y color según el tipo de alerta
  const getHeaderIcon = () => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle-outline', color: '#22c55e', bgColor: '#f0fdf4' };
      case 'error':
        return { name: 'close-circle-outline', color: '#ef4444', bgColor: '#fef2f2' };
      case 'confirm':
        return { 
          name: isDestructive ? 'log-out-outline' : 'alert-circle-outline', 
          color: isDestructive ? '#8A1C14' : '#d97706', 
          bgColor: isDestructive ? '#fdf2f2' : '#fef3c7' 
        };
      case 'info':
      default:
        return { name: 'information-circle-outline', color: '#3b82f6', bgColor: '#eff6ff' };
    }
  };

  const iconConfig = getHeaderIcon();
  const showCancelButton = type === 'confirm';
  const defaultConfirmText = type === 'confirm' ? 'Aceptar' : 'Entendido';
  const finalConfirmText = confirmText || defaultConfirmText;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* Cabecera con Icono */}
          <View style={[styles.iconWrapper, { backgroundColor: iconConfig.bgColor }]}>
            {/* @ts-expect-error - React 18/19 vector icons compatibility */}
            <Ionicons name={iconConfig.name} size={36} color={iconConfig.color} />
          </View>

          {/* Textos */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Botones de Acción */}
          <View style={[styles.buttonContainer, showCancelButton ? styles.rowButtons : styles.singleButton]}>
            {showCancelButton && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                type === 'confirm' && isDestructive ? styles.destructiveButton : styles.confirmButton
              ]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>{finalConfirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  singleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
  },
  confirmButton: {
    backgroundColor: '#3b82f6',
  },
  destructiveButton: {
    backgroundColor: '#8A1C14',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
