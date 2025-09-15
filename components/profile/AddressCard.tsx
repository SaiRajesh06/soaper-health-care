// src/components/profile/AddressCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Card } from '../ui/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';

interface AddressCardProps {
  editing: boolean;
  profileData: {
    address: {
      fullAddress: string;
      unit: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  onAddressSelect: (data: any, details: any) => void;
  onUnitChange: (unit: string) => void;
  googlePlacesApiKey: string;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  editing,
  profileData,
  onAddressSelect,
  onUnitChange,
  googlePlacesApiKey,
}) => (
  <Card style={[styles.card, editing && { zIndex: 1 }]}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Address</Text>
      <View style={styles.iconContainer}>
        <Icon name="map-marker" size={24} color="#FF7E47" />
      </View>
    </View>
    {editing ? (
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search for your address"
          onPress={onAddressSelect}
          fetchDetails={true}
          query={{
            key: googlePlacesApiKey,
            language: 'en',
            components: 'country:us',
          }}
          styles={{
            container: {
              flex: 0,
              marginBottom: 12,
            },
            textInput: {
              height: 44,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              fontSize: 16,
              color: '#0F172A',
              paddingHorizontal: 12,
            },
            listView: {
              position: 'absolute',
              top: 45,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              zIndex: 1000,
              elevation: 3,
            },
            row: {
              padding: 13,
              height: 44,
              flexDirection: 'row',
            },
            separator: {
              height: 0.5,
              backgroundColor: '#E5E7EB',
            },
            description: {
              fontSize: 14,
              color: '#0F172A',
            },
          }}
          enablePoweredByContainer={false}
          listViewDisplayed="auto"
          returnKeyType="search"
          minLength={2}
        />
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Apartment/Unit (Optional)</Text>
          <TextInput
            value={profileData.address.unit}
            onChangeText={onUnitChange}
            placeholder="Apt #, Unit #, etc."
            style={styles.input}
            selectTextOnFocus
          />
        </View>
      </View>
    ) : (
      <View style={styles.formGrid}>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Address</Text>
          <Text style={styles.fieldValue}>
            {profileData.address.fullAddress}
            {profileData.address.unit ? ` ${profileData.address.unit}` : ''}
          </Text>
        </View>
        <View style={styles.addressDetails}>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>City</Text>
            <Text style={styles.fieldValue}>{profileData.address.city}</Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>State</Text>
            <Text style={styles.fieldValue}>{profileData.address.state}</Text>
          </View>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>ZIP Code</Text>
            <Text style={styles.fieldValue}>{profileData.address.zipCode}</Text>
          </View>
        </View>
      </View>
    )}
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
  searchContainer: {
    position: 'relative',
    zIndex: 1000,
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
});