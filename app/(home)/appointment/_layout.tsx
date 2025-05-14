import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      
      <Stack.Screen
        name="index"
        options={({ navigation }) => ({
          headerShown: false,

          
         
        })}
      />
     
    </Stack>
  );
};

export default _layout;
