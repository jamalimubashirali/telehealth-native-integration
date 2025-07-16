// import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
// import React, { useState } from 'react'
// import { useSelector } from 'react-redux';
// import { Colors } from '../../Constants/themeColors';
// import CustomLayout from '../../components/CustomLayout';
// import { Fonts } from '../../Constants/Fonts';
// import { normalizeFontSize, scaleHeight, scaleWidth } from '../../utils/responsive';
// import TxtInput from '../../components/TextInput/Txtinput';
// import CustomButton from '../../components/Buttons/customButton';
// import StackHeader from '../../components/Header/StackHeader';
// import { useAlert } from '../../Providers/AlertContext';
// import { SCREENS } from '../../Constants/Screens';
// import useBackHandler from '../../utils/useBackHandler';
// import { Svgs } from '../../assets/Svgs/Svg';
// const Login = ({navigation}) => {
//   const { isDarkMode } = useSelector(store => store.theme);
//   const {showAlert} = useAlert()

//   const [value, setValue] = useState('')
//   const [password, setPassword] = useState('')
//   useBackHandler(()=>{
//     // navigation.goBack()

//   })

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? Colors.darkTheme.backgroundColor : Colors.lightTheme.backgroundColor,
//       // justifyContent: 'center',
//       // paddingHorizontal: 20,
//       alignItems: 'center',
//     },
//     contentContainer: {
//       paddingTop: scaleHeight(100)
//     },
//     Heading: {
//       color: isDarkMode ? Colors.darkTheme.primaryTextColor : Colors.lightTheme.primaryTextColor,
//       fontSize: normalizeFontSize(25),
//       fontFamily: Fonts.Bold,
//       marginBottom: scaleHeight(10),
//       textAlign: 'center'
//     },
//     label: {
//       color: isDarkMode ? Colors.darkTheme.primaryTextColor : Colors.lightTheme.primaryTextColor,
//       fontSize: normalizeFontSize(16),
//       fontFamily: Fonts.Regular,
//       marginTop: scaleHeight(10),
//       textAlign: 'left',
//       marginBottom: scaleHeight(5)
//     },
//     btn: {
//       backgroundColor: isDarkMode ? Colors.darkTheme.primaryBtn.BtnColor : Colors.lightTheme.primaryBtn.BtnColor,
//       paddingVertical: scaleHeight(13),
//       borderRadius: scaleWidth(6),
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginTop: scaleHeight(30),
//       // borderColor:  isDarkMode ? Colors.darkTheme.primaryBtn.BtnColor : Colors.lightTheme.primaryBtn.BtnColor,
//       // borderWidth: scaleHeight(2)
//     },
//     btnText: {
//       color: isDarkMode ? Colors.darkTheme.primaryBtn.TextColor : Colors.lightTheme.secondryBtn.TextColor,
//       fontFamily: Fonts.Bold,
//       fontSize: normalizeFontSize(14),

//     },
//     secondryBtnText: {
//       marginLeft: scaleWidth(10),
//       color: isDarkMode?Colors.darkTheme.secondryBtn.TextColor : Colors.lightTheme.secondryBtn.TextColor,
//     },
//     forgetText: {
//       color: isDarkMode ? Colors.darkTheme.primaryColor : Colors.lightTheme.primaryColor,
//       fontSize: normalizeFontSize(14),
//       fontFamily: Fonts.Regular,
//       marginTop: scaleHeight(10),
//       textAlign: 'center',
//     },
//     seprator:{
//       height: scaleHeight(1),
//       backgroundColor: isDarkMode? Colors.darkTheme.secondryColor : Colors.lightTheme.BorderGrayColor,
//       width: scaleWidth(130),
//       // marginVertical: scaleHeight(30)
//     },
//     OrTxt: {
//       color: isDarkMode? Colors.darkTheme.secondryTextColor : Colors.lightTheme.secondryTextColor,

//     },
//     rowView:{
//       flexDirection: 'row',
//       justifyContent:'space-between',
//       alignItems: 'center',
//       marginTop: scaleHeight(50)

//     }

//   })
//   const validate = () => {
//     if (!value || value.length === 0) {
//       showAlert('Please Enter email address', 'error');
//       return false;
//     }
//     const isEmail = /\S+@\S+\.\S+/.test(value);
//     const isPhone = /^[+]?[0-9]{10,15}$/.test(value);

//     if (!isEmail && !isPhone) {
//       showAlert('Please Enter valid email/phone number', 'error');
//       return false;
//     }

//     if (!password || password.length === 0) {
//       showAlert('Please Enter Password', 'error');
//       return false;
//     }
//       return true;
//   };

