// src/components/cameraScanner/styles.ts
// Common styles for insurance card camera scanner

import { StyleSheet, Dimensions } from 'react-native';
import { theme, sharedStyles } from '../../theme/styles';
import {
  FRAME_WIDTH as finalFrameWidth,
  FRAME_HEIGHT as finalFrameHeight,
  screenWidth,
  screenHeight
} from './dimensions';

const { width } = Dimensions.get('window');
const CARD_ASPECT_RATIO = 1.586; // Standard insurance card ratio
const BOTTLE_ASPECT_RATIO = 0.4; // Taller than wide for bottles

export const cameraStyles = StyleSheet.create({
  container: {
    ...sharedStyles.container,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%', 
  },
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  cardFrame: {
    width: width * 0.8,
    height: width * 0.8 / CARD_ASPECT_RATIO,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  bottleFrame: {
    width: width * 0.7, // Narrower width
    height: width * 0.5 / BOTTLE_ASPECT_RATIO, // Taller height
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    ...sharedStyles.button,
    width: Math.min(200, screenWidth * 0.5),
  },
  buttonText: { 
    color: '#fff',
    fontSize: theme.typography.regular,
    fontWeight: '600',
  },
  processingContainer: {
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: theme.typography.regular,
    marginTop: Math.max(theme.spacing.md, screenHeight * 0.02),
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  message: {
    color: '#fff',
    fontSize: theme.typography.regular,
    textAlign: 'center',
    paddingBottom: theme.spacing.sm,
  },

  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
  processingText: {
    color: '#fff',
    fontSize: theme.typography.regular,
    marginTop:  theme.spacing.sm,
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 1)', // Darker overlay to hide camera
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContainer: {
    backgroundColor: sharedStyles.button.backgroundColor,
    borderRadius: 16,
    padding: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  modalSpinner: {
    marginBottom: 12,
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },

  preview: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  
  previewControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
});