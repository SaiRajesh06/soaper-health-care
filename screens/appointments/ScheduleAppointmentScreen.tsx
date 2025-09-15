// src/screens/appointments/ScheduleAppointmentScreen.tsx
import React, {useEffect} from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Alert,
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../../theme/styles';
import { useAppointments } from '../../hooks/useAppointments';
import { AppointmentService } from '../../services/appointmentService';

import type { 
  AppointmentsNavigationProp,
  ScheduleAppointmentRouteProp 
} from '../../types/navigation';

const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#10B981" />
  </View>
);

const ScheduleAppointmentScreen = () => {
  const navigation = useNavigation<AppointmentsNavigationProp>();
  const route = useRoute<ScheduleAppointmentRouteProp>();
  const rescheduleData = route.params?.rescheduleData;

  const {
    physicians,
    locations,
    availableSlots,
    selectedPhysician,
    selectedLocation,
    selectedSlot,
    visitTypes,
    selectedVisitType,
    loading,
    error,
    selectPhysician,
    selectLocation,
    selectTimeSlot,
    selectVisitType,
    scheduleAppointment
  } = useAppointments();

  useEffect(() => {
    if (rescheduleData && physicians.length > 0) {
      // Find the physician
      const physician = physicians.find(p => p.id === rescheduleData.physicianId);
      if (physician && selectedPhysician?.id !== physician.id) {
        selectPhysician(physician);
      }
    }
  }, [rescheduleData, physicians]); // Remove visitTypes from dependencies

  // Add a separate useEffect for visit type selection
  useEffect(() => {
    if (rescheduleData && visitTypes.length > 0 && selectedPhysician) {
      const visitType = visitTypes.find(vt => vt.name === rescheduleData.visitType);
      if (visitType && selectedVisitType?.id !== visitType.id) {
        selectVisitType(visitType);
      }
    }
  }, [rescheduleData, visitTypes, selectedPhysician]); // This will run when visitTypes are loaded

  const handleScheduleAppointment = async () => {
    if (!selectedPhysician || !selectedVisitType || (!selectedLocation && !selectedVisitType.is_telehealth) || !selectedSlot) {
      Alert.alert('Error', 'Please select all required fields');
      return;
    }
  
    try {
      const appointmentDetails = {
        physicianId: selectedPhysician.id,
        locationId: selectedVisitType.is_telehealth ? null : selectedLocation?.id,
        dateTime: selectedSlot.datetime,
        duration: selectedVisitType.default_duration
      };
  
      console.log('Attempting to schedule appointment with:', appointmentDetails);
      
      // First schedule the new appointment
      const newAppointment = await scheduleAppointment(appointmentDetails);
  
      // If this is a reschedule, cancel the old appointment
      if (rescheduleData?.oldAppointmentId) {
        try {
          console.log('Cancelling old appointment:', rescheduleData.oldAppointmentId);
          await AppointmentService.cancelAppointment(rescheduleData.oldAppointmentId);
        } catch (error) {
          console.error('Error cancelling old appointment:', error);
          // Show warning but don't fail the whole operation
          Alert.alert(
            'Warning',
            'New appointment was scheduled but there was an error cancelling the old appointment. Please try cancelling it manually.',
            [{ text: 'OK', onPress: () => navigation.navigate('AppointmentsList', { refresh: true }) }]
          );
          return;
        }
      }
  
      Alert.alert(
        'Success', 
        rescheduleData ? 'Appointment rescheduled successfully' : 'Appointment scheduled successfully',
        [{ 
          text: 'OK', 
          onPress: () => navigation.navigate('AppointmentsList', { refresh: true }) 
        }]
      );
    } catch (err) {
      console.error('Appointment scheduling failed:', err);
      
      // Handle time conflict error specifically
      if (err instanceof Error && err.message.includes('time conflict')) {
        Alert.alert(
          'Time Conflict',
          'This time slot is no longer available. Please select a different time.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          err instanceof Error ? err.message : 'Failed to schedule appointment'
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-left" size={28} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {rescheduleData ? 'Reschedule Visit' : 'Schedule Visit'}
          </Text>
        </View>
      </View>

      <ScrollView 
        bounces={false} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Physicians Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Provider</Text>
          {loading.physicians ? (
            <LoadingIndicator />
          ) : (
            <View style={styles.optionsContainer}>
              {physicians.map((physician) => (
                <TouchableOpacity
                  key={physician.id}
                  style={[
                    styles.careOption,
                    selectedPhysician?.id === physician.id && styles.selectedOption
                  ]}
                  onPress={() => selectPhysician(physician)}
                >
                  <View style={styles.careOptionLeft}>
                    <View style={styles.careOptionIcon}>
                      <Icon name="doctor" size={24} color="#475569" />
                    </View>
                    <View style={styles.careOptionContent}>
                      <Text style={styles.careOptionTitle}>
                        {`${physician.user.first_name} ${physician.user.last_name}`}
                      </Text>
                      <Text style={styles.careOptionDescription}>{physician.specialty}</Text>
                    </View>
                  </View>
                  <Icon 
                    name="chevron-right" 
                    size={24} 
                    color={selectedPhysician?.id === physician.id ? "#10B981" : "#CBD5E1"} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Visit Type Section */}
        {selectedPhysician && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Visit Type</Text>
            {loading.visitTypes ? (
              <LoadingIndicator />
            ) : (
              <View style={styles.optionsContainer}>
                {visitTypes.map((visitType) => (
                  <TouchableOpacity
                    key={visitType.id}
                    style={[
                      styles.careOption,
                      selectedVisitType?.id === visitType.id && styles.selectedOption
                    ]}
                    onPress={() => selectVisitType(visitType)}
                  >
                    <View style={styles.careOptionLeft}>
                      <View style={styles.careOptionIcon}>
                        <Icon 
                          name={visitType.is_telehealth ? "video" : "clipboard-list"} 
                          size={24} 
                          color="#475569" 
                        />
                      </View>
                      <View style={styles.careOptionContent}>
                        <Text style={styles.careOptionTitle}>{visitType.name}</Text>
                        <Text style={styles.careOptionDescription}>
                          {visitType.description} ({visitType.default_duration} min)
                        </Text>
                        {visitType.is_telehealth && (
                          <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>Virtual</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Icon 
                      name="chevron-right" 
                      size={24} 
                      color={selectedVisitType?.id === visitType.id ? "#10B981" : "#CBD5E1"} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Locations Section - Only show if not virtual visit */}
        {selectedPhysician && selectedVisitType && !selectedVisitType.is_telehealth && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Location</Text>
            {loading.locations ? (
              <LoadingIndicator />
            ) : (
              <View style={styles.optionsContainer}>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    style={[
                      styles.careOption,
                      selectedLocation?.id === location.id && styles.selectedOption
                    ]}
                    onPress={() => selectLocation(location)}
                  >
                    <View style={styles.careOptionLeft}>
                      <View style={styles.careOptionIcon}>
                        <Icon name="map-marker" size={24} color="#475569" />
                      </View>
                      <View style={styles.careOptionContent}>
                        <Text style={styles.careOptionTitle}>{location.name}</Text>
                        <Text style={styles.careOptionDescription}>
                          {`${location.address_line1}, ${location.city}`}
                        </Text>
                      </View>
                    </View>
                    <Icon 
                      name="chevron-right" 
                      size={24} 
                      color={selectedLocation?.id === location.id ? "#10B981" : "#CBD5E1"} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Time Slots Section */}
        {((selectedLocation && !selectedVisitType?.is_telehealth) || 
          (selectedVisitType?.is_telehealth && selectedPhysician)) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Time</Text>
            {loading.slots ? (
              <LoadingIndicator />
            ) : (
              <View style={styles.optionsContainer}>
                {availableSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.datetime}
                    style={[
                      styles.careOption,
                      selectedSlot?.datetime === slot.datetime && styles.selectedOption
                    ]}
                    onPress={() => selectTimeSlot(slot)}
                  >
                    <View style={styles.careOptionLeft}>
                      <View style={styles.careOptionIcon}>
                        <Icon name="clock-outline" size={24} color="#475569" />
                      </View>
                      <View style={styles.careOptionContent}>
                        <Text style={styles.careOptionTitle}>
                          {new Date(slot.datetime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                        <Text style={styles.careOptionDescription}>
                          {new Date(slot.datetime).toLocaleDateString()}
                        </Text>
                        {slot.is_preferred_time && (
                          <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>Preferred</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Icon 
                      name="chevron-right" 
                      size={24} 
                      color={selectedSlot?.datetime === slot.datetime ? "#10B981" : "#CBD5E1"} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Schedule Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.scheduleButton,
            (!selectedPhysician || 
             !selectedVisitType || 
             (!selectedLocation && !selectedVisitType.is_telehealth) || 
             !selectedSlot || 
             loading.scheduling) &&
              styles.disabledButton
          ]}
          onPress={handleScheduleAppointment}
          disabled={
            !selectedPhysician || 
            !selectedVisitType || 
            (!selectedLocation && !selectedVisitType.is_telehealth) || 
            !selectedSlot || 
            loading.scheduling
          }
        >
          <Text style={styles.scheduleButtonText}>
            {loading.scheduling ? 'Scheduling...' : 
             rescheduleData ? 'Reschedule Appointment' : 'Schedule Appointment'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  careOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedOption: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  careOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  careOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  careOptionContent: {
    flex: 1,
  },
  careOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  careOptionDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  badgeContainer: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  scheduleButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#CBD5E1',
  },
});

export default ScheduleAppointmentScreen;