import { View, Text, Image, TouchableOpacity } from 'react-native';
import { AppIcon } from '~/constants/images';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputWithIcon } from '~/components/inputs/InputWithIcon';
import CustomButton from '~/components/CustomButton';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { postData } from '~/config/fetchData';
import { RegisterDataProps } from '~/types';
const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

const SignUp = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
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

  const onSubmit = async (data: FormData) => {
    console.log('Submitted', data);
    try {
      await signUp?.create({
        emailAddress: data.email,
        password: data.password,
      });

      // Send user an email with verification code
      await signUp?.prepareEmailAddressVerification({ strategy: 'email_code' });
      const params: RegisterDataProps = {
        name: data.name,
        email: data.email,

        password: data.password,
      };
      fetchDashboard(params);
      // router.replace('/auth/verify');
      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
  const fetchDashboard = async (data: RegisterDataProps) => {
    try {
      // setLoading(true);
      const response = await postData(`register`, data);
      // setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      // setLoading(false);
    }
  };
  return (
    <View className="flex-1 bg-white">
      {/* Logo & Titles */}
      <Stack.Screen options={{ headerShown: false }} />
      <View className="mt-16 items-center justify-center">
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

        {/* Dash Separator */}
        <View className="my-6 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300" />
          <Text className="mx-3 font-medium text-gray-400">OR</Text>
          <View className="h-px flex-1 bg-gray-300" />
        </View>

        {/* Social Login Buttons */}
        <TouchableOpacity className="mb-3 flex-row items-center justify-center rounded-full border border-gray-300 py-3">
          <Feather name="facebook" size={20} color="#1877F2" />
          <Text className="ml-2 font-medium text-gray-800">Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-center rounded-full border border-gray-300 py-3">
          <Feather name="globe" size={20} color="#DB4437" />
          <Text className="ml-2 font-medium text-gray-800">Continue with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sign-in option */}
      <View className="mb-10 mt-6 items-center justify-center">
        <Text className="text-gray-500">
          Already have an account?{' '}
          <Text
            className="font-semibold text-[#111928]"
            onPress={() => router.replace('/auth/sign-in')} // replace 'SignIn' with your screen name
          >
            Sign in
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignUp;
