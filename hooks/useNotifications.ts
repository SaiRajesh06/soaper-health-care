// src/hooks/useNotifications.ts
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useNavigation, CommonActions  } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BillingStackParamList } from '../types/navigation';
import { getFirebaseToken } from '../config/firebase';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

type RootStackParamList = {
  Auth: undefined;
  Main: {
    screen: string;
    params?: {
      appointment_id?: string;
      charge_id?: string;
    };
  };
};

const API_BASE_URL = process.env.API_BASE_URL;

type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useNotifications = () => {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const navigation = useNavigation<RootNavigationProp>();

  const registerDeviceToken = async (token: string) => {
    console.log('Getting Firebase token...');
    const firebasetoken = await getFirebaseToken();
    console.log('Got Firebase token:', firebasetoken);
    
    try {
      console.log('Making registration request to:', `${API_BASE_URL}/api/v1/notifications/register`);
      const response = await fetch(`${API_BASE_URL}/api/v1/notifications/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebasetoken}`
        },
        body: JSON.stringify({ device_token: token })
      });
  
      console.log('Registration response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Registration failed with response:', errorText);
        throw new Error('Failed to register device token');
      }
  
      console.log('Device token registered successfully');
    } catch (error) {
      console.error('Error registering device token:', error);
    }
  };

  const setupNotificationListeners = () => {
    console.log('Setting up notification listeners...');
    // Handle notification when app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        const data = notification.request.content.data;
        console.log('Received notification:', data);
      }
    );

    // Handle notification taps with support for both payment and appointment reminders
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content.data;
        console.log('Notification tapped:', data);
        
        switch (data.type) {
          case 'PAYMENT_REMINDER':
            if (data.charge_id) {
              navigation.navigate('Main', {
                screen: 'BillingList',
                params: { charge_id: data.charge_id }
              });
            }
            break;
            
          case 'APPOINTMENT_REMINDER':
            if (data.appointment_id) {
              navigation.navigate('Main', {
                screen: 'Appointments',
                params: { appointment_id: data.appointment_id }
              });
            }
            break;
            
          default:
            console.log('Unhandled notification type:', data.type);
        }
      }
    );
    console.log('Notification listeners setup complete');
  };

  const cleanup = () => {
    console.log('Cleaning up notification listeners...');
    if (notificationListener.current) {
      Notifications.removeNotificationSubscription(notificationListener.current);
    }
    if (responseListener.current) {
      Notifications.removeNotificationSubscription(responseListener.current);
    }
    console.log('Cleanup complete');
  };

  const registerForPushNotifications = async () => {
    console.log('Starting push notification registration...');

    if (!Device.isDevice) {
      console.log('Not a physical device, stopping');
      alert('Push notifications require a physical device');
      return;
    }

    try {
      console.log('Checking existing permissions...');
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      console.log('Current permission status:', existingStatus);

      if (existingStatus !== 'granted') {
        console.log('Requesting permissions...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('New permission status:', status);
      }

      if (finalStatus !== 'granted') {
        console.log('Permission denied, stopping');
        alert('Failed to get push token for push notification!');
        return;
      }

      console.log('Permission granted, getting token...');

      // Set up Android channel
      if (Platform.OS === 'android') {
        console.log('Setting up Android channel...');
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      console.log('Getting Expo push token...');
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: "8c0e3d4c-8ec8-4078-8af8-8ed52eeb98b7"
      });
      console.log("Push token:", token.data);

      console.log('About to register with backend...');
      // Register token with backend
      await registerDeviceToken(token.data);

    } catch (error) {
      console.error('Error in registerForPushNotifications:', error);
    }
  };

  useEffect(() => {
    console.log('useNotifications hook mounted');
    registerForPushNotifications();
    setupNotificationListeners();

    // Return cleanup function
    return () => {
      cleanup();
    };
  }, []);

  return {
    registerForPushNotifications,
  };
};