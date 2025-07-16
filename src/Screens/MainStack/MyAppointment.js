import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AirbnbRating } from 'react-native-ratings';
import StackHeader from '../../components/Header/StackHeader';
import { useSelector } from 'react-redux';
import { Colors } from '../../Constants/themeColors';
import { Fonts } from '../../Constants/Fonts';
import { Images } from '../../assets/Images/images';
import patientApi from '../../services/patientApi';
import appointmentApi from '../../services/appointmentApi';
import { useAlert } from '../../Providers/AlertContext';

const MyAppointment = () => {
    const { isDarkMode } = useSelector(store => store.theme);
    const { token } = useSelector(store => store.auth.User || {});
    const { showAlert } = useAlert();
    const [upcoming, setUpcoming] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            try {
                const [upcomingRes, historyRes] = await Promise.all([
                    patientApi.getUpcomingAppointments(token),
                    patientApi.getAppointmentHistory(token),
                ]);
                setUpcoming(upcomingRes.data.appointments || []);
                setHistory(historyRes.data.appointments || []);
            } catch (err) {
                showAlert(err.response?.data?.message || 'Failed to load appointments', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [token]);

    const handleCancel = async (appointmentId) => {
        setActionLoading(true);
        try {
            await appointmentApi.cancelAppointment(appointmentId, {}, token);
            showAlert('Appointment cancelled', 'success');
            // Refresh appointments
        } catch (err) {
            showAlert(err.response?.data?.message || 'Failed to cancel appointment', 'error');
        } finally {
            setActionLoading(false);
        }
    };
    const handleComplete = async (appointmentId) => {
        setActionLoading(true);
        try {
            await appointmentApi.completeAppointment(appointmentId, {}, token);
            showAlert('Appointment marked as complete', 'success');
            // Refresh appointments
        } catch (err) {
            showAlert(err.response?.data?.message || 'Failed to complete appointment', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? Colors.darkTheme.backgroundColor : Colors.lightTheme.backgroundColor,
            //   padding: wp('5%'),
        },

        doctorContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: hp('1.5%'),
            marginBottom: hp('2.5%'),
            borderBottomColor: isDarkMode ? Colors.darkTheme.BorderGrayColor : Colors.lightTheme.BorderGrayColor,
            borderBottomWidth: 1
        },
        doctorImage: {
            width: wp('20%'),
            height: wp('20%'),
            borderRadius: wp('10%'),
            marginRight: wp('4%'),
        },
        editIcon: {
            position: 'absolute',
            bottom: 0,
            right: wp('37%'),
            backgroundColor: isDarkMode ? Colors.darkTheme.primaryColor : Colors.lightTheme.primaryColor,
            borderRadius: wp('5%'),
            padding: wp('2%'),
            borderWidth: wp(0.5),
            borderColor: isDarkMode ? Colors.darkTheme.secondryColor : Colors.lightTheme.secondryColor
        },
        doctorDetails: {
            flex: 1,
        },
        doctorName: {
            fontSize: RFPercentage(2.2),
            fontFamily: Fonts.Bold,
            color: isDarkMode ? Colors.darkTheme.primaryTextColor : Colors.lightTheme.primaryTextColor,
        },
        doctorSpeciality: {
            fontSize: RFPercentage(1.8),
            fontFamily: Fonts.Regular,
            color: isDarkMode ? Colors.darkTheme.secondryTextColor : Colors.lightTheme.secondryTextColor,
            marginVertical: hp('0.5%'),
        },
        locationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: hp('0.5%'),
        },
        locationText: {
            fontSize: RFPercentage(1.8),
            fontFamily: Fonts.Regular,
            color: isDarkMode ? Colors.darkTheme.secondryTextColor : Colors.lightTheme.secondryTextColor,
            marginLeft: wp('1%'),
        },
        ratingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        reviewText: {
            fontSize: RFPercentage(1.7),
            fontFamily: Fonts.Regular,
            color: isDarkMode ? Colors.darkTheme.secondryTextColor : Colors.lightTheme.secondryTextColor,
            borderLeftColor: isDarkMode ? Colors.darkTheme.BorderGrayColor : Colors.lightTheme.secondryTextColor,
            borderLeftWidth: 1,
            paddingLeft: wp(2),

        },
        sectionContainer: {
            marginBottom: hp('2.5%'),
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? Colors.darkTheme.BorderGrayColor : Colors.lightTheme.BorderGrayColor,
            paddingBottom: hp('1.5%'),
        },
        sectionTitle: {
            fontSize: RFPercentage(2),
            fontFamily: Fonts.Medium,
            color: isDarkMode ? Colors.darkTheme.primaryTextColor : Colors.lightTheme.primaryTextColor,
            marginBottom: hp('1%'),
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: hp('2%'),
            marginTop: hp('0.3%'),
        },
        infoLabel: {
            fontSize: RFPercentage(1.9),
            fontFamily: Fonts.Regular,
            color: isDarkMode ? Colors.darkTheme.secondryTextColor : Colors.lightTheme.secondryTextColor,
        },
        infoValue: {
            fontSize: RFPercentage(1.8),
            fontFamily: Fonts.Regular,
            color: isDarkMode ? Colors.darkTheme.secondryTextColor : Colors.lightTheme.secondryTextColor,
            textAlign: 'right',
        },
    });

    if (loading) {
        return (
            <View style={styles.container}>
                <StackHeader title={'My Appointments'} headerStyle={{ paddingBottom: hp(1) }} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading appointments...</Text>
                </View>
            </View>
        );
    }

    if (upcoming.length === 0 && history.length === 0) {
        return (
            <View style={styles.container}>
                <StackHeader title={'My Appointments'} headerStyle={{ paddingBottom: hp(1) }} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>No appointments found.</Text>
                </View>
            </View>
        );
    }

    const upcomingAppointment = upcoming[0];
    const pastAppointment = history[0];

    return (
        <View style={styles.container}>
            {/* Header */}
            <StackHeader title={'My Appointments'} headerStyle={{ paddingBottom: hp(1) }}  />

            {/* Doctor Info */}
            <View style={{ paddingHorizontal: wp(5), marginTop: hp(1) }} >
                <View style={styles.doctorContainer}>
                    <View>
                        <Image
                            source={Images.dr2}
                            style={styles.doctorImage}
                        />
                        <TouchableOpacity style={styles.editIcon}>
                            <Icon name="star-shooting" size={RFPercentage(2.5)} color={isDarkMode ? Colors.darkTheme.backgroundColor : Colors.lightTheme.backgroundColor} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.doctorDetails}>
                        <Text style={styles.doctorName}>Dr. Kenny Adeola</Text>
                        <Text style={styles.doctorSpeciality}>General Practitioner</Text>
                        <View style={styles.locationContainer}>
                            <Icon name="map-marker" size={RFPercentage(2)} color={isDarkMode ? Colors.darkTheme.primaryColor : Colors.lightTheme.primaryColor} />
                            <Text style={styles.locationText}>Lagos, Nigeria</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <AirbnbRating
                                count={5}
                                showRating={false}
                                defaultRating={5}
                                size={RFPercentage(2)}
                                // starImage={<Images.food1 />}
                                // ratingContainerStyle={{marginBottom: 20, width: 50}}
                                onFinishRating={value => {
                                    // setRating(value);
                                }}
                            />
                            <Text style={styles.reviewText}>52 Reviews</Text>
                        </View>
                    </View>
                </View>

                {/* Appointment Info */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Schedule Appointment</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date</Text>
                        <Text style={styles.infoValue}>November 24, 2023</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Time</Text>
                        <Text style={styles.infoValue}>9:00 - 9:30 (30 minutes)</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Booking For</Text>
                        <Text style={styles.infoValue}>Self</Text>
                    </View>
                </View>

                {/* Patient Info */}
                <View style={[styles.sectionContainer, {borderBottomWidth: 0}]}>
                    <Text style={styles.sectionTitle}>Patient Info.</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Full Name</Text>
                        <Text style={styles.infoValue}>Ngozi Onwuka</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Gender</Text>
                        <Text style={styles.infoValue}>Female</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Age</Text>
                        <Text style={styles.infoValue}>27</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Problem</Text>
                        <Text style={[styles.infoValue, { width: wp(60) }]} >
                            hello, doctor I need help I believe am falling sick as I am
                            experiencing headache and body temperature.
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};



export default MyAppointment;
