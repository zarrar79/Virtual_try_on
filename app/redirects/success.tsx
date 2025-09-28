import { View, Text } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { useCart } from "../context/CartContext";

export default function SuccessScreen() {
  const  { setCart }  = useCart();
  useEffect(() => {
    const timer = setTimeout(() => {
      setCart([]);
      router.replace("/root_home/home"); // 👈 navigates back to home
    }, 3000);

    return () => clearTimeout(timer); // cleanup
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, color: "green" }}>✅ Payment Successful!</Text>
      <Text style={{ marginTop: 10, fontSize: 14, color: "gray" }}>
        Redirecting to home...
      </Text>
    </View>
  );
}
