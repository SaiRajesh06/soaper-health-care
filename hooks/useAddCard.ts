// src/hooks/useAddCard.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { getFirebaseToken } from '../config/firebase';
import { processPaymentWithMethodId } from '../services/payment.service';

const API_BASE_URL = process.env.API_BASE_URL

export const useAddCard = (onSuccess: () => void, chargeId?: string) => {
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const { confirmSetupIntent, createPaymentMethod } = useStripe();

  const handlePayment = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please complete card details');
      return;
    }

    setLoading(true);
    try {
      if (saveCard) {
        // When saving card and making payment, use setupIntent
        const token = await getFirebaseToken();
        const setupResponse = await fetch(`${API_BASE_URL}/api/v1/stripe_cards/setup-intent`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const setupData = await setupResponse.json();
        
        if (!setupResponse.ok) {
          throw new Error(setupData.detail || 'Failed to initialize card setup');
        }

        const { setupIntent, error: setupError } = await confirmSetupIntent(
          setupData.client_secret,
          {
            paymentMethodType: 'Card',
            paymentMethodData: {
              billingDetails: {
                name: 'Test User',
                email: 'test@example.com',
              },
            },
          }
        );

        if (setupError) {
          throw new Error(setupError.message);
        }

        if (chargeId && setupIntent?.paymentMethodId) {
          const result = await processPaymentWithMethodId(chargeId, setupIntent.paymentMethodId);
          if (result.payment_intent_id && result.client_secret) {
            Alert.alert('Success', 'Card saved and payment processed successfully', [
              {
                text: 'OK',
                onPress: onSuccess
              }
            ]);
          } else {
            throw new Error(result.error || 'Payment failed');
          }
        }
      } else {
        // Direct payment without saving card
        await processDirectPayment();
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const processDirectPayment = async () => {
    const { paymentMethod, error } = await createPaymentMethod({
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (paymentMethod?.id && chargeId) {
      const result = await processPaymentWithMethodId(chargeId, paymentMethod.id);
      if (result.payment_intent_id && result.client_secret) {
        Alert.alert('Success', 'Payment processed successfully', [
          {
            text: 'OK',
            onPress: onSuccess
          }
        ]);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    }
  };

  const handleSaveCard = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please complete card details');
      return;
    }

    try {
      const token = await getFirebaseToken();
      const setupResponse = await fetch(`${API_BASE_URL}/api/v1/stripe_cards/setup-intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const setupData = await setupResponse.json();
      
      if (!setupResponse.ok) {
        throw new Error(setupData.detail || 'Failed to initialize card setup');
      }

      const { setupIntent, error: setupError } = await confirmSetupIntent(
        setupData.client_secret,
        {
          paymentMethodType: 'Card',
          paymentMethodData: {
            billingDetails: {
              name: 'Test User',
              email: 'test@example.com',
            },
          },
        }
      );

      if (setupError) {
        throw new Error(setupError.message);
      }

      if (chargeId && setupIntent?.paymentMethodId) {
        await processPaymentWithMethodId(chargeId, setupIntent.paymentMethodId);
      }

      Alert.alert('Success', 'Card saved successfully', [
        {
          text: 'OK',
          onPress: onSuccess
        }
      ]);

    } catch (err) {
      throw new Error(err.message || 'Failed to save card');
    }
  };

  return {
    cardDetails,
    loading,
    saveCard,
    setCardDetails,
    setSaveCard,
    handlePayment,
    handleSaveCard
  };
};