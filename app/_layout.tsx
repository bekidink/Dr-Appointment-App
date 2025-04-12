import '../global.css';

import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack >
    <Stack.Screen name='auth/sign-up' options={{headerShown:false}}/>
  </Stack>;
}
