import { Stack } from 'expo-router';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { useAuth } from '@clerk/clerk-expo';
export default function Layout() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  return (
    <>
      {user ? (
        <Stack>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack>
      ) : (
        <Stack>
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
          <Stack.Screen name="profile-onboarding" options={{ headerShown: false }} />
        </Stack>
      )}
    </>
  );
}
