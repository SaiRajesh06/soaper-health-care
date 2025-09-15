// src/screens/PaymentScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Alert, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BillingStackParamList } from '../../types/navigation';
import { SavedCard } from '../../types/billing';
import { processPaymentWithMethodId, fetchSavedCards } from '../../services/payment.service';
import { RouteParams } from '../../types/navigation';
import { PaymentSummary } from '../../components/billing/PaymentSummary';
import { SavedCard as SavedCardComponent } from '../../components/billing/SavedCard';
import { PaymentButton } from '../../components/billing/PaymentButton';
import { AddCardButton } from '../../components/billing/AddCardButton';
import { usePayment } from '../../hooks/usePayment';
import { styles } from '../../components/billing/style';

type NavigationProp = NativeStackScreenProps<BillingStackParamList, 'PaymentScreen'>['navigation'];

function PaymentScreen() {
  const {
    loading,
    savedCards,
    selectedCardId,
    handlePayWithSavedCard,
    setSelectedCardId,
    loadSavedCards
  } = usePayment();

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { chargeId, amount, chargeType } = route.params as RouteParams;

  const navigateToAddCard = () => {
    navigation.navigate('AddCard', {
      onCardAdded: loadSavedCards,
      chargeId,
      amount,
      chargeType
    });
  };

  if (loading && savedCards.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PaymentSummary amount={amount} chargeType={chargeType} />

        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          
          {savedCards.length > 0 ? (
            <FlatList
              data={savedCards}
              renderItem={({ item }) => (
                <SavedCardComponent
                  card={item}
                  isSelected={selectedCardId === item.id}
                  onSelect={setSelectedCardId}
                />
              )}
              keyExtractor={(item) => item.id}
              style={styles.cardList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noCardsContainer}>
              <Icon name="credit-card-off-outline" size={48} color="#666" />
              <Text style={styles.noCardsText}>No saved cards</Text>
            </View>
          )}

          <AddCardButton onPress={navigateToAddCard} />

          {selectedCardId && (
            <PaymentButton
              amount={amount}
              loading={loading}
              onPress={() => handlePayWithSavedCard(chargeId)}
            />
          )}
        </View>

        <View style={styles.securityNote}>
          <Icon name="shield-check-outline" size={16} color="#4CAF50" />
          <Text style={styles.securityText}>Secure payment</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default PaymentScreen;