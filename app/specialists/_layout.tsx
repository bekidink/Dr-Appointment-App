import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="[slug]" options={{ title: 'Service Detail', headerShown: true }} />
    </Stack>
  );
}
