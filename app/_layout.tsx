import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> {/* Login screen - no header */}
      <Stack.Screen 
        name="root_home/home" 
        options={{
          headerShown: false,
          title: 'Home',
          headerBackVisible: false
        }}
      />
    </Stack>
  );
}