// src/components/payment/PaymentButton.tsx
import React from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from './style';

interface PaymentButtonProps {
  amount: number;
  loading: boolean;
  onPress: () => void;
}

export const PaymentButton = ({ amount, loading, onPress }: PaymentButtonProps) => (
  <TouchableOpacity 
    style={[styles.payButton, loading && styles.payButtonDisabled]}
    onPress={onPress}
    disabled={loading}
    accessible={true}
    accessibilityLabel={loading ? "Processing payment" : `Pay ${amount.toFixed(2)} dollars`}
    accessibilityRole="button"
  >
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#FFF" />
        <Text style={[styles.payButtonText, styles.loadingText]}>
          Processing...
        </Text>
      </View>
    ) : (
      <>
        <Icon name="lock-outline" size={20} color="#FFF" />
        <Text style={styles.payButtonText}>
          Pay ${amount.toFixed(2)}
        </Text>
      </>
    )}
  </TouchableOpacity>
);