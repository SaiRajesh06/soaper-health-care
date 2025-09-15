// src/components/charge-details/ChargeInfo.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { CreditCard, Calendar } from 'lucide-react-native';
import { InfoRow } from './InfoRow';
import { styles } from './style';
import { formatDate } from '../../utils/formatters';

interface ChargeInfoProps {
  description: string;
  createdAt: string;
}

export const ChargeInfo = ({ description, createdAt }: ChargeInfoProps) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>Charge Information</Text>
    
    <InfoRow
      icon={<CreditCard color="#4A5568" size={16} />}
      label="Description"
      value={description}
    />

    <InfoRow
      icon={<Calendar color="#4A5568" size={16} />}
      label="Date Created"
      value={formatDate(createdAt)}
    />
  </View>
);