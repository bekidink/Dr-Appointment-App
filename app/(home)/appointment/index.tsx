import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchData } from '~/config/fetchData';
import { Appointment } from '~/types';
import { useAuthStore } from '~/store/useAuthStore';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const index = () => {
const { user } = useAuthStore();
const [loading, setLoading] = useState<boolean>(true);
const [appointments, setAppointments] = useState<Appointment[]>();
  useEffect(()=>{
    const fetchAppointments = async () => {
          try {
            setLoading(true);
            const data = await fetchData<Appointment[]>(`user/appointments/${user?.id}`);
            
            setAppointments(data);
          } catch (err: any) {
            console.error(err.message);
          } finally {
            setLoading(false);
          }
        };
        fetchAppointments()
  },[])
  return (
    <>
      <SafeAreaView className="absolute left-0 right-0 top-0 z-10 mt-4 flex-row items-center gap-x-10  px-4">
        <TouchableOpacity className="rounded-full bg-white p-2" onPress={() => router.back()}>
          <AntDesign name="left" size={20} color="#156778" />
        </TouchableOpacity>
        <Text className="mx-10 text-lg">My Booking</Text>
      </SafeAreaView>
      <ScrollView className="mt-16 gap-y-4 p-2.5">
        <View className="flex-row">
          <Text className="m-3 mr-2.5 text-base text-gray-500">Upcoming Appointments</Text>
          {/* <Text className="text-base text-gray-300">Completed</Text>
        <Text className="text-base text-gray-300">Canceled</Text> */}
        </View>
        {appointments &&
          appointments.map((appointment) => (
            <View
              key={appointment.id}
              className="p-3.75 my-1.25 m-4 rounded-lg bg-white shadow-md shadow-black/10">
              <Text className="mx-2 text-sm text-gray-600">
                {appointment.appointmentDate} - {appointment.appointmentTime}
              </Text>
              <View className="mt-2.5 flex-row items-center">
                <Image
                  source={{ uri: appointment.doctor.profilePicture }}
                  style={{ width: 55, height: 75, borderRadius: 10 }}
                />
                <View>
                  <Text className="text-base font-bold">
                    Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {appointment.doctor.sepeciality.title}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {appointment.doctor.hospitalName}, Ethiopia
                  </Text>
                </View>
              </View>
              <View className="mt-3.75 mx-3 flex-row justify-between gap-x-8">
                <TouchableOpacity className="mr-1.25 flex-1 rounded-lg bg-gray-300 p-2.5">
                  <Text className="text-center text-base text-white">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 rounded-lg bg-black p-2.5">
                  <Text className="text-center text-base text-white">Reschedule</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
    </>
  );
}

export default index