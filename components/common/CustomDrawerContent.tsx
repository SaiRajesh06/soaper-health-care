// src/components/common/CustomDrawerContent.tsx
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function CustomDrawerContent(props: any) {
  const { signOut, user } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userSection}>
        <Text style={styles.userName}>{user?.name || 'Patient Name'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'patient@example.com'}</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign Out"
        onPress={signOut}
        style={styles.signOutButton}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  userSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  signOutButton: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});