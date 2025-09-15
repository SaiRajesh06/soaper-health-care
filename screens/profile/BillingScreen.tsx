import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BillingStackParamList } from '../../types/navigation';
import { MainTabType, PaymentStatusType, Charge } from '../../types/billing';

const Stack = createNativeStackNavigator();

// Sample transaction data
const sampleCharges: Charge[] = [
  {
    id: '1',
    amount: 150.00,
    status: 'unpaid',
    created_at: '2024-01-31T18:55:00',
    physician: { last_name: 'Smith' },
    encounter: { encounter_type: 'OFFICE_VISIT' },
    description: 'Regular checkup'
  },
  {
    id: '2',
    amount: 275.50,
    status: 'unpaid',
    created_at: '2024-01-28T14:30:00',
    physician: { last_name: 'Johnson' },
    encounter: { encounter_type: 'SPECIALIST_VISIT' },
    description: 'Specialist consultation'
  },
  {
    id: '3',
    amount: 95.00,
    status: 'pending',
    created_at: '2024-01-25T11:15:00',
    physician: { last_name: 'Williams' },
    encounter: { encounter_type: 'FOLLOW_UP' },
    description: 'Follow-up visit'
  },
  {
    id: '4',
    amount: 180.00,
    status: 'pending',
    created_at: '2024-01-22T09:45:00',
    physician: { last_name: 'Davis' },
    encounter: { encounter_type: 'OFFICE_VISIT' },
    description: 'Annual physical'
  },
  {
    id: '5',
    amount: 320.00,
    status: 'paid',
    created_at: '2024-01-15T16:20:00',
    physician: { last_name: 'Brown' },
    encounter: { encounter_type: 'SPECIALIST_VISIT' },
    description: 'Specialist evaluation'
  },
  {
    id: '6',
    amount: 125.00,
    status: 'paid',
    created_at: '2024-01-10T13:40:00',
    physician: { last_name: 'Miller' },
    encounter: { encounter_type: 'FOLLOW_UP' },
    description: 'Follow-up consultation'
  }
];


// Transaction Card Component
const TransactionCard: React.FC<TransactionCardProps> = ({ charge, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatServiceType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <TouchableOpacity
      style={styles.chargeCard}
      onPress={() => onPress(charge)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.providerName}>
              Dr. {charge.physician?.last_name || 'undefined'}
            </Text>
            <Text style={styles.serviceType}>
              {formatServiceType(charge.encounter?.encounter_type || 'Office Visit')}
            </Text>
          </View>
         
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(charge.created_at)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.amountText}>${Number(charge.amount || 0).toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.viewDetails}>View Details →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Insurance Card Component
const InsuranceCard: React.FC<{ primary?: boolean }> = ({ primary = true }) => (
  <View style={styles.insuranceCard}>
    <View style={styles.insuranceHeader}>
      <Text style={styles.insuranceLabel}>
        {primary ? 'Primary Insurance' : 'Secondary Insurance'}
      </Text>
      <TouchableOpacity style={styles.insuranceAction}>
        <Text style={styles.insuranceActionText}>Update</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.insuranceContent}>
      <View style={styles.insuranceRow}>
        <Text style={styles.insuranceFieldLabel}>Provider</Text>
        <Text style={styles.insuranceFieldValue}>Blue Cross Blue Shield</Text>
      </View>
      <View style={styles.insuranceRow}>
        <Text style={styles.insuranceFieldLabel}>Member ID</Text>
        <Text style={styles.insuranceFieldValue}>XXXX-XXXX-XXXX</Text>
      </View>
      <View style={styles.insuranceRow}>
        <Text style={styles.insuranceFieldLabel}>Group Number</Text>
        <Text style={styles.insuranceFieldValue}>XXXXXX</Text>
      </View>
      <View style={styles.insuranceRow}>
        <Text style={styles.insuranceFieldLabel}>Plan Type</Text>
        <Text style={styles.insuranceFieldValue}>PPO</Text>
      </View>
    </View>
  </View>
);

// Main Screen Component
export default function BillingScreen() {
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>('transactions');
  const [paymentStatusTab, setPaymentStatusTab] = useState<PaymentStatusType>('unpaid');
  const [charges, setCharges] = useState<Charge[]>(sampleCharges);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<BillingStackParamList>>();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleChargePress = (charge: Charge) => {
    navigation.navigate('ChargeDetails', { charge });
  };

  const renderTransactions = () => {
    if (loading) {
      return <Text style={styles.messageText}>Loading charges...</Text>;
    }

    const filteredCharges = charges.filter(charge => charge.status === paymentStatusTab);

    if (filteredCharges.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No {paymentStatusTab} charges</Text>
          <Text style={styles.emptyStateText}>
            All your {paymentStatusTab} medical charges will appear here
          </Text>
        </View>
      );
    }

    return filteredCharges.map((charge) => (
      <TransactionCard
        key={charge.id}
        charge={charge}
        onPress={handleChargePress}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4B7A6B"
            colors={["#4B7A6B"]}
            progressBackgroundColor="#ffffff"
          />
        }
      >
       

        <View style={styles.tabContainer}>
          {['transactions', 'insurance'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeMainTab === tab && styles.activeTab]}
              onPress={() => setActiveMainTab(tab as MainTabType)}
            >
              <Text style={[styles.tabText, activeMainTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeMainTab === 'transactions' && (
          <View style={styles.section}>
            <View style={styles.statusTabContainer}>
              {['unpaid', 'pending', 'paid'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusTab,
                    paymentStatusTab === status && styles.activeStatusTab
                  ]}
                  onPress={() => setPaymentStatusTab(status as PaymentStatusType)}
                >
                  <Text
                    style={[
                      styles.statusTabText,
                      paymentStatusTab === status && styles.activeStatusTabText
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {renderTransactions()}
          </View>
        )}

        {activeMainTab === 'insurance' && (
          <View style={styles.section}>
            <InsuranceCard primary={true} />
            <View style={styles.divider} />
            <InsuranceCard primary={false} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4B7A6B',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4B7A6B', // green
    fontWeight: '600',
  },
  statusTabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  statusTab: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  activeStatusTab: {
    backgroundColor: '#4B7A6B',
  },
  statusTabText: {
    color: '#666666',
    fontWeight: '500',
  },
  activeStatusTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chargeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  providerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 15,
    color: '#666666',
  },
  cardDetails: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  amountText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  cardFooter: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  viewDetails: {
    fontSize: 14,
    color: '#4B7A6B',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusUnpaid: {
    backgroundColor: '#FEF2F2',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPaid: {
    backgroundColor: '#ECFDF5',
  },
  statusUnpaidText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },
  statusPendingText: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '500',
  },
  statusPaidText: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '500',
  },
  insuranceCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  insuranceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  insuranceLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  insuranceAction: {
    padding: 8,
  },
  insuranceActionText: {
    color: '#4B7A6B',
    fontSize: 14,
    fontWeight: '500',
  },
  insuranceContent: {
    padding: 16,
  },
  insuranceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  insuranceFieldLabel: {
    fontSize: 15,
    color: '#666666',
  },
  insuranceFieldValue: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F7FA',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
  },
  section: {
    flex: 1,
  },
  messageText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#666666',
    fontSize: 16,
  }
});

export default BillingScreen;