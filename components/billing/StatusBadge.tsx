// src/components/charge-details/StatusBadge.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './style';
import { getStatusColor, getStatusBgColor } from '../../utils/status';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(status) }]}>
    <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
      {status.replace(/_/g, ' ').toUpperCase()}
    </Text>
  </View>
);