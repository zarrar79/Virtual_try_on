import { Stack } from 'expo-router';
import '../global.css';
import { CartProvider } from './context/CartContext';
import useStripeRedirect from './hooks/useStripeRedirect';
import { ApiProvider } from './context/ApiContext';

export default function RootLayout() {
  useStripeRedirect();

  return (
    <ApiProvider>
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen
          name="root_home/home"
          options={{
            headerShown: false,
            title: 'Home',
          }}
        />
        {/* Drawer is just another route in your stack */}
        {/* <Stack.Screen
          name="drawer"
          options={{ headerShown: false }}
        /> */}
      </Stack>
    </CartProvider>
    </ApiProvider>
  );
}