//   const handleLogin = () => {
//     if (validate()) {
//       navigation.navigate(SCREENS.DASHBOARD)
//     }
//   }
//   return (
//     <SafeAreaView style={styles.container} >
//       {/* <CustomLayout> */}
//       {/* <StackHeader title={'Sign In'} /> */}
//       <View style={styles.contentContainer} >
//         <Text style={styles.Heading} >Hello There!</Text>
//         <Text style={styles.label} >Email/Phone Number</Text>
//         <TxtInput placeholder={'Enter email or phone number'} style={{ width: scaleWidth(330) }} value={value} onChangeText={setValue} containerStyle={{ paddingHorizontal: scaleWidth(10) }} />
//         <Text style={styles.label} >Password</Text>
//         <TxtInput placeholder={'Enter Password'} style={{ width: scaleWidth(330) }} inputStyle={{}} value={password} onChangeText={setPassword} secureTextEntry={true} containerStyle={{ paddingHorizontal: scaleWidth(10) }} />
//         <CustomButton text={'Forgot Password?'} textStyle={styles.forgetText} containerStyle={{ width: scaleWidth(120), alignSelf: 'flex-end' }} onPress={()=> navigation.navigate(SCREENS.FORGET)} />
//         <CustomButton containerStyle={styles.btn} text={'Sign In'} textStyle={[styles.btnText, {color: isDarkMode ? Colors.darkTheme.primaryBtn.TextColor : Colors.lightTheme.primaryBtn.TextColor,}]} onPress={()=> handleLogin()} />
//         <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: scaleHeight(20)}} >
//         <Text style={[styles.OrTxt, {textAlign: 'center'}]}>
//         Don't have an account?
//       </Text>
//       <CustomButton
//           text={' Sign Up'}
//           onPress={() => navigation.navigate(SCREENS.SIGNUP)}
//           textStyle={[styles.OrTxt, {textAlign: 'center', color: isDarkMode ?Colors.darkTheme.primaryColor: Colors.lightTheme.primaryColor}]}
//         />
//         </View>

//         {/* <CustomButton containerStyle={[styles.btn, {backgroundColor:'transparent'}]} text={`Don't have an account? ${<Text style={{color: isDarkMode? Colors.darkTheme.primaryColor  : Colors.lightTheme.primaryColor}} >Sign Up</Text>}`} textStyle={[styles.btnText, styles.secondryBtnText]}  onPress={()=> navigation.navigate(SCREENS.SIGNUP)} /> */}
//         {/* <CustomButton containerStyle={styles.btn} text={'Sign In'} textStyle={styles.btnText} /> */}
//         <View style={styles.rowView} >
//         <View style={styles.seprator} />
//         <Text style={styles.OrTxt} >or</Text>
//         <View style={styles.seprator} />
//         </View>

//         <CustomButton containerStyle={styles.btn} mode={true} svg={<Svgs.Google/>} text={'Sign in with Google'} textStyle={[styles.btnText, styles.secondryBtnText ]} />

//       </View>
//       {/* <View style={styles.seprator} /> */}
//       {/* </CustomLayout> */}
//     </SafeAreaView>
//   )
// }

'use client';

import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Colors} from '../../Constants/themeColors';
import {Fonts} from '../../Constants/Fonts';
import {
  normalizeFontSize,
  scaleHeight,
  scaleWidth,
} from '../../utils/responsive';
import TxtInput from '../../components/TextInput/Txtinput';
import CustomButton from '../../components/Buttons/customButton';
import {useAlert} from '../../Providers/AlertContext';
import {SCREENS} from '../../Constants/Screens';
import useBackHandler from '../../utils/useBackHandler';
import {Svgs} from '../../assets/Svgs/Svg';
import authApi from '../../services/authApi';
import { loginUser } from '../../redux/Slices/authSlice';
import {CommonActions} from '@react-navigation/native';

