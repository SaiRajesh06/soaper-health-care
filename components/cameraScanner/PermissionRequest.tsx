// src/components/cameraScanner/PermissionRequest.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cameraStyles } from './style';

type PermissionRequestProps = {
  onRequestPermission: () => void;
};

export function PermissionRequest({ onRequestPermission }: PermissionRequestProps) {
  return (
    <View style={cameraStyles.container}>
      <Text style={cameraStyles.message}>Camera permission is required</Text>
    
    </View>
  );
}