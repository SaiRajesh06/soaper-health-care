import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecordsListScreen from '../screens/records/RecordsListScreen';
import TestResultsScreen from '../screens/records/TestResultsScreen';
import MedicationsScreen from '../screens/records/MedicationsScreen';
import VisitHistoryScreen from '../screens/records/VisitHistoryScreen';
import DocumentsScreen from '../screens/records/DocumentsScreen';
import { RecordsStackParamList } from './types';

const Stack = createNativeStackNavigator<RecordsStackParamList>();

export default function RecordsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="RecordsList" 
        component={RecordsListScreen}
        options={{ title: 'Medical Records' }}
      />
      <Stack.Screen name="TestResults" component={TestResultsScreen} />
      <Stack.Screen name="Medications" component={MedicationsScreen} />
      <Stack.Screen name="VisitHistory" component={VisitHistoryScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
    </Stack.Navigator>
  );
}
