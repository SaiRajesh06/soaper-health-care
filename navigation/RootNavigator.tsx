// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import PhysicianDrawerNavigator from '../physicianapp/navigation/PhysicianDrawerNavigator';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator, Text } from 'react-native';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  PhysicianMain: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const HeaderTitle = ({ children }: { children: string }) => (
  <Text>{children}</Text>
);

const screenOptions = {
  headerShown: false,
  headerTitle: HeaderTitle
};

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
    <Text>Loading...</Text>
  </View>
);

export default function RootNavigator() {
  const { isAuthenticated, loading, userRole } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {!isAuthenticated ? (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
          />
        ) : userRole === 'physician' ? (
          <Stack.Screen
            name="PhysicianMain"
            component={PhysicianDrawerNavigator}
          />
        ) : (
          <Stack.Screen
            name="Main"
            component={DrawerNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}