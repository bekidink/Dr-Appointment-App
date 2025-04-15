import {
  View,
  Text,
  Image,
  GestureResponderEvent,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { fetchData } from '~/config/fetchData';
import { DashboardStats, DoctorProfile } from '~/types';
import ViewMoreText from 'react-native-view-more-text';
import { SearchIcon } from '~/constants/icons';

const DoctorDetail = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [doctor, setDoctor] = useState<DoctorProfile>();
  const [stats, setStats] = useState<DashboardStats>();
  const [loading, setLoading] = useState(true);

  const fetchServiceDetail = async (slug: string) => {
    try {
      setLoading(true);
      const data = await fetchData<DoctorProfile>(`doctor/${slug}`);
      setDoctor(data);
    } catch (error) {
      console.error('Error fetching doctor detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async (slug: string) => {
    try {
      setLoading(true);
      const data = await fetchData<DashboardStats>(`doctor/stats/${slug}`);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchServiceDetail(slug);
      fetchDashboard(slug);
    }
  }, [slug]);

  const renderViewMore = (onPress) => (
    <Text className="mt-1 text-blue-500" onPress={onPress}>
      View more
    </Text>
  );

  const renderViewLess = (onPress) => (
    <Text className="mt-1 text-blue-500" onPress={onPress}>
      View less
    </Text>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="mx-6 mt-5 flex flex-row space-x-4 shadow-2xl">
          <Image
            source={{ uri: doctor?.profilePicture }}
            className="h-16 w-16 rounded"
            resizeMode="cover"
          />
          <View className="mx-5 flex flex-col">
            <Text className="py-1 text-lg font-bold underline">
              Dr. {doctor?.firstName} {doctor?.lastName}
            </Text>
            <Text className="mt-2 text-lg font-semibold">{doctor?.sepeciality.title}</Text>
            <View className="flex flex-row">
              <Image source={SearchIcon} />
              <Text className="items-center p-1 capitalize">
                {doctor?.city}, {doctor?.country} ({doctor?.hospitalName})
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-4 mt-4 flex flex-col">
          <Text className="text-xl font-bold">About Me</Text>
          <ViewMoreText
            numberOfLines={2}
            renderViewMore={renderViewMore}
            renderViewLess={renderViewLess}>
            <Text className="font-bold">
              {doctor?.bio} {doctor?.educationHistory}
            </Text>
          </ViewMoreText>
          <Text className="my-3 text-xl font-bold">Operation Mode</Text>
          <Text>{doctor?.operationMode}</Text>
          <Text className="my-3 text-xl font-bold">Working Time</Text>
          <Text>{doctor?.hospitalHoursOfOperation}</Text>

          <Text className="my-3 text-xl font-bold">Hospital</Text>
          <Text>{doctor?.hospitalName}</Text>

          <Text className="my-2 text-xl font-bold">Services Offered</Text>
          <FlatList
            data={doctor?.servicesOffered || []}
            keyExtractor={(item) => item}
            numColumns={2}
            // horizontal
            // showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity className="mx-5 rounded-full bg-[#F3F4F6] py-2 px-3">
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ textAlign: 'center', marginTop: 4 }}>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="absolute bottom-20 left-4 right-4">
        <TouchableOpacity
          onPress={() => {
            // TODO: handle book appointment logic
          }}
          className="items-center rounded-full bg-[#1C2A3A] py-4">
          <Text className="text-lg font-bold text-white">Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DoctorDetail;
