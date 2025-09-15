// src/screens/profile/ProfileScreen.tsx
import React, { useState, useRef } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PhoneInput from 'react-native-phone-number-input';

import {
  ProfileHeader,
  ProfileSummaryCard,
  PersonalInfoCard,
  AddressCard,
  EmergencyContactCard,
} from '../../components/profile';

import { ProfileData } from '../../components/profile/types';
import {
  GOOGLE_PLACES_API_KEY,
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  RELATIONSHIP_OPTIONS,
} from '../../components/profile/constants';

const ProfileScreen: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);
  const emergencyPhoneInput = useRef<PhoneInput>(null);

  const mockData: ProfileData = {
    fullName: 'John Doe',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Main St',
      unit: '',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      fullAddress: '123 Main St',
    },
    preferredLanguage: 'English',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '(555) 987-6543',
    },
  };

  const [profileData, setProfileData] = useState<ProfileData>(mockData);

  const handleEditPhoto = () => {
    setUploadingPhoto(true);
    setTimeout(() => setUploadingPhoto(false), 2000);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setProfileData((prev) => ({
        ...prev,
        dateOfBirth: formattedDate,
      }));
    }
  };

  const handleUnitChange = (unit: string) => {
    setProfileData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        unit,
      },
    }));
  };

  const handleAddressSelect = (data: any, details: any) => {
    // Extract initial components from the first response
    const { main_text, secondary_text } = data.structured_formatting;
    const secondaryParts = secondary_text.split(', ');
    
    let zipCode = '';
    let street = main_text;
    let city = '';
    let state = '';
    
    // Extract components from details
    if (details && details.address_components) {
      const addressComponents = details.address_components;
      
      // Find ZIP code
      const zipComponent = addressComponents.find(
        (component: any) => component.types.includes('postal_code')
      );
      if (zipComponent) {
        zipCode = zipComponent.long_name;
      }

      // Find city
      const cityComponent = addressComponents.find(
        (component: any) => component.types.includes('locality')
      );
      if (cityComponent) {
        city = cityComponent.long_name;
      }

      // Find state
      const stateComponent = addressComponents.find(
        (component: any) => component.types.includes('administrative_area_level_1')
      );
      if (stateComponent) {
        state = stateComponent.short_name;
      }

      // Get street number and route for complete street address
      const streetNumber = addressComponents.find(
        (component: any) => component.types.includes('street_number')
      )?.long_name;
      const route = addressComponents.find(
        (component: any) => component.types.includes('route')
      )?.long_name;
      if (streetNumber && route) {
        street = `${streetNumber} ${route}`;
      }
    }

    // Fallback to parsed secondary_text if needed
    if (!city && secondaryParts.length > 0) {
      city = secondaryParts[0];
    }
    if (!state && secondaryParts.length > 1) {
      state = secondaryParts[1];
    }

    const newAddress = {
      street,
      unit: profileData.address.unit, // Preserve existing unit
      city,
      state,
      zipCode,
      fullAddress: street
    };

    setProfileData((prev) => ({
      ...prev,
      address: newAddress
    }));
  };

  const handleInputChange = (id: string, value: string) => {
    if (id.startsWith('ec_')) {
      const field = id.replace('ec_', '');
      setProfileData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const personalFields = [
    {
      id: 'fullName',
      label: 'Full Name',
      value: profileData.fullName,
      type: 'text',
    },
    {
      id: 'dateOfBirth',
      label: 'Date of Birth',
      value: profileData.dateOfBirth,
      type: 'date',
    },
    {
      id: 'gender',
      label: 'Gender',
      value: profileData.gender,
      type: 'dropdown',
      options: GENDER_OPTIONS,
    },
    {
      id: 'preferredLanguage',
      label: 'Preferred Language',
      value: profileData.preferredLanguage,
      type: 'dropdown',
      options: LANGUAGE_OPTIONS,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader 
        editing={editing} 
        onEditPress={() => setEditing(!editing)} 
      />

      <ScrollView
        style={styles.scrollView}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <ProfileSummaryCard
            profileData={profileData}
            uploadingPhoto={uploadingPhoto}
            onEditPhoto={handleEditPhoto}
          />

          <PersonalInfoCard
            editing={editing}
            profileData={profileData}
            personalFields={personalFields}
            onInputChange={handleInputChange}
            phoneInput={phoneInput}
            onDatePress={() => setShowDatePicker(true)}
          />

          <AddressCard
            editing={editing}
            profileData={profileData}
            onAddressSelect={handleAddressSelect}
            onUnitChange={handleUnitChange}
            googlePlacesApiKey={GOOGLE_PLACES_API_KEY}
          />

          <EmergencyContactCard
            editing={editing}
            profileData={profileData}
            relationshipOptions={RELATIONSHIP_OPTIONS}
            onInputChange={handleInputChange}
            emergencyPhoneInput={emergencyPhoneInput}
          />
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(profileData.dateOfBirth)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});

export default ProfileScreen;