import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { AppIcon } from '~/constants/images';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputWithIcon } from '~/components/inputs/InputWithIcon';
import CustomButton from '~/components/CustomButton';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';

const schema = z.object({
  newPassword: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

const ChangePassword = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: '',
      password: '',
    },
  });
  const { signIn, setActive } = useSignIn();
  const [error, setError] = useState('');
  const onSubmit = async(data: FormData) => {
    if (data.newPassword !== data.newPassword) {
      setError('Passwords do not match');
      return;
    }

    if (data.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      // Complete the password reset by setting the new password
      const completeSignIn = await signIn.attempt({
        strategy: 'reset_password_email_code',
        password: data.newPassword,
      });

      if (completeSignIn.status === 'complete') {
        await s(completeSignIn.createdSessionId); // Log the user in with the new password
        router.push('/(home)'); // Navigate to home screen after successful reset
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset Password Error:', error.message);
      setError(error.message || 'An error occurred while resetting the password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: true, title: '' }} />
      {/* Logo & Titles */}
      <View className="mt-16 items-center justify-center">
        <Image source={AppIcon} style={{ width: 50, height: 50 }} resizeMode="contain" />
        <Text className="mt-3 text-2xl font-bold text-[#6B7280]">HealthPal</Text>
        <Text className="mt-5 text-2xl font-bold text-[#1C2A3A]">Create new password </Text>
        <Text className="mt-2 text-base font-medium text-[#6B7280] mx-3">
          Your new password must be different form previously used password
        </Text>
      </View>

      {/* Form */}
      <View className="mx-5 mt-5">
        <InputWithIcon
          icon="key"
          placeholder="Password"
          value={watch('password')}
          onChangeText={(text) => setValue('password', text, { shouldValidate: true })}
          error={errors.password?.message}
        />
        <InputWithIcon
          icon="key"
          placeholder="Confirm Password"
          value={watch('newPassword')}
          onChangeText={(text) => setValue('newPassword', text, { shouldValidate: true })}
          error={errors.newPassword?.message}
        />
        <CustomButton
          title="Reset Password"
          onPress={handleSubmit(onSubmit)}
          className="mt-4 rounded-full bg-[#111928] py-3"
        />
      </View>
    </View>
  );
};

export default ChangePassword;
