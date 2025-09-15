// src/components/messages/MessageListItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MessageResponse } from '../../types/message';
import { User } from 'lucide-react-native';
import { messageListStyles as styles } from './style';

interface MessageListItemProps {
  message: MessageResponse;
  onPress: (message: MessageResponse) => void;
}

export const MessageListItem = ({ message, onPress }: MessageListItemProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(message)}
      accessible={true}
      accessibilityLabel={`Message from doctor about ${message.subject}`}
      accessibilityHint="Double tap to read message"
    >
      {/* Left section - Sender Avatar/Icon */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarCircle}>
          <User size={20} color="#666" />
        </View>
      </View>

      {/* Middle section - Message Content */}
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.senderName} numberOfLines={1}>
            Dr. Smith {/* Replace with actual sender name */}
          </Text>
          <Text style={styles.date}>
            {formatDate(message.created_at)}
          </Text>
        </View>
        
        <Text style={styles.subject} numberOfLines={1}>
          {message.subject}
        </Text>
        
        <Text style={styles.preview} numberOfLines={2}>
          {message.body}
        </Text>
      </View>
    </TouchableOpacity>
  );
};