// src/hooks/useAppointments.ts
import { useState, useEffect } from 'react';
import { AppointmentService } from '../services/appointmentService';

interface Physician {
  id: string;
  user: {
    first_name: string;
    last_name: string;
  };
  specialty: string;
}

interface Location {
  id: string;
  name: string;
  address_line1: string;
  city: string;
  state: string;
}

interface TimeSlot {
  datetime: string;
  duration: number;
  is_preferred_time: boolean;
}

interface VisitType {
  id: string;
  name: string;
  description: string;
  is_telehealth: boolean;
  default_duration: number;
}

interface AppointmentState {
  physicians: Physician[];
  locations: Location[];
  availableSlots: TimeSlot[];
  selectedPhysician: Physician | null;
  selectedLocation: Location | null;
  selectedSlot: TimeSlot | null;
  visitTypes: VisitType[];
  selectedVisitType: VisitType | null;
}

interface LoadingState {
  physicians: boolean;
  locations: boolean;
  slots: boolean;
  scheduling: boolean;
  visitTypes: boolean;
}

interface AppointmentCreateRequest {
  physicianId: string;
  locationId: string | null;
  dateTime: string;
  duration: number;
  visit_type?: string;
  slot_type?: string;
}

export const useAppointments = () => {
  const [state, setState] = useState<AppointmentState>({
    physicians: [],
    locations: [],
    availableSlots: [],
    selectedPhysician: null,
    selectedLocation: null,
    selectedSlot: null,
    visitTypes: [],
    selectedVisitType: null
  });

  const [loading, setLoading] = useState<LoadingState>({
    physicians: true,
    locations: false,
    slots: false,
    scheduling: false,
    visitTypes: false
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPhysicians();
  }, []);

  useEffect(() => {
    if (state.selectedPhysician) {
      fetchVisitTypes();
    }
  }, [state.selectedPhysician]);

  useEffect(() => {
    if (state.selectedPhysician && state.selectedVisitType && !state.selectedVisitType.is_telehealth) {
      fetchLocations();
    }
  }, [state.selectedPhysician, state.selectedVisitType]);

  useEffect(() => {
    if (state.selectedLocation || (state.selectedVisitType?.is_telehealth && state.selectedPhysician)) {
      fetchTimeSlots();
    }
  }, [state.selectedLocation, state.selectedVisitType]);

  const fetchPhysicians = async () => {
    try {
      setLoading(prev => ({ ...prev, physicians: true }));
      setError(null);
      const response = await AppointmentService.getAvailablePhysicians();
      setState(prev => ({ ...prev, physicians: response.items || [] }));
    } catch (err) {
      setError('Failed to load physicians');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, physicians: false }));
    }
  };

  const fetchVisitTypes = async () => {
    if (!state.selectedPhysician) return;
    try {
      setLoading(prev => ({ ...prev, visitTypes: true }));
      setError(null);
      const response = await AppointmentService.getPhysicianVisitTypes(state.selectedPhysician.id);
      const defaultVisitType = response.find(vt => vt.name === "Standard Office Visit");
      setState(prev => ({ 
        ...prev, 
        visitTypes: response || [],
        selectedVisitType: defaultVisitType || null
      }));
    } catch (err) {
      setError('Failed to load visit types');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, visitTypes: false }));
    }
  };

  const fetchLocations = async () => {
    if (!state.selectedPhysician) return;
    try {
      setLoading(prev => ({ ...prev, locations: true }));
      setError(null);
      const response = await AppointmentService.getPhysicianLocations(state.selectedPhysician.id);
      setState(prev => ({ ...prev, locations: response || [] }));
    } catch (err) {
      setError('Failed to load locations');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, locations: false }));
    }
  };

  const fetchTimeSlots = async () => {
    if (!state.selectedPhysician || (!state.selectedLocation && !state.selectedVisitType?.is_telehealth)) return;
    try {
      setLoading(prev => ({ ...prev, slots: true }));
      setError(null);
      const response = await AppointmentService.getNextAvailable(
        state.selectedPhysician.id,
        {
          locationId: state.selectedLocation?.id,
          startDate: new Date().toISOString().split('T')[0]
        }
      );
      setState(prev => ({ ...prev, availableSlots: response.slots || [] }));
    } catch (err) {
      setError('Failed to load time slots');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, slots: false }));
    }
  };

  const scheduleAppointment = async (appointmentDetails: AppointmentCreateRequest) => {
    try {
      setLoading(prev => ({ ...prev, scheduling: true }));
      setError(null);
      
      const requestData = {
        physician_id: appointmentDetails.physicianId,
        location_id: state.selectedVisitType?.is_telehealth ? null : appointmentDetails.locationId,
        scheduled_datetime: appointmentDetails.dateTime,
        duration_minutes: state.selectedVisitType?.default_duration || 30,
        visit_type: state.selectedVisitType?.name || "Standard Office Visit",
        slot_type: "appointment"
      };

      await AppointmentService.scheduleAppointment(requestData);
    } catch (err) {
      setError('Failed to schedule appointment');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, scheduling: false }));
    }
  };

  const selectPhysician = (physician: Physician) => {
    setState(prev => ({
      ...prev,
      selectedPhysician: physician,
      selectedLocation: null,
      selectedSlot: null,
      selectedVisitType: null,
      locations: [],
      availableSlots: [],
      visitTypes: []
    }));
  };

  const selectVisitType = (visitType: VisitType) => {
    setState(prev => ({
      ...prev,
      selectedVisitType: visitType,
      selectedLocation: visitType.is_telehealth ? null : prev.selectedLocation,
      selectedSlot: null,
      availableSlots: []
    }));
  };

  const selectLocation = (location: Location) => {
    setState(prev => ({
      ...prev,
      selectedLocation: location,
      selectedSlot: null,
      availableSlots: []
    }));
  };

  const selectTimeSlot = (slot: TimeSlot) => {
    setState(prev => ({
      ...prev,
      selectedSlot: slot
    }));
  };

  return {
    // Data
    physicians: state.physicians,
    locations: state.locations,
    availableSlots: state.availableSlots,
    selectedPhysician: state.selectedPhysician,
    selectedLocation: state.selectedLocation,
    selectedSlot: state.selectedSlot,
    visitTypes: state.visitTypes,
    selectedVisitType: state.selectedVisitType,
    
    // Loading states
    loading,
    error,
    
    // Actions
    selectPhysician,
    selectLocation,
    selectTimeSlot,
    selectVisitType,
    scheduleAppointment,
    
    // Fetch methods (in case we need to refresh data)
    refreshPhysicians: fetchPhysicians,
    refreshLocations: fetchLocations,
    refreshTimeSlots: fetchTimeSlots
  };
};