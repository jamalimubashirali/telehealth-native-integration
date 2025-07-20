'use client';

import {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
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
import {SCREENS} from '../../Constants/Screens';
import CustomButton from '../../components/Buttons/customButton';
import {SafeAreaView} from 'react-native';
import {useLogout} from '../../utils/authUtils';
import doctorApi from '../../services/doctorApi';
import { useAlert } from '../../Providers/AlertContext';
import { getToken } from '../../utils/tokenStorage';

const DoctorDashboard = ({navigation}) => {
  const {isDarkMode} = useSelector(store => store.theme);
  const {User} = useSelector(store => store.auth);
  const logout = useLogout();
  const { token } = getToken();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    todayAppointments: 5,
    totalPatients: 45,
    todayEarnings: 320,
    monthlyEarnings: 8500,
    pendingAppointments: 3,
    completedToday: 2,
    newPatients: 3, // New patients this week
    activePatients: 42, // Currently active patients
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [patientsTreated, setPatientsTreated] = useState([]);
  const [availabilityStatus, setAvailabilityStatus] = useState('');

  const theme = isDarkMode ? Colors.darkTheme : Colors.lightTheme;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard stats
      const dashboardRes = await doctorApi.getDoctorDashboard();
      setDashboardStats(dashboardRes.data.dashboardStats || {});
      setAvailabilityStatus(dashboardRes.data.dashboardStats?.availability || 'Unavailable');
      // Fetch today's appointments
      const upcomingRes = await doctorApi.getDoctorUpcomingAppointments();
      // Filter today's appointments by date
      const todayDate = new Date().toISOString().slice(0, 10);
      const todays = (upcomingRes.data.appointments || []).filter(appt => {
        const apptDate = new Date(appt.date).toISOString().slice(0, 10);
        return apptDate === todayDate;
      });
      setTodayAppointments(todays);
      // Fetch consultation history for patients treated
      const historyRes = await doctorApi.getConsultationHistory();
      const consultations = historyRes.data.appointments || [];
      // Extract unique patients
      const patientMap = {};
      consultations.forEach(appt => {
        if (appt.patient && appt.patient._id) {
          if (!patientMap[appt.patient._id]) {
            patientMap[appt.patient._id] = {
              ...appt.patient,
              visitCount: 1
            };
          } else {
            patientMap[appt.patient._id].visitCount += 1;
          }
        }
      });
      setPatientsTreated(Object.values(patientMap));
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to load dashboard', 'error');
      setTodayAppointments([]);
      setPatientsTreated([]);
      setAvailabilityStatus('Unavailable');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout(navigation);
  };

  const handleAvailability = async (status) => {
    try {
      await doctorApi.setOrUpdateAvailability({ status }, token);
      showAlert('Availability updated', 'success');
      fetchDashboardData();
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to update availability', 'error');
    }
  };

  // Enhanced stat card with different actions
  const StatCard = ({title, value, icon, color, onPress, subtitle}) => (
    <TouchableOpacity
      style={[styles.statCard, {backgroundColor: theme.secondryColor}]}
      onPress={onPress}>
      <View style={styles.statCardHeader}>
        <Icon name={icon} size={RFPercentage(3)} color={color} />
        <Text style={[styles.statValue, {color}]}>{value}</Text>
      </View>
      <Text style={[styles.statTitle, {color: theme.secondryTextColor}]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, {color: theme.primaryColor}]}>
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );

  const QuickActionCard = ({title, icon, onPress, color}) => (
    <TouchableOpacity
      style={[styles.quickActionCard, {backgroundColor: theme.secondryColor}]}
      onPress={onPress}>
      <Icon name={icon} size={RFPercentage(4)} color={color} />
      <Text style={[styles.quickActionText, {color: theme.primaryTextColor}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: wp(4),
      paddingTop: hp(2),
      marginBottom: hp(2),
    },
    headerInfo: {
      flex: 1,
    },
    welcomeText: {
      fontSize: RFPercentage(2.8),
      fontFamily: Fonts.Bold,
      color: theme.primaryTextColor,
      marginBottom: hp(0.5),
    },
    dateText: {
      fontSize: RFPercentage(2),
      fontFamily: Fonts.Regular,
      color: theme.secondryTextColor,
    },
    logoutButton: {
      padding: wp(2.5),
      borderRadius: wp(2),
      backgroundColor: theme.secondryColor,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    scrollContainer: {
      padding: wp(4),
    },
    availabilityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.secondryColor,
      padding: wp(4),
      borderRadius: wp(3),
      marginBottom: hp(2),
    },
    availabilityText: {
      fontSize: RFPercentage(2.2),
      fontFamily: Fonts.Medium,
      color: theme.primaryTextColor,
    },
    availabilityStatus: {
      fontSize: RFPercentage(1.8),
      fontFamily: Fonts.Regular,
      color: Colors.success,
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
      fontSize: RFPercentage(2.5),
      fontFamily: Fonts.Bold,
    },
    statTitle: {
      fontSize: RFPercentage(1.8),
      fontFamily: Fonts.Regular,
    },
    statSubtitle: {
      fontSize: RFPercentage(1.4),
      fontFamily: Fonts.Medium,
      marginTop: hp(0.5),
    },
    sectionTitle: {
      fontSize: RFPercentage(2.4),
      fontFamily: Fonts.Bold,
      color: theme.primaryTextColor,
      marginBottom: hp(2),
    },
    quickActionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: hp(3),
    },
    quickActionCard: {
      width: '48%',
      padding: wp(4),
      borderRadius: wp(3),
      alignItems: 'center',
      marginBottom: hp(2),
      elevation: 2,
    },
    quickActionText: {
      fontSize: RFPercentage(1.8),
      fontFamily: Fonts.Medium,
      marginTop: hp(1),
      textAlign: 'center',
    },
    appointmentCard: {
      backgroundColor: theme.secondryColor,
      padding: wp(4),
      borderRadius: wp(3),
      marginBottom: hp(1.5),
      elevation: 2,
    },
    appointmentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(1),
    },
    patientName: {
      fontSize: RFPercentage(2.2),
      fontFamily: Fonts.Medium,
      color: theme.primaryTextColor,
    },
    appointmentTime: {
      fontSize: RFPercentage(1.8),
      fontFamily: Fonts.Regular,
      color: theme.secondryTextColor,
    },
    appointmentType: {
      fontSize: RFPercentage(1.6),
      fontFamily: Fonts.Regular,
      color: theme.primaryColor,
    },
    joinButton: {
      backgroundColor: Colors.success,
      paddingHorizontal: wp(4),
      paddingVertical: hp(1),
      borderRadius: wp(2),
    },
    joinButtonText: {
      color: Colors.white,
      fontSize: RFPercentage(1.8),
      fontFamily: Fonts.Medium,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.welcomeText}>
            Welcome back, Dr. {User?.name || 'Doctor'}
          </Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon
            name="logout"
            size={RFPercentage(3)}
            color={theme.primaryColor}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.availabilityContainer}>
          <View>
            <Text style={styles.availabilityText}>Availability Status</Text>
            <Text style={styles.availabilityStatus}>{availabilityStatus}</Text>
          </View>
          <CustomButton text={availabilityStatus === 'Available' ? 'Go Offline' : 'Go Online'} onPress={() => handleAvailability(availabilityStatus === 'Available' ? 'offline' : 'online')} />
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            title="Today's Appointments"
            value={dashboardStats.todayAppointments !== undefined ? dashboardStats.todayAppointments : 0}
            icon="calendar-today"
            color={theme.primaryColor}
            onPress={() => navigation.navigate(SCREENS.DOCTOR_APPOINTMENTS)}
          />

          <StatCard
            title="Patient Analytics"
            value={dashboardStats.totalPatients !== undefined ? dashboardStats.totalPatients : 0}
            subtitle={dashboardStats.newPatients !== undefined ? `+${dashboardStats.newPatients} this week` : 'No new patients this week'}
            icon="account-group"
            color={Colors.success}
            onPress={() =>
              navigation.navigate(SCREENS.DOCTOR_PATIENTS, {
                filter: 'analytics',
                title: 'Patient Analytics',
              })
            }
          />

          {/* <StatCard
            title="Today's Earnings"
            value={`$${dashboardStats.todayEarnings}`}
            icon="currency-usd"
            color={Colors.success}
            onPress={() =>
              navigation.navigate(SCREENS.DOCTOR_EARNINGS, {
                defaultTab: 'daily',
                title: 'Daily Earnings Report',
              })
            }
          />
          <StatCard
            title="Monthly Earnings"
            value={`$${dashboardStats.monthlyEarnings}`}
            icon="chart-line"
            color={theme.primaryColor}
            onPress={() =>
              navigation.navigate(SCREENS.DOCTOR_EARNINGS, {
                defaultTab: 'monthly',
                title: 'Monthly Earnings Report',
              })
            }
          /> */}
        </View>

        {/*-----------------Quick Actions-----------------*/}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <QuickActionCard
            title="Manage Availability"
            icon="calendar-clock"
            color={theme.primaryColor}
            onPress={() => navigation.navigate(SCREENS.MANAGE_AVAILABILITY)}
          />

          <QuickActionCard
            title="My Patients"
            icon="account-multiple"
            color={Colors.success}
            onPress={() => navigation.navigate(SCREENS.DOCTOR_PATIENTS)}
          />

          <QuickActionCard
            title="Consultation Notes"
            icon="note-text"
            color={Colors.error}
            onPress={() => navigation.navigate(SCREENS.CONSULTATION_NOTES)}
          />
          <QuickActionCard
            title="Earnings Report"
            icon="chart-bar"
            color={theme.primaryColor}
            onPress={() => navigation.navigate(SCREENS.DOCTOR_EARNINGS)}
          />
        </View>

        {/* Today's Appointments */}
        <Text style={styles.sectionTitle}>Today's Appointments</Text>
        {loading ? (
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentTime}>Loading appointments...</Text>
          </View>
        ) : todayAppointments.length === 0 ? (
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentTime}>No appointments for today</Text>
          </View>
        ) : todayAppointments.map((appt, idx) => (
          <View style={styles.appointmentCard} key={appt._id || idx}>
            <View style={styles.appointmentHeader}>
              <View>
                <Text style={styles.patientName}>{appt.patient?.name || 'Patient'}</Text>
                <Text style={styles.appointmentTime}>{appt.date ? new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time N/A'}</Text>
                <Text style={styles.appointmentType}>{appt.type || appt.status || 'Consultation'}</Text>
              </View>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => navigation.navigate(SCREENS.CALL, { appointment: appt })}>
                <Text style={styles.joinButtonText}>Join Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Patients Treated</Text>
        {loading ? (
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentTime}>Loading patients...</Text>
          </View>
        ) : patientsTreated.length === 0 ? (
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentTime}>No patients treated yet</Text>
          </View>
        ) : patientsTreated.map((patient, idx) => (
          <View style={styles.appointmentCard} key={patient._id || idx}>
            <View style={styles.appointmentHeader}>
              <View>
                <Text style={styles.patientName}>{patient.name || 'Patient'}</Text>
                <Text style={styles.appointmentType}>Visits: {patient.visitCount !== undefined ? patient.visitCount : 0}</Text>
                <Text style={styles.appointmentTime}>Gender: {patient.gender || 'N/A'}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorDashboard;
