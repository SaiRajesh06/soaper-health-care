import React from 'react';
import { View } from 'react-native';
import { CardField } from '@stripe/stripe-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addCardstyles } from './style';

interface CardInputProps {
  onCardChange: (cardDetails: any) => void;
}

export const CardInput = ({ onCardChange }: CardInputProps) => (
  <View style={addCardstyles.cardContainer}>
    <Icon name="credit-card-outline" size={40} color="#007AFF" style={addCardstyles.cardIcon} />
    <CardField
      postalCodeEnabled={false}
      onCardChange={onCardChange} 
      style={addCardstyles.cardField}
      cardStyle={{
        backgroundColor: '#FFFFFF',
        textColor: '#1c1c1e',
        placeholderColor: '#999999',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e1e1e1',
      }}
    />
  </View>
);