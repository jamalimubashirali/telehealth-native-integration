import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Image, TouchableOpacity} from 'react-native';
import {Colors} from '../../../Constants/themeColors';
import {useSelector} from 'react-redux';
import CustomButton from '../../../components/Buttons/customButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Fonts} from '../../../Constants/Fonts';
import TxtInput from '../../../components/TextInput/Txtinput';
import UpcomingCard from '../../../components/Card/UpcomingCardd';
import DoctorCard from '../../../components/Card/DoctorCard';
import {SCREENS} from '../../../Constants/Screens';
import {Images} from '../../../assets/Images/images';
import FullLoader from '../../../components/Loaders';
import CategoryTab from './../../../components/FeatureCard/FeatureCard';
import patientApi from '../../../services/patientApi';
import doctorApi from '../../../services/doctorApi';
import { useAlert } from '../../../Providers/AlertContext';



const ambulances = [
  {
    id: '1',
    name: 'LifeLine Ambulance',
    location: 'Victoria Island, Lagos',
    rating: 4.9,
    reviews: 320,
    who: 'ambulance',
  },
  {
    id: '2',
    name: 'SwiftAid Ambulance',
    location: 'Wuse Zone, Abuja',
    rating: 4.7,
    reviews: 150,
    who: 'ambulance',
  },
  {
    id: '3',
    name: '24/7 Emergency Response',
    location: 'GRA, Port Harcourt',
    rating: 4.8,
    reviews: 180,
    who: 'ambulance',
  },
  {
    id: '4',
    name: 'RapidMed Ambulance',
    location: 'Bompai, Kano',
    rating: 4.6,
    reviews: 140,
    who: 'ambulance',
  },
];
const pharmacies = [
  {
    id: '1',
    name: 'MedPlus Pharmacy',
    location: 'Main Street, Lagos',
    rating: 4.7,
    reviews: 120,
    who: 'pharmacy',
  },
  {
    id: '2',
    name: 'HealthMart',
    location: 'Market Road, Abuja',
    rating: 4.5,
    reviews: 95,
    who: 'pharmacy',
  },
  {
    id: '3',
    name: 'Green Cross Pharmacy',
    location: 'Unity Avenue, Port Harcourt',
    rating: 4.6,
    reviews: 110,
    who: 'pharmacy',
  },
  {
    id: '4',
    name: 'Royal Pharmacy',
    location: 'Ring Road, Kano',
    rating: 4.8,
    reviews: 200,
    who: 'pharmacy',
  },
];
const hospitals = [
  {
    id: '1',
    name: 'Lagoon Hospital',
    location: 'Ikoyi, Lagos',
    rating: 4.5,
    reviews: 500,
    who: 'hospital',
  },
  {
    id: '2',
    name: 'National Hospital',
    location: 'Central Area, Abuja',
    rating: 4.6,
    reviews: 400,
    who: 'hospital',
  },
  {
    id: '3',
    name: 'Port Harcourt Teaching Hospital',
    location: 'University Road, Port Harcourt',
    rating: 4.7,
    reviews: 350,
    who: 'hospital',
  },
  {
    id: '4',
    name: 'Aminu Kano Teaching Hospital',
    location: 'Zaria Road, Kano',
    rating: 4.4,
    reviews: 300,
    who: 'hospital',
  },
];

