import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CodeField, Cursor } from 'react-native-confirmation-code-field';
import { TextInput } from 'react-native';
import { AppIcon } from '~/constants/images';
import { Image } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
const OtpVerificationScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const ref = useRef(null);
const { isLoaded, signUp, setActive } = useSignUp();
  const CELL_COUNT = 6; // Define the number of OTP digits

  const handleVerifyOtp = async() => {
    setIsLoading(true);
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code:otp,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
    //    router.replace('/auth/profile-onboarding');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
    
    setTimeout(() => {
      setIsLoading(false);
      console.log('OTP Verified:', otp);
      // Navigate to the next screen upon successful OTP verification
      //   router.push('/next-screen'); // Replace with your actual path
    }, 2000);
  };

  return (
    <View className="flex-1  bg-white p-5">
      <View className="mt-16 items-center justify-center">
        <Image source={AppIcon} style={{ width: 50, height: 50 }} resizeMode="contain" />
        <Text className="mt-3 text-2xl font-bold text-[#6B7280]">HealthPal</Text>
        <Text className="mt-5 text-2xl font-bold text-[#1C2A3A]">Verify Code </Text>
        <Text className="mt-2 text-base font-medium text-[#6B7280]">
          Enter the the code we just sent you on your registered Email
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
          //   autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
          testID="otp-input"
          rootStyle={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}
          InputComponent={TextInput} // Ensure to provide the InputComponent
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
                isFocused && { borderColor: '#111928' }, // Change border color when focused
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
        <TouchableOpacity>
          <Text className="text-blue-500">Resend</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

export default OtpVerificationScreen;
