import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { fetchData } from '~/config/fetchData';
import { DoctorData, Specialities } from '~/types';
import { Ionicons } from '@expo/vector-icons';

const ServiceDetail = () => {
  const { slug: initialSlug } = useLocalSearchParams<{ slug: string }>();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const [specialities, setSpecialities] = useState<any | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchServiceDetail = async (slug: string) => {
    try {
      setLoading(true);
      const data = await fetchData<Specialities>(`specialities/${slug}`);
       console.log("spe",data)
      setSpecialities(data.specialities);
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
      <Stack.Screen
        options={{
          title: initialSlug || 'Service Detail',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
              <Ionicons name="arrow-back" size={24} color="#1C2A3A" />
            </TouchableOpacity>
          ),
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1C2A3A" className="mt-10" />
      ) : (
        <ScrollView className="px-4 pb-6">
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, marginTop: 10 }}>
            All Specialists
          </Text>
          <FlatList
            data={specialities || []}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedSlug(item.slug)}
                className="items-center rounded-full bg-[#1C2A3A] py-4">
                <View style={{ alignItems: 'center' }}>
                  <Text className="overflow-clip truncate px-1 text-white">{item.title}</Text>
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
