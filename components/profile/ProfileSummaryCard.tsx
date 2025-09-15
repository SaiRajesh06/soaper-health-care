// src/components/profile/ProfileSummaryCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from '../ui/Card';  // Changed from default import to named import
import { ProfilePhoto } from './ProfilePhoto';

interface ProfileSummaryCardProps {
  profileData: {
    fullName: string;
    email: string;
    phone: string;
  };
  uploadingPhoto: boolean;
  onEditPhoto: () => void;
}

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  profileData,
  uploadingPhoto,
  onEditPhoto,
}) => (
  <Card style={styles.card}>
    <View style={styles.profileSummary}>
      <ProfilePhoto uploadingPhoto={uploadingPhoto} onEditPhoto={onEditPhoto} />
      <View style={styles.profileInfo}>
        <View>
          <Text style={styles.profileName}>{profileData.fullName}</Text>
          <Text style={styles.patientId}>Patient ID: #12345</Text>
        </View>
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <View style={styles.iconContainer}>
              <Icon name="email-outline" size={20} color="#FF7E47" />
            </View>
            <Text style={styles.contactText}>{profileData.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <View style={styles.iconContainer}>
              <Icon name="phone" size={20} color="#FF7E47" />
            </View>
            <Text style={styles.contactText}>{profileData.phone}</Text>
          </View>
        </View>
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
});