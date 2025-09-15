// src/components/appointments/NewAppointmentButton.tsx
import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { Plus } from 'lucide-react-native';
import { appointmentStyles as styles } from './styles';

interface NewAppointmentButtonProps {
  onPress: () => void;
  style?: object;
}

export const NewAppointmentButton: React.FC<NewAppointmentButtonProps> = ({
  onPress,
  style
}) => {
  const shadowOpacity = new Animated.Value(0.25);

  return (
    <Animated.View style={[{
      position: 'absolute',
      bottom: 24,
      right: 16,
      ...styles.shadowProps,
      shadowOpacity,
    }, style]}>
      <TouchableOpacity
        style={{
          backgroundColor: styles.colors.primary,
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: styles.colors.primary,
          ...styles.shadowProps,
        }}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Plus size={24} color={styles.colors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default NewAppointmentButton;