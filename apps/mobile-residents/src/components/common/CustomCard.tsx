import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface CustomCardProps extends ViewProps {
  children: React.ReactNode;
}

export function CustomCard({ children, style, ...props }: CustomCardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
});
