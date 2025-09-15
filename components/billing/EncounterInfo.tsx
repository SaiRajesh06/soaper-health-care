// src/components/charge-details/EncounterInfo.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { User } from 'lucide-react-native';
import { InfoRow } from './InfoRow';
import { styles } from './style';
import { Encounter } from '../../types/billing';

interface EncounterInfoProps {
  encounter: Encounter;
}

export const EncounterInfo = ({ encounter }: EncounterInfoProps) => (
  <>
    <Text style={styles.sectionTitle}>Encounter Details</Text>

    <InfoRow
      icon={<User color="#4A5568" size={16} />}
      label="Type"
      value={encounter.encounter_type}
    />

    {encounter.meta_chief_complaint && (
      <InfoRow
        icon={<User color="#4A5568" size={16} />}
        label="Chief Complaint"
        value={encounter.meta_chief_complaint}
      />
    )}

    {encounter.meta_visit_reason && (
      <InfoRow
        icon={<User color="#4A5568" size={16} />}
        label="Visit Reason"
        value={encounter.meta_visit_reason}
      />
    )}
  </>
);