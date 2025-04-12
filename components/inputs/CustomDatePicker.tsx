import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';

interface Props {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

const CustomDatePicker = ({
  value,
  onChange,
  placeholder = 'Select date',
  icon = 'calendar',
  error,
  minimumDate,
  maximumDate,
}: Props) => {
  const [show, setShow] = useState(false);

  const handleChange = (_: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View className="mb-4">
      <Pressable
        onPress={() => setShow(true)}
        className={`flex-row items-center rounded-lg border bg-[#D1D5DB] px-3 py-3 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}>
        {icon && <Feather name={icon} size={20} color="#555" className="mr-2" />}
        <Text className={`text-black ${!value ? 'text-gray-500' : ''}`}>
          {value ? value.toDateString() : placeholder}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate || new Date()}
        />
      )}

      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
};

export default CustomDatePicker;
