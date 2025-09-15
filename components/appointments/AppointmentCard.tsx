// src/components/appointments/AppointmentCard.tsx
import React, { useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Linking, Platform } from 'react-native';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Appointment, PrevisitTask } from '../../types/appointments';
import { AppointmentService } from '../../services/appointmentService';
import ZoomLauncher from '../../services/ZoomLauncher';
import { useNavigation } from '@react-navigation/native';
import type { AppointmentsNavigationProp } from '../../types/navigation';



// Map of doctor IDs to their respective image assets
const doctorImages = {
  doc1: require('../../../assets/Doctors/doctor-smith.jpg'),
  doc2: require('../../../assets/Doctors/Dr-Emily.jpg'),
  doc3: require('../../../assets/Doctors/Dr-Michael.jpeg'),
  doc4: require('../../../assets/Doctors/Dr.Sarah.jpeg'),
};

interface AppointmentCardProps {
  appointment: Appointment;
  doctorImage: any;
  onCancel: (id: string) => void;
  onCompleteTask: (appointmentId: string, taskType: PrevisitTask['type']) => void;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 8,
    color: '#FF7E47',
  },
  dateTimeInfo: {
    flexDirection: 'column',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  timeText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  doctorContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF', // FCF7EE
    borderRadius: 8,
    marginBottom: 12,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  checklistContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  checklistHeader: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  taskIcon: {
    marginRight: 8,
    color: '#FF7E47',
  },
  checklistText: {
    fontSize: 15,
    color: '#1C1C1E',
    flex: 1,
  },
  // Updated styles for action buttons to match the minimal design
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  secondaryButton: {
    backgroundColor: '#4B7A6B', // green
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  tertiaryButton: {
    backgroundColor: '#D7ECE5',
  },
  tertiaryButtonText: {
    color: '#527A6E',
    fontSize: 16,
    fontWeight: '500',
  },
  virtualVisitButton: {
    backgroundColor: '#FF7E47',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 12,
  },
  virtualVisitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  virtualVisitIcon: {
    marginRight: 8,
    color: '#FFFFFF',
  },
  virtualVisitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  doctorImage,
  onCancel,
  onCompleteTask,
}) => {
  const navigation = useNavigation<AppointmentsNavigationProp>();
  const [isJoining, setIsJoining] = useState(false);
  const incompleteTasks = appointment.previsitTasks.filter(task => !task.completed && task.required);
  const hasIncompleteTasks = incompleteTasks.length > 0;
  const [zoomLauncher] = useState(new ZoomLauncher());
  const [isCancelling, setIsCancelling] = useState(false);

  const handleReschedule = () => {
    navigation.navigate('ScheduleAppointment', {
      rescheduleData: {
        physicianId: appointment.physicianId,
        visitType: appointment.visitType,
        isVirtual: appointment.isVirtual,
        oldAppointmentId: appointment.id,
      }
    });
  };

  const handleJoinVirtualVisit = async () => {
    try {
      setIsJoining(true);
      const response = await AppointmentService.getZoomLink(appointment.id);
      console.log('Zoom link response:', response);
      
      const zoomScheme = Platform.select({
        ios: 'zoomus://',
        android: 'zoomus://'
      }) || 'zoomus://';
      
      const zoomUrl = response.join_url;
      const meetingId = zoomUrl.split('zoom.us/j/')[1].split('?')[0];
      
      // Create a more structured return URL
      const returnUrl = `soaperemr://appointments/return?meetingId=${meetingId}&appointmentId=${appointment.id}`;
      console.log('Return URL:', returnUrl);
      
      const zoomDeepLink = `${zoomScheme}join?action=join&confno=${meetingId}&pwd=${response.password}&browser=0&uname=${encodeURIComponent("Patient")}&returnTo=${encodeURIComponent(returnUrl)}`;
      
      console.log('Attempting to open:', zoomDeepLink);
      
      try {
        await Linking.openURL(zoomDeepLink);
      } catch (error) {
        console.log('Failed to open Zoom app, checking if installed...');
        
        const zoomAvailable = await Linking.canOpenURL(zoomScheme);
        if (!zoomAvailable) {
          Alert.alert(
            'Zoom Not Installed',
            'Please install the Zoom app to join virtual visits.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Install Zoom', 
                onPress: () => {
                  const storeUrl = Platform.select({
                    ios: 'https://apps.apple.com/us/app/zoom-cloud-meetings/id546505307',
                    android: 'https://play.google.com/store/apps/details?id=us.zoom.videomeetings'
                  }) || 'https://zoom.us/download';
                  Linking.openURL(storeUrl);
                }
              }
            ]
          );
        } else {
          await Linking.openURL(zoomUrl);
        }
      }
    } catch (error) {
      console.error('Error in handleJoinVirtualVisit:', error);
      Alert.alert(
        'Unable to Join Visit',
        'There was an error joining the virtual visit.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsJoining(false);
    }
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsCancelling(true);
              await AppointmentService.cancelAppointment(appointment.id);
              // Call the onCancel prop after successful cancellation
              onCancel(appointment.id);
            } catch (error) {
              console.error('Error cancelling appointment:', error);
              Alert.alert(
                'Error',
                'Failed to cancel appointment. Please try again later.'
              );
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getTaskIcon = (type: PrevisitTask['type']) => {
    switch (type) {
      case 'questionnaire': return 'clipboard-text-outline';
      case 'medications': return 'pill';
      case 'copay': return 'credit-card-outline';
      default: return 'checkbox-marked-circle-outline';
    }
  };

  // Check if the appointment is within 15 minutes of start time
  const canJoinMeeting = () => {
    const now = new Date();
    const appointmentTime = new Date(appointment.datetime);
    const timeDiff = (appointmentTime.getTime() - now.getTime()) / (1000 * 60); // difference in minutes
    return timeDiff <= 15 && timeDiff >= -60; // can join 15 minutes before until 60 minutes after start
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Icon name="calendar" size={24} style={styles.dateIcon} />
          <View style={styles.dateTimeInfo}>
            <Text style={styles.dateText}>
              {format(new Date(appointment.datetime), 'EEE, MMM d')}
            </Text>
            <Text style={styles.timeText}>
              {format(new Date(appointment.datetime), 'h:mm a')}
            </Text>
          </View>
        </View>
      </View>

      {/* Doctor Info */}
      <View style={styles.doctorContainer}>
        <Image
          source={doctorImage || doctorImages[appointment.physicianId as keyof typeof doctorImages]}
          style={styles.doctorImage}
          resizeMode="cover"
        />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>Dr. {appointment.physicianName}</Text>
          <Text style={styles.infoText}>
            {appointment.department}, {appointment.isVirtual ? 'Virtual Visit' : appointment.location}
          </Text>
        </View>
      </View>

      {/* Pre-visit Checklist */}
      {hasIncompleteTasks && (
        <View style={styles.checklistContainer}>
          <Text style={styles.checklistHeader}>Required Pre-visit Tasks</Text>
          {incompleteTasks.map(task => (
            <TouchableOpacity
              key={task.id}
              style={styles.checklistItem}
              onPress={() => onCompleteTask(appointment.id, task.type)}
            >
              <Icon name={getTaskIcon(task.type)} size={20} style={styles.taskIcon} />
              <Text style={styles.checklistText}>
                {task.type === 'questionnaire' ? 'Complete Health Questionnaire' :
                 task.type === 'medications' ? 'Review Medications' : 
                 'Process Copayment'}
              </Text>
              <Icon name="chevron-right" size={20} color="#666666" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Add Virtual Visit Button if applicable */}
      {appointment.isVirtual && canJoinMeeting() && (
        <TouchableOpacity
          style={styles.virtualVisitButton}
          onPress={handleJoinVirtualVisit}
          disabled={isJoining}
        >
          <View style={styles.virtualVisitContainer}>
            <Icon name="video" size={20} style={styles.virtualVisitIcon} />
            <Text style={styles.virtualVisitText}>
              {isJoining ? 'Opening Zoom...' : 'Join Virtual Visit'}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Updated Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleReschedule}
          disabled={isCancelling}
        >
          <Text style={styles.secondaryButtonText}>Reschedule</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button, 
            styles.tertiaryButton,
            isCancelling && styles.disabledButton
          ]}
          onPress={handleCancelAppointment}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <Text style={styles.tertiaryButtonText}>Cancelling...</Text>
          ) : (
            <Text style={styles.tertiaryButtonText}>Cancel</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppointmentCard;