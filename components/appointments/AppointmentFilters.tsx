// src/components/appointments/AppointmentFilters.tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { sharedStyles } from '../../theme/styles';
import { appointmentStyles as styles } from './styles';

interface AppointmentFiltersProps {
  selectedFilter: 'upcoming' | 'past';
  onFilterChange: (filter: 'upcoming' | 'past') => void;
}

export const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <View style={{ padding: 16, backgroundColor: styles.colors.white }}>
      <View style={[styles.row, { 
        backgroundColor: styles.colors.lightGray,
        borderRadius: 8,
        padding: 2,
      }]}>
        <TouchableOpacity
          style={[{
            flex: 1,
            paddingVertical: 7,
            alignItems: 'center',
            borderRadius: 6,
          }, selectedFilter === 'upcoming' && {
            backgroundColor: styles.colors.white,
            ...styles.shadowProps,
          }]}
          onPress={() => onFilterChange('upcoming')}
        >
          <Text style={[
            styles.body,
            { color: selectedFilter === 'upcoming' ? styles.colors.primary : styles.colors.gray }
          ]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[{
            flex: 1,
            paddingVertical: 7,
            alignItems: 'center',
            borderRadius: 6,
          }, selectedFilter === 'past' && {
            backgroundColor: styles.colors.white,
            ...styles.shadowProps,
          }]}
          onPress={() => onFilterChange('past')}
        >
          <Text style={[
            styles.body,
            { color: selectedFilter === 'past' ? styles.colors.primary : styles.colors.gray }
          ]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppointmentFilters;