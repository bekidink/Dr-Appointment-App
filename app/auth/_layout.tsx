import { Stack } from 'expo-router';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ActivityIndicator, View, AppState, TouchableWithoutFeedback } from 'react-native';
import { useEffect, useRef } from 'react';

function InactivityHandler({ children }: { children: React.ReactNode }) {
  

  return (
    <TouchableWithoutFeedback >
      <View style={{ flex: 1 }}>{children}</View>
    </TouchableWithoutFeedback>
  );
}

export default function RootLayoutNav() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || typeof isSignedIn === 'undefined') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // This Stack is now valid directly inside Layout
  return (
    <InactivityHandler>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false, title: '' }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="(forget)" options={{ headerShown: false }} />
        <Stack.Screen name="verify" options={{ headerShown: false }} />
        <Stack.Screen name="profile-onboarding" options={{ headerShown: false }} />
      </Stack>
    </InactivityHandler>
  );
}

