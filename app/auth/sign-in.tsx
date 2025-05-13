import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { AppIcon } from '~/constants/images';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputWithIcon } from '~/components/inputs/InputWithIcon';
import CustomButton from '~/components/CustomButton';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useSignIn, useSSO } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { postData } from '~/config/fetchData';
import { RegisterResponse } from '~/types';
import { useAuthStore } from '~/store/useAuthStore';
type User = {
  email: string;
  id: string;
  name: string;
  picture: string | null;
  role: 'USER' | 'ADMIN'; // Add more roles if needed
};

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();
const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

const SignIn = () => {
  const navigation = useNavigation();
  const { signIn, setActive, isLoaded } = useSignIn();
  useWarmUpBrowser();
  const { setUser } = useAuthStore();
  const { startSSOFlow } = useSSO();

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
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        // router.replace('/(home)');

        await fetchDashboard(data.email);
      } else {
        await fetchDashboard(data.email);
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      await fetchDashboard(data.email);
      console.error(JSON.stringify(err, null, 2));
    }
  };
  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn } = await startSSOFlow({
        strategy: 'oauth_google',
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.push('/(home)');
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);
  const fetchDashboard = async (email: string) => {
    try {
      const params={
        email:email
      }
      const response:User = await postData('login', params);
      console.log('resp', response);
      if (response) {
        const data={
          id:response.id,
          email:response.email,
          name:response.name,
          token:890,
          role:response.role
        }
         setUser(data);
        router.push('/(home)');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };
  return (
    <View className="flex-1 bg-white">
      {/* Logo & Titles */}
      <View className="mt-16 items-center justify-center">
        <Image source={AppIcon} style={{ width: 50, height: 50 }} resizeMode="contain" />
        <Text className="mt-3 text-2xl font-bold text-[#6B7280]">HealthPal</Text>
        <Text className="mt-5 text-2xl font-bold text-[#1C2A3A]">Hi, Welcome Back! </Text>
        <Text className="mt-2 text-base font-medium text-[#6B7280]">Hope you’re doing fine.</Text>
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
        <InputWithIcon
          icon="key"
          placeholder="Password"
          value={watch('password')}
          onChangeText={(text) => setValue('password', text, { shouldValidate: true })}
          error={errors.password?.message}
        />

        <CustomButton
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          className="mt-4 rounded-full bg-[#111928] py-3"
        />

        {/* Dash Separator */}
        <View className="my-6 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300" />
          <Text className="mx-3 font-medium text-gray-400">OR</Text>
          <View className="h-px flex-1 bg-gray-300" />
        </View>

        {/* Social Login Buttons */}
        <TouchableOpacity
          onPress={onPress}
          className="flex-row items-center justify-center rounded-full border border-gray-300 py-3">
          <Feather name="globe" size={20} color="#DB4437" />
          <Text className="ml-2 font-medium text-gray-800">Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mb-3 flex-row items-center justify-center rounded-full border border-gray-300 py-3">
          <Feather name="facebook" size={20} color="#1877F2" />
          <Text className="ml-2 font-medium text-gray-800">Continue with Facebook</Text>
        </TouchableOpacity>

        <View className="mb-5 mt-6 items-center justify-center">
          <Text
            className="font-semibold text-[#1C64F2]"
            onPress={() => router.push('/auth/(forget)')} // replace 'SignIn' with your screen name
          >
            Forget Password?
          </Text>
        </View>
      </View>

      {/* Bottom Sign-in option */}
      <View className="mb-10 mt-6 items-center justify-center">
        <Text className="text-gray-500">
          Don't have an account yet?{' '}
          <Text
            className="font-semibold text-[#1C64F2]"
            onPress={() => router.push('/auth/sign-up')} // replace 'SignIn' with your screen name
          >
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignIn;
