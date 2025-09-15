// src/components/cameraScanner/CameraUI.tsx
import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { cameraStyles } from './style';
import { AnalyzingModal } from './AnalyzingModal';

interface CameraUIProps {
  cameraRef: React.RefObject<CameraView>;
  isProcessing: boolean;
  facing: CameraType;
  onCapture: () => void;
  type?: 'insurance' | 'medication';
}

export function CameraUI({ cameraRef, isProcessing, facing, onCapture, type = 'insurance' }: CameraUIProps) {
  const getInstructionText = () => {
    switch (type) {
      case 'medication':
        return 'Take clear picture of medication(s)';
      default:
        return 'Position your insurance card within the frame';
    }
  };

  return (
    <View style={cameraStyles.container}>
      <CameraView
        ref={cameraRef}
        style={cameraStyles.camera}
        type={facing}
      >
        {type === 'insurance' ? (
          // Insurance layout
          <View style={cameraStyles.overlay}>
            <View style={cameraStyles.cardFrame} />
            <Text style={cameraStyles.instructionText}>
              {getInstructionText()}
            </Text>
            <TouchableOpacity 
              style={cameraStyles.captureButton} 
              onPress={onCapture}
            >
              <Text style={cameraStyles.buttonText}>
                {isProcessing ? 'Processing...' : 'Capture'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Medication layout
          <View style={styles.medicationOverlay}>
            <Text style={styles.medicationText}>
              {getInstructionText()}
            </Text>
            <TouchableOpacity 
              style={styles.medicationCaptureButton} 
              onPress={onCapture}
            >
              <Text style={styles.captureText}>
                {isProcessing ? 'Processing...' : 'Capture'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </CameraView>
      {isProcessing && <AnalyzingModal />}
    </View>
  );
}

const styles = StyleSheet.create({
  medicationOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  medicationText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 8,
    marginTop: 40,
  },
  medicationCaptureButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 40,
  },
  captureText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});