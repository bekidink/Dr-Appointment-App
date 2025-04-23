// components/inputs/SearchInput.tsx
import React from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchInput = ({ searchQuery, setSearchQuery, onSearchPress }: any) => {
  return (
    <View className="mx-4 my-2 flex-row items-center rounded-lg bg-[#F3F4F6] p-1 shadow">
      <Feather name="search" size={20} color="#6b7280" className="mx-2" />
      <TextInput
        className="flex-1 text-base text-gray-800"
        placeholder="Search..."
        placeholderTextColor="#9ca3af"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Feather name="x" size={20} color="#6b7280" className="ml-2" />
        </TouchableOpacity>
      )}
      {/* Add this search button */}
      <TouchableOpacity onPress={onSearchPress}>
        <Feather name="arrow-right" size={20} color="#6b7280" className="ml-2" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
