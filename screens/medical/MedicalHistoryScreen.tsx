import React from 'react';
import { View, Text } from 'react-native';
import { sharedStyles } from '../../theme/styles';

export default function MedicalHistoryScreen() {
  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.text}>Medical History Screen</Text>
    </View>
  );
}
