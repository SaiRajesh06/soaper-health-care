import { StyleSheet } from 'react-native';

export const appointmentStyles = StyleSheet.create({
  // Shared Colors
  colors: {
    primary: '#527A6E', // iOS blue
    success: '#34C759', // iOS green
    warning: '#FF9500', // iOS orange
    danger: '#FF3B30', // iOS red
    gray: '#8E8E93', // iOS gray
    lightGray: '#F2F2F7', // iOS light gray
    white: '#FFFFFF',
    black: '#000000',
    separator: '#E5E5EA', // iOS separator color
  },
  // Shared Shadow
  shadowProps: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  // Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  // Text Styles
  heading: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  subheading: {
    fontSize: 12,
    color: '#666666',
  },
  body: {
    fontSize: 15,
    color: '#000000',
  },
  caption: {
    fontSize: 13,
    color: '#8E8E93',
  },
  // Button Styles
  primaryButton: {
    backgroundColor: '#557E71', // iOS Done
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#D7ECE5', // iOS light green
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#527A6E', //dark green
    fontSize: 15,
    fontWeight: '500',
  },
  tertiaryButton: {
    backgroundColor: '#D7ECE5', // iOS light green
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tertiaryButtonText: {
    color: '#527A6E', //dark green
    fontSize: 15,
    fontWeight: '500',
  },
  quaternaryButton: {
    backgroundColor: '#D7ECE5', // iOS light green
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quaternaryButtonText: {
    color: '#527A6E', //dark greeen
    fontSize: 15,
    fontWeight: '500',
  },
  // Badge Styles
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  // Layout Styles
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  // Modal Styles
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  // List Styles
  listSeparator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 16,
  },
  // Input Styles
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#000000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default appointmentStyles;
