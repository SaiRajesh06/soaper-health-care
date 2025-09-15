// src/components/messages/styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '../../theme/styles';

export const messageListStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  senderName: {
    fontSize: theme.typography.regular,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  date: {
    fontSize: theme.typography.small,
    color: '#666',
  },
  subject: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
    marginBottom: 2,
  },
  preview: {
    fontSize: theme.typography.small,
    color: '#666',
  },
});

export const threadStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    contentContainer: {
      paddingVertical: theme.spacing.md,
    },
    messageContainer: {
      marginVertical: theme.spacing.xs,
      marginHorizontal: theme.spacing.md,
    },
    sentMessage: {
      alignItems: 'flex-end',
    },
    receivedMessage: {
      alignItems: 'flex-start',
    },
    senderContainer: {
      marginBottom: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
    },
    senderInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    senderIcon: {
      marginRight: theme.spacing.xs,
    },
    senderName: {
      fontSize: theme.typography.small,
      color: '#666',
    },
    messageBubble: {
      maxWidth: '80%',
      padding: theme.spacing.sm,
      borderRadius: theme.spacing.sm,
      minWidth: 80,
    },
    sentBubble: {
      backgroundColor: theme.colors.primary,
      borderTopRightRadius: 4,
    },
    receivedBubble: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 4,
      borderWidth: 1,
      borderColor: '#E1E1E1',
    },
    messageText: {
      fontSize: theme.typography.regular,
      marginBottom: theme.spacing.xs,
    },
    sentMessageText: {
      color: '#fff',
    },
    receivedMessageText: {
      color: theme.colors.text,
    },
    messageTime: {
      fontSize: theme.typography.small,
      color: '#666',
      alignSelf: 'flex-end',
    },
  });
  

export const inboxStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    backgroundColor: '#F8F9FA',
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: theme.typography.regular,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.regular,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: theme.typography.regular,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.xs,
  },
  retryText: {
    color: '#fff',
    fontSize: theme.typography.regular,
  },
  composeButton: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});



export const composeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  headerTitle: {
    fontSize: theme.typography.large,
    color: theme.colors.text,
    fontWeight: '600',
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  label: {
    fontSize: theme.typography.small,
    color: '#666',
    marginBottom: theme.spacing.xs,
  },
  input: {
    fontSize: theme.typography.regular,
    color: theme.colors.text,
    padding: 0,
    minHeight: 40,
  },
  messageContainer: {
    flex: 1,
    borderBottomWidth: 0,
  },
  messageInput: {
    fontSize: theme.typography.regular,
    color: theme.colors.text,
    minHeight: 200,
    padding: 0,
    textAlignVertical: 'top',
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.small,
    marginBottom: theme.spacing.sm,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.xs,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: theme.typography.regular,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
});

export const recipientPickerStyles = StyleSheet.create({
  pickerButton: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: theme.spacing.xs,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  selectedRecipient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedRecipientInfo: {
    flex: 1,
  },
  selectedRecipientName: {
    fontSize: theme.typography.regular,
    color: theme.colors.text,
  },
  selectedRecipientRole: {
    fontSize: theme.typography.small,
    color: '#666',
  },
  placeholderText: {
    color: '#666',
    fontSize: theme.typography.regular,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.spacing.md,
    borderTopRightRadius: theme.spacing.md,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  modalTitle: {
    fontSize: theme.typography.large,
    color: theme.colors.text,
    fontWeight: '600',
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    backgroundColor: '#F8F9FA',
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.regular,
    color: theme.colors.text,
  },
  recipientItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  selectedItem: {
    backgroundColor: '#F0F9FF',
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: theme.typography.regular,
    color: theme.colors.text,
    marginBottom: 2,
  },
  recipientRole: {
    fontSize: theme.typography.small,
    color: '#666',
  },
  emptyText: {
    padding: theme.spacing.md,
    textAlign: 'center',
    color: '#666',
    fontSize: theme.typography.regular,
  },
});


export const messageDetailStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 50, // Height of reply container
  },

  // Loading and Error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.regular,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.xs,
  },
  retryText: {
    color: '#fff',
    fontSize: theme.typography.regular,
  },

  // Message Container and Layout
  messageContainer: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  patientMessage: {
    alignItems: 'flex-end',
  },
  physicianMessage: {
    alignItems: 'flex-start',
  },

  // Message Header
  messageHeader: {
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  senderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  patientSenderContainer: {
    flexDirection: 'row-reverse',
  },
  physicianSenderContainer: {
    flexDirection: 'row',
  },

  // Avatar
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientAvatar: {
    backgroundColor: '#E9ECEF',
  },
  physicianAvatar: {
    backgroundColor: '#E3F2FD',
  },

  // Sender Info
  senderInfo: {
    marginHorizontal: theme.spacing.sm,
  },
  senderName: {
    fontSize: theme.typography.regular,
    fontWeight: '500',
  },
  patientName: {
    textAlign: 'right',
    color: theme.colors.text,
  },
  physicianName: {
    color: theme.colors.primary,
  },
  timestamp: {
    fontSize: theme.typography.small,
    color: '#666',
    marginTop: 2,
  },

  // Subject
  subject: {
    fontSize: theme.typography.large,
    color: theme.colors.text,
    fontWeight: '600',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },

  // Message Bubble
  messageBubble: {
    maxWidth: '80%',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  patientBubble: {
    backgroundColor: theme.colors.primary,
    borderTopRightRadius: 0,
  },
  physicianBubble: {
    backgroundColor: '#F0F0F0',
    borderTopLeftRadius: 0,
  },
  messageBody: {
    fontSize: theme.typography.regular,
    lineHeight: 24,
  },
  patientMessageText: {
    color: '#FFFFFF',
  },
  physicianMessageText: {
    color: theme.colors.text,
  },

  // Reply Container
  replyContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
  },
  replyInput: {
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    fontSize: theme.typography.regular,
    maxHeight: 80,
    minHeight: 36,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  }
});

export const selectPhysicianStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.large,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  physicianItem: {
    backgroundColor: '#fff',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  physicianName: {
    fontSize: theme.typography.regular,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  specialty: {
    fontSize: theme.typography.small,
    color: '#666',
    marginBottom: theme.spacing.xs,
  },
  lastSeen: {
    fontSize: theme.typography.small,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.regular,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});