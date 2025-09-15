// src/components/add-card/SecurityNote.tsx
import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addCardstyles } from './style';
export const SecurityNote = () => (
  <Text style={addCardstyles.secureText}>
    <Icon name="lock-outline" size={14} color="#4a4a4a" /> Your payment info is secure
  </Text>
);