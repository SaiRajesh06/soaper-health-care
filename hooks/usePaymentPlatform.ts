import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BillingStackParamList } from '../types/navigation';
import { 
  isPlatformPaySupported, 
  usePlatformPay,
  PlatformPay
} from '@stripe/stripe-react-native';
import { processPaymentWithMethodId } from '../services/payment.service';

export const usePaymentPlatform = (charge: {
  id: string;
  amount: number;
  description: string;
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<BillingStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);
  const [isGooglePaySupported, setIsGooglePaySupported] = useState(false);
  const { createPlatformPayPaymentMethod } = usePlatformPay();

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

  const handlePaymentError = (error: any) => {
    Alert.alert('Error', error.message || 'Payment failed');
  };
  const checkPlatformPaySupport = async () => {
    console.log('Current Platform:', Platform.OS);
    console.log('Checking Platform Pay Support...');
    
    if (Platform.OS === 'ios') {
      try {
        const isSupported = await isPlatformPaySupported();
        console.log('Apple Pay Support Check Result:', isSupported);
        setIsApplePaySupported(isSupported);
        
        if (isSupported) {
          console.log('Apple Pay is supported');
        } else {
          console.log('Apple Pay is not supported');
        }
      } catch (error) {
        console.error('Error checking Apple Pay support:', error);
        setIsApplePaySupported(false);
      }
    } else if (Platform.OS === 'android') {
      try {
        const googlePaySupported = await isPlatformPaySupported({ 
          googlePay: { testEnv: true } 
        });
        setIsGooglePaySupported(googlePaySupported);
        console.log('Google Pay Support:', googlePaySupported);
      } catch (error) {
        console.error('Error checking Google Pay support:', error);
        setIsGooglePaySupported(false);
      }
    }
  };

  
  const handleApplePay = async () => {
    setLoading(true);
    try {
      const { error, paymentMethod } = await createPlatformPayPaymentMethod({
        applePay: {
          cartItems: [
            {
              label: charge.description || 'Charge',
              amount: charge.amount.toString(),
              paymentType: PlatformPay.PaymentType.Immediate,
            }
          ],
          merchantCountryCode: 'US',
          currencyCode: 'USD',
        },
      });

      if (error) {
        handlePaymentError(error);
        return;
      }
  
      if (paymentMethod) {
        const result = await processPaymentWithMethodId(charge.id, paymentMethod.id);
        if (result.payment_intent_id && result.client_secret) {
          handlePaymentSuccess();
        } else {
          handlePaymentError(new Error(result.error || 'Payment failed'));
        }
      }
    } catch (err) {
      handlePaymentError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePay = async () => {
    setLoading(true);
    try {
      const { error, paymentMethod } = await createPlatformPayPaymentMethod({
        googlePay: {
          testEnv: true,
          amount: charge.amount * 100,
          currencyCode: 'USD',
          merchantName: 'EMR Patient App',
          merchantCountryCode: 'US',
          billingAddressConfig: {
            format: 'Full',
            isPhoneNumberRequired: true,
            isRequired: true,
          },
        },
      });
  
      if (error) {
        handlePaymentError(error);
        return;
      }
  
      if (paymentMethod) {
        const result = await processPaymentWithMethodId(charge.id, paymentMethod.id);
        if (result.payment_intent_id && result.client_secret) {
          handlePaymentSuccess();
        } else {
          handlePaymentError(new Error(result.error || 'Payment failed'));
        }
      }
    } catch (err) {
      handlePaymentError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkPlatformPaySupport();
  }, []);

  return {
    loading,
    isApplePaySupported,
    isGooglePaySupported,
    handleApplePay,
    handleGooglePay
  };
};
