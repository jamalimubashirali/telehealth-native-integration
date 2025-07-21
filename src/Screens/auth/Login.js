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
      const user = res.data?.data?.user;
      const token = res.data?.data?.token;
      const emailVerified = res.data?.data?.emailVerified;
      if (user) {
        const isVerified = (user.emailVerified === true) || (emailVerified === true) || (token ? true : false);
        if (isVerified) {
          // Store token FIRST, then update Redux and show success
          const { storeToken } = await import('../../utils/tokenStorage');
          if (token) await storeToken(token); // <-- Await this!
          const loginPayload = { user, userType: user.role };
          dispatch(loginUser(loginPayload));
          showAlert('Login successful', 'success');
          // Navigation is now handled by the root navigator (Router.js) based on Redux state.
        } else {
          // Only navigate to OTP if backend message is strictly about unverified email and NOT invalid credentials
          const msgRaw = res.data?.message || '';
          const msg = msgRaw.toLowerCase();
          if (msg.includes('email not verified') && !msg.includes('invalid credentials')) {
            showAlert('Your email is not verified. Please verify your email to continue.', 'error');
            navigation.navigate(SCREENS.OTPSCREEN, {
              emailOrPhone: value,
              userType: routeUserType,
              userData: user,
            });
          } else {
            showAlert('Invalid credentials', 'error');
          }
        }
      } else {
        showAlert('Invalid credentials', 'error');
      }
    } catch (err) {
      const msgRaw = err.response?.data?.message || 'Login failed';
      const msg = msgRaw.toLowerCase();
      if (msg.includes('email not verified') && !msg.includes('invalid credentials')) {
        showAlert('Your email is not verified. Please verify your email to continue.', 'error');
        navigation.navigate(SCREENS.OTPSCREEN, {
          emailOrPhone: value,
          userType: routeUserType,
          userData: null,
        });
      } else {
        showAlert('Invalid credentials', 'error');
      }
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
