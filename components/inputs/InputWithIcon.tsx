import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

interface Props {
  icon?: FeatherIconName; // <-- make icon optional
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export const InputWithIcon = ({ icon, placeholder, value, onChangeText, error }: Props) => {
  return (
    <View className="mb-4">
      <View className="flex-row items-center rounded-lg border border-gray-300 bg-[#D1D5DB] px-3 py-1">
        {icon && <Feather name={icon} size={20} color="#555" style={{ marginRight: 8 }} />}
        <TextInput
          className="flex-1 text-black"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#999"
        />
      </View>
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
};
