// src/components/billing/styles.ts
import { StyleSheet, Platform } from 'react-native';


export const billingStyles = StyleSheet.create({
  messageText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    padding: 20,
    color: '#D32F2F',
  },
  statusTextBase: {
    fontSize: 12,
    marginTop: 4,
  },
  statusTextScheduled: {
    color: '#2E7D32', // Green
  },
  statusTextCancelled: {
    color: '#D32F2F', // Red
  },
  statusTextDefault: {
    color: '#F9A825', // Yellow
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  balanceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  payButton: {
    backgroundColor: '#5A8678', // changed colour
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionDesc: {
    fontSize: 16,
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  insuranceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  insuranceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  insuranceDetails: {
    fontSize: 16,
    marginBottom: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#5A8678', // changed colour
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#5A8678', // changed colour
    fontWeight: '600',
  },
  statusTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5F1FF', //hover
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  statusTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeStatusTab: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusTabText: {
    fontSize: 14,
    color: '#666',
  },
  activeStatusTabText: {
    color: '#5A8678', // changed colour
    fontWeight: '600',
  },
  dueDate: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
  },
  pendingText: {
    fontSize: 12,
    color: '#F9A825',
    marginTop: 4,
  },
  paidText: {
    fontSize: 12,
    color: '#2E7D32',
    marginTop: 4,
  },
  visitInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export const styles = StyleSheet.create({
  // Layout styles
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadingText: {
    marginLeft: 8,
  },

  // Header styles
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },

  // Summary styles
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  summaryTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  chargeType: {
    fontSize: 14,
    color: '#666',
  },

  // Card section styles
  cardSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    marginTop: 12,
  },
  cardList: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Status Badge styles
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Info Row styles
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#718096',
  },
  value: {
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500',
  },

  // Card Item styles
  cardItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedCard: {
    backgroundColor: '#F0F8FF',
    borderColor: '#5A8678', // changed colour
    borderWidth: 2,
  },
  cardItemContent: {
    flex: 1,
  },
  cardBrandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    color: '#1a1a1a',
  },
  selectedText: {
    color: '#5A8678', // changed colour
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    fontSize: 15,
    color: '#666',
  },
  cardExpiry: {
    fontSize: 14,
    color: '#666',
  },
  selectedIndicator: {
    marginLeft: 12,
  },

  // No Cards Container
  noCardsContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
  },
  noCardsText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },

  // Add Card Button styles
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#5A8678', // changed colour
    borderRadius: 12,
    marginBottom: 16,
  },
  addCardText: {
    marginLeft: 8,
    color: '#5A8678', // changed colour
    fontSize: 16,
    fontWeight: '500',
  },

  // Payment Options styles
  paymentOptions: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  platformPayButton: {
    height: 48,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5A8678', // changed colour
    padding: 18,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  orText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#718096',
    textAlign: 'center',
    marginVertical: 12,
  },

  // Security styles
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  securityText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontSize: 14,
  },
});


export const addCardstyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  cardField: {
    height: 50,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#5A8678', // changed colour
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#5A8678', // changed colour
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  saveButton: {
    backgroundColor: '#5A8678', // changed colour
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  saveIcon: {
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secureText: {
    fontSize: 14,
    color: '#4a4a4a',
    textAlign: 'center',
    marginTop: 16,
  },
});