import { View, Text } from 'react-native';
import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useAuthStore } from '~/store/useAuthStore';

const index = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useAuthStore();
  console.log('user', user,isSignedIn);
  return (
    <View>
      <Text>index</Text>
    </View>
  );
};

export default index;