const Login = ({navigation, route}) => {
  const {isDarkMode} = useSelector(store => store.theme);
  const {showAlert} = useAlert();
  const dispatch = useDispatch();

  const [value, setValue] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const userType = route?.params?.userType || 'patient';

  useBackHandler(() => {
    // navigation.goBack()
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? Colors.darkTheme.backgroundColor
        : Colors.lightTheme.backgroundColor,
      alignItems: 'center',
    },
    contentContainer: {
      paddingTop: scaleHeight(100),
    },
    Heading: {
      color: isDarkMode
        ? Colors.darkTheme.primaryTextColor
        : Colors.lightTheme.primaryTextColor,
      fontSize: normalizeFontSize(25),
      fontFamily: Fonts.Bold,
      marginBottom: scaleHeight(10),
      textAlign: 'center',
    },
    userTypeIndicator: {
      backgroundColor: isDarkMode
        ? Colors.darkTheme.primaryColor
        : Colors.lightTheme.primaryColor,
      paddingHorizontal: scaleWidth(20),
      paddingVertical: scaleHeight(8),
      borderRadius: scaleWidth(20),
      marginBottom: scaleHeight(20),
    },
    userTypeText: {
      color: Colors.white,
      fontSize: normalizeFontSize(14),
      fontFamily: Fonts.Medium,
      textAlign: 'center',
    },
    label: {
      color: isDarkMode
        ? Colors.darkTheme.primaryTextColor
        : Colors.lightTheme.primaryTextColor,
      fontSize: normalizeFontSize(16),
      fontFamily: Fonts.Regular,
      marginTop: scaleHeight(10),
      textAlign: 'left',
      marginBottom: scaleHeight(5),
    },
    btn: {
      backgroundColor: isDarkMode
        ? Colors.darkTheme.primaryBtn.BtnColor
        : Colors.lightTheme.primaryBtn.BtnColor,
      paddingVertical: scaleHeight(13),
      borderRadius: scaleWidth(6),
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: scaleHeight(30),
    },
    btnText: {
      color: isDarkMode
        ? Colors.darkTheme.primaryBtn.TextColor
        : Colors.lightTheme.secondryBtn.TextColor,
      fontFamily: Fonts.Bold,
      fontSize: normalizeFontSize(14),
    },
    secondryBtnText: {
      marginLeft: scaleWidth(10),
      color: isDarkMode
        ? Colors.darkTheme.secondryBtn.TextColor
        : Colors.lightTheme.secondryBtn.TextColor,
    },
    forgetText: {
      color: isDarkMode
        ? Colors.darkTheme.primaryColor
        : Colors.lightTheme.primaryColor,
      fontSize: normalizeFontSize(14),
      fontFamily: Fonts.Regular,
      marginTop: scaleHeight(10),
      textAlign: 'center',
    },
    seprator: {
      height: scaleHeight(1),
      backgroundColor: isDarkMode
        ? Colors.darkTheme.secondryColor
        : Colors.lightTheme.BorderGrayColor,
      width: scaleWidth(130),
    },
    OrTxt: {
      color: isDarkMode
        ? Colors.darkTheme.secondryTextColor
        : Colors.lightTheme.secondryTextColor,
    },
    rowView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: scaleHeight(50),
    },
  });

  const handleLogin = async () => {
    if (!value || value.length === 0) {
      showAlert('Please Enter email address', 'error');
      return;
    }
    const isEmail = /\S+@\S+\.\S+/.test(value);
    const isPhone = /^[+]?\d{10,15}$/.test(value);
    if (!isEmail && !isPhone) {
      showAlert('Please Enter valid email/phone number', 'error');
      return;
    }
    if (!password || password.length === 0) {
      showAlert('Please Enter Password', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login({ emailOrPhone: value, password });
      if (res.data && res.data.token && res.data.user) {
        dispatch(loginUser({ user: res.data.user, userType: res.data.user.role }));
        showAlert('Login successful', 'success');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: SCREENS.DASHBOARD }],
          })
        );
      } else {
        showAlert(res.data.message || 'Login failed', 'error');
      }
    } catch (err) {
      showAlert(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.Heading}>Hello There!</Text>

        <Text style={styles.label}>Email/Phone Number</Text>
        <TxtInput
          placeholder={'Enter email or phone number'}
          style={{width: scaleWidth(330)}}
          value={value}
          onChangeText={setValue}
          containerStyle={{paddingHorizontal: scaleWidth(10)}}
        />

        <Text style={styles.label}>Password</Text>
        <TxtInput
          placeholder={'Enter Password'}
          style={{width: scaleWidth(330)}}
          inputStyle={{}}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          containerStyle={{paddingHorizontal: scaleWidth(10)}}
        />

        <CustomButton
          text={'Forgot Password?'}
          textStyle={styles.forgetText}
          containerStyle={{width: scaleWidth(120), alignSelf: 'flex-end'}}
          onPress={() => navigation.navigate(SCREENS.FORGET)}
        />

        <CustomButton
          containerStyle={styles.btn}
          text={
            userType === 'doctor' ? 'Sign in as Doctor' : ' Sign in as Patient'
          }
          textStyle={[
            styles.btnText,
            {
              color: isDarkMode
                ? Colors.darkTheme.primaryBtn.TextColor
                : Colors.lightTheme.primaryBtn.TextColor,
            },
          ]}
          onPress={handleLogin}
          loading={loading}
        />

        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: scaleHeight(20),
          }}>
          <Text style={[styles.OrTxt, {textAlign: 'center'}]}>
            Don't have an account?
          </Text>
          <CustomButton
            text={' Sign Up'}
            onPress={() => navigation.navigate(SCREENS.SIGNUP, {userType})}
            textStyle={[
              styles.OrTxt,
              {
                textAlign: 'center',
                color: isDarkMode
                  ? Colors.darkTheme.primaryColor
                  : Colors.lightTheme.primaryColor,
              },
            ]}
          />
        </View>

        {/* <View style={styles.rowView}>
          <View style={styles.seprator} />
          <Text style={styles.OrTxt}>or</Text>
          <View style={styles.seprator} />
        </View> */}

        {/* <CustomButton
          containerStyle={styles.btn}
          mode={true}
          svg={<Svgs.Google />}
          text={'Sign in with Google'}
          textStyle={[styles.btnText, styles.secondryBtnText]}
        /> */}
      </View>
    </SafeAreaView>
  );
};

export default Login;
