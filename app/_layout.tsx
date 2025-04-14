import '../global.css';
import { Stack } from 'expo-router';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ActivityIndicator, View, AppState, TouchableWithoutFeedback } from 'react-native';
import { useEffect, useRef } from 'react';

// 👇 This now wraps the screen content rather than the Stack
function InactivityHandler({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      signOut();
    }, 60 * 1000); // 1 minute
  };

  useEffect(() => {
    resetTimer(); // start timer

    const appStateListener = AppState.addEventListener('change', (state) => {
      if (state === 'active') resetTimer();
      else if (timerRef.current) clearTimeout(timerRef.current);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      appStateListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={resetTimer}>
      <View style={{ flex: 1 }}>{children}</View>
    </TouchableWithoutFeedback>
  );
}

function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  console.log('isSignedIn:', isSignedIn);

  if (!isLoaded || typeof isSignedIn === 'undefined') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      {isSignedIn ? (
        <Stack.Screen
          name="auth"
          options={{ headerShown: false }}
          // Wrap the screen content with InactivityHandler
          // children={() => (
          //   <InactivityHandler>
          //     <View style={{ flex: 1 }} />
          //   </InactivityHandler>
          // )}
        />
      ) : (
        <>
          <Stack.Screen
            name="(home)"
            options={{ headerShown: false }}
            // Wrap the screen content with InactivityHandler
            // children={() => (
            //   <InactivityHandler>
            //     <View style={{ flex: 1 }} />
            //   </InactivityHandler>
            // )}
          />
        </>
      )}
    </Stack>
  );
}

export default function Layout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <AuthGate />
    </ClerkProvider>
  );
}
