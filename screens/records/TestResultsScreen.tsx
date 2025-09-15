import React from 'react';
import { View, Text } from 'react-native';
import { sharedStyles } from '../../theme/styles';

export default function TestResultsScreen() {
  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.text}>TestResults Screen</Text>
    </View>
  );
}
