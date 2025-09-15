// src/screens/profile/InsuranceScreen.tsx

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Plus, Shield, User, ChevronRight } from 'lucide-react-native';
import { sharedStyles } from '../../theme/styles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InsuranceStackParamList } from '../../navigation/InsuranceStackNavigator';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// Color palette
const colors = {
  primary: '#0A5F2C',
  secondary: '#4B7A6B',
  accent: '#20C997',
  success: '#28A745',
  iconColor: '#FF7E47',
  lightGreen: '#E7F5EE',
  background: '#F8FAF9',
  white: '#FFFFFF',
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    light: '#888888'
  }
};

interface InsuranceCard {
  id: string;
  provider: string;
  policyNumber: string;
  type: 'Primary' | 'Secondary';
  groupNumber: string;
  memberName: string;
  status: 'Active';
  expiryDate: string;
}

type InsuranceScreenProps = NativeStackScreenProps<InsuranceStackParamList, 'InsuranceMain'>;

type DisplayableInsurance = InsuranceCard | BackendInsuranceCard;

const API_BASE_URL = process.env.API_BASE_URL;

const mockInsurances: InsuranceCard[] = [
  {
    id: '1',
    provider: 'Blue Cross Blue Shield',
    policyNumber: 'XXX-YYY-ZZZ',
    type: 'Primary',
    groupNumber: '123456',
    memberName: 'John Smith',
    status: 'Active',
    expiryDate: '12/2025',
  },
  {
    id: '2',
    provider: 'Aetna',
    policyNumber: 'AAA-BBB-CCC',
    type: 'Secondary',
    groupNumber: '789012',
    memberName: 'John Smith',
    status: 'Active',
    expiryDate: '12/2025',
  },
];

const InsuranceCardItem = ({ insurance }: { insurance: InsuranceCard }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.headerRow}>
        <View style={styles.providerSection}>
          <Shield color={colors.iconColor} size={24} strokeWidth={1.5} />
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{insurance.provider}</Text>
          </View>
        </View>
        <Text style={[styles.typeText]}>
          {insurance.type}
        </Text>
      </View>
      
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={[styles.infoColumn, { marginRight: 16 }]}>
            <Text style={styles.label}>Policy Number</Text>
            <Text style={styles.value}>{insurance.policyNumber}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.label}>Group Number</Text>
            <Text style={styles.value}>{insurance.groupNumber}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.memberInfo}>
          <User size={16} color={colors.text.secondary} />
          <Text style={styles.memberText}>{insurance.memberName}</Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.expiryText}>Expires {insurance.expiryDate}</Text>
          <ChevronRight size={20} color={colors.text.light} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function InsuranceScreen({ navigation }: InsuranceScreenProps) {
  const [insurances, setInsurances] = useState<InsuranceCard[]>(mockInsurances);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useFocusEffect(
    React.useCallback(() => {
      const loadInsurances = async () => {
        try {
          setLoading(true);
          await new Promise(resolve => setTimeout(resolve, 1000));
          setInsurances(mockInsurances);
        } catch (err) {
          setError('Could not load insurance information. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      loadInsurances();
    }, [])
  );

  const handleAddInsurance = () => {
    navigation.navigate('CameraScreen', {
      type: 'insurance',
      onCapture: (savedInsurance: InsuranceCard) => {
        setInsurances(prev => [...prev, savedInsurance]);
      },
    });
  };

  return (
    <SafeAreaView style={[sharedStyles.container, styles.container]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.secondary} />
            <Text style={styles.loadingText}>Loading your insurance cards...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : insurances.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No insurance cards added yet
            </Text>
          </View>
        ) : (
          insurances.map((insurance) => (
            <InsuranceCardItem key={insurance.id} insurance={insurance} />
          ))
        )}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handleAddInsurance}
        activeOpacity={0.9}
      >
        <Plus color={colors.white} size={20} />
        <Text style={styles.addButtonText}>Add New Card</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingVertical: 12,
    width: '100%',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  providerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerInfo: {
    marginLeft: 10,
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondary,
    textAlign: 'right',
    minWidth: 80, // Ensures consistent alignment
  },
  infoSection: {
    marginBottom: 16,
    paddingRight: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  infoColumn: {
    flex: 1,
    paddingLeft: 24,
  },
  infoColumnRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 4,
    textAlign: 'left',
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'left',
    letterSpacing: 0.2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  memberText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginLeft: 5,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  expiryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: colors.secondary,
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.text.secondary,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});