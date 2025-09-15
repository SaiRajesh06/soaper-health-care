// src/screens/messages/MessageDetailScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity,
  TextInput,
  Keyboard,
  KeyboardEvent,
  Platform,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { User, Send } from 'lucide-react-native';
import { messageDetailStyles as styles } from '../../components/message/style';
import MessageService from '../../services/messageServices';
import { MessageResponse } from '../../types/message';
import { theme } from '../../theme/styles';
import { useAuth } from '../../hooks/useAuth';

type MessageDetailProps = NativeStackScreenProps<{
  MessageDetail: {
    messageId: string;
    threadId: string;
  };
}>;

export const MessageDetailScreen = ({ route, navigation }: MessageDetailProps) => {
  const { messageId, threadId } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyboardHeight] = useState(new Animated.Value(0));
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchMessages();

    const keyboardWillShow = (event: KeyboardEvent) => {
      setKeyboardVisible(true);
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }).start();
    };

    const keyboardWillHide = (event: KeyboardEvent) => {
      setKeyboardVisible(false);
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    };

    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      keyboardWillShow
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      keyboardWillHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await MessageService.getThreadMessages(threadId);
      setMessages(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || sending) return;

    setSending(true);
    try {
      const originalMessage = messages[0];
      await MessageService.createMessage({
        recipient_id: originalMessage.recipient_id,
        subject: `Re: ${originalMessage.subject}`,
        body: replyText.trim(),
        thread_id: threadId
      });

      setReplyText('');
      await fetchMessages();
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      console.error('Error sending reply:', err);
      setError(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isKeyboardVisible && event.nativeEvent.contentOffset.y < 0) {
      Keyboard.dismiss();
    }
  };

  const renderMessage = (message: MessageResponse, index: number) => {
    const isPatientMessage = message.sender_id === user?.uid;

    return (
      <View 
        key={message.id} 
        style={[
          styles.messageContainer,
          isPatientMessage ? styles.patientMessage : styles.physicianMessage
        ]}
      >
        <View style={styles.messageHeader}>
          <View style={[
            styles.senderContainer,
            isPatientMessage ? styles.patientSenderContainer : styles.physicianSenderContainer
          ]}>
            <View style={[
              styles.avatarContainer,
              isPatientMessage ? styles.patientAvatar : styles.physicianAvatar
            ]}>
              <User size={20} color={isPatientMessage ? "#666" : theme.colors.primary} />
            </View>
            <View style={styles.senderInfo}>
              <Text style={[
                styles.senderName,
                isPatientMessage ? styles.patientName : styles.physicianName
              ]}>
                {isPatientMessage ? 'You' : 'Emma'}
              </Text>
              <Text style={styles.timestamp}>
                {formatDate(message.created_at)}
              </Text>
            </View>
          </View>
          {index === 0 && (
            <Text style={styles.subject}>{message.subject}</Text>
          )}
        </View>
        <View style={[
          styles.messageBubble,
          isPatientMessage ? styles.patientBubble : styles.physicianBubble
        ]}>
          <Text style={[
            styles.messageBody,
            isPatientMessage ? styles.patientMessageText : styles.physicianMessageText
          ]}>
            {message.body}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchMessages}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {messages.map((message, index) => renderMessage(message, index))}
      </ScrollView>

      <Animated.View 
        style={[
          styles.replyContainer,
          {
            bottom: keyboardHeight,
          }
        ]}
      >
        <TextInput
          style={styles.replyInput}
          placeholder="Type your reply..."
          value={replyText}
          onChangeText={setReplyText}
          multiline
          maxHeight={80}
          onFocus={() => {
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!replyText.trim() || sending) && styles.sendButtonDisabled
          ]}
          onPress={handleSendReply}
          disabled={!replyText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Send size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};