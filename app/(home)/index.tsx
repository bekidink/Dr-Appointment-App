import { View, Text, Image, Button, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { SearchIcon } from '~/constants/icons';
import { getCurrentLocationDetails } from '~/utils/getCurrentLocation';
import { NotificationIcon } from '~/constants/images';
import SearchInput from '~/components/inputs/searchInput';
import ImageTextCarousel from '~/components/home/ImageCarousel';
import { Service, Specialty } from '~/types';
import { fetchData } from '~/config/fetchData';
import ServiceShimmer from '~/components/shimmers/service';
const index = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [city, setCity] = useState<string | null>('Addis Ababa');
  const [country, setCountry] = useState<string | null>('Ethiopia');
  const [searchQuery, setSearchQuery] = useState('');
 const [services, setServices] = useState<Service[]>([]);
 const [specialities, setSpecialities] = useState<Specialty[]>([]);
 const [loading, setLoading] = useState<boolean>(true);
 const router=useRouter()
  useEffect(() => {
    async function fetchLocationDetails() {
      try {
        const { location, city, country } = await getCurrentLocationDetails();
        setLocation(location);
        setCity(city ?? 'Unknown');
        setCountry(country ?? 'Unknown');
      } catch (error: any) {
        // handle location error
      }
    }

    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await fetchData<Service[]>('services');
        setServices(data);
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

     const fetchSpecialities = async () => {
       try {
         setLoading(true);
         const data = await fetchData<Specialty[]>('admin/specialities');
         setSpecialities(data);
       } catch (err: any) {
         console.error(err.message);
       } finally {
         setLoading(false);
       }
     };
    fetchLocationDetails();
    fetchServices(); // ✅ call the service fetch here
    fetchSpecialities()
  }, []);

  return (
    <ScrollView className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex flex-row justify-between">
        <View className="mx-2 flex flex-col">
          <Text>Location</Text>
          <View className="mt-3 flex flex-row items-center">
            <Image source={SearchIcon} />
            <Text className="ml-2 text-[#292D32]">Addis Ababa,</Text>
            <Text className="text-[#292D32]">Ethiopia</Text>
          </View>
        </View>
        <Image className="mx-5 mt-6" source={NotificationIcon} />
      </View>
      <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ImageTextCarousel />
      <View className="mx-5 my-2 flex flex-row items-center justify-between">
        <Text className="text-lg font-bold text-[#1C2A3A]">Categories</Text>
        <TouchableOpacity>
          <Text className="text-[#6B7280]">See All</Text>
        </TouchableOpacity>
      </View>
      <View className="mx-5 mt-3">
        {loading ? (
          // Show shimmer or loader
          <View className="flex flex-row flex-wrap justify-between">
            {[1, 2, 3, 4].map((_, index) => (
              <ServiceShimmer key={index} />
            ))}
          </View>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="m-1 flex-1 items-center rounded-lg bg-white p-2 shadow"
                style={{ maxWidth: '23%' }} onPress={()=>router.push(`/services/${item.slug}` as never)}>
                <Image
                  source={{ uri: item.imageUrl }}
                  className="h-12 w-12 rounded-full"
                  resizeMode="cover"
                />
                <Text className="mt-2 text-center text-xs font-medium text-[#1C2A3A]">
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
            columnWrapperStyle={{}}
          />
        )}
      </View>
      <View className="mx-5 my-2 flex flex-row items-center justify-between">
        <Text className="text-lg font-bold text-[#1C2A3A]">Specialists</Text>
        <TouchableOpacity>
          <Text className="text-[#6B7280]">See All</Text>
        </TouchableOpacity>
      </View>
      <View className="mx-5 mt-3">
        {loading ? (
          // Show shimmer or loader
          <View className="flex flex-row flex-wrap justify-between">
            {[1, 2, 3, 4].map((_, index) => (
              <ServiceShimmer key={index} />
            ))}
          </View>
        ) : (
          <FlatList
            data={specialities}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="m-1 flex-1 items-center rounded-lg bg-white p-2 shadow"
                style={{ maxWidth: '23%' }}>
                {/* <Image
                  source={{ uri: item. }}
                  className="h-12 w-12 rounded-full"
                  resizeMode="cover"
                /> */}
                <Text className="mt-2 text-center text-xs font-medium text-[#1C2A3A]">
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
            columnWrapperStyle={{}}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default index;
