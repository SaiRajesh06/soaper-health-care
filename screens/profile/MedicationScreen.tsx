import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Camera, Plus, Pill, ChevronRight, PencilLine, Trash2 } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Swipeable } from 'react-native-gesture-handler';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MedicationStackParamList } from '../../navigation/MedicationStackNavigator';
import { MedicationService } from '../../services/MedicationService';
import { MedicationData } from '../../services/medicationGPTService';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<MedicationStackParamList, 'MedicationMain'>;

const FILTER_OPTIONS = ['All', 'Active', 'Inactive'];

const FORM_OPTIONS = [
  { label: 'Tablet', value: 'tablet' },
  { label: 'Capsule', value: 'capsule' },
  { label: 'Solution', value: 'solution' },
  { label: 'Suspension', value: 'suspension' },
  { label: 'Cream', value: 'cream' },
  { label: 'Ointment', value: 'ointment' },
  { label: 'Patch', value: 'patch' },
  { label: 'Inhaler', value: 'inhaler' },
  { label: 'Injection', value: 'injection' },
  { label: 'Drops', value: 'drops' },
];

const ROUTE_OPTIONS = [
  { label: 'Oral', value: 'oral' },
  { label: 'Topical', value: 'topical' },
  { label: 'Injection', value: 'injection' },
  { label: 'Inhalation', value: 'inhalation' },
  { label: 'Sublingual', value: 'sublingual' },
  { label: 'Rectal', value: 'rectal' },
  { label: 'Transdermal', value: 'transdermal' },
  { label: 'Ophthalmic', value: 'ophthalmic' },
  { label: 'Otic', value: 'otic' },
  { label: 'Nasal', value: 'nasal' },
];

