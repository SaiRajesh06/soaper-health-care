// src/components/profile/ProfileHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProfileHeaderProps {
  editing: boolean;
  onEditPress: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ editing, onEditPress }) => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      <Text style={styles.headerTitle}>My Profile</Text>
      <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
        <View style={styles.buttonContent}>
          {editing ? (
            <>
              <Icon name="check" size={20} color="#FF7E47" />
              <Text style={styles.buttonText}>Save Changes</Text>
            </>
          ) : (
            <>
              <Icon name="pencil" size={20} color="#FF7E47" />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
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
});