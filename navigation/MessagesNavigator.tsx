// MessagesNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectPhysicianScreen } from '../screens/messages/SelectPhysicianScreen';
import { SelectEncounterScreen } from '../screens/messages/SelectEncounterScreen';
import { ComposeMessageScreen } from '../screens/messages/ComposeMessageScreen';
import { MessageDetailScreen } from '../screens/messages/MessageDetailScreen';
import { InboxScreen } from '../screens/messages/InboxScreen';
import { PhysicianResponse } from '../types/physician';

export type MessagesStackParamList = {
  Inbox: undefined;
  ComposeMessage: {
    physician: PhysicianResponse;
    encounterId?: string;
    subject?: string;
    threadId?: string;
  };
  MessageDetail: {
    messageId: string;
    threadId: string;
  };
  SelectionFlow: {
    screen: 'SelectPhysician' | 'SelectEncounter';
    params?: {
      physician?: PhysicianResponse;
    };
  };
  SelectPhysician: undefined;
  SelectEncounter: {
    physician: PhysicianResponse;
  };
};

const Stack = createNativeStackNavigator<MessagesStackParamList>();

export default function MessagesNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Inbox"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen 
        name="Inbox" 
        component={InboxScreen}
        options={{
          title: "Messages",
        }}
      />
      
      <Stack.Screen 
        name="ComposeMessage" 
        component={ComposeMessageScreen}
        options={{
          title: "New Message",
        }}
      />
      
      <Stack.Screen 
        name="MessageDetail" 
        component={MessageDetailScreen}
        options={{
          title: "Message",
        }}
      />
      
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen 
          name="SelectionFlow"
          component={SelectPhysicianScreen}
          options={{
            title: "Select Physician"
          }}
        />
        <Stack.Screen 
          name="SelectEncounter"
          component={SelectEncounterScreen}
          options={{
            title: "Select Encounter"
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}