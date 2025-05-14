import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CodeField, Cursor } from 'react-native-confirmation-code-field';
import { TextInput } from 'react-native';
import { AppIcon } from '~/constants/images';
import { Image } from 'react-native';

const OtpVerificationScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const ref = useRef(null);
  const { resetPassword, setCode, setActive, signIn } = useForgotPassword();

  const CELL_COUNT = 6; // Define the number of OTP digits

  // Handle OTP verification with Clerk
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      await setCode(otp); // Set the OTP code
      await resetPassword(); // Attempt to reset password with the code
      // On success, navigate to the reset password screen or login
      router.push('/auth/(forget)/changePassword'); // Replace with your reset password screen path
    } catch (error:any) {
      console.error('OTP Verification Error:', error.message);
      // Handle error (e.g., show an alert or update UI)
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend code (optional, using Clerk's API)
  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const completeSignIn = await signIn.attempt({
        strategy: 'reset_password_email_code',
        code: otp,
         // Required if sign-up flow is involved
      });

      if (completeSignIn.status === 'complete') {
        await setActive({ session: completeSignIn.createdSessionId }); // Set the session to log the user in
        router.push('/auth/(forget)/changePassword'); // Navigate to reset password screen
      } else {
        console.log('Sign-in status:', completeSignIn.status);
      }
    } catch (error:any) {
      console.error('OTP Verification Error:', error.message);
      // Handle error (e.g., show alert for invalid code)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-5">
      <View className="mt-16 items-center justify-center">
        <Image source={AppIcon} style={{ width: 50, height: 50 }} resizeMode="contain" />
        <Text className="mt-3 text-2xl font-bold text-[#6B7280]">HealthPal</Text>
        <Text className="mt-5 text-2xl font-bold text-[#1C2A3A]">Verify Code</Text>
        <Text className="mt-2 text-base font-medium text-[#6B7280]">
          Enter the code we just sent you on your registered Email
        </Text>
      </View>

      <View className="mt-5 w-full">
        {/* OTP CodeField */}
        <CodeField  
          ref={ref}
          value={otp}
          onChangeText={setOtp}
          cellCount={CELL_COUNT}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          rootStyle={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}
          InputComponent={TextInput}
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[
                {
                  width: 45,
                  height: 45,
                  borderWidth: 2,
                  borderColor: '#ccc',
                  borderRadius: 10,
                  textAlign: 'center',
                  fontSize: 18,
                },
                isFocused && { borderColor: '#111928' },
              ]}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#111928" className="mt-5" />
      ) : (
        <TouchableOpacity
          onPress={handleVerifyOtp}
          className="mt-5 rounded-full bg-[#111928] px-6 py-3">
          <Text className="text-center text-white">Verify</Text>
        </TouchableOpacity>
      )}

      <Text className="mt-4 text-center text-sm text-[#6B7280]">
        Didn't receive the code?{' '}
        <TouchableOpacity onPress={handleResendCode}>
          <Text className="text-blue-500">Resend</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

export default OtpVerificationScreen;
