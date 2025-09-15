// src/navigation/DrawerNavigator.tsx

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import type { DrawerParamList } from './types';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '../screens/profile/ProfileScreen';
import InsuranceStackNavigator from './InsuranceStackNavigator';
import BillingScreen from '../screens/profile/BillingScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import SupportScreen from '../screens/profile/SupportScreen';
import CustomDrawerContent from '../components/common/CustomDrawerContent';
import BillingNavigator from './BillingNavigator';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';
import MedicationStackNavigator from './MedicationStackNavigator';
import { Pill } from 'lucide-react-native';
import ImportRecordsScreen from '../screens/medical/ImportRecordsScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  // Common options for drawer screens
  const drawerScreenOptions = {
    drawerLabelStyle: {
      color: '#5A8678'  // Darker green for all drawer items
    }
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation, route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#C5E8D5',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#E8F0ED',
          height: 100,
        },
        headerTintColor: '#2C5446',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: '#2C5446',
        },
        drawerStyle: {
          backgroundColor: '#f5f5f5',
          width: 280,
        },
        drawerActiveBackgroundColor: '#E5F1FF', //hover
        drawerActiveTintColor: '#4B917D',
        drawerInactiveTintColor: '#8BA89F',
        headerLeft: () => {
          if (route.name === 'MainTabs') {
            return (
              <TouchableOpacity
                onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 16 }}
              >
                <Ionicons name="menu" size={24} color="#4B917D" />
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 16,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Ionicons name="chevron-back" size={24} color="#4B917D" />
              <Text style={{
                color: '#4B917D',
                fontSize: 17,
                marginLeft: 40,
                fontWeight: '500'
              }}>
                Back
              </Text>
            </TouchableOpacity>
          );
        },
      })}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ ...drawerScreenOptions, title: 'Soaper EMR' }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={drawerScreenOptions}
      />
      <Drawer.Screen
        name="Insurance"
        component={InsuranceStackNavigator}
        options={drawerScreenOptions}
      />
      <Drawer.Screen
        name="Medications"
        component={MedicationStackNavigator}
        options={drawerScreenOptions}
      />
      <Drawer.Screen
        name="Billing"
        component={BillingNavigator}
        options={{ ...drawerScreenOptions, headerShown: false }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={drawerScreenOptions}
      />
      <Drawer.Screen
        name="Support"
        component={SupportScreen}
        options={drawerScreenOptions}
      />
      <Drawer.Screen
        name="Import Records"
        component={ImportRecordsScreen}
        options={drawerScreenOptions}
      />
    </Drawer.Navigator>
  );
}