import React from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#E9F6FE',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: '',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="home" size={30} color={focused ? '#1E90FF' : '#888'} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="search1" size={30} color={focused ? '#1E90FF' : '#888'} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointment"
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="calendar" size={30} color={focused ? '#1E90FF' : '#888'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="user" size={30} color={focused ? '#1E90FF' : '#888'} />
          ),
        }}
      />
    </Tabs>
  );
}
