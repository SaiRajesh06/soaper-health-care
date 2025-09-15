// src/components/charge-details/PaymentOptions.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PlatformPayButton, PlatformPay } from '@stripe/stripe-react-native';
import { styles } from './style';

interface PaymentOptionsProps {
  isApplePaySupported: boolean;
  isGooglePaySupported: boolean;
  onApplePay: () => void;
  onGooglePay: () => void;
  onCardPay: () => void;
}

export const PaymentOptions = ({
  isApplePaySupported,
  isGooglePaySupported,
  onApplePay,
  onGooglePay,
  onCardPay,
}: PaymentOptionsProps) => (
  <View style={styles.paymentOptions}>
    {isApplePaySupported && (
      <PlatformPayButton
        onPress={onApplePay}
        type={PlatformPay.ButtonType.Pay}
        appearance={PlatformPay.ButtonStyle.Black}
        style={styles.platformPayButton}
      />
    )}
    {isGooglePaySupported && (
      <PlatformPayButton
        onPress={onGooglePay}
        type={PlatformPay.ButtonType.Pay}
        style={styles.platformPayButton}
      />
    )}
    <Text style={styles.orText}>or</Text>
    <TouchableOpacity
      style={styles.payButton}
      onPress={onCardPay}
      activeOpacity={0.8}
    >
      <Text style={styles.payButtonText}>Pay with Card</Text>
    </TouchableOpacity>
  </View>
);