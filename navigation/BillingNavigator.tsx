import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BillingScreen from '../screens/profile/BillingScreen';
import VisitChargesScreen from '../screens/profile/VisitChargeScreen';
import PaymentScreen from '../screens/profile/PaymentScreen';
import AddCardScreen from '../screens/profile/AddCard';
import { BillingStackParamList } from '../types/navigation';
import ChargeDetailsScreen from '../screens/profile/ChargeDetailsScreen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';

const Stack = createNativeStackNavigator<BillingStackParamList>();

export default function BillingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#C5E8D5',  // Light green background
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{flexDirection: 'row', alignItems: 'center' }}
          >
            <Ionicons name="chevron-back" size={24} color="#5A8678" />
            <Text style={{ color: '#5A8678', fontSize: 17 }}>Back</Text>
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen
        name="BillingList"
        component={BillingScreen}
        options={{
          title: 'Billing',
          headerTitleStyle: {
            color: '#2C5446',  // Green text color
          },
        }}
      />
      <Stack.Screen
        name="ChargeDetails"
        component={ChargeDetailsScreen}
        options={{
          title: 'Charge Details',
          headerTitleStyle: {
            color: '#5A8678',  // Green text color
          },
        }}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={({ navigation }) => ({
          title: 'Make Payment',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#f5f5f5',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={28} color="#000000" />
            </TouchableOpacity>
          )
        })}
      />
      <Stack.Screen
        name="AddCard"
        component={AddCardScreen}
        options={({ navigation }) => ({
          title: 'Add New Card',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#f5f5f5',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={28} color="#000000" />
            </TouchableOpacity>
          )
        })}
      />
    </Stack.Navigator>
  );
}