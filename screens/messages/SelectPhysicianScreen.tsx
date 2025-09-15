// src/screens/messages/SelectPhysicianScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User } from 'lucide-react-native';
import { theme } from '../../theme/styles';
import PatientService from '../../services/patientService';
import { PhysicianResponse } from '../../types/physician';
import { selectPhysicianStyles as styles} from '../../components/message/style';
import { formatDate } from '../../utils/formatters';

export const SelectPhysicianScreen = () => {
  const [recentPhysicians, setRecentPhysicians] = useState<PhysicianResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    fetchRecentPhysicians();
  }, []);

  const fetchRecentPhysicians = async () => {
    try {
      const physicians = await PatientService.getRecentPhysicians();
      setRecentPhysicians(physicians);
    } catch (error) {
      console.error('Error fetching physicians:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPhysician = (physician: PhysicianResponse) => {
    navigation.navigate('SelectEncounter', { physician });
  };

  const renderPhysicianItem = ({ item }: { item: PhysicianResponse }) => (
    <TouchableOpacity 
      style={styles.physicianItem}
      onPress={() => handleSelectPhysician(item)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.avatarContainer}>
          <User size={24} color="#666" />
        </View>
        <View style={styles.physicianInfo}>
          <Text style={styles.physicianName}>
            Dr. {item.user?.first_name} {item.user?.last_name}
          </Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
          <Text style={styles.lastSeen}>
            Last interaction: {formatDate(item.last_interaction_time)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (recentPhysicians.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          You haven't interacted with any physicians yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recentPhysicians}
        renderItem={renderPhysicianItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: theme.spacing.md }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SelectPhysicianScreen;