import { Stack } from 'expo-router';
import '../global.css';
import { CartProvider } from './context/CartContext'; // adjust path

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="root_home/home"
          options={{
            headerShown: false,
            title: 'Home',
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="root_home/Try"
          options={{
            headerShown: true,
            title: 'Try Your Dress',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="cart"
          options={{
            headerShown: true,
            title: 'Your Cart',
            headerBackVisible: true,
          }}
        />
      </Stack>
    </CartProvider>
  );
}
