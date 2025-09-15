// src/components/cameraScanner/dimensions.ts
import { Platform, StatusBar, Dimensions } from 'react-native';


// Get screen dimensions
export const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Constants for camera frame UI
export const FRAME_WIDTH = 320;
export const FRAME_HEIGHT = 200;

// Standard credit card aspect ratio (85.60 × 53.98 mm)
export const CARD_ASPECT_RATIO = 1.586;

// Crop percentage of original image
export const CROP_PERCENTAGE = 0.75;

// Navigation and status bar heights
export const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
export const NAVIGATION_BAR_HEIGHT = 44; // Standard iOS navigation bar height

// Helper function to determine if device has notch
export const hasNotch = Platform.OS === 'ios' && screenHeight >= 812;

// Helper function to calculate device-specific vertical offset
export function getDeviceOffset(): number {
  if (Platform.OS === 'ios') {
    if (hasNotch) {
      // For notched devices, use relative offset
      return Math.floor(screenHeight * 0.05); // 5% of screen height
    } else {
      // For non-notched devices, use standard offset
      return STATUS_BAR_HEIGHT + (NAVIGATION_BAR_HEIGHT / 2);
    }
  } else {
    // For Android, use status bar height as base offset
    return StatusBar.currentHeight || 0;
  }
}

// Helper function to calculate crop dimensions based on original image
export interface CropDimensions {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

export function calculateCropDimensions(
  imageWidth: number, 
  imageHeight: number
): CropDimensions {
  const cropWidth = Math.floor(imageWidth * CROP_PERCENTAGE);
  const cropHeight = Math.floor(cropWidth / CARD_ASPECT_RATIO);
  
  // Calculate offset based on device characteristics
  const deviceOffset = getDeviceOffset();
  const offsetScale = imageHeight / screenHeight;
  const scaledOffset = Math.floor(deviceOffset * offsetScale);

  return {
    centerX: Math.floor((imageWidth - cropWidth) / 2),
    centerY: Math.floor((imageHeight - cropHeight) / 2) - scaledOffset,
    width: cropWidth,
    height: cropHeight
  };
}