import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

export function CustomButton({
  title,
  loading = false,
  style,
  disabled,
  ...props
}: CustomButtonProps) {
  const isButtonDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isButtonDisabled && styles.disabledButton,
        style,
      ]}
      disabled={isButtonDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#8A1C14',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8A1C14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
