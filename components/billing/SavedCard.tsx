// src/components/payment/SavedCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SavedCard as SavedCardType } from '../../types/billing';
import {styles} from './style';

interface SavedCardProps {
  card: SavedCardType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const SavedCard = ({ card, isSelected, onSelect }: SavedCardProps) => {
  const getBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa': return 'credit-card';
      case 'mastercard': return 'credit-card';
      case 'amex': return 'credit-card';
      default: return 'credit-card-outline';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.cardItem, isSelected && styles.selectedCard]}
      onPress={() => onSelect(card.id)}
      accessible={true}
      accessibilityLabel={`${card.brand} card ending in ${card.last4}`}
      accessibilityRole="button"
    >
      <View style={styles.cardItemContent}>
        <View style={styles.cardBrandContainer}>
          <Icon 
            name={getBrandIcon(card.brand)} 
            size={24} 
            color={isSelected ? "#007AFF" : "#666"}
          />
          <Text style={[styles.cardBrand, isSelected && styles.selectedText]}>
            {card.brand}
          </Text>
        </View>
        <View style={styles.cardDetails}>
          <Text style={[styles.cardNumber, isSelected && styles.selectedText]}>
            •••• {card.last4}
          </Text>
          <Text style={[styles.cardExpiry, isSelected && styles.selectedText]}>
            Expires {card.exp_month}/{card.exp_year}
          </Text>
        </View>
      </View>
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Icon name="check-circle" size={24} color="#007AFF" />
        </View>
      )}
    </TouchableOpacity>
  );
};