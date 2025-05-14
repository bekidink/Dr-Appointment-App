import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { fetchData } from '~/config/fetchData';
import { DoctorData } from '~/types';
import { AntDesign } from '@expo/vector-icons';

const ServiceDetail = () => {
  const { slug: initialSlug } = useLocalSearchParams<{ slug: string }>();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const [service, setService] = useState<any | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServiceDetail = async (slug: string) => {
    try {
      setLoading(true);
      const data = await fetchData<DoctorData>(`/services/${slug}`);
      
      setService(data.services);
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error('Error fetching service detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSlug) {
      fetchServiceDetail(selectedSlug);
    }
  }, [selectedSlug]);

  return (
    <ScrollView className="flex-1 bg-white">
      <Stack.Screen options={{ title: initialSlug || 'Service Detail' }} />
      <SafeAreaView className="absolute left-0 right-0 top-0 z-10 mt-4 flex-row items-center gap-x-10  px-4">
        <TouchableOpacity className="rounded-full bg-white p-2" onPress={() => router.back()}>
          <AntDesign name="left" size={20} color="#156778" />
        </TouchableOpacity>
        <View className="flex-row gap-2 ml-10">
          <Text className='text-lg'>Service Detail</Text>
          
        </View>
      </SafeAreaView>
      {loading ? (
        <ActivityIndicator size="large" color="#1C2A3A" className="mt-10" />
      ) : (
        <ScrollView className="px-4 pb-6 mt-16">
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, marginTop: 10 }}>
            All Services
          </Text>
          <FlatList
            data={service || []}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedSlug(item.slug)}>
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 30, height: 30, borderRadius: 10 }}
                  />
                  <Text style={{ textAlign: 'center', marginTop: 4 }}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* Service banner */}

          <Text className="my-2 text-lg font-semibold text-[#1C2A3A]">Available Doctors</Text>

          {doctors.length === 0 ? (
            <Text className="text-gray-500">No doctors available for this service.</Text>
          ) : (
            <FlatList
              data={doctors}
              keyExtractor={(item) => item.id}
              scrollEnabled
              nestedScrollEnabled
              renderItem={({ item: doctor }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/doctors/${doctor.userId}` as never)}
                  className="mb-4 flex-row items-start gap-4 rounded-lg bg-[#F9FAFB] p-4 shadow-sm">
                  <Image
                    source={{ uri: doctor.profilePicture }}
                    className="h-16 w-16 rounded-full"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-[#1C2A3A]">
                      Dr. {doctor.firstName} {doctor.middleName}{' '}
                      {doctor.lastName?.replace(/["]/g, '')}
                    </Text>
                    <Text
                      className="mt-1 text-sm text-gray-600"
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {doctor.bio}
                    </Text>
                    {doctor.hospitalName && (
                      <Text className="mt-1 text-xs text-gray-500">
                        Hospital: {doctor.hospitalName}
                      </Text>
                    )}
                    {doctor.operationMode && (
                      <Text className="text-xs text-gray-500">Mode: {doctor.operationMode}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </ScrollView>
      )}
    </ScrollView>
  );
};

export default ServiceDetail;
