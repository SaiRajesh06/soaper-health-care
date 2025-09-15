// src/screens/home/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  ScheduleAppointmentScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ScheduleAppointmentScreen'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleScheduleVisit = () => {
    navigation.navigate('Appointments', {
      screen: 'ScheduleAppointmentScreen'
    });
  };

  // Rest of your component remains exactly the same
  const navigationItems = [
    { icon: 'home', label: 'Home', isActive: true },
    { icon: 'message-text-outline', label: 'Messages', isActive: false },
    { icon: 'clipboard-check-outline', label: 'Care Plan', badge: 1, isActive: false },
    { icon: 'chart-line', label: 'My Health', isActive: false }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logo}>
              <Icon name="dots-hexagon" size={28} color="#0F172A" />
            </View>
            <Text style={styles.headerTitle}>Patient Name</Text>
          </View>
        </View>

        {/* Welcome Card */}
        <TouchableOpacity style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeIcon}>
              <Icon name="check-circle-outline" size={24} color="#10B981" />
            </View>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>Welcome to your healthcare hub</Text>
              <Text style={styles.welcomeSubtitle}>Set up your profile for personalized care</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={24} color="#94A3B8" />
        </TouchableOpacity>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionGrid}>
            {[
              { icon: 'calendar-clock', title: 'Schedule Visit', onPress: handleScheduleVisit, color:'FFFFFF'},
              { icon: 'video', title: 'Virtual Care', onPress: () => {}, color:'FFFFFF' },
              { icon: 'pill', title: 'Medications', onPress: () => {}, color: 'FFFFFF' },
              { icon: 'file-document-outline', title: 'Records', onPress: () => {}, color: 'FFFFFF' },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={[styles.actionItem, { backgroundColor: item.color }]} onPress={item.onPress}>
                <View style={styles.actionIcon}>
                  <Icon name={item.icon} size={24} color="#FF7E47" />
                </View>
                <Text style={styles.actionTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Care Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Options</Text>
          <View style={styles.careOptionsContainer}>
            {[
              {
                icon: 'stethoscope',
                title: 'Primary Care',
                description: 'Book an appointment with your doctor',
                badge: 'Available Today'
              },
              {
                icon: 'message-processing-outline',
                title: 'Message Provider',
                description: 'Send a secure message to your care team'
              },
              {
                icon: 'video-outline',
                title: 'Urgent Video Chat',
                description: 'Connect with a provider within minutes',
                badge: '24/7 Care'
              }
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.careOption}>
                <View style={styles.careOptionLeft}>
                  <View style={styles.careOptionIcon}>
                    <Icon name={item.icon} size={24} color="#475569" />
                  </View>
                  <View style={styles.careOptionContent}>
                    <Text style={styles.careOptionTitle}>{item.title}</Text>
                    <Text style={styles.careOptionDescription}>{item.description}</Text>
                    {item.badge && (
                      <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // All your existing styles remain exactly the same
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 12,
  },
  settingsButton: {
    padding: 8,
  },
  welcomeCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  welcomeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  seeAllButton: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B7A6B',
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  careOptionsContainer: {
    gap: 12,
  },
  careOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
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
    marginBottom: 8,
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  navItem: {
    alignItems: 'center',
  },
  navIconContainer: {
    position: 'relative',
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  navBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  navLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#10B981',
  },
});

export default HomeScreen;