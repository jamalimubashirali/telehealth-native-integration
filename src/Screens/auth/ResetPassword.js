import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import authApi from '../../services/authApi';
import { useAlert } from '../../Providers/AlertContext';
import { SCREENS } from '../../Constants/Screens';
import CustomButton from '../../Components/CustomButton';

const ResetPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleReset = async () => {
    if (!email || !otp || !password) {
      showAlert('Please fill all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ email, otp, password });
      showAlert('Password reset successful!', 'success');
      setTimeout(() => navigation.navigate(SCREENS.LOGIN), 1500);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Password reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 10, margin: 10, width: 200 }} />
      <Text>OTP</Text>
      <TextInput value={otp} onChangeText={setOtp} keyboardType="numeric" maxLength={6} style={{ borderWidth: 1, padding: 10, margin: 10, width: 200 }} />
      <Text>New Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, padding: 10, margin: 10, width: 200 }} />
      <CustomButton text={loading ? 'Resetting...' : 'Reset Password'} onPress={handleReset} />
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({})