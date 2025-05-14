import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Platform, TextInput, ScrollView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { fetchData, postData } from '~/config/fetchData';
import { AppointmentsProps, DoctorProfile } from '~/types';
import dayjs from 'dayjs';
import CustomSuccessModal from '~/components/modals/CustomSuccessModal';
import { useStore } from '~/store/store';
import { useAuthStore } from '~/store/useAuthStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
const MakeAppointment = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [doctor, setDoctor] = useState<DoctorProfile>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dob, setDob] = useState(new Date());
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reason, setReason] = useState('');
  const [address, setAddress] = useState('');
  const [medicFiles, setMedicFiles] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { user } = useAuthStore();
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const fetchServiceDetail = async (slug: string) => {
    try {
      const data = await fetchData<DoctorProfile>(`doctor/${slug}`);
      console.log('data', data.availability);
      setDoctor(data);
      updateAvailabilityForDate(selectedDate.toISOString(), data);
    } catch (error) {
      console.error('Error fetching doctor detail:', error);
    }
  };

  const updateAvailabilityForDate = (date: string, doctorData = doctor) => {
    if (!doctorData || !doctorData.availability) return;

    const dayOfWeek = dayjs(date).format('dddd').toLowerCase(); // e.g. "monday"
   console.log("dor",doctorData)
    const times = doctorData.availability[dayOfWeek] || [];
    console.log('times', times);
    setAvailableTimes(times);
  };

 const handleDateChange = (event: any, date?: Date) => {
   setShowDatePicker(false);
   if (date) {
    updateAvailabilityForDate(dayjs(date).format('YYYY-MM-DD'), doctor);
     setSelectedDate(date);
     
   }
 };
  const { openSuccessModal, closeSuccessModal, setLoadingState } = useStore(); // Zustand store
  const fetchDashboard = async (data: AppointmentsProps) => {
    try {
      console.log(data);
      const response = await postData(`appointments/${user?.id}`, data);
      console.log('resp', response);
      if (response) {
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };
  const handleConfirmAppointment = async () => {
    // Start loading state
    setLoadingState(true);
    // Simulate API call or some async operation
    const data = {
      appointmentTime: selectedTime ?? '',
      appointmentDate: selectedDate,

      doctorId: doctor?.id ?? '',
      charge: doctor?.hourlyWage ?? 0,
      userId: user?.id! ?? '',
      fullName: user?.name ?? '',
      dob: selectedDate,
      gender: '',
      phoneNumber: '',
      email: user?.email ?? '',
      medicdoc: [''],
      address: '',
      reason: '',
      occupation: '',
    };
    // await fetchDashboard(data);
    //  setTimeout(() => {
    //    setLoadingState(false);
    //    openSuccessModal('Appointment Confirmed Successfully!');
    //  }, 2000);
  };
  useEffect(() => {
    if (slug) {
      fetchServiceDetail(slug);
    }
  }, [slug]);
 const pickDocument = async () => {
   const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
   if (result.assets && result.assets.length > 0) {
     setMedicFiles([...medicFiles, result.assets[0].uri]);
   }
 };
 const handleConfirm = async () => {
   const errors = [];
   if (!selectedTime) errors.push('Please select an appointment time.');
   if (!phoneNumber) errors.push('Phone number is required.');
   if (!reason) errors.push('Reason for appointment is required.');
   if (!gender) errors.push('Gender is required.');

   if (errors.length) {
     setFormErrors(errors);
     return;
   }

   setLoadingState(true);
   const formattedDob = new Date(dob).toISOString();
   const payload: AppointmentsProps = {
     appointmentTime: selectedTime!,
     appointmentDate: dayjs(selectedDate).format('YYYY-MM-DD'),
     doctorId: doctor?.id ?? '',
     charge: doctor?.hourlyWage ?? 0,
     userId: user?.id ?? '',
     fullName: user?.name ?? '',
     dob: formattedDob,
     gender,
     phoneNumber,
     email: user?.email ?? '',
     medicdoc: medicFiles,
     address,
     reason,
     occupation: '',
   };
console.log("payload",payload)
   await postData(`appointments/${user?.id}`, payload);
   setLoadingState(false);
   openSuccessModal('Appointment Confirmed Successfully!');
 };
  return (
    <ScrollView className="flex-1 bg-white p-4" keyboardShouldPersistTaps="handled">
      <Text className="mt-4 text-base font-semibold">Select Appointment Date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="mt-2 rounded border border-gray-300 px-4 py-3">
        <Text>{dayjs(selectedDate).format('YYYY-MM-DD')}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      <Text className="mt-4 text-base font-semibold">Select Time</Text>
      {availableTimes.length > 0 ? (
        <FlatList
          data={availableTimes}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          className="mt-2"
          renderItem={({ item }) => {
            const selected = item === selectedTime;
            return (
              <TouchableOpacity
                className={`m-1 flex-1 rounded-lg border p-3 ${
                  selected ? 'border-blue-800 bg-blue-800' : 'border-gray-300 bg-gray-100'
                }`}
                onPress={() => setSelectedTime(item)}>
                <Text className={`text-center ${selected ? 'text-white' : 'text-black'}`}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <Text className="mt-2 text-gray-500">No available times</Text>
      )}

      <Text className="mt-4 text-base font-semibold">Date of Birth</Text>
      <TouchableOpacity
        onPress={() => setShowDobPicker(true)}
        className="mt-2 rounded border border-gray-300 px-4 py-3">
        <Text>{dayjs(dob).format('YYYY-MM-DD')}</Text>
      </TouchableOpacity>
      {showDobPicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={(event, date) => {
            if (date) setDob(date);
            setShowDobPicker(false);
          }}
        />
      )}

      <Text className="mt-4 text-base font-semibold">Gender</Text>
      <TextInput
        placeholder="Enter gender"
        value={gender}
        onChangeText={setGender}
        className="mt-2 rounded border border-gray-300 px-4 py-3"
      />

      <Text className="mt-4 text-base font-semibold">Phone Number</Text>
      <TextInput
        placeholder="Enter phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        className="mt-2 rounded border border-gray-300 px-4 py-3"
      />

      <Text className="mt-4 text-base font-semibold">Reason</Text>
      <TextInput
        placeholder="Enter reason"
        value={reason}
        onChangeText={setReason}
        multiline
        className="mt-2 rounded border border-gray-300 px-4 py-3"
      />

      <Text className="mt-4 text-base font-semibold">Address</Text>
      <TextInput
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
        className="mt-2 rounded border border-gray-300 px-4 py-3"
      />

      <Text className="mt-4 text-base font-semibold">Medical Documents</Text>
      <TouchableOpacity
        onPress={pickDocument}
        className="mt-2 rounded border border-blue-800 px-4 py-3">
        <Text className="text-center text-blue-800">Upload Document</Text>
      </TouchableOpacity>
      {medicFiles.map((file, index) => (
        <Text key={index} className="mt-1 text-xs text-gray-500">
          • {file.split('/').pop()}
        </Text>
      ))}

      {formErrors.length > 0 && (
        <View className="mt-4">
          {formErrors.map((err, i) => (
            <Text key={i} className="text-sm text-red-600">
              • {err}
            </Text>
          ))}
        </View>
      )}
      <TouchableOpacity
        onPress={handleConfirm}
        className="mb-24 mt-5 items-center rounded-full bg-blue-800 py-4">
        <Text className="text-base font-semibold text-white">Confirm</Text>
      </TouchableOpacity>
      <CustomSuccessModal
        isVisible={useStore((state) => state.isSuccessModalVisible)}
        message={useStore((state) => state.successModalMessage)}
        onClose={closeSuccessModal}
        isLoading={useStore((state) => state.isLoading)}
      />
    </ScrollView>
  );
};

export default MakeAppointment;
