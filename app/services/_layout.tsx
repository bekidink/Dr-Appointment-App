
import { Stack } from 'expo-router';

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
      
      <Stack.Screen
        name="[slug]"
        options={({ navigation }) => ({
          headerShown: false,

          
         
        })}
      />
     
    </Stack>
  );
};

export default _layout;
