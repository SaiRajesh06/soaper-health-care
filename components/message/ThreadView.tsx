// src/components/messages/ThreadView.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MessageResponse } from '../../types/message';
import { threadStyles as styles } from './style';
import { User } from 'lucide-react-native';

interface ThreadViewProps {
  messages: MessageResponse[];
  currentUserId: string;
}

const ThreadMessage = ({ 
  message, 
  isCurrentUser, 
  showSender 
}: { 
  message: MessageResponse; 
  isCurrentUser: boolean;
  showSender: boolean;
}) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={[
      styles.messageContainer,
      isCurrentUser ? styles.sentMessage : styles.receivedMessage
    ]}>
      {showSender && (
        <View style={styles.senderContainer}>
          <View style={styles.senderInfo}>
            <User size={16} color="#666" style={styles.senderIcon} />
            <Text style={styles.senderName}>
              {isCurrentUser ? 'You' : 'Dr. Smith'} {/* Replace with actual name */}
            </Text>
          </View>
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        isCurrentUser ? styles.sentBubble : styles.receivedBubble
      ]}>
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.sentMessageText : styles.receivedMessageText
        ]}>
          {message.body}
        </Text>
        <Text style={styles.messageTime}>
          {formatTime(message.created_at)}
        </Text>
      </View>
    </View>
  );
};

export const ThreadView = ({ messages, currentUserId }: ThreadViewProps) => {
  const shouldShowSender = (index: number) => {
    if (index === 0) return true;
    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];
    return currentMessage.sender_id !== previousMessage.sender_id;
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {messages.map((message, index) => (
        <ThreadMessage
          key={message.id}
          message={message}
          isCurrentUser={message.sender_id === currentUserId}
          showSender={shouldShowSender(index)}
        />
      ))}
    </ScrollView>
  );
};

const additionalStyles = {
  contentContainer: {
    paddingVertical: 16,
  },
  senderContainer: {
    marginBottom: 4,
    paddingHorizontal: 12,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderIcon: {
    marginRight: 4,
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#000',
  }
};