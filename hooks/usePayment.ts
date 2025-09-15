// src/hooks/usePayment.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SavedCard } from '../types/billing';
import { processPaymentWithMethodId, fetchSavedCards } from '../services/payment.service';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadSavedCards();
  }, []);

  const loadSavedCards = async () => {
    try {
      setLoading(true);
      const cards = await fetchSavedCards();
      setSavedCards(cards || []);
    } catch (error) {
      console.error('Error loading cards:', error);
      Alert.alert('Error', 'Failed to load saved cards');
      setSavedCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    Alert.alert('Success', 'Payment processed successfully', [
      {
        text: 'OK',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'BillingList' }]
          });
        }
      }
    ]);
  };

  const handlePaymentError = (error: Error) => {
    Alert.alert('Error', error.message || 'Payment failed');
  };

  const handlePayWithSavedCard = async (chargeId: string) => {
    if (!selectedCardId) {
      Alert.alert('Error', 'Please select a card');
      return;
    }

    setLoading(true);
    try {
      const result = await processPaymentWithMethodId(chargeId, selectedCardId);
      if (result.payment_intent_id && result.client_secret) {
        handlePaymentSuccess();
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error) {
      handlePaymentError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    savedCards,
    selectedCardId,
    setSelectedCardId,
    handlePayWithSavedCard,
    loadSavedCards
  };
};