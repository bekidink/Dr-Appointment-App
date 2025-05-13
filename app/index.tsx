import { Stack } from 'expo-router';
import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { onboardingData } from '~/utils/onboarding-data';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useUser } from '@clerk/clerk-expo';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const {user}=useUser()
  console.log("user",user)
  const goToNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage < onboardingData.length) {
      scrollViewRef.current?.scrollTo({ x: width * nextPage, animated: true });
      setCurrentPage(nextPage);
    } else {
      router.replace('/auth/sign-in' as never);
    }
  };

  const skipOnboarding = () => {
    router.replace('/auth/sign-in');
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-white">
        {/* Horizontal Scroll View */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {onboardingData.map((item, index) => (
            <View key={index} style={{ width }} className="flex-1">
              {/* Full-width image at top */}
              <View className="w-full" style={{ height: height * 0.7 }}>
                <Image source={item.img} style={{ width, height: '100%' }} resizeMode="contain" />
              </View>

              {/* Text content in middle */}
              <View className="mt-4 px-6">
                <Text className="text-center text-2xl font-bold text-gray-800">{item.title}</Text>
                <Text className="mt-2 px-4 text-center text-base text-gray-600">
                  {item.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Centered vertical controls - Fixed position */}
        <View className="absolute bottom-7 left-0 right-0 items-center">
          {/* Next Button */}
          <TouchableOpacity
            className="mb-3 h-8 w-52 items-center justify-center rounded-full bg-[#111928]"
            onPress={goToNextPage}>
            <Text className="text-xl font-bold text-white">
              {currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>

          {/* Dots */}
          <View className="my-1 flex-row">
            {onboardingData.map((_, index) => (
              <View
                key={index}
                className={`mx-1 h-2 w-2 rounded-full ${currentPage === index ? 'bg-[#111928]' : 'bg-gray-300'}`}
              />
            ))}
          </View>

          {/* Skip Button */}
          <TouchableOpacity onPress={skipOnboarding}>
            <Text className="text-lg text-[#111928]">Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
