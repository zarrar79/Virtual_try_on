// hooks/useStripeRedirect.ts
import { useEffect } from 'react';
import * as Linking from 'expo-linking';

export default function useStripeRedirect() {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      if (url.includes("success")) {
        console.log("✅ Payment success");
      } else if (url.includes("cancel")) {
        console.log("❌ Payment canceled");
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);
}
