import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirebaseToken } from '../../config/firebase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BillingStackParamList } from '../../types/navigation';

const API_BASE_URL = process.env.API_BASE_URL;

interface Charge {
  id: string;
  charge_type: string;
  amount: number;
  due_date: string;
  status: string;
}

interface RouteParams {
  visitId: string;
  visitDate: string;
  visitType: string;
}

export default function VisitChargesScreen() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<BillingStackParamList>>();
  const route = useRoute();
  const { visitId, visitDate, visitType } = route.params as RouteParams;
  
  // Add mounted ref to prevent state updates after unmount
  const mounted = useRef(true);

  useEffect(() => {
    // Set up mounted ref
    mounted.current = true;

    fetchCharges();

    // Cleanup function
    return () => {
      mounted.current = false;
    };
  }, [visitId]);

  const fetchCharges = async () => {
    try {
      setLoading(true);
      const token = await getFirebaseToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/billing_charges/patient/visit/${visitId}/charges`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch charges: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Only update state if component is still mounted
      if (mounted.current) {
        setCharges(data);
        setError(null);
      }
    } catch (err) {
      // Only update state if component is still mounted
      if (mounted.current) {
        setError(err.message);
        console.error('Error fetching charges:', err);
      }
    } finally {
      // Only update state if component is still mounted
      if (mounted.current) {
        setLoading(false);
      }
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return styles.statusPaid;
      case 'pending':
        return styles.statusPending;
      default:
        return styles.statusUnpaid;
    }
  };

  const handleChargePress = (charge: Charge) => {
    navigation.navigate('Payment', { 
      chargeId: charge.id,
      amount: charge.amount,
      chargeType: charge.charge_type
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.visitInfo}>
        <Text style={styles.visitDate}>{formatDate(visitDate)}</Text>
        <Text style={styles.visitType}>{visitType}</Text>
      </View>

      <View style={styles.chargesContainer}>
        <Text style={styles.sectionTitle}>Charges</Text>
        {charges.length === 0 ? (
          <Text style={styles.noCharges}>No charges found for this visit</Text>
        ) : (
          charges.map((charge) => (
            <TouchableOpacity
              key={charge.id}
              style={styles.chargeItem}
              onPress={() => handleChargePress(charge)}
            >
              <View>
                <Text style={styles.chargeType}>{charge.charge_type}</Text>
                <Text style={[styles.chargeStatus, getStatusStyle(charge.status)]}>
                  {charge.status.toUpperCase()}
                </Text>
                {charge.due_date && (
                  <Text style={styles.dueDate}>
                    Due: {formatDate(charge.due_date)}
                  </Text>
                )}
              </View>
              <Text style={styles.amount}>${charge.amount}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    margin: 20,
  },
  visitInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  visitDate: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  visitType: {
    fontSize: 16,
    color: '#666',
  },
  chargesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  noCharges: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  chargeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chargeType: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  chargeStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusPaid: {
    color: '#2E7D32',
  },
  statusPending: {
    color: '#F9A825',
  },
  statusUnpaid: {
    color: '#D32F2F',
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
  },
});