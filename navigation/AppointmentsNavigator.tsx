// src/navigation/AppointmentsNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppointmentsScreen from '../screens/appointments/AppointmentsScreen';
import ScheduleAppointmentScreen from '../screens/appointments/ScheduleAppointmentScreen';
import type { AppointmentsStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<AppointmentsStackParamList>();

export default function AppointmentsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AppointmentsList" 
        component={AppointmentsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ScheduleAppointment"  // Changed from ScheduleAppointmentScreen
        component={ScheduleAppointmentScreen}
        options={({ route }) => ({ 
          title: route.params?.rescheduleData ? 'Reschedule Appointment' : 'Schedule Appointment',
          headerShown: false // Since your ScheduleAppointmentScreen has its own header
        })}
      />
    </Stack.Navigator>
  );
}