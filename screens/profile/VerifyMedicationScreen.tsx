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
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MedicationStackParamList } from '../../navigation/MedicationStackNavigator';
import { MedicationData } from '../../services/medicationGPTService';
import { MedicationService } from '../../services/MedicationService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme, sharedStyles } from '../../theme/styles';

type VerifyMedicationScreenProps = NativeStackScreenProps<MedicationStackParamList, 'VerifyMedication'>;

export default function VerifyMedicationScreen({ navigation, route }: VerifyMedicationScreenProps) {
  const [submitting, setSubmitting] = useState(false);
  const [currentMedIndex, setCurrentMedIndex] = useState(0);
  const [isValid, setIsValid] = useState(false);
  
  const [medications, setMedications] = useState<MedicationData[]>(() => {
    const initialData = route.params?.medicationData;
    if (!initialData) {
      return [{
        name: '',
        genericName: '',
        strength: '',
        form: '',
        route: '',
        sig: '',
        clinicalDetails: ''
      }];
    }
    const medArray = Array.isArray(initialData) ? initialData : [initialData];
    return medArray.map(med => ({
      ...med,
      name: med?.name || '',
      genericName: med?.genericName || '',
      strength: med?.strength || '',
      form: med?.form || '',
      route: med?.route || '',
      sig: med?.sig || '',
      clinicalDetails: med?.clinicalDetails || ''
    }));
  });

  useEffect(() => {
    validateCurrentMedication();
  }, [medications, currentMedIndex]);

  const validateCurrentMedication = () => {
    const currentMed = medications[currentMedIndex];
    const valid = !!(
      currentMed.name && 
      currentMed.genericName && 
      currentMed.strength && 
      currentMed.form && 
      currentMed.route && 
      currentMed.sig
    );
    setIsValid(valid);
  };

  const updateMedicationField = (field: keyof MedicationData, value: string | number) => {
    const updatedMedications = [...medications];
    updatedMedications[currentMedIndex] = {
      ...updatedMedications[currentMedIndex],
      [field]: value
    };
    setMedications(updatedMedications);
  };

  const handleNextMedication = () => {
    if (currentMedIndex < medications.length - 1) {
      setCurrentMedIndex(currentMedIndex + 1);
    }
  };

  const handlePrevMedication = () => {
    if (currentMedIndex > 0) {
      setCurrentMedIndex(currentMedIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all medications before submitting
    const invalidMeds = medications.filter(med => 
      !med.name || !med.genericName || !med.strength || 
      !med.form || !med.route || !med.sig
    );
    
    if (invalidMeds.length > 0) {
      Alert.alert('Error', `Please complete all required fields for all medications`);
      return;
    }

    try {
      setSubmitting(true);
      const createdMedications = await MedicationService.createMultipleMedications(medications);
      
      if (route.params?.onSave) {
        route.params.onSave(createdMedications);
      }

      Alert.alert(
        'Success',
        'Medications saved successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to save medications'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progress, 
            { width: `${((currentMedIndex + 1) / medications.length) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        Steps {currentMedIndex + 1} of {medications.length}
      </Text>
    </View>
  );

  const renderMedicationForm = () => {
    const currentMed = medications[currentMedIndex] || {
      name: '',
      genericName: '',
      strength: '',
      form: '',
      route: '',
      sig: '',
      clinicalDetails: ''
    };

    return (
      <View style={styles.formContainer}>
        <View style={styles.stepHeader}>
          <Icon name="medical-services" size={24} color={theme.colors.secondary} />
          <Text style={styles.stepTitle}>Medication Information</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medication Name*</Text>
          <TextInput
            style={styles.inputEnhanced}
            value={currentMed.name}
            onChangeText={(text) => updateMedicationField('name', text)}
            placeholder="Enter medication name"
            placeholderTextColor={theme.colors.input.placeholder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Generic Name*</Text>
          <TextInput
            style={styles.inputEnhanced}
            value={currentMed.genericName}
            onChangeText={(text) => updateMedicationField('genericName', text)}
            placeholder="Enter generic name"
            placeholderTextColor={theme.colors.input.placeholder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Strength*</Text>
          <TextInput
            style={styles.inputEnhanced}
            value={currentMed.strength}
            onChangeText={(text) => updateMedicationField('strength', text)}
            placeholder="Ex: 50mg"
            placeholderTextColor={theme.colors.input.placeholder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Form*</Text>
          <TextInput
            style={styles.inputEnhanced}
            value={currentMed.form}
            onChangeText={(text) => updateMedicationField('form', text)}
            placeholder="Ex: Tablet, Capsule"
            placeholderTextColor={theme.colors.input.placeholder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Route*</Text>
          <TextInput
            style={styles.inputEnhanced}
            value={currentMed.route}
            onChangeText={(text) => updateMedicationField('route', text)}
            placeholder="Ex: Oral, Topical"
            placeholderTextColor={theme.colors.input.placeholder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Instructions (Sig)*</Text>
          <TextInput
            style={[styles.inputEnhanced, styles.multilineInput]}
            value={currentMed.sig}
            onChangeText={(text) => updateMedicationField('sig', text)}
            placeholder="Ex: Take 1 tablet daily"
            placeholderTextColor={theme.colors.input.placeholder}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Clinical Details</Text>
          <TextInput
            style={[styles.inputEnhanced, styles.multilineInput]}
            value={currentMed.clinicalDetails}
            onChangeText={(text) => updateMedicationField('clinicalDetails', text)}
            placeholder="Enter any clinical details"
            placeholderTextColor={theme.colors.input.placeholder}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
    );
  };

  const renderFooterButtons = () => (
    <View style={styles.buttonContainer}>
      <View style={styles.buttonContentWrapper}>
        {currentMedIndex > 0 ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePrevMedication}
          >
            <Icon name="arrow-back" size={20} color="#4B7A6B" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptySpace} />
        )}
        
        {currentMedIndex < medications.length - 1 ? (
          <TouchableOpacity
            style={[styles.nextButton, !isValid && styles.buttonDisabled]}
            onPress={handleNextMedication}
            disabled={!isValid}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Icon name="arrow-forward" size={20} color={theme.colors.background} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, !isValid && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || submitting}
          >
            {submitting ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <Text style={styles.submitButtonText}>
                {medications.length > 1 ? 'Save All' : 'Save Medication'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {renderProgressBar()}
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderMedicationForm()}
      </ScrollView>

      {renderFooterButtons()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pageTitle: {
    fontSize: theme.typography.heading,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  progressContainer: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progress: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.small,
    textAlign: 'center',
  },
  scrollContent: {
    padding: theme.spacing.xl,
  },
  formContainer: {
    marginBottom: theme.spacing.xl,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl * 1.5,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  inputGroup: {
    marginBottom: theme.spacing.xl * 1.2,
  },
  label: {
    fontSize: theme.typography.regular,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  
  inputEnhanced: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.regular,
    color: theme.colors.text.primary,
  },
  multilineInput: {
    height: theme.spacing.xl * 3,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.md,
  },
  buttonContainer: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  buttonContentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  emptySpace: {
    width: 120, // Same width as buttons for balance
  },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: '#D7ECE5', // Updated light green color
    borderRadius: theme.spacing.sm,
    minWidth: 120,
  },
  backButtonText: {
    color: '#4B7A6B', // Updated text color
    fontSize: theme.typography.regular,
    fontWeight: '500',
    marginLeft: theme.spacing.xs,
  },
  nextButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.sm,
    minWidth: 120,
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.sm,
    minWidth: 120,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.regular,
    fontWeight: '500',
    marginRight: theme.spacing.xs,
  },
  submitButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.regular,
    fontWeight: '500',
    textAlign: 'center',
  },
});