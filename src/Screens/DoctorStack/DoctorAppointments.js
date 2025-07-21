import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
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
import StackHeader from '../../components/Header/StackHeader';
import doctorApi from '../../services/doctorApi';
import appointmentApi from '../../services/appointmentApi';
import { useAlert } from '../../Providers/AlertContext';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { Images } from '../../assets/Images/images';

const DoctorAppointments = ({navigation}) => {
  const {isDarkMode} = useSelector(store => store.theme);
  const theme = isDarkMode ? Colors.darkTheme : Colors.lightTheme;
  const { token } = useSelector(store => store.auth.User || {});
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState({ upcoming: [], completed: [], cancelled: [] });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const [upcomingRes, historyRes] = await Promise.all([
        doctorApi.getDoctorUpcomingAppointments(),
        doctorApi.getConsultationHistory(),
      ]);

      const upcoming = upcomingRes.data.data.appointments || [];
      const history = historyRes.data.data.appointments || [];

      setAppointments({
        upcoming: upcoming,
        completed: history.filter(appt => appt.status === 'completed'),
        cancelled: history.filter(appt => appt.status === 'cancelled'),
      });
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAppointments();
    }, [])
  );

  const [selectedTab, setSelectedTab] = useState('upcoming');

  const tabs = [
    {key: 'upcoming', label: 'Upcoming', count: appointments.upcoming.length},
    {
      key: 'completed',
      label: 'Completed',
      count: appointments.completed.length,
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
      count: appointments.cancelled.length,
    },
  ];

  const getStatusColor = status => {
    switch (status) {
      case 'confirmed':
        return Colors.success;
      case 'pending':
        return Colors.error;
      case 'completed':
        return Colors.success;
      case 'cancelled':
        return Colors.error;
      default:
        return theme.secondryTextColor;
    }
  };

  const handleAccept = async (appointmentId) => {
    setActionLoading(true);
    try {
      await appointmentApi.acceptAppointment(appointmentId, token);
      showAlert('Appointment accepted', 'success');
      // Refresh appointments
      fetchAppointments();
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to accept appointment', 'error');
    } finally {
      setActionLoading(false);
    }
  };
  const handleComplete = async (appointmentId) => {
    setActionLoading(true);
    try {
      await appointmentApi.completeAppointment(appointmentId, {});
      showAlert('Appointment marked as complete', 'success');
      // Refresh appointments
      fetchAppointments();
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to complete appointment', 'error');
    } finally {
      setActionLoading(false);
    }
  };
  const handleCancel = async (appointmentId) => {
    setActionLoading(true);
    try {
      await appointmentApi.cancelAppointment(appointmentId, {});
      showAlert('Appointment cancelled', 'success');
      // Refresh appointments
      fetchAppointments();
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to cancel appointment', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Format appointment data for card UI
  const formatAppointment = (appointment) => ({
    id: appointment._id,
    name: appointment.patient?.name || 'Patient Name',
    gender: appointment.patient?.gender || 'N/A',
    age: appointment.patient?.dob ? new Date().getFullYear() - new Date(appointment.patient.dob).getFullYear() : null,
    date: new Date(appointment.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }),
    bookingId: `#${appointment._id.slice(-8).toUpperCase()}`,
    status: appointment.status,
    image: appointment.patient?.avatar ? { uri: appointment.patient.avatar } : Images.profile,
    rawData: appointment,
  });

  // Patient Appointment Card UI
  const PatientAppointmentCard = ({ item, actionButtons, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.date}>{item.date}</Text>
      <View style={styles.cardContent}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.specialty}>{item.gender}{item.age ? ` • Age: ${item.age}` : ''}</Text>
          <Text style={styles.specialty}>{item.status}</Text>
          <Text style={styles.bookingId}>Booking ID : <Text style={styles.bookingIdHighlight}>{item.bookingId}</Text></Text>
        </View>
      </View>
      <View style={styles.actions}>{actionButtons}</View>
    </TouchableOpacity>
  );

  const TabButton = ({tab}) => (
    <TouchableOpacity
      style={[styles.tabButton, selectedTab === tab.key && styles.activeTab]}
      onPress={() => setSelectedTab(tab.key)}>
      <Text
        style={[
          styles.tabText,
          selectedTab === tab.key
            ? styles.activeTabText
            : {color: theme.secondryTextColor},
        ]}>
        {tab.label} ({tab.count})
      </Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.secondryColor,
      margin: wp(4),
      borderRadius: wp(3),
      padding: wp(1),
    },
    tabButton: {
      flex: 1,
      paddingVertical: hp(1.5),
      alignItems: 'center',
      borderRadius: wp(2),
    },
    activeTab: {
      backgroundColor: theme.primaryColor,
    },
    tabText: {
      fontSize: RFPercentage(1.8),
      fontFamily: Fonts.Medium,
    },
    activeTabText: {
      color: Colors.white,
    },
    listContainer: {
      paddingHorizontal: wp(4),
    },
    appointmentCard: {
      padding: wp(4),
      borderRadius: wp(3),
      marginBottom: hp(2),
      elevation: 2,
    },
    appointmentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    appointmentInfo: {
      flex: 1,
    },
    patientName: {
      fontSize: RFPercentage(2.2),
      fontFamily: Fonts.Bold,
      marginBottom: hp(0.5),
    },
    appointmentTime: {
      fontSize: RFPercentage(1.8),
      fontFamily: Fonts.Regular,
      marginBottom: hp(0.5),
    },
    appointmentType: {
      fontSize: RFPercentage(1.6),
      fontFamily: Fonts.Regular,
    },
    appointmentActions: {
      alignItems: 'flex-end',
    },
    statusBadge: {
      paddingHorizontal: wp(3),
      paddingVertical: hp(0.5),
      borderRadius: wp(2),
      marginBottom: hp(1),
    },
    statusText: {
      color: Colors.white,
      fontSize: RFPercentage(1.4),
      fontFamily: Fonts.Medium,
    },
    actionButton: {
      padding: wp(2),
      borderRadius: wp(2),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: hp(1),
    },
    actionButtonText: {
      color: Colors.white,
      fontSize: RFPercentage(1.6),
      fontFamily: Fonts.Medium,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: hp(10),
    },
    emptyText: {
      fontSize: RFPercentage(2),
      fontFamily: Fonts.Regular,
      color: theme.secondryTextColor,
      textAlign: 'center',
    },
    card: {
      backgroundColor: theme.secondryColor,
      borderRadius: wp(3),
      padding: wp(4),
      marginBottom: hp(2),
      elevation: 2,
    },
    date: {
      fontSize: RFPercentage(1.8),
      fontFamily: Fonts.Medium,
      color: theme.secondryTextColor,
      marginBottom: hp(1),
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    image: {
      width: wp(12),
      height: wp(12),
      borderRadius: wp(6),
      marginRight: wp(4),
    },
    details: {
      flex: 1,
    },
    name: {
      fontSize: RFPercentage(2),
      fontFamily: Fonts.Bold,
      marginBottom: hp(0.3),
    },
    specialty: {
      fontSize: RFPercentage(1.6),
      fontFamily: Fonts.Regular,
      color: theme.secondryTextColor,
      marginBottom: hp(0.3),
    },
    bookingId: {
      fontSize: RFPercentage(1.4),
      fontFamily: Fonts.Regular,
      color: theme.secondryTextColor,
    },
    bookingIdHighlight: {
      fontFamily: Fonts.Bold,
      color: theme.primaryColor,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(1),
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StackHeader title="My Appointments" />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TabButton key={tab.key} tab={tab} />
        ))}
      </View>

      {/* Appointments List */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading appointments...</Text>
        </View>
      ) : (
        <FlatList
          data={appointments[selectedTab].map(formatAppointment)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PatientAppointmentCard
              item={item}
              onPress={() => navigation.navigate(SCREENS.PATIENT_PROFILE, { patient: item.rawData.patient })}
              actionButtons={
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: wp(78) }}>
                  {item.status === 'requested' && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, {backgroundColor: Colors.success, marginRight: 8}]}
                        onPress={() => handleAccept(item.id)}>
                        <Text style={styles.actionButtonText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, {backgroundColor: Colors.error}]}
                        onPress={() => handleCancel(item.id)}>
                        <Text style={styles.actionButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {item.status === 'accepted' && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, {backgroundColor: Colors.success, marginRight: 8}]}
                        onPress={() => handleComplete(item.id)}>
                        <Text style={styles.actionButtonText}>Complete</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, {backgroundColor: Colors.error}]}
                        onPress={() => handleCancel(item.id)}>
                        <Text style={styles.actionButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              }
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No {selectedTab} appointments found
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default DoctorAppointments;
