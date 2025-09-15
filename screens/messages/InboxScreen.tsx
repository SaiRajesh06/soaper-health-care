// src/screens/messages/InboxScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MessageListItem } from '../../components/message/messageListItem';
import { MessageResponse } from '../../types/message';
import MessageService from '../../services/messageServices';
import { Plus, Search } from 'lucide-react-native';
import { TouchableOpacity, TextInput } from 'react-native';
import { inboxStyles as styles } from '../../components/message/style';
import { theme } from '../../theme/styles';
import { useAuth } from '../../hooks/useAuth';

export const InboxScreen = () => {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const fetchMessages = async () => {
    try {
      const response = await MessageService.getInbox();
      setMessages(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchMessages();
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMessages().finally(() => setLoading(false));
  }, []);

  const handleMessagePress = (message: MessageResponse) => {
    navigation.navigate('MessageDetail', {
      messageId: message.id,
      threadId: message.thread_id,
    });
  };

  const handleComposePress = () => {
    navigation.navigate('SelectionFlow', {
      screen: 'SelectPhysician'
    });
  };
  const filteredMessages = messages.filter(message => 
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={onRefresh}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageListItem
            message={item}
            onPress={handleMessagePress}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No messages found' : 'No messages yet'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.composeButton}
        onPress={handleComposePress}
        accessible={true}
        accessibilityLabel="Compose new message"
        accessibilityHint="Double tap to write a new message"
      >
        <Plus color="#fff" size={24} />
      </TouchableOpacity>
    </View>
  );
};