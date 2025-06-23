// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> {/* Login screen - no header */}
      <Stack.Screen 
        name="home" 
        options={{
          headerShown: true,
          title: 'Home',
          headerBackVisible: false
        }} 
      />
    </Stack>
  );
}