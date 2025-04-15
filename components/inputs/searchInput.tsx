import React from 'react';
import { TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchInput = ({ searchQuery, setSearchQuery }:any) => {
  return (
    <View className="mx-4 my-2 flex-row items-center rounded-lg bg-[#F3F4F6] p-1 shadow">
      {/* Search Icon */}
      <Feather name="search" size={20} color="#6b7280" className="mx-2" />
      {/* Search Input */}
      <TextInput
        className="flex-1 text-base text-gray-800"
        placeholder="Search..."
        placeholderTextColor="#9ca3af"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {/* Clear Button (optional) */}
      {searchQuery.length > 0 && (
        <Feather
          name="x"
          size={20}
          color="#6b7280"
          className="ml-2"
          onPress={() => setSearchQuery('')}
        />
      )}
    </View>
  );
};

export default SearchInput;
