// src/components/payment/AddCardButton.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from './style';

interface AddCardButtonProps {
  onPress: () => void;
}

export const AddCardButton = ({ onPress }: AddCardButtonProps) => (
  <TouchableOpacity 
    style={styles.addCardButton} 
    onPress={onPress}
    accessible={true}
    accessibilityLabel="Add new card"
    accessibilityRole="button"
  >
    <Icon name="credit-card-plus-outline" size={24} color="#007AFF" />
    <Text style={styles.addCardText}>New Card</Text>
  </TouchableOpacity>
);