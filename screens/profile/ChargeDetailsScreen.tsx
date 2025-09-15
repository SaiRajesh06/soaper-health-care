// src/screens/ChargeDetailsScreen.tsx
import React from 'react';
import { ScrollView, View, Text, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { BillingStackParamList } from '../../types/navigation';
import { usePaymentPlatform } from '../../hooks/usePaymentPlatform';
import { ChargeDetailsRouteParams } from '../../types/navigation';
import { styles } from '../../components/billing/style';
import { formatCurrency } from '../../utils/formatters';

import { StatusBadge } from '../../components/billing/StatusBadge';
import { ChargeInfo } from '../../components/billing/ChargeInfo';
import { EncounterInfo } from '../../components/billing/EncounterInfo';
import { PaymentOptions } from '../../components/billing/PaymentOptions';

type ChargeDetailsRouteProp = RouteProp<{ ChargeDetails: ChargeDetailsRouteParams }, 'ChargeDetails'>;

export default function ChargeDetailsScreen() {
  const route = useRoute<ChargeDetailsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<BillingStackParamList>>();
  const { charge } = route.params;
  
  const {
    loading,
    isApplePaySupported,
    isGooglePaySupported,
    handleApplePay,
    handleGooglePay
  } = usePaymentPlatform(charge);

  const handlePayNow = () => {
    navigation.navigate('PaymentScreen', {
      chargeId: charge.id,
      amount: charge.amount,
      chargeType: charge.description
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerAmount}>{formatCurrency(charge.amount)}</Text>
          <StatusBadge status={charge.status} />
        </View>

        <ChargeInfo
          description={charge.description}
          createdAt={charge.created_at}
        />

        {charge.encounter && (
          <View style={styles.card}>
            <EncounterInfo encounter={charge.encounter} />
          </View>
        )}

        {charge.status === 'unpaid' && (
          <PaymentOptions
            isApplePaySupported={isApplePaySupported}
            isGooglePaySupported={isGooglePaySupported}
            onApplePay={handleApplePay}
            onGooglePay={handleGooglePay}
            onCardPay={handlePayNow}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}