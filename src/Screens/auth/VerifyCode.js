import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import authApi from '../../services/authApi';
import { useAlert } from '../../Providers/AlertContext';
import { SCREENS } from '../../Constants/Screens';
import CustomButton from '../../Components/CustomButton';

const VerifyCode = ({ navigation, route }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const email = route?.params?.email;

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      showAlert('Please enter a valid 6-digit OTP.', 'error');
      return;
    }
    setLoading(true);
    try {
      await authApi.verifyEmail({ email, otp });
      showAlert('Email verified successfully!', 'success');
      setTimeout(() => navigation.navigate(SCREENS.LOGIN), 1500);
    } catch (err) {
      showAlert(err.response?.data?.message || 'OTP verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Enter OTP sent to your email</Text>
      <TextInput value={otp} onChangeText={setOtp} keyboardType="numeric" maxLength={6} style={{ borderWidth: 1, padding: 10, margin: 10, width: 200 }} />
      <CustomButton text={loading ? 'Verifying...' : 'Verify'} onPress={handleVerify} />
    </View>
  );
};

export default VerifyCode;

const styles = StyleSheet.create({})