import { View, Text, FlatList, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import SearchInput from '~/components/inputs/searchInput';
import { fetchData } from '~/config/fetchData';
import { SearDataProps } from '~/types';

import { router } from 'expo-router';

const index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<SearDataProps>();
  const [loading, setLoading] = useState(true);
  const fetchDashboard = async () => {
    try {
      setLoading(true);
    
      const data = await fetchData<SearDataProps>(`search/${searchQuery}`);
      setData(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView>
      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchPress={fetchDashboard}
      />
      {data?.services && data.services.length > 0 && (
        <View className="mx-2 mt-2">
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, marginTop: 10 }}>
            All Services
          </Text>
          <FlatList
            data={data?.services || []}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => fetchDashboard(item.slug)}>
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
        </View>
      )}
      {data?.specialities && (
        <View className="mx-2 mt-5">
          <FlatList
            data={data.specialities || []}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => fetchDashboard(item.slug)}
                className="items-center rounded-full bg-[#1C2A3A] py-4">
                <View style={{ alignItems: 'center' }}>
                  <Text className="overflow-clip truncate px-1 text-white">{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {data?.doctors.length === 0 ? (
        <Text className="text-gray-500"></Text>
      ) : (
        <FlatList
          data={data?.doctors}
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
                  Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName?.replace(/["]/g, '')}
                </Text>
                <Text className="mt-1 text-sm text-gray-600" numberOfLines={2} ellipsizeMode="tail">
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
      {data?.doctors.length === 0 &&
        data.services.length === 0 &&
        data.specialities.length === 0 && <Text>No Data Found</Text>}
    </KeyboardAvoidingView>
  );
};

export default index;