const Home = ({navigation}) => {
  const {isDarkMode} = useSelector(store => store.theme);
  const { User } = useSelector(store => store.auth);
  const { showAlert } = useAlert();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Doctors');
  const [flatlistArray, setFlatListArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  
  // Real data states
  const [realDoctors, setRealDoctors] = useState([]);
  const [realAmbulances, setRealAmbulances] = useState([]);
  const [realPharmacies, setRealPharmacies] = useState([]);
  const [realHospitals, setRealHospitals] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctorError, setDoctorError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [User]);

  useEffect(() => {
    // Update flatlist array when category changes
    switch(selectedCategory) {
      case 'Doctors':
        setFlatListArray(realDoctors);
        break;
      case 'Ambulances':
        setFlatListArray(realAmbulances.length ? realAmbulances : ambulances);
        break;
      case 'Pharmacies':
        setFlatListArray(realPharmacies.length ? realPharmacies : pharmacies);
        break;
      case 'Hospitals':
        setFlatListArray(realHospitals.length ? realHospitals : hospitals);
        break;
      default:
        setFlatListArray(realDoctors);
    }
  }, [selectedCategory, realDoctors, realAmbulances, realPharmacies, realHospitals]);

  const fetchUserData = async () => {
    if (!User?.token) return;
    
    setLoading(true);
    try {
      // Fetch upcoming appointments for the user
      const upcomingRes = await patientApi.getUpcomingAppointments();
      setUpcomingAppointments(upcomingRes.data.upcoming || []);

      // Fetch available doctors from the API
      const doctorsRes = await doctorApi.getAllDoctors();
      const fetchedDoctors = doctorsRes.data.doctors || [];
      setRealDoctors(fetchedDoctors);
      if (selectedCategory === 'Doctors') {
        setFlatListArray(fetchedDoctors);
      }
      // Set empty arrays for other categories until specific APIs are implemented
      setRealAmbulances([]);
      setRealPharmacies([]);
      setRealHospitals([]);

    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to load data', 'error');
      setRealDoctors([]);
      setFlatListArray([]);
      setRealAmbulances([]);
      setRealPharmacies([]);
      setRealHospitals([]);
      setUpcomingAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: wp(5),
      backgroundColor: isDarkMode
        ? Colors.darkTheme.backgroundColor
        : Colors.lightTheme.backgroundColor,
    },
    rowView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    header: {
      marginBottom: hp(3),
      flexDirection: 'row',
    },
    greeting: {
      fontSize: RFPercentage(2),
      fontFamily: Fonts.Medium,
      color: isDarkMode
        ? Colors.darkTheme.primaryTextColor
        : Colors.lightTheme.primaryTextColor,
    },
    subGreeting: {
      fontSize: RFPercentage(2),
      color: isDarkMode
        ? Colors.darkTheme.primaryTextColor
        : Colors.lightTheme.primaryTextColor,
      fontFamily: Fonts.Light,
    },
    searchBar: {
      marginBottom: hp(2),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    input: {
      flex: 1,
      padding: wp(3),
      borderRadius: wp(2.5),
      backgroundColor: '#fff',
      elevation: 2,
    },
    schedule: {
      marginBottom: hp(2.5),
    },
    sectionTitle: {
      fontSize: RFPercentage(2.2),
      marginBottom: hp(1.5),
      color: isDarkMode
        ? Colors.darkTheme.primaryTextColor
        : Colors.lightTheme.primaryTextColor,
      fontFamily: Fonts.Medium,
    },
    doctorImage: {
      width: wp(12),
      height: wp(12),
      borderRadius: wp(6),
      marginRight: wp(4),
    },
    featureCardWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingLeft: 0,
      marginTop: 12,
      justifyContent: 'center',
      alignItems: 'stretch',
    },
    featureRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(2),
      // paddingHorizontal: wp(1),
    },

    cardShadow: {
      flex: 1,
      marginHorizontal: 5,
      borderRadius: 20,
      backgroundColor: '#fff',
      // shadow for iOS
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.26,
      shadowRadius: 3.5,
      // elevation for Android
      elevation: 5,
    },

    CategoryLabel: {
      color: Colors.lightTheme.secondryTextColor,
      fontFamily: Fonts.Medium,
      fontSize: RFPercentage(1.5),
      textAlign: 'center',
    },
    SelctedCategoryLabel: {
      color: isDarkMode
        ? Colors.darkTheme.primaryTextColor
        : Colors.lightTheme.primaryColor,
    },
    selectedCategory: {
      backgroundColor: isDarkMode
        ? `${Colors.darkTheme.primaryColor}40`
        : `${Colors.lightTheme.primaryColor}40`,
      paddingHorizontal: wp(1),
      borderRadius: 7,
    },
  });

  // This function returns all your header components as a single View for FlatList header
  const renderHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.rowView}>
        <View style={styles.header}>
          <Image source={Images.dr1} style={styles.doctorImage} />
          <View>
            <Text style={styles.greeting}>Hi, {User?.name || 'User'}!</Text>
            <Text style={styles.subGreeting}>How are you today?</Text>
          </View>
        </View>
        <CustomButton
          icon={'bell-outline'}
          iconSize={RFPercentage(3.2)}
          iconColor={
            isDarkMode
              ? Colors.darkTheme.secondryTextColor
              : Colors.lightTheme.secondryTextColor
          }
          onPress={() => navigation.navigate(SCREENS.NOTIFICATONS)}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TxtInput
          rightIcon={'magnify'}
          rightIconSize={RFPercentage(3)}
          rightIconColor={
            isDarkMode
              ? Colors.darkTheme.primaryColor
              : Colors.lightTheme.primaryColor
          }
          placeholder={'Search doctor, Pharmacy...'}
          style={{width: wp(70)}}
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={{paddingHorizontal: wp(5)}}
        />
        <CustomButton
          icon={'tune-variant'}
          iconSize={RFPercentage(3.2)}
          onPress={() => navigation.navigate(SCREENS.FILTERS)}
          iconColor={
            isDarkMode
              ? Colors.darkTheme.secondryColor
              : Colors.lightTheme.secondryColor
          }
          containerStyle={{
            backgroundColor: isDarkMode
              ? Colors.darkTheme.primaryColor
              : Colors.lightTheme.primaryColor,
            padding: wp(4),
            borderRadius: wp(2),
          }}
        />
      </View>

      {/* Upcoming Schedule */}
      <View style={styles.schedule}>
        <View style={styles.rowView}>
          <Text style={styles.sectionTitle}>Upcoming schedule</Text>
          <CustomButton
            text={'See all'}
            textStyle={{
              color: isDarkMode
                ? Colors.darkTheme.primaryColor
                : Colors.lightTheme.primaryColor,
            }}
            onPress={() => navigation.navigate(SCREENS.BOOKING)}
          />
        </View>
        <UpcomingCard appointment={upcomingAppointments[0] || null} />
      </View>

      <View style={styles.featureRow}>
        <View style={styles.cardShadow}>
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.SEEALLDOCTORS)}>
            <CategoryTab content={<Text>Find Doctors near you</Text>} imgUrl={Images.chat} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardShadow}>
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.CALL)}>
            <CategoryTab
              content={<Text>Instant Video Consultation</Text>}
              imgUrl={Images.phone}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Doctors */}
      <View style={styles.rowView}>
        <Text style={styles.sectionTitle}>Top {selectedCategory || 'Doctors'}</Text>
        <CustomButton
          text={'See all'}
          textStyle={{
            color: isDarkMode
              ? Colors.darkTheme.primaryColor
              : Colors.lightTheme.primaryColor,
          }}
          onPress={() => navigation.navigate(SCREENS.SEEALLDOCTORS)}
        />
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={realDoctors}
        keyExtractor={item => item._id || item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        renderItem={({item}) => <DoctorCard item={item} />}
        ListEmptyComponent={doctorError ? (
          <View style={{alignItems: 'center', padding: 16}}>
            <Text style={{color: isDarkMode ? Colors.darkTheme.primaryTextColor : Colors.lightTheme.primaryTextColor, fontSize: RFPercentage(2), fontFamily: Fonts.Medium}}>
              {doctorError}
            </Text>
          </View>
        ) : null}
      />
    </View>
  );
};

export default Home;