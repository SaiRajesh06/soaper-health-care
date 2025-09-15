import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, RefreshControl, Text, Linking, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { appointmentStyles as styles } from '../../components/appointments/styles';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import AppointmentFilters from '../../components/appointments/AppointmentFilters';
import NewAppointmentButton from '../../components/appointments/NewAppointmentButton';
import PrevisitChecklist from '../../components/appointments/PrevisitChecklist';
import type { Appointment, PrevisitTask } from '../../types/appointments';
import { useNavigation } from '@react-navigation/native';
import { AppointmentService } from '../../services/appointmentService';

// Keep the doctor images mapping
const doctorImages = {
  doc1: require('../../../assets/Doctors/doctor-smith.jpg'),
  doc2: require('../../../assets/Doctors/Dr-Emily.jpg'),
  doc3: require('../../../assets/Doctors/Dr-Michael.jpeg'),
  doc4: require('../../../assets/Doctors/Dr.Sarah.jpeg'),
};

export default function AppointmentsScreen() {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [checklistVisible, setChecklistVisible] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AppointmentService.getUpcomingAppointments();
      // Filter out cancelled appointments
      const activeAppointments = response.filter(apt => apt.status !== 'cancelled');
      setAppointments(activeAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on initial load
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Fetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  useEffect(() => {
    // Handle deep linking when app is already open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link received:', url);
      if (url.includes('appointments/return')) {
        // Extract meetingId if needed
        const meetingId = url.split('meetingId=')[1];
        console.log('Returned from meeting:', meetingId);
        // Refresh appointments list
        fetchAppointments();
      }
    });
  
    // Handle deep linking when app is opened from background
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('Initial URL:', url);
        if (url.includes('appointments/return')) {
          const meetingId = url.split('meetingId=')[1];
          console.log('Opened from meeting:', meetingId);
          fetchAppointments();
        }
      }
    });
  
    return () => {
      subscription.remove();
    };
  }, []);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  }, []);

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await AppointmentService.cancelAppointment(appointmentId);
      // Only update local state after successful cancellation
      setAppointments(currentAppointments => 
        currentAppointments.filter(apt => apt.id !== appointmentId)
      );
    } catch (error) {
      console.error('Error canceling appointment:', error);
      // Optionally show an error message to the user
      Alert.alert(
        'Error',
        'Failed to cancel appointment. Please try again.'
      );
    }
  };

  const handleRescheduleAppointment = (appointment: Appointment) => {
    // Navigate to ScheduleAppointmentScreen with pre-filled data
    navigation.navigate('ScheduleAppointment', {
      rescheduleData: {
        physicianId: appointment.physicianId,
        visitType: appointment.visitType,
        isVirtual: appointment.isVirtual,
        oldAppointmentId: appointment.id,
        // Add any other relevant data you need
      }
    });
  };

  const handleCompleteTask = async (appointmentId: string, taskType: PrevisitTask['type']) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setChecklistVisible(true);
    }
  };

  const handleTaskCompletion = async (taskId: string) => {
    try {
      await AppointmentService.completeTask(taskId);
      setChecklistVisible(false);
      // Refresh appointments to show updated task status
      fetchAppointments();
    } catch (err) {
      console.error('Error completing task:', err);
    }
  };

  const handleNewAppointment = () => {
    navigation.navigate('ScheduleAppointment');
  };

  const filteredAppointments = appointments.filter(appointment => {
    // const appointmentDate = new Date(appointment.datetime);
    // const now = new Date();
    // return selectedFilter === 'upcoming' ? appointmentDate >= now : appointmentDate < now;
    const appointmentDate = new Date(appointment.datetime);
    const now = new Date();
    console.log('Date comparison:', {
      appointmentDate: appointmentDate.toISOString(),
      now: now.toISOString(),
      isUpcoming: appointmentDate >= now
    });
    const isUpcoming = selectedFilter === 'upcoming' ? appointmentDate >= now : appointmentDate < now;
    return isUpcoming;
  });

  if (loading && appointments.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading appointments...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4B7A6B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppointmentFilters
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      <FlatList
            data={filteredAppointments}
            renderItem={({ item }) => (
              <AppointmentCard
                appointment={item}
                doctorImage={doctorImages[item.physicianId as keyof typeof doctorImages]}
                onCancel={handleCancelAppointment}
                onCompleteTask={handleCompleteTask}
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingVertical: 8 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />

      <NewAppointmentButton onPress={handleNewAppointment} />

      {selectedAppointment && (
        <PrevisitChecklist
          visible={checklistVisible}
          appointment={selectedAppointment}
          onClose={() => {
            setChecklistVisible(false);
            setSelectedAppointment(null);
          }}
          onCompleteTask={handleTaskCompletion}
        />
      )}
    </View>
  );
}