// src/screens/messages/SelectEncounterScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar, Plus } from 'lucide-react-native';
import { theme } from '../../theme/styles';
import { EncounterResponse } from '../../types/encounters';
import { PhysicianResponse } from '../../types/physician';
import PatientService from '../../services/patientService';
import { formatDate } from '../../utils/formatters';

interface RouteParams {
  physician: PhysicianResponse;
}

export const SelectEncounterScreen = () => {
  const [encounters, setEncounters] = useState<EncounterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const { physician } = route.params as RouteParams;
  

  useEffect(() => {
    fetchEncounters();
  }, []);

  const fetchEncounters = async () => {
    try {
      const data = await PatientService.getEncountersWithPhysician(physician.id);
      
      if (!Array.isArray(data)) {
        console.error("API returned invalid data structure:", data);
        return;
      }
  
      const formattedEncounters = data.map(encounter => ({
        id: encounter.id,
        encounter_type: encounter.encounter_type?.name || 'Visit', // Safely access the encounter type name
        created_at: encounter.created_at,
        meta_visit_reason: encounter.meta_visit_reason || "No reason provided",
      }));
  
      setEncounters(formattedEncounters);
    } catch (error) {
      console.error("Error fetching encounters:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSelectEncounter = (encounter: EncounterResponse) => {
    navigation.navigate('ComposeMessage', {
      physician,
      encounterId: encounter.id,
      subject: ``
    });
    // Close all modals by going back to the root screen
    navigation.getParent()?.goBack();
  };
  
  const handleNewProblem = () => {
    navigation.navigate('ComposeMessage', {
      physician,
      subject: 'New Medical Question'
    });
    // Close all modals by going back to the root screen
    navigation.getParent()?.goBack();
  };

  const renderEncounterItem = ({ item }: { item: EncounterResponse }) => (
    <TouchableOpacity 
      style={styles.encounterItem}
      onPress={() => handleSelectEncounter(item)}
    >
      <View style={styles.encounterRow}>
        <Calendar size={24} color="#666" />
        <View style={styles.encounterInfo}>
          <Text style={styles.encounterType}>
            {item.encounter_type ? String(item.encounter_type) : 'Visit'}
          </Text>
          <Text style={styles.encounterDate}>
            {formatDate(item.created_at)}
          </Text>
          {item.meta_visit_reason && (
            <Text style={styles.visitReason}>
              Reason: {String(item.meta_visit_reason)}
            </Text>
          )}
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

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.newProblemButton}
        onPress={handleNewProblem}
      >
        <View style={styles.newProblemRow}>
          <Plus size={24} color={theme.colors.primary} />
          <View style={styles.newProblemInfo}>
            <Text style={styles.newProblemTitle}>New Medical Question</Text>
            <Text style={styles.newProblemSubtitle}>Start a new conversation</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Encounters</Text>
      
      <FlatList
        data={encounters}
        renderItem={renderEncounterItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No previous encounters with this physician
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newProblemButton: {
    backgroundColor: '#F0F9FF',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  newProblemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newProblemInfo: {
    marginLeft: theme.spacing.md,
  },
  newProblemTitle: {
    fontSize: theme.typography.regular,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  newProblemSubtitle: {
    fontSize: theme.typography.small,
    color: '#666',
  },
  sectionTitle: {
    fontSize: theme.typography.regular,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    flexGrow: 1,
  },
  encounterItem: {
    backgroundColor: '#fff',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  encounterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  encounterInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  encounterType: {
    fontSize: theme.typography.regular,
    fontWeight: '500',
    color: theme.colors.text,
  },
  encounterDate: {
    fontSize: theme.typography.small,
    color: '#666',
    marginTop: 2,
  },
  visitReason: {
    fontSize: theme.typography.small,
    color: '#666',
    marginTop: theme.spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: theme.typography.regular,
    color: '#666',
    marginTop: theme.spacing.xl,
  },
});

export default SelectEncounterScreen;