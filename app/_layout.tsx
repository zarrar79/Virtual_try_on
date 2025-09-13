import { Stack } from 'expo-router';
import '../global.css';
import { CartProvider } from './context/CartContext'; 
// import { StripeProvider } from '@stripe/stripe-react-native';
import useStripeRedirect from './hooks/useStripeRedirect';

export default function RootLayout() {
  useStripeRedirect();
  return (
    // <StripeProvider publishableKey="pk_test_51Ppyq82NzF0ktfL2sjQOt1a1vdf9ZHTmjvpOPbujxrd83zcDOIV1sQSxZR3mfoKJhNJKOsZqNTkmWR1KgTWZTQ1V00a3FI4GRt">
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
    // </StripeProvider>
  );
}
