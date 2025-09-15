// src/components/profile/EmergencyContactCard.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from '../ui/Dropdown';
import PhoneInput from 'react-native-phone-number-input';

interface EmergencyContactCardProps {
  editing: boolean;
  profileData: {
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  relationshipOptions: string[];
  onInputChange: (id: string, value: string) => void;
  emergencyPhoneInput: React.RefObject<PhoneInput>;
}

export const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  editing,
  profileData,
  relationshipOptions,
  onInputChange,
  emergencyPhoneInput,
}) => (
  <Card style={styles.card}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Emergency Contact</Text>
      <View style={styles.iconContainer}>
        <Icon name="heart-outline" size={24} color="#FF7E47" />
      </View>
    </View>
    <View style={styles.formGrid}>
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Name</Text>
        {editing ? (
          <TextInput
            value={profileData.emergencyContact.name}
            onChangeText={(value) => onInputChange('ec_name', value)}
            style={styles.input}
            selectTextOnFocus
          />
        ) : (
          <Text style={styles.fieldValue}>{profileData.emergencyContact.name}</Text>
        )}
      </View>
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Relationship</Text>
        {editing ? (
          <Dropdown
            options={relationshipOptions}
            defaultValue={profileData.emergencyContact.relationship}
            onSelect={(index: number, value: string) => onInputChange('ec_relationship', value)}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
          />
        ) : (
          <Text style={styles.fieldValue}>{profileData.emergencyContact.relationship}</Text>
        )}
      </View>
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Phone</Text>
        {editing ? (
          <PhoneInput
            ref={emergencyPhoneInput}
            defaultValue={profileData.emergencyContact.phone}
            defaultCode="US"
            layout="first"
            onChangeFormattedText={(text) => onInputChange('ec_phone', text)}
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.phoneInputText}
            countryPickerProps={{}}
          />
        ) : (
          <Text style={styles.fieldValue}>{profileData.emergencyContact.phone}</Text>
        )}
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
  iconContainer: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
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
});