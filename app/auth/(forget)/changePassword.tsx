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

  const onSubmit = (data: FormData) => {
    console.log('Submitted', data);
    router.replace('/auth/profile-onboarding');
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
