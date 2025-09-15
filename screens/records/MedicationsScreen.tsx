import React from 'react';
import { View, Text } from 'react-native';
import { sharedStyles } from '../../theme/styles';

export default function MedicationsScreen() {
  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.text}>Medications Screen</Text>
    </View>
  );
}
