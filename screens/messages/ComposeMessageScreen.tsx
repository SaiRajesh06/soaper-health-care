// src/screens/messages/ComposeMessageScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Send, X, User } from 'lucide-react-native';
import { composeStyles as styles } from '../../components/message/style';
import MessageService from '../../services/messageServices';
import { theme } from '../../theme/styles';
import { PhysicianResponse } from '../../types/physician';

interface ComposeMessageProps {
  route: {
    params: {
      physician: PhysicianResponse;
      encounterId?: string;
      subject?: string;
      threadId?: string;
    }
  }
}

export const ComposeMessageScreen = ({ route }: ComposeMessageProps) => {
  const { physician, encounterId, subject: initialSubject, threadId } = route.params;
  const [subject, setSubject] = useState(initialSubject || '');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyboardShown, setKeyboardShown] = useState(false);
  
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    const keyboardDidShow = () => setKeyboardShown(true);
    const keyboardDidHide = () => setKeyboardShown(false);

    const showSubscription = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSend = async () => {
    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return;
    }
    if (!body.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }
  
    setSending(true);
    setError(null);
    
    try {
      await MessageService.createMessage({
        recipient_id: physician.user_id,
        subject: subject.trim(),
        body: body.trim(),
        thread_id: threadId,
        encounter_id: encounterId // Include encounter ID if it exists
      });
  
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Message</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <X size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: keyboardShown ? 120 : 20
        }}
      >
        {/* Recipient Display */}
        <View style={styles.recipientContainer}>
          <Text style={styles.label}>To:</Text>
          <View style={styles.recipientInfo}>
            <View style={styles.avatarContainer}>
              <User size={20} color="#666" />
            </View>
            <Text style={styles.recipientName}>
              Dr. {physician.user?.first_name} {physician.user?.last_name}
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Subject:</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="Enter subject"
            placeholderTextColor="#666"
          />
        </View>

        <View style={[styles.inputContainer, styles.messageContainer]}>
          <TextInput
            style={styles.messageInput}
            value={body}
            onChangeText={setBody}
            placeholder="Type your message here..."
            placeholderTextColor="#666"
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        <TouchableOpacity 
          style={[
            styles.sendButton,
            (sending || !subject.trim() || !body.trim()) && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={sending || !subject.trim() || !body.trim()}
        >
          {sending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Send size={20} color="#fff" />
              <Text style={styles.sendButtonText}>Send</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};