export default function MedicationScreen({ navigation }: Props) {
  const [medications, setMedications] = useState<MedicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<MedicationData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchMedications();
    }, [])
  );

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const data = await MedicationService.getPatientMedications();
      setMedications(data?.items || []);
    } catch (err) {
      console.error('Fetch error:', err);
      Alert.alert('Error', 'Failed to load medications');
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleScanMedications = () => {
    navigation.navigate('CameraScreen', {
      type: 'medication',
      onCapture: async (medications: MedicationData[]) => {
        try {
          const savedMedications = await MedicationService.createMultipleMedications(medications);
          setMedications(prev => [...prev, ...savedMedications]);
          Alert.alert('Success', 'Medications added successfully');
        } catch (error) {
          Alert.alert('Error', 'Failed to save medications');
        }
      },
    });
  };

  const handleDeleteMedication = async (medicationId: string) => {
    Alert.alert(
      "Delete Medication",
      "Are you sure you want to delete this medication?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await MedicationService.deleteMedication(medicationId);
              setMedications(prev => prev.filter(med => med.id !== medicationId));
              Alert.alert('Success', 'Medication deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete medication');
            }
          }
        }
      ]
    );
  };

  const handleEditMedication = (medication: MedicationData) => {
    setNewMedication(medication);
    setIsEditing(true);
    setModalVisible(true);
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const inactiveStatuses = ['discontinued', 'completed'];
    
    const matchesFilter = 
      activeFilter === 'All' || 
      (activeFilter === 'Active' && med.status === 'active') ||
      (activeFilter === 'Inactive' && inactiveStatuses.includes(med.status || ''));
    
    return matchesSearch && matchesFilter;
  });

  const MedicationCard = ({ medication }: { medication: MedicationData }) => {
    const [cardHeight, setCardHeight] = useState(0);
    
    // Function to render the appropriate medication icon based on form
    const renderMedicationIcon = () => {
      // Check if the medication form is 'tablet'
      if (medication.form === 'tablet') {
        // Half orange, half white circular pill rotated 45 degrees
        return (
          <View style={styles.medicationIconContainer}>
            {/* Base white circle with rotation */}
            <View style={styles.tabletCircle}>
              {/* Half-orange overlay using absolute positioning with rotation */}
              <View style={styles.halfOrangeOverlay} />
            </View>
          </View>
        );
      } else {
        // Use the Pill icon from lucide for capsules and other forms
        return <Pill size={24} color="#FF7E47" style={styles.medicationIcon} />;
      }
    };
    
    const renderRightActions = () => (
      <View style={[styles.swipeActionContainer, { height: cardHeight }]}>
        <TouchableOpacity 
          style={styles.deleteAction}
          onPress={() => handleDeleteMedication(medication.id!)}
        >
          <Trash2 size={24} color="white" />
          <Text style={styles.swipeActionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        rightThreshold={40}
      >
        <TouchableOpacity 
          style={styles.medicationCard}
          onPress={() => handleEditMedication(medication)}
          onLayout={(event) => {
            setCardHeight(event.nativeEvent.layout.height);
          }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.medicationNameContainer}>
              {renderMedicationIcon()}
              <Text style={styles.medicationName}>{medication.name}</Text>
            </View>
          </View>
          <View style={styles.cardDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dose</Text>
              <Text style={styles.detailValue}>
                {medication.strength} {medication.form}
              </Text>
            </View>
            {medication.sig && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Instructions:</Text>
                <Text style={styles.detailValue}>{medication.sig}</Text>
              </View>
            )}
            {medication.lastFilledDate && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Last Filled:</Text>
                <Text style={styles.detailValue}>
                  {new Date(medication.lastFilledDate).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const handleSaveMedication = async () => {
    try {
      if (!newMedication.name || !newMedication.strength) {
        Alert.alert('Error', 'Please fill in required fields');
        return;
      }

      setIsSaving(true);
      let savedMedication: MedicationData;

      if (isEditing && newMedication.id) {
        savedMedication = await MedicationService.updateMedication(
          newMedication.id,
          newMedication as MedicationData
        );
        setMedications(prev => 
          prev.map(med => med.id === savedMedication.id ? savedMedication : med)
        );
      } else {
        savedMedication = await MedicationService.createMedication(
          newMedication as MedicationData
        );
        setMedications(prev => [...prev, savedMedication]);
      }

      setIsSaving(false);
      setModalVisible(false);
      setNewMedication({});
      setIsEditing(false);
      Alert.alert('Success', `Medication ${isEditing ? 'updated' : 'added'} successfully`);
    } catch (error) {
      setIsSaving(false);
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'add'} medication`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search medications"
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        {FILTER_OPTIONS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.activeFilterTab
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#4B7A6B" style={styles.loader} />
        ) : filteredMedications.length === 0 ? (
          <Text style={styles.emptyText}>No medications found</Text>
        ) : (
          filteredMedications.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} />
          ))
        )}
      </ScrollView>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.scanButton]}
          onPress={handleScanMedications}
        >
          <Camera size={24} color="white" />
          <Text style={styles.scanButtonText}>Scan Medications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.addButton]}
          onPress={() => setModalVisible(true)}
        >
          <PencilLine size={24} color="#527A6E" />
          <Text style={styles.addButtonText}>Add Manually</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setNewMedication({});
          setIsEditing(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              setModalVisible(false);
              setNewMedication({});
              setIsEditing(false);
            }}
          >
            <View 
              style={styles.modalInnerContainer}
              onStartShouldSetResponder={() => true}
              onResponderGrant={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEditing ? 'Edit Medication' : 'Add New Medication'}
                </Text>
              </View>

              <ScrollView 
                style={styles.modalContent}
                contentContainerStyle={styles.modalContentContainer}
                showsVerticalScrollIndicator={true}
              >
                <Text style={styles.inputLabel}>Medication Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter medication name"
                  value={newMedication.name}
                  onChangeText={(text) => setNewMedication(prev => ({ ...prev, name: text }))}
                />

                <Text style={styles.inputLabel}>Generic Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter generic name"
                  value={newMedication.genericName}
                  onChangeText={(text) => setNewMedication(prev => ({ ...prev, genericName: text }))}
                />

                <Text style={styles.inputLabel}>Strength *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 50mg"
                  value={newMedication.strength}
                  onChangeText={(text) => setNewMedication(prev => ({ ...prev, strength: text }))}
                />

                <Text style={styles.inputLabel}>Form</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={FORM_OPTIONS}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select form..."
                  value={newMedication.form}
                  onChange={item => {
                    setNewMedication(prev => ({ ...prev, form: item.value }));
                  }}
                />

                <Text style={styles.inputLabel}>Route</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={ROUTE_OPTIONS}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select route..."
                  value={newMedication.route}
                  onChange={item => {
                    setNewMedication(prev => ({ ...prev, route: item.value }));
                  }}
                />
                <Text style={styles.inputLabel}>Instructions</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., take twice daily"
                  value={newMedication.sig}
                  onChangeText={(text) => setNewMedication(prev => ({ ...prev, sig: text }))}
                />

                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter quantity"
                  value={newMedication.quantity?.toString()}
                  onChangeText={(text) => setNewMedication(prev => ({ ...prev, quantity: parseFloat(text) || 0 }))}
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Days Supply</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter days supply"
                  value={newMedication.daysSupply?.toString()}
                  onChangeText={(text) => setNewMedication(prev => ({ ...prev, daysSupply: parseInt(text) || 0 }))}
                  keyboardType="numeric"
                />

                {/* Add extra padding at the bottom */}
                <View style={styles.bottomPadding} />
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    setNewMedication({});
                    setIsEditing(false);
                  }}
                  disabled={isSaving}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSaveMedication}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {isEditing ? 'Update' : 'Add'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#F2F2F7',
  },
  searchBar: {
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#000000',
    height: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#F2F2F7',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4B7A6B',
  },
  filterText: {
    fontSize: 17,
    color: '#8E8E93',
  },
  activeFilterText: {
    color: '#4B7A6B',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loader: {
    marginTop: 20,
  },
  emptyText: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 20,
  },
  medicationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medicationIcon: {
    marginRight: 4,
  },
  // Half orange, half white circular pill icon styles with 45-degree rotation
  medicationIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  tabletCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FF7E47',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden', // Ensure the half-orange overlay stays within the circle
    transform: [{ rotate: '45deg' }], // Rotate the entire pill 45 degrees
    // Added shadow for more 3D pill effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  // Half-orange overlay for the pill
  halfOrangeOverlay: {
    position: 'absolute',
    width: '50%',   // Take up half the width
    height: '100%', // Full height
    backgroundColor: '#FF7E47',
    right: 0,       // Position on the right side
    top: 0,
  },
  medicationName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: '#8E8E93',
    width: 100,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 15,
    color: '#000000',
    flex: 1,
    textAlign: 'left',
  },
  swipeActionContainer: {
    width: 75,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  swipeActionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  actionButtonsContainer: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  scanButton: {
    backgroundColor: '#4B7A6B',
  },
  addButton: {
    backgroundColor: '#D7ECE5',
  },
  scanButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#527A6E',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalInnerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    padding: 16,
  },
  modalContent: {
    maxHeight: '75%',
  },
  modalContentContainer: {
    padding: 12,
    paddingBottom: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: 'white',
  },
  bottomPadding: {
    height: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#D7ECE5',
  },
  submitButton: {
    backgroundColor: '#4B7A6B',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#527A6E',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dropdown: {
    height: 50,
    borderColor: '#E5E5EA',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000000',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
});