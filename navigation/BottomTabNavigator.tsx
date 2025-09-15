// src/navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/home/HomeScreen';
import MessagesNavigator from './MessagesNavigator';
import AppointmentsNavigator from './AppointmentsNavigator';
import RecordsNavigator from './RecordsNavigator';
import { BottomTabParamList } from './types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Messages':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Appointments':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Records':
              iconName = focused ? 'document-text' : 'document-text-outline';
              break;
            default:
              iconName = 'square';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4B917D',
        tabBarInactiveTintColor: '#8BA89F',
        tabBarStyle: {
          backgroundColor: '#ffffff',// nav bar color
          borderTopColor: '#E8F0ED',
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          position: 'relative', 
          borderRadius: 2,
          marginHorizontal: 1,
          marginBottom: 24,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="Messages" 
        component={MessagesNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentsNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Records" component={RecordsNavigator} />
    </Tab.Navigator>
  );
}