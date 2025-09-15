// src/components/profile/styles.ts

import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 1,
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1FDF7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FF7E47',
    marginLeft: 8,
    fontWeight: '500',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  photoContainer: {
    position: 'relative',
  },
  photoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploading: {
    opacity: 0.7,
  },
  loadingSpinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#FF7E47',
    borderTopColor: 'transparent',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileSummary: {
    flexDirection: 'row',
    gap: 16,
  },
  profileInfo: {
    flex: 1,
    marginTop: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  patientId: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginRight: 8,
  },
  contactText: {
    color: '#64748B',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  formGrid: {
    gap: 16,
  },
  formField: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#0F172A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    color: '#0F172A',
  },
  addressDetails: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  googlePlacesContainer: {
    position: 'relative',
    zIndex: 1,
    minHeight: 50,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#0F172A',
  },
  phoneInputContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  phoneInputText: {
    backgroundColor: 'transparent',
  },
  disabledInput: {
    color: '#0F172A',
    fontSize: 16,
  },
});