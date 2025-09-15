// src/components/profile/PersonalInfoCard.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Card } from '../ui/Card';
import { Dropdown } from '../ui/Dropdown';
import PhoneInput from 'react-native-phone-number-input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface PersonalFieldType {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'date' | 'dropdown';
  options?: string[];
}

interface PersonalInfoCardProps {
  editing: boolean;
  profileData: {
    phone: string;
  };
  personalFields: PersonalFieldType[];
  onInputChange: (id: string, value: string) => void;
  phoneInput: React.RefObject<PhoneInput>;
  onDatePress: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const renderPersonalField = (
  field: PersonalFieldType,
  editing: boolean,
  onInputChange: (id: string, value: string) => void,
  onDatePress: () => void
) => {
  switch (field.type) {
    case 'date':
      return editing ? (
        <TouchableOpacity
          onPress={onDatePress}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>{formatDate(field.value)}</Text>
          <Icon name="calendar" size={20} color="#64748B" />
        </TouchableOpacity>
      ) : (
        <Text style={styles.fieldValue}>{formatDate(field.value)}</Text>
      );

    case 'dropdown':
      return editing ? (
        <Dropdown
          options={field.options || []}
          defaultValue={field.value}
          onSelect={(index: number, value: string) => onInputChange(field.id, value)}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
        />
      ) : (
        <Text style={styles.fieldValue}>{field.value}</Text>
      );

    default:
      return editing ? (
        <TextInput
          value={field.value}
          onChangeText={(value) => onInputChange(field.id, value)}
          style={styles.input}
          selectTextOnFocus
        />
      ) : (
        <Text style={styles.fieldValue}>{field.value}</Text>
      );
  }
};

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  editing,
  profileData,
  personalFields,
  onInputChange,
  phoneInput,
  onDatePress,
}) => (
  <Card style={styles.card}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.iconContainer}>
        <Icon name="account-details" size={24} color="#FF7E47" />
      </View>
    </View>
    <View style={styles.formGrid}>
      {personalFields.map((field) => (
        <View key={field.id} style={styles.formField}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          {renderPersonalField(field, editing, onInputChange, onDatePress)}
        </View>
      ))}
      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Phone Number</Text>
        {editing ? (
          <PhoneInput
            ref={phoneInput}
            defaultValue={profileData.phone}
            defaultCode="US"
            layout="first"
            onChangeFormattedText={(text) => onInputChange('phone', text)}
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.phoneInputText}
            countryPickerProps={{}}
          />
        ) : (
          <Text style={styles.fieldValue}>{profileData.phone}</Text>
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
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  datePickerText: {
    fontSize: 16,
    color: '#0F172A',
  },
});