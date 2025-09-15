import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MedicationScreen from '../screens/profile/MedicationScreen';
import CameraScreen from '../screens/profile/CameraScreen';
import VerifyMedicationScreen from '../screens/profile/VerifyMedicationScreen';
import { MedicationData } from '../services/medicationGPTService';

export type MedicationStackParamList = {
  MedicationMain: undefined;
  CameraScreen: {
    type: 'medication';
    onCapture: (medications: MedicationData[]) => void;
  };
  VerifyMedication: {
    medicationData: MedicationData | MedicationData[];
    onSave: (medications: MedicationData[]) => void;
  };
};

const Stack = createNativeStackNavigator<MedicationStackParamList>();

export default function MedicationStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MedicationMain" 
        component={MedicationScreen}
        options={{ 
          title: 'Medications',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="CameraScreen" 
        component={CameraScreen}
        options={({ route }) => ({ 
          title: route.params.type === 'medication' ? 'Scan Medication List or Bottles' : undefined,
          presentation: 'modal'
        })}
      />
      <Stack.Screen 
        name="VerifyMedication" 
        component={VerifyMedicationScreen}
        options={{ 
          title: 'Verify Medication Details',
          headerShown: true,
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
} 