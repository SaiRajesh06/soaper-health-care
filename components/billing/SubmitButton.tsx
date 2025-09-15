import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addCardstyles } from './style';

interface SubmitButtonProps {
  loading: boolean;
  disabled: boolean;
  isPayment: boolean;
  amount?: number;
  onPress: () => void;
}

export const SubmitButton = ({
  loading,
  disabled,
  isPayment,
  amount,
  onPress
}: SubmitButtonProps) => (
  <TouchableOpacity
    style={[addCardstyles.saveButton, disabled && addCardstyles.saveButtonDisabled]}
    onPress={onPress}
    disabled={disabled}
  >
    {loading ? (
      <View style={addCardstyles.loadingContainer}>
        <Text style={addCardstyles.saveButtonText}>Processing...</Text>
      </View>
    ) : (
      <>
        <Icon
          name={isPayment ? "cash" : "content-save"}
          size={20}
          color="#FFFFFF"
          style={addCardstyles.saveIcon}
        />
        <Text style={addCardstyles.saveButtonText}>
          {isPayment ? `Pay $${amount?.toFixed(2)}` : 'Save Card'}
        </Text>
      </>
    )}
  </TouchableOpacity>
);