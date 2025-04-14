import { Tabs } from 'expo-router';
import { Image,  TouchableOpacity } from 'react-native';

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
        name="home"
        options={{
          title: 'Home',
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => <Image source={HomeIcon} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => <Image source={SearchIcon} />,
        }}
      />

      <Tabs.Screen
        name="appointment"
        options={{
          title: 'Booking',
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => <Image source={AppointmentIcon} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          headerTitleAlign: 'center', // Centers the title
          headerTintColor: 'white', // Makes text white
          headerStyle: { backgroundColor: '#00BBD3' },
          title: 'Profile',
          headerLeft: () => (
            <TouchableOpacity>
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => <Image source={PersonIcon} />,
        }}
      />
    </Tabs>
  );
}
