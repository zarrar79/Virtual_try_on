import { Stack } from 'expo-router';
import '../global.css';
import { CartProvider } from './context/CartContext';
import useStripeRedirect from './hooks/useStripeRedirect';
import { ApiProvider } from './context/ApiContext';
import ProductCustomization from './root_home/ProductCustomization';

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
          <Stack.Screen
            name="ProductCustomization"
            options={{
              headerShown: false,
              title: 'Product Customization',
            }}
          />
        </Stack>
      </CartProvider>
    </ApiProvider>
  );
}
