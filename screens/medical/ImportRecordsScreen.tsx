// src/screens/medical/ImportRecordsScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import { EpicService } from '../../services/epicService';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ImportRecordsScreen = () => {
  const [loading, setLoading] = useState(false);

  const fetchEpicData = async () => {
    try {
      const data = await EpicService.getAllEpicData();
      console.log('Epic data:', data);
      Alert.alert(
        'Data Retrieved',
        'Successfully retrieved your medical records.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to fetch Epic data:', error);
      Alert.alert(
        'Error',
        'Failed to retrieve your medical records. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleConnectToEpic = async () => {
    setLoading(true);
    try {
      const success = await EpicService.initiateEpicConnection();
      if (success) {
        Alert.alert(
          'Success',
          'Successfully connected to Epic. Retrieving your records now...',
          [{
            text: 'OK',
            onPress: fetchEpicData
          }]
        );
      } else {
        Alert.alert(
          'Connection Failed',
          'Unable to complete the Epic connection. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Epic connection error:', error);
      Alert.alert(
        'Connection Error',
        'There was an error connecting to Epic. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

 return (
   <SafeAreaView style={styles.safeArea}>
     <View style={styles.container}>
       <Text style={styles.title}>Import Medical Records</Text>
       <Text style={styles.description}>
         Connect your Epic MyChart account to import your medical records, including:
       </Text>
       <View style={styles.benefitsList}>
         <Text style={styles.benefitItem}>• Past medical visits and appointments</Text>
         <Text style={styles.benefitItem}>• Medication history</Text>
         <Text style={styles.benefitItem}>• Lab results and test reports</Text>
         <Text style={styles.benefitItem}>• Immunization records</Text>
       </View>
       <View style={styles.buttonContainer}>
         {loading ? (
           <ActivityIndicator size="large" color="#4B917D" />
         ) : (
           <Button
             mode="contained"
             onPress={handleConnectToEpic}
             style={styles.button}
             contentStyle={styles.buttonContent}
             labelStyle={styles.buttonLabel}
           >
             Connect to Epic MyChart
           </Button>
         )}
       </View>
       <Text style={styles.securityNote}>
         Your data is securely transferred and encrypted. We maintain strict privacy standards
         to protect your medical information.
       </Text>
     </View>
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 safeArea: {
   flex: 1,
   backgroundColor: '#fff',
 },
 container: {
   flex: 1,
   padding: 20,
   backgroundColor: '#fff',
 },
 title: {
   fontSize: 24,
   fontWeight: '600',
   color: '#2C5446',
   marginBottom: 20,
   textAlign: 'center',
 },
 description: {
   fontSize: 16,
   color: '#4A4A4A',
   marginBottom: 20,
   lineHeight: 22,
 },
 benefitsList: {
   marginBottom: 30,
 },
 benefitItem: {
   fontSize: 16,
   color: '#4A4A4A',
   marginBottom: 10,
   lineHeight: 22,
 },
 buttonContainer: {
   marginVertical: 20,
   alignItems: 'center',
 },
 button: {
   width: '100%',
   backgroundColor: '#4B917D',
   borderRadius: 8,
 },
 buttonContent: {
   height: 50,
 },
 buttonLabel: {
   fontSize: 16,
   fontWeight: '600',
   color: '#fff',
 },
 securityNote: {
   fontSize: 14,
   color: '#666',
   textAlign: 'center',
   marginTop: 20,
   fontStyle: 'italic',
 },
});

export default ImportRecordsScreen;