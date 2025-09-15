// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StripeProvider } from '@stripe/stripe-react-native';
import 'react-native-reanimated';
import { useAuth } from './src/hooks/useAuth';
import { useNotifications } from './src/hooks/useNotifications';
import RootNavigator from './src/navigation/RootNavigator';

// Create a separate component for notifications
function NotificationHandler() {
  useNotifications();
  return null;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider
        publishableKey="pk_test_51QXU2SGpq1V5cIsXWbSiIvwz9bIdCXzT2IHAWiRKttwnosH8qWuFlNp6pEdWJPB9ydF4OcvOsFjZewgBQVlfWwdk00QXFO7cfn"
        merchantIdentifier="merchant.soaper.EMR"
      >
        <RootNavigator>
          {/* Move NotificationHandler inside RootNavigator */}
          {isAuthenticated && <NotificationHandler />}
        </RootNavigator>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}