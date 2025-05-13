import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';

import { AppIcon } from '~/constants/images';
import { InputWithIcon } from '~/components/inputs/InputWithIcon';
import CustomButton from '~/components/CustomButton';
import { useAuth, useSignUp, useSSO, useUser } from '@clerk/clerk-expo';
import { postData } from '~/config/fetchData';
import { RegisterDataProps, RegisterResponse } from '~/types';
import { useAuthStore } from '~/store/useAuthStore';
import { useCallback } from 'react';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

const SignUp = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const { startSSOFlow } = useSSO();
  const { isLoaded, signUp, setActive } = useSignUp();
  const {signOut}=useAuth()
  const { user } = useUser();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  });

  const fetchDashboard = async (data: RegisterDataProps) => {
    try {
      const response: RegisterResponse = await postData('register', data);
      console.log("resp",response)
      if (response?.data) {
        setUser(response.data);
        router.push('/(home)');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await signOut()
      await signUp?.create({
        emailAddress: data.email,
        password: data.password,
      });

 const res=     await signUp?.prepareEmailAddressVerification({ strategy: 'email_code' });

      // const params: RegisterDataProps = {
      //   name: data.name,
      //   email: data.email,
      //   password: data.password,
      // };

      // await fetchDashboard(params);
      router.push({
        pathname: '/auth/verify',
        params: {
          email: data.email,
          password: data.password,
          name:data.name
        },
      });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });

        // if (!user) return;
if(user){
  const registerData = {
    email: user.primaryEmailAddress?.emailAddress ?? '',
    name: user.fullName || user.firstName || 'NoName',
    password: 'google_oauth_user',
  };
  router.push('/(home)');
  const response: RegisterResponse = await postData('register', registerData);
  if (response?.data) {
    setUser(response.data);
   
  }
}
       
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow, user, setUser, router]);

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Logo and Titles */}
      <View className="mt-16 items-center">
        <Image source={AppIcon} style={{ width: 50, height: 50 }} resizeMode="contain" />
        <Text className="mt-3 text-2xl font-bold text-[#6B7280]">HealthPal</Text>
        <Text className="mt-5 text-2xl font-bold text-[#1C2A3A]">Create Account</Text>
        <Text className="mt-2 text-base font-medium text-[#6B7280]">We are here to help you!</Text>
      </View>

      {/* Form */}
      <View className="mx-5 mt-5">
        <InputWithIcon
          icon="user"
          placeholder="Your Name"
          value={watch('name')}
          onChangeText={(text) => setValue('name', text, { shouldValidate: true })}
          error={errors.name?.message}
        />
        <InputWithIcon
          icon="mail"
          placeholder="Your Email"
          value={watch('email')}
          onChangeText={(text) => setValue('email', text, { shouldValidate: true })}
          error={errors.email?.message}
        />
        <InputWithIcon
          icon="key"
          placeholder="Password"
          value={watch('password')}
          onChangeText={(text) => setValue('password', text, { shouldValidate: true })}
          error={errors.password?.message}
        />

        <CustomButton
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          className="mt-4 rounded-full bg-[#111928] py-3"
        />

        {/* Divider */}
        <View className="my-6 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300" />
          <Text className="mx-3 font-medium text-gray-400">OR</Text>
          <View className="h-px flex-1 bg-gray-300" />
        </View>

        {/* Social Buttons */}
        <TouchableOpacity className="mb-3 flex-row items-center justify-center rounded-full border border-gray-300 py-3">
          <Feather name="facebook" size={20} color="#1877F2" />
          <Text className="ml-2 font-medium text-gray-800">Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-center rounded-full border border-gray-300 py-3"
          onPress={onGoogleSignIn}>
          <Feather name="globe" size={20} color="#DB4437" />
          <Text className="ml-2 font-medium text-gray-800">Continue with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="mb-10 mt-6 items-center">
        <Text className="text-gray-500">
          Already have an account?{' '}
          <Text
            className="font-semibold text-[#111928]"
            onPress={() => router.replace('/auth/sign-in')}>
            Sign in
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignUp;
