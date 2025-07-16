import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Fonts } from '../../Constants/Fonts';
import { useSelector } from 'react-redux';
import { Colors } from '../../Constants/themeColors';

const CustomCalender = () => {
  const { isDarkMode } = useSelector(store => store.theme);
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment().date());

  // Generate the calendar days dynamically for the current month
  const generateCalendarData = () => {
    const startOfMonth = moment(currentDate).startOf('month');
    const endOfMonth = moment(currentDate).endOf('month');

    const dates = [];
    for (let day = startOfMonth.date(); day <= endOfMonth.date(); day++) {
      const date = moment(currentDate).date(day);
      dates.push({
        date: day,
        day: date.format('ddd').toUpperCase(),
      });
    }
    return dates;
  };

  // Format the current month and year
  const getMonthYear = () => {
    return currentDate.format('MMM, YYYY');
  };

  // Navigate to the previous month
  const handlePreviousMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'month'));
  };

  // Navigate to the next month
  const handleNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'month'));
  };

  const calendarData = generateCalendarData();

  // Render a single date item
  const renderDateItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.dateItem,
        selectedDate === item.date && styles.selectedDateItem,
      ]}
      onPress={() => setSelectedDate(item.date)}
    >
      <Text
        style={[
          styles.dateText,
          selectedDate === item.date && styles.selectedDateText,
        ]}
      >
        {item.date}
      </Text>
      <Text
        style={[
          styles.dayText,
          selectedDate === item.date && styles.selectedDayText,
        ]}
      >
        {item.day}
      </Text>
    </TouchableOpacity>
  );




  const styles = StyleSheet.create({
    container: {
  
      paddingBottom: hp(2),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: hp(2),
    },
    monthText: {
      fontSize: RFPercentage(2.5),
      fontFamily: Fonts.Medium,
      color: isDarkMode? Colors.darkTheme.primaryTextColor: Colors.lightTheme.primaryTextColor,
    },
    datesList: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dateItem: {
      width: wp(15),
      height: hp(10),
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: wp(1),
      borderRadius: wp(2),
      backgroundColor: isDarkMode? Colors.darkTheme.secondryColor: Colors.lightTheme.secondryColor ,
      borderColor: isDarkMode? Colors.darkTheme.BorderGrayColor: Colors.lightTheme.BorderGrayColor ,
      borderWidth: 1
    },
    selectedDateItem: {
      backgroundColor: isDarkMode?Colors.darkTheme.primaryColor: Colors.lightTheme.primaryColor,
    },
    dateText: {
      fontSize: RFPercentage(2.5),
      fontFamily: Fonts.Bold,
      color: isDarkMode?Colors.darkTheme.secondryTextColor: Colors.lightTheme.secondryTextColor,
    },
    selectedDateText: {
      color: isDarkMode? Colors.darkTheme.primaryTextColor: Colors.white,
    },
    dayText: {
      fontSize: RFPercentage(1.8),
      fontFamily: Fonts.Regular,
      color: isDarkMode?Colors.darkTheme.secondryTextColor: Colors.lightTheme.secondryTextColor,
    },
    selectedDayText: {
      color: isDarkMode? Colors.darkTheme.primaryTextColor: Colors.white,
    },
  });
  return (
    <View style={styles.container}>
      {/* Month and Year */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePreviousMonth}>
          <Icon name="keyboard-arrow-left" size={RFPercentage(3)} color={isDarkMode? Colors.darkTheme.primaryTextColor: Colors.lightTheme.secondryTextColor} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{getMonthYear()}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Icon name="keyboard-arrow-right" size={RFPercentage(3)} color={isDarkMode? Colors.darkTheme.primaryTextColor: Colors.lightTheme.secondryTextColor}  />
        </TouchableOpacity>
      </View>

      {/* Date List */}
      <FlatList
        data={calendarData}
        keyExtractor={(item) => item.date.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderDateItem}
        contentContainerStyle={styles.datesList}
      />
    </View>
  );
};



export default CustomCalender;
