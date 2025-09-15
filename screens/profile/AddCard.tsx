import React from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BillingStackParamList } from '../../types/navigation';
import { useAddCard } from '../../hooks/useAddCard';
import { addCardstyles } from '../../components/billing/style';

import { CardInput } from '../../components/billing/CardInput';
import { SaveCardCheckbox } from '../../components/billing/SaveCardCheckbox';
import { SubmitButton } from '../../components/billing/SubmitButton';
import { SecurityNote } from '../../components/billing/SecurityNote';

type AddCardScreenRouteProp = NativeStackScreenProps<BillingStackParamList, 'AddCard'>['route'];
type AddCardScreenNavigationProp = NativeStackScreenProps<BillingStackParamList, 'AddCard'>['navigation'];

function AddCardScreen() {
  const navigation = useNavigation<AddCardScreenNavigationProp>();
  const route = useRoute<AddCardScreenRouteProp>();
  const { onCardAdded, chargeId, amount, chargeType } = route.params || {};

  const handleNavigateAfterSuccess = () => {
    if (onCardAdded) {
      onCardAdded();
    }
    navigation.popToTop();
    navigation.reset({
      index: 0,
      routes: [{ name: 'BillingList' }]
    });
  };

  const {
    cardDetails,
    loading,
    saveCard,
    setCardDetails,
    setSaveCard,
    handlePayment,
    handleSaveCard
  } = useAddCard(handleNavigateAfterSuccess, chargeId);

  return (
    <SafeAreaView style={addCardstyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={addCardstyles.container}>
        <CardInput onCardChange={setCardDetails} />
        
        {chargeId && (
          <SaveCardCheckbox 
            saveCard={saveCard}
            onToggle={() => setSaveCard(!saveCard)}
          />
        )}

        <SubmitButton
          loading={loading}
          disabled={!cardDetails?.complete || loading}
          isPayment={!!chargeId}
          amount={amount}
          onPress={chargeId ? handlePayment : handleSaveCard}
        />

        <SecurityNote />
      </View>
    </SafeAreaView>
  );
}

export default AddCardScreen;