'use client';

import {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../Constants/themeColors';
import {Fonts} from '../../Constants/Fonts';
import StackHeader from '../../components/Header/StackHeader';
import doctorApi from '../../services/doctorApi';
import { useAlert } from '../../Providers/AlertContext';

const DoctorEarnings = ({navigation, route}) => {
  const {isDarkMode} = useSelector(store => store.theme);
  const theme = isDarkMode ? Colors.darkTheme : Colors.lightTheme;

  // Get the default tab from navigation params
  const defaultTab = route?.params?.defaultTab || 'daily';
  const screenTitle = route?.params?.title || 'Earnings Report';

  const [activeTab, setActiveTab] = useState(defaultTab);

  const { token } = useSelector(store => store.auth.User || {});
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Update active tab when route params change
  useEffect(() => {
    if (route?.params?.defaultTab) {
      setActiveTab(route.params.defaultTab);
    }
  }, [route?.params?.defaultTab]);

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      try {
        const res = await doctorApi.getEarningNegotiation(token);
        setEarningsData(res.data.earningsData || null);
        setTransactions(res.data.transactions || []);
      } catch (err) {
        showAlert(err.response?.data?.message || 'Failed to load earnings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [token]);

  // Use earningsData and transactions if available, otherwise fallback to static data
  // Show loading indicator if loading is true
  const currentData = earningsData || {
    daily: {
      amount: 320,
      consultations: 4,
      averagePerConsultation: 80,
      growthRate: 12,
      pendingPayments: 150,
    },
    weekly: {
      amount: 2100,
      consultations: 28,
      averagePerConsultation: 75,
      growthRate: 8,
      pendingPayments: 300,
    },
    monthly: {
      amount: 8500,
      consultations: 95,
      averagePerConsultation: 89,
      growthRate: 12,
      pendingPayments: 150,
    },
    yearly: {
      amount: 95000,
      consultations: 1200,
      averagePerConsultation: 79,
      growthRate: 15,
      pendingPayments: 500,
    },
  };

  const TabButton = ({title, isActive, onPress}) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: isActive ? theme.primaryColor : 'transparent',
        },
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.tabText,
          {
            color: isActive ? Colors.white : theme.secondryTextColor,
            fontFamily: isActive ? Fonts.Bold : Fonts.Regular,
          },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const StatCard = ({title, value, icon, color, subtitle}) => (
    <View style={[styles.statCard, {backgroundColor: theme.secondryColor}]}>
      <View style={styles.statCardHeader}>
        <Icon name={icon} size={RFPercentage(3)} color={color} />
        <Text style={[styles.statValue, {color}]}>{value}</Text>
      </View>
      <Text style={[styles.statTitle, {color: theme.secondryTextColor}]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, {color: theme.primaryTextColor}]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  const TransactionItem = ({item}) => (
    <View
      style={[
        styles.transactionItem,
        {borderBottomColor: theme.BorderGrayColor},
      ]}>
      <View>
        <Text style={[styles.patientName, {color: theme.primaryTextColor}]}>
          {item.patientName}
        </Text>
        <Text
          style={[styles.transactionDate, {color: theme.secondryTextColor}]}>
          {item.date}
        </Text>
      </View>
      <Text style={[styles.transactionAmount, {color: Colors.success}]}>
        ${item.amount}
      </Text>
    </View>
  );

  const getTabTitle = () => {
    switch (activeTab) {
      case 'daily':
        return 'Daily Earnings';
      case 'weekly':
        return 'Weekly Earnings';
      case 'monthly':
        return 'Monthly Earnings';
      case 'yearly':
        return 'Yearly Earnings';
      default:
        return 'Earnings';
    }
  };

  const getConsultationText = () => {
    const count = currentData.consultations !== undefined ? currentData.consultations : 0;
    switch (activeTab) {
      case 'daily':
        return `${count} Consultations Today`;
      case 'weekly':
        return `${count} Consultations This Week`;
      case 'monthly':
        return `${count} Consultations This Month`;
      case 'yearly':
        return `${count} Consultations This Year`;
      default:
        return `${count} Consultations`;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: wp(4),
      paddingVertical: hp(2),
      justifyContent: 'space-between',
    },
    tabButton: {
      paddingHorizontal: wp(4),
      paddingVertical: hp(1.5),
      borderRadius: wp(2),
      minWidth: wp(20),
      alignItems: 'center',
    },
    tabText: {
      fontSize: RFPercentage(1.8),
    },
    contentContainer: {
      padding: wp(4),
    },
    earningsContainer: {
      alignItems: 'center',
      marginBottom: hp(3),
    },
    earningsAmount: {
      fontSize: RFPercentage(4),
      fontFamily: Fonts.Bold,
      color: Colors.success,
      marginBottom: hp(1),
    },
    earningsTitle: {
      fontSize: RFPercentage(2.2),
      fontFamily: Fonts.Medium,
      color: theme.primaryTextColor,
      marginBottom: hp(0.5),
    },
    consultationsText: {
      fontSize: RFPercentage(1.8),
      fontFamily: Fonts.Regular,
      color: theme.secondryTextColor,
    },
    statsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: hp(3),
    },
    statCard: {
      width: '48%',
      padding: wp(4),
      borderRadius: wp(3),
      marginBottom: hp(2),
      elevation: 2,
    },
    statCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: hp(1),
    },
    statValue: {
      fontSize: RFPercentage(2.2),
      fontFamily: Fonts.Bold,
    },
    statTitle: {
      fontSize: RFPercentage(1.6),
      fontFamily: Fonts.Regular,
    },
    statSubtitle: {
      fontSize: RFPercentage(1.4),
      fontFamily: Fonts.Medium,
      marginTop: hp(0.5),
    },
    sectionTitle: {
      fontSize: RFPercentage(2.2),
      fontFamily: Fonts.Bold,
      color: theme.primaryTextColor,
      marginBottom: hp(2),
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: hp(2),
      borderBottomWidth: 1,
    },
    patientName: {
      fontSize: RFPercentage(2),
      fontFamily: Fonts.Medium,
    },
    transactionDate: {
      fontSize: RFPercentage(1.6),
      fontFamily: Fonts.Regular,
      marginTop: hp(0.5),
    },
    transactionAmount: {
      fontSize: RFPercentage(2),
      fontFamily: Fonts.Bold,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StackHeader title={screenTitle} />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton
          title="Daily"
          isActive={activeTab === 'daily'}
          onPress={() => setActiveTab('daily')}
        />
        <TabButton
          title="Weekly"
          isActive={activeTab === 'weekly'}
          onPress={() => setActiveTab('weekly')}
        />
        <TabButton
          title="Monthly"
          isActive={activeTab === 'monthly'}
          onPress={() => setActiveTab('monthly')}
        />
        <TabButton
          title="Yearly"
          isActive={activeTab === 'yearly'}
          onPress={() => setActiveTab('yearly')}
        />
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.earningsContainer}>
          <Text style={styles.earningsAmount}>${currentData.amount !== undefined ? currentData.amount : 0}</Text>
          <Text style={styles.earningsTitle}>{getTabTitle()}</Text>
          <Text style={styles.consultationsText}>{getConsultationText()}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Average per Consultation"
            value={`$${currentData.averagePerConsultation !== undefined ? currentData.averagePerConsultation : 0}`}
            icon="calculator"
            color={theme.primaryColor}
          />
          <StatCard
            title="Total Consultations"
            value={currentData.consultations !== undefined ? currentData.consultations : 0}
            icon="account-group"
            color={Colors.success}
          />
          <StatCard
            title="Growth Rate"
            value={`+${currentData.growthRate !== undefined ? currentData.growthRate : 0}%`}
            icon="trending-up"
            color={Colors.success}
          />
          <StatCard
            title="Pending Payments"
            value={`$${currentData.pendingPayments !== undefined ? currentData.pendingPayments : 0}`}
            icon="clock-outline"
            color={Colors.error}
          />
        </View>

        {/* Recent Transactions */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.length === 0 ? (
          <Text style={styles.consultationsText}>No transactions found.</Text>
        ) : (
          transactions.map(transaction => (
            <TransactionItem key={transaction.id || transaction._id} item={transaction} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorEarnings;
