import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import styles from "../CSS/Cart.styles";
import { useCart } from "../context/CartContext";
import { router, Stack } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../context/ApiContext";

export default function CartScreen() {
  const BASE_URL = useApi();
  const { cart, removeFromCart, setCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");

  const handleCheckout = async () => {
    const userId = await AsyncStorage.getItem("user");
    const user_name = await AsyncStorage.getItem("user_name");

    if (!userId) {
      console.error("User not logged in");
      return;
    }

    // 🔔 Confirmation popup before proceeding
    Alert.alert(
      "Confirm Order",
      paymentMethod === "online"
        ? "Are you sure you want to proceed with Online Payment?"
        : "Are you sure you want to place this order with Cash on Delivery?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              if (paymentMethod === "online") {
                // ✅ Online Payment - Stripe Checkout
                const response = await axios.post(
                  `${BASE_URL}/create-checkout-session`,
                  { cart, userId, user_name }
                );
                const { url } = response.data;
                router.push(url); // open Stripe checkout
              } else {
                // ✅ Cash on Delivery
                const response = await axios.post(`${BASE_URL}/order/cod`, {
                  userId,
                  user_name,
                  cart: cart.map((item) => ({
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    imageUrl: item.imageUrl,
                  })),
                });

                if (response.status === 201) {
                  Alert.alert("Success", "Order placed successfully with COD!");
                  setCart([]); // empty the cart
                } else {
                  Alert.alert("Error", "Something went wrong placing your order.");
                }
              }
            } catch (err) {
              console.error("Checkout error:", err);
              Alert.alert("Error", "Checkout failed. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ App Header with Checkout Button */}
      <Stack.Screen
        options={{
          title: "Cart",
          headerRight: () =>
            cart.length > 0 ? (
              <TouchableOpacity
                onPress={handleCheckout}
                style={styles.checkoutBtn}
              >
                <Text style={styles.checkoutText}>
                  {paymentMethod === "online" ? "Pay Online" : "Place Order"}
                </Text>
              </TouchableOpacity>
            ) : null,
        }}
      />

      {/* ✅ Payment Method Selection */}
      {cart.length > 0 && (
        <View style={styles.paymentRow}>
          <TouchableOpacity
            style={[
              styles.optionBtn,
              paymentMethod === "online" && styles.optionActive,
            ]}
            onPress={() => setPaymentMethod("online")}
          >
            <Text
              style={[
                styles.optionText,
                paymentMethod === "online" && styles.optionTextActive,
              ]}
            >
              Online Payment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionBtn,
              paymentMethod === "cod" && styles.optionActive,
            ]}
            onPress={() => setPaymentMethod("cod")}
          >
            <Text
              style={[
                styles.optionText,
                paymentMethod === "cod" && styles.optionTextActive,
              ]}
            >
              Cash on Delivery
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cart Items */}
      <View style={{ flex: 1, padding: 16 }}>
        {cart.length === 0 ? (
          <Text style={styles.emptyText}>Your cart is empty</Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartCard}>
                <Image
                  source={{ uri: `${BASE_URL}${item.imageUrl}` }}
                  style={styles.cartImage}
                />
                <View style={styles.cartDetails}>
                  <Text style={styles.cartName}>{item.name}</Text>
                  <Text style={styles.cartPrice}>Rs.{item.price}.00</Text>
                  <Text style={styles.cartQty}>Quantity: {item.quantity}</Text>
                </View>

                {/* Delete Button */}
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => removeFromCart(item._id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />

        )}
      </View>
    </SafeAreaView>
  );
}