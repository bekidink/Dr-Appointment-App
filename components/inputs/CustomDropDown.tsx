import React from 'react';
import { Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  error?: string;
}

const CustomDropdown = ({ value, onChange, options, placeholder, error }: Props) => {
  return (
    <View className="mb-4">
      <Dropdown
        style={{
          height: 50,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: '#F1F1F1',
          paddingLeft: 10,
        }}
        placeholder={placeholder}
        value={value}
        onChange={(item) => onChange(item.value)}
        data={options}
        labelField="label"
        valueField="value"
        placeholderStyle={{
          color: '#999',
        }}
        selectedTextStyle={{
          color: '#000',
        }}
        
      />
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
};

export default CustomDropdown;
