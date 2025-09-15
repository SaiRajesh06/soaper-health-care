// src/components/payment/PaymentSummary.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './style';

interface PaymentSummaryProps {
  amount: number;
  chargeType: string;
}

export const PaymentSummary = ({ amount, chargeType }: PaymentSummaryProps) => (
  <View style={styles.summaryContainer}>
    <Text style={styles.summaryTitle}>Payment Amount</Text>
    <Text style={styles.amount}>${amount.toFixed(2)}</Text>
    <Text style={styles.chargeType}>{chargeType}</Text>
  </View>
);