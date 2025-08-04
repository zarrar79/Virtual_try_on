import { Stack } from 'expo-router';
import '../global.css'

export default function RootLayout() {
  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="root_home/home"
          options={{
            headerShown: false,
            title: 'Home',
            headerBackVisible: false
          }}
        />
        <Stack.Screen
          name="root_home/Try"
          options={{
            headerShown: true,
            title: 'Try Your Dress',
            headerBackVisible: false
          }}
        />
      </Stack>
  );
}
