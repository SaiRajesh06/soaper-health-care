import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addCardstyles } from './style';

interface SaveCardCheckboxProps {
  saveCard: boolean;
  onToggle: () => void;
}

export const SaveCardCheckbox = ({ saveCard, onToggle }: SaveCardCheckboxProps) => (
  <Pressable 
    style={addCardstyles.checkboxContainer} 
    onPress={onToggle}
  >
    <View style={[addCardstyles.checkbox, saveCard && addCardstyles.checkboxChecked]}>
      {saveCard && <Icon name="check" size={16} color="#FFFFFF" />}
    </View>
    <Text style={addCardstyles.checkboxLabel}>Save this card for future payments</Text>
  </Pressable>
);