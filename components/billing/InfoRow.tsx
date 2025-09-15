// src/components/charge-details/InfoRow.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './style';

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>{icon}</View>
    <View style={styles.infoContent}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);
