import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import type { Appointment, PrevisitTask } from '../../types/appointments';
import { appointmentStyles as styles } from './styles';

interface PrevisitChecklistProps {
  visible: boolean;
  appointment: Appointment;
  onClose: () => void;
  onCompleteTask: (taskId: string) => Promise<void>;
}

export const PrevisitChecklist: React.FC<PrevisitChecklistProps> = ({
  visible,
  appointment,
  onClose,
  onCompleteTask,
}) => {
  const getTaskLabel = (task: PrevisitTask) => {
    switch (task.type) {
      case 'questionnaire':
        return 'Health Questionnaire';
      case 'medications':
        return 'Medications Review';
      case 'copay':
        return 'Process Copayment';
      default:
        return '';
    }
  };

  const getTaskDescription = (task: PrevisitTask) => {
    switch (task.type) {
      case 'questionnaire':
        return 'Please complete a brief health questionnaire to help us prepare for your visit.';
      case 'medications':
        return 'Review and update your current medications list.';
      case 'copay':
        return 'Process your visit copayment in advance.';
      default:
        return '';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.modalHeader}>
          <Text style={styles.heading}>Pre-visit Tasks</Text>
          <TouchableOpacity
            style={{ padding: 8 }}
            onPress={onClose}
          >
            <X size={24} color={styles.colors.black} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={{ padding: 16, backgroundColor: styles.colors.lightGray }}>
            <Text style={styles.heading}>
              Appointment on {new Date(appointment.datetime).toLocaleDateString()}
            </Text>
            <Text style={styles.subheading}>
              with Dr. {appointment.physicianName}
            </Text>
          </View>

          <View style={{ padding: 16 }}>
            {appointment.previsitTasks.map((task) => (
              <View key={task.id} style={[styles.card, styles.shadowProps, { marginBottom: 16 }]}>
                <View style={styles.row}>
                  <Text style={styles.heading}>{getTaskLabel(task)}</Text>
                  <View style={[
                    styles.badge,
                    { backgroundColor: task.completed ? 
                      styles.colors.success + '20' : // 20 is for opacity
                      styles.colors.warning + '20'
                    }
                  ]}>
                    <Text style={[
                      styles.badgeText,
                      { color: task.completed ? styles.colors.success : styles.colors.warning }
                    ]}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.body, { marginTop: 8, color: styles.colors.gray }]}>
                  {getTaskDescription(task)}
                </Text>

                {!task.completed && (
                  <TouchableOpacity
                    style={[
                      task.type === 'questionnaire' ? styles.secondaryButton :
                      task.type === 'medications' ? styles.tertiaryButton :
                      task.type === 'copay' ? styles.quaternaryButton :
                      styles.primaryButton,
                      { marginTop: 16 }
                    ]}
                    onPress={() => onCompleteTask(task.id)}
                  >
                    <Text style={[
                      task.type === 'questionnaire' ? styles.secondaryButtonText :
                      task.type === 'medications' ? styles.tertiaryButtonText :
                      task.type === 'copay' ? styles.quaternaryButtonText :
                      styles.primaryButtonText
                    ]}>
                      Complete Now
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.primaryButton, { paddingVertical: 16 }]}
            onPress={onClose}
          >
            <Text style={[styles.primaryButtonText, { fontSize: 17 }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PrevisitChecklist;
