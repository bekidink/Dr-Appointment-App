import { Tabs } from 'expo-router';
import { Image, TouchableOpacity } from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import { AppointmentIcon, HomeIcon, PersonIcon, SearchIcon } from '~/constants/icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: '#E9F6FE',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: '',

          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => <Image source={HomeIcon} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: '',
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => <Image source={SearchIcon} />,
        }}
      />

      <Tabs.Screen
        name="appointment"
        options={{
          tabBarLabel: '',
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => <Image source={AppointmentIcon} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
         
          tabBarIcon: ({ color }) => <Image source={PersonIcon} />,
        }}
      />
    </Tabs>
  );
}
