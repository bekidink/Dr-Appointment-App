import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { fetchData } from '~/config/fetchData';
import { DoctorProfile } from '~/types';
import dayjs from 'dayjs';
import CustomSuccessModal from '~/components/modals/CustomSuccessModal';
import { useStore } from '~/store/store';

const MakeAppointment = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [doctor, setDoctor] = useState<DoctorProfile>();
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const fetchServiceDetail = async (slug: string) => {
    try {
      const data = await fetchData<DoctorProfile>(`doctor/${slug}`);
      setDoctor(data);
      updateAvailabilityForDate(selectedDate, data);
    } catch (error) {
      console.error('Error fetching doctor detail:', error);
    }
  };

  const updateAvailabilityForDate = (date: string, doctorData = doctor) => {
    if (!doctorData || !doctorData.availability) return;

    const dayOfWeek = dayjs(date).format('dddd').toLowerCase(); // e.g. "monday"
    const times = doctorData.availability[dayOfWeek] || [];
    setAvailableTimes(times);
  };

  const handleDateChange = (date: Date) => {

    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
    if (doctor) updateAvailabilityForDate(formattedDate, doctor);
  };
 const { openSuccessModal, closeSuccessModal, setLoadingState } = useStore(); // Zustand store

 const handleConfirmAppointment = () => {
   // Start loading state
   setLoadingState(true);
   // Simulate API call or some async operation
   setTimeout(() => {
     setLoadingState(false);
     openSuccessModal('Appointment Confirmed Successfully!');
   }, 2000);
 };
  useEffect(() => {
    if (slug) {
      fetchServiceDetail(slug);
    }
  }, [slug]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select Date</Text>

      <CalendarPicker
        onDateChange={handleDateChange}
        selectedStartDate={new Date(selectedDate)}
        todayBackgroundColor="#1C2A3A"
        selectedDayColor="#1C2A3A"
        selectedDayTextColor="#fff"
      />

      <Text style={{ fontSize: 16, marginTop: 20, fontWeight: 'bold' }}>Select Hour</Text>

      {availableTimes.length > 0 ? (
        <FlatList
          data={availableTimes}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={{ marginTop: 8 }}
          renderItem={({ item }) => {
            const isSelected = selectedTime === item;
            return (
              <TouchableOpacity
                style={{
                  flex: 1,
                  margin: 5,
                  paddingVertical: 10,
                  backgroundColor: isSelected ? '#1C2A3A' : '#f2f2f2',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: isSelected ? '#1C2A3A' : '#ccc',
                }}
                onPress={() => setSelectedTime(item)}>
                <Text style={{ textAlign: 'center', color: isSelected ? '#fff' : '#000' }}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <Text style={{ marginTop: 8, color: 'gray' }}>No available times.</Text>
      )}
      <View className="absolute bottom-20 left-4 right-4">
        <TouchableOpacity
          onPress={handleConfirmAppointment}
          className="items-center rounded-full bg-[#1C2A3A] py-4">
          <Text className="text-lg font-bold text-white">Confirm</Text>
        </TouchableOpacity>
      </View>
      <CustomSuccessModal
        isVisible={useStore((state) => state.isSuccessModalVisible)}
        message={useStore((state) => state.successModalMessage)}
        onClose={closeSuccessModal}
        isLoading={useStore((state) => state.isLoading)}
      />
    </View>
  );
};

export default MakeAppointment;
