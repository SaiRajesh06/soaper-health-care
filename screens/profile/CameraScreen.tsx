// src/screens/profile/CameraScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { InsuranceStackParamList } from '../../navigation/InsuranceStackNavigator';
import type { MedicationStackParamList } from '../../navigation/MedicationStackNavigator';
import { CameraService } from '../../services/cameraService';
import { PermissionRequest } from '../../components/cameraScanner/PermissionRequest';
import { MedicationCameraService } from '../../services/MedicationCameraService';

type CameraScreenProps =
  | NativeStackScreenProps<InsuranceStackParamList, 'CameraScreen'>
  | NativeStackScreenProps<MedicationStackParamList, 'CameraScreen'>;

export default function CameraScreen({ navigation, route }: CameraScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [facing] = useState<CameraType>('back');
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setShowCamera(true);
    });
    const unsubscribeBlur = navigation.addListener('blur', () => {
      setShowCamera(false);
    });
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      setShowCamera(false);
    };
  }, [navigation]);

  useEffect(() => {
    requestPermission();
  }, []);

  const takePicture = async () => {
    if (!isProcessing && cameraRef.current) {
      setIsProcessing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
        });

        if (!photo || !photo.uri || !photo.base64) {
          throw new Error('Failed to capture photo');
        }

        if (route.params.type === 'insurance') {
          const insuranceData = await CameraService.processImage(photo.uri, photo.base64);
          (navigation as NativeStackNavigationProp<InsuranceStackParamList>).navigate('VerifyInsurance', {
            insuranceData,
            onSubmit: route.params?.onCapture,
            onSave: route.params?.onCapture
          });
        } else {
          const medications = await MedicationCameraService.processImage(photo.uri, photo.base64);
          (navigation as NativeStackNavigationProp<MedicationStackParamList>).navigate('VerifyMedication', {
            medicationData: medications,
            onSave: (savedMedications) => {
              route.params.onCapture(savedMedications);
              navigation.goBack();
            },
          });
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to analyze the image');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (!permission?.granted) {
    return <PermissionRequest onRequestPermission={requestPermission} />;
  }

  return (
    <View style={styles.container}>
      
      
      {showCamera ? (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            type={facing}
          />
          
          {/* Card Frame */}
          <View style={styles.frameContainer}>
            <View style={styles.frame} />
          </View>
          
          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <Text style={styles.instructionText}>
              Position your insurance card within the frame
            </Text>
            <View style={styles.captureContainer}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <Ionicons name="camera" size={40} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  frameContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: '85%',
    height: '45%',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 20,
  },
  instructionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  captureContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});