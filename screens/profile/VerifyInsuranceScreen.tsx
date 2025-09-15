// src/screens/profile/VerifyInsuranceScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { InsuranceStackParamList } from '../../navigation/InsuranceStackNavigator';
import { InsuranceCard } from '../../types/insurance';
import { InsuranceService } from '../../services/InsuranceService';
import { Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme, sharedStyles } from '../../theme/styles';

type VerifyInsuranceScreenProps = NativeStackScreenProps<InsuranceStackParamList, 'VerifyInsurance'>;

export default function VerifyInsuranceScreen({ navigation, route }: VerifyInsuranceScreenProps) {
  const initialData = route.params?.insuranceData || {};
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<InsuranceCard, 'id'>>({
    provider: '',
    policyNumber: '',
    type: '',
    groupNumber: '',
    memberName: '',
    policyHolderDOB: '',
    expirationDate: '',
    copayInfo: '',
  });
  const [step, setStep] = useState(1);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (route.params?.insuranceData) {
      const data = route.params.insuranceData;
      setFormData({
        provider: data.provider || data.insuranceCompany || '',
        policyNumber: data.memberId || '',
        type: data.insuranceType || '',
        groupNumber: data.groupNumber || '',
        memberName: data.memberName || '',
        policyHolderDOB: data.policyHolderDOB || '',
        expirationDate: data.expirationDate || '',
        copayInfo: '',
      });
    }
  }, [route.params?.insuranceData]);

  useEffect(() => {
    validateStep(step);
  }, [formData, step]);

  const validateStep = (currentStep: number) => {
    let valid = false;
    switch (currentStep) {
      case 1:
        valid = !!formData.provider && !!formData.type && !!formData.policyNumber;
        break;
      case 2:
        valid = !!formData.memberName && !!formData.policyHolderDOB;
        break;
      case 3:
        valid = !!formData.groupNumber && !!formData.expirationDate;
        break;
    }
    setIsValid(valid);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const createdInsurance = await InsuranceService.createInsurance(formData);
      
      if (route.params?.onSave) {
        route.params.onSave(createdInsurance);
      }
  
      Alert.alert(
        'Success',
        'Insurance information saved successfully',
        [{ text: 'OK', onPress: () => navigation.navigate('InsuranceMain') }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to save insurance information'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${(step / 3) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Step {step} of 3</Text>
    </View>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Icon name="description" size={24} color={theme.colors.secondary} />
              <Text style={styles.stepTitle}>Insurance Details</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Insurance Provider</Text>
              <TextInput
                style={styles.inputEnhanced}
                value={formData.provider}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, provider: text }))}
                placeholder="Ex: Blue Cross Blue Shield"
                placeholderTextColor={theme.colors.input.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Policy Number</Text>
              <TextInput
                style={styles.inputEnhanced}
                value={formData.policyNumber}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, policyNumber: text }))}
                placeholder="Ex: XXX-YYY-ZZZ"
                placeholderTextColor={theme.colors.input.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Insurance Type</Text>
              <TextInput
                style={styles.inputEnhanced}
                value={formData.type}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, type: text }))}
                placeholder="Ex: PPO, HMO"
                placeholderTextColor={theme.colors.input.placeholder}
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Icon name="person" size={24} color={theme.colors.secondary} />
              <Text style={styles.stepTitle}>Member Information</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Member Name</Text>
              <TextInput
                style={styles.inputEnhanced}
                value={formData.memberName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, memberName: text }))}
                placeholder="Ex: John Doe"
                placeholderTextColor={theme.colors.input.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={styles.inputEnhanced}
                value={formData.policyHolderDOB}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, policyHolderDOB: text }))}
                placeholder="MM/DD/YYYY"
                placeholderTextColor={theme.colors.input.placeholder}
                keyboardType="numeric"
              />
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Icon name="info" size={24} color={theme.colors.secondary} />
              <Text style={styles.stepTitle}>Additional Details</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Group Number</Text>
              <TextInput
                style={styles.inputEnhanced}
                value={formData.groupNumber}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, groupNumber: text }))}
                placeholder="Ex: 123456"
                placeholderTextColor={theme.colors.input.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expiration Date</Text>
              <TextInput
                style={styles.inputEnhanced}
                value={formData.expirationDate}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, expirationDate: text }))}
                placeholder="MM/DD/YYYY"
                placeholderTextColor={theme.colors.input.placeholder}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Copay Information</Text>
              <TextInput
                style={styles.inputEnhanced}
                value={formData.copayInfo}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, copayInfo: text }))}
                placeholder="Ex: PCP: $20, Specialist: $40"
                placeholderTextColor={theme.colors.input.placeholder}
              />
            </View>
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePrevStep}
          >
            <Icon name="arrow-back" size={20} color={theme.colors.primary} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
      {renderProgressBar()}
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {step < 3 ? (
          <TouchableOpacity
            style={[styles.nextButton, !isValid && styles.buttonDisabled]}
            onPress={handleNextStep}
            disabled={!isValid}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Icon name="arrow-forward" size={20} color={theme.colors.background} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextButton, styles.submitButton, !isValid && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || submitting}
          >
            {submitting ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <Text style={styles.nextButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...sharedStyles.container,
  },
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  scrollContent: {
    padding: theme.spacing.xl,
  },
  progressContainer: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  progressBar: {
    height: theme.spacing.xs,
    backgroundColor: theme.colors.border,
    borderRadius: theme.spacing.xs / 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.small,
    textAlign: 'center',
  },
  stepContainer: {
    marginBottom: theme.spacing.xl,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  stepTitle: {
    fontSize: theme.typography.heading,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...sharedStyles.label,
  },
  inputEnhanced: {
    ...sharedStyles.input,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.regular,
    marginLeft: theme.spacing.xs,
},
nextButton: {
    ...sharedStyles.button,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    flexDirection: 'row',
    minWidth: 120,
},
submitButton: {
    backgroundColor: theme.colors.primary,
},
buttonDisabled: {
    opacity: 0.5,
},
nextButtonText: {
    ...sharedStyles.buttonText,
    marginRight: theme.spacing.xs,
},
});
