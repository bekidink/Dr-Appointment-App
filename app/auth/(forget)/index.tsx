import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { AppIcon } from '~/constants/images';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputWithIcon } from '~/components/inputs/InputWithIcon';
import CustomButton from '~/components/CustomButton';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { useSignIn, useSSO } from '@clerk/clerk-expo';
const schema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type FormData = z.infer<typeof schema>;

const ForgetPassword = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit =async (data: FormData) => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: data.email,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'needs_first_factor') {
        await setActive({ session: signInAttempt.createdSessionId });
        //  router.replace('/');
        router.replace('/auth/(forget)/verify');
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
    
  };

  return (
    <View className="flex-1 bg-white">
         <Stack.Screen options={{ headerShown: true, title: '' }} />
      {/* Logo & Titles */}
      <View className="mt-16 items-center justify-center">
        <Image source={AppIcon} style={{ width: 50, height: 50 }} resizeMode="contain" />
        <Text className="mt-3 text-2xl font-bold text-[#6B7280]">HealthPal</Text>
        <Text className="mt-5 text-2xl font-bold text-[#1C2A3A]">Forget Password? </Text>
        <Text className="mt-2 text-base font-medium text-[#6B7280]">
          Enter your Email, we will send you a verification code.
        </Text>
      </View>

      {/* Form */}
      <View className="mx-5 mt-5">
        <InputWithIcon
          icon="mail"
          placeholder="Your Email"
          value={watch('email')}
          onChangeText={(text) => setValue('email', text, { shouldValidate: true })}
          error={errors.email?.message}
        />

        <CustomButton
          title="Send Code"
          onPress={handleSubmit(onSubmit)}
          className="mt-4 rounded-full bg-[#111928] py-3"
        />
      </View>
    </View>
  );
};

export default ForgetPassword;
