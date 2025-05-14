import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useAuth } from '@clerk/clerk-expo';
import { useAuthStore } from '~/store/useAuthStore';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const {user}=useAuthStore()
  const menuItems = [
    { icon: 'edit', label: 'Edit Profile' },
    { icon: 'heart', label: 'Favorites' },
    { icon: 'bells', label: 'Notifications' },
    { icon: 'setting', label: 'Settings' },
    { icon: 'questioncircleo', label: 'Help & Support' },
    { icon: 'filetext1', label: 'Terms and Conditions' },
    { icon: 'logout', label: 'Log Out' },
  ];

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    await signOut();
    router.push('/auth/sign-in')
    setLogoutModalVisible(false);
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Profile Header */}
      <View className="items-center border-b border-gray-200 py-5">
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Replace with actual profile picture URL
          style={{width:30,height:30}}
        />
        <Text className="mt-2.5 text-xl font-bold">{user?.name}</Text>
        <Text className="mt-1 text-gray-500">{user?.email}</Text>
      </View>

      {/* Menu Items */}
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          className="flex-row  border-b border-gray-200 p-4 px-3 gap-x-10"
          onPress={item.label === 'Log Out' ? handleLogout : undefined}>
          <AntDesign name={item.icon} size={20} color="#000" />
          <Text className="ml-14 text-base">{item.label}</Text>
        </TouchableOpacity>
      ))}

      {/* Logout Confirmation Modal */}
      <Modal isVisible={isLogoutModalVisible} onBackdropPress={cancelLogout}>
        <View className="rounded-lg bg-white p-5">
          <Text className="mb-4 text-lg font-bold">Are you sure you want to log out?</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="mr-2.5 flex-1 rounded-lg bg-gray-300 p-2.5"
              onPress={cancelLogout}>
              <Text className="text-center text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 rounded-lg bg-black p-2.5" onPress={confirmLogout}>
              <Text className="text-center text-white">Yes, Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
