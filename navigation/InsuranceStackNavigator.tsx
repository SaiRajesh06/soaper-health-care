// src/navigation/InsuranceStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InsuranceScreen from '../screens/profile/InsuranceScreen';
import CameraScreen from '../screens/profile/CameraScreen';
import VerifyInsuranceScreen from '../screens/profile/VerifyInsuranceScreen';
import { InsuranceCard } from '../types/insurance';

export type InsuranceStackParamList = {
  InsuranceMain: undefined; // Add this line
  Insurance: undefined; // If this is not needed, you can remove it
  CameraScreen: {
    type: 'insurance' | 'medication';
    onCapture: (data: any) => void;
  };
  VerifyInsurance: {
    insuranceData: any;
    onSubmit: (insurance: any) => void;
    onSave: (savedInsurance: InsuranceCard) => void;
  };
};
const Stack = createNativeStackNavigator<InsuranceStackParamList>();

export default function InsuranceStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="InsuranceMain" 
        component={InsuranceScreen}
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="CameraScreen" 
        component={CameraScreen}
        options={{ 
          headerShown: true,
          title: 'Scan Insurance Card',
          // Important: This makes the stack navigator header independent
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="VerifyInsurance" 
        component={VerifyInsuranceScreen}
        options={{ 
          headerShown: true,
          title: 'Verify Insurance Details',
          // Important: This makes the stack navigator header independent
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}