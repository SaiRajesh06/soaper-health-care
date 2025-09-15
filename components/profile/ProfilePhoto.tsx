// src/components/profile/ProfilePhoto.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProfilePhotoProps {
  uploadingPhoto: boolean;
  onEditPhoto: () => void;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ uploadingPhoto, onEditPhoto }) => (
  <View style={styles.photoContainer}>
    <View style={[styles.photoCircle, uploadingPhoto && styles.uploading]}>
      {uploadingPhoto ? (
        <View style={styles.loadingSpinner} />
      ) : (
        <Icon name="account" size={40} color="#FF7E47" />
      )}
    </View>
    <TouchableOpacity onPress={onEditPhoto} style={styles.editPhotoButton}>
      <Icon name="camera" size={16} color="#FF7E47" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
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
});