import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomButton from '../Buttons/customButton'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts } from '../../Constants/Fonts';
import { Colors } from '../../Constants/themeColors';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '../../Constants/Screens';
import { Images } from '../../assets/Images/images';

const DoctorCard = ({ item }) => {
    const { isDarkMode } = useSelector(store => store.theme);

    const navigation = useNavigation()


    const styles = StyleSheet.create({
        doctorImage: {
            width: wp(12),
            height: wp(12),
            borderRadius: wp(6),
            marginRight: wp(4)
        },
        doctorName: {
            fontSize: RFPercentage(2),
            fontFamily: Fonts.Medium,
            color: isDarkMode ? Colors.darkTheme.primaryTextColor : Colors.lightTheme.primaryTextColor
        },
        specialization: {
            fontSize: RFPercentage(1.7),
            color: isDarkMode ? Colors.darkTheme.secondryTextColor : Colors.lightTheme.secondryTextColor,
            fontFamily: Fonts.Regular,

        },

        doctorCard: {
            flexDirection: 'row',
            padding: wp(4),
            backgroundColor: isDarkMode ? Colors.darkTheme.secondryColor : Colors.lightTheme.secondryColor,
            borderRadius: wp(3),
            marginBottom: hp(1.5),
            elevation: 2,
            justifyContent: 'space-between'
        },
        rating: {
            fontSize: RFPercentage(1.8),
            color: isDarkMode ? Colors.darkTheme.primaryColor : Colors.lightTheme.secondryTextColor,
            backgroundColor: `${Colors.lightTheme.primaryColor}40`, paddingHorizontal: wp(1), borderRadius: wp(1), marginRight: wp(2)
        },
        reviews: {
            fontSize: RFPercentage(1.6),
            color: isDarkMode ? Colors.darkTheme.secondryTextColor : Colors.lightTheme.secondryTextColor,
        },
    })
    console.log(item.who ,'who')
    
    return (
        <TouchableOpacity style={styles.doctorCard} onPress={() => navigation.navigate(SCREENS.DETAILS, {who: item.who})} >
            <View style={{ flexDirection: 'row' }} >
                <Image source={Images.dr2} style={styles.doctorImage} />
                <View>
                    <Text style={styles.doctorName}>{item.name}</Text>
                    <Text style={styles.specialization}>{item.specialization ? item.specialization : item.location}</Text>
                    <View style={{ flexDirection: 'row' }} >
                        <Text style={[styles.rating]}><Icon name='star' color={isDarkMode ? Colors.darkTheme.primaryColor : Colors.lightTheme.primaryColor} /> {item.rating}</Text>
                        <Text style={[styles.reviews]}>({item.reviews} reviews)</Text>
                    </View>

                </View>
            </View>
            <CustomButton icon={'arrow-right'} iconSize={RFPercentage(3.2)} iconColor={isDarkMode ? Colors.darkTheme.primaryTextColor : Colors.lightTheme.secondryTextColor} containerStyle={{ alignItems: 'center', justifyContent: 'center' }} />
            {/* {
                item.who === 'ambulance' ? <CustomButton icon={'phone'} iconSize={RFPercentage(3.2)} iconColor={isDarkMode ? Colors.darkTheme.primaryTextColor : Colors.lightTheme.secondryTextColor} containerStyle={{ alignItems: 'center', justifyContent: 'center', backgroundColor: isDarkMode?Colors.darkTheme.primaryColor: Colors.lightTheme.primaryColor, paddingHorizontal: wp(2), height: hp(5), alignSelf: 'center', borderRadius: wp(6) }} />:
            } */}
            
            


        </TouchableOpacity>
    )
}

export default DoctorCard

