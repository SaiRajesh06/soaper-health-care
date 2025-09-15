// src/components/cameraScanner/AnalyzingModal.tsx
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { sharedStyles } from "../../theme/styles";

export function AnalyzingModal() {
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <ActivityIndicator
          size="large"
          color="#fff"
          style={styles.modalSpinner}
        />
        <Text style={styles.modalText}>Processing (this may take a minute)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 1)", // Darker overlay to hide camera
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContainer: {
    backgroundColor: sharedStyles.button.backgroundColor,
    borderRadius: 16,
    padding: 24,
    minWidth: 200,
    alignItems: "center",
  },
  modalSpinner: {
    marginBottom: 12,
  },
  modalText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
