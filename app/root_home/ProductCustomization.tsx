import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../context/ApiContext";

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  imageUrl?: string;
}

const ProductCustomization: React.FC = () => {
  const BASE_URL = useApi();
  const route = useRoute();
  const navigation = useNavigation();

  const product: Product | undefined = (route.params as any)?.product;

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No product data found!</Text>
      </View>
    );
  }

  const defaultSizes = ["S", "M", "L", "XL"];
  const defaultColors = ["None", "Red", "Blue", "Green", "Yellow"];

  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);

  const handlePlaceCODOrder = async () => {
    const userId = await AsyncStorage.getItem("user");
    const user_name = await AsyncStorage.getItem("user_name");

    if (!userId || !user_name) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    Alert.alert(
      "Confirm Order",
      `Are you sure you want to place this order with Cash on Delivery?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const orderItem = {
                _id: product._id,
                name: product.name,
                price: product.price,
                quantity,
                imageUrl: product.imageUrl,
              } as any;

              if (selectedSize) orderItem.size = selectedSize;
              if (selectedColor && selectedColor !== "None") orderItem.color = selectedColor;

              const response = await axios.post(`${BASE_URL}/order/cod`, {
                userId,
                user_name,
                cart: [orderItem],
              });

              if (response.status === 201) {
                Alert.alert("Success", "Order placed successfully with COD!");
                navigation.goBack();
              } else {
                Alert.alert("Error", "Something went wrong placing your order.");
              }
            } catch (err) {
              console.error("COD Order Error:", err);
              Alert.alert("Error", "Failed to place order. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{product.name}</Text>

      {/* Image with color overlay */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: `${BASE_URL}${product.imageUrl}` }}
          style={styles.image}
          resizeMode="contain"
        />
        {selectedColor && selectedColor !== "None" && (
          <View
            style={[styles.overlay, { backgroundColor: selectedColor.toLowerCase() }]}
          />
        )}
      </View>

      <Text style={styles.brand}>Brand: {product.brand}</Text>
      <Text style={styles.price}>Price: Rs. {product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>

      {/* Quantity Selector */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
          <Text style={styles.qtyBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyText}>{quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Size Selection */}
      <View style={{ marginVertical: 12 }}>
        <Text style={styles.label}>Select Size (optional):</Text>
        <View style={styles.sizeContainer}>
          {defaultSizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.sizeButton, selectedSize === size && styles.selectedSizeButton]}
              onPress={() => setSelectedSize(selectedSize === size ? undefined : size)}
            >
              <Text style={[styles.sizeButtonText, selectedSize === size && styles.selectedSizeButtonText]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Color Selection */}
      <View style={{ marginVertical: 12 }}>
        <Text style={styles.label}>Select Color (optional):</Text>
        <View style={styles.colorContainer}>
          {defaultColors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorSwatch,
                color !== "None" && { backgroundColor: color.toLowerCase() },
                selectedColor === color && styles.selectedColorSwatch,
                color === "None" && selectedColor === "None" && styles.selectedNoneColor
              ]}
              onPress={() => setSelectedColor(selectedColor === color ? undefined : color)}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.confirmBtn} onPress={handlePlaceCODOrder}>
        <Text style={styles.confirmBtnText}>Place Order (COD)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#1f1f1f" },
  name: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  imageWrapper: { width: "100%", height: 250, borderRadius: 12, overflow: "hidden", marginBottom: 8 },
  image: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, opacity: 0.4 },
  brand: { color: "#ccc", fontSize: 16, marginBottom: 4 },
  price: { color: "#4da6ff", fontSize: 18, marginBottom: 8 },
  description: { color: "#aaa", fontSize: 14, marginBottom: 12 },
  label: { color: "#fff", marginBottom: 8, fontSize: 16 },
  sizeContainer: { flexDirection: "row", flexWrap: "wrap" },
  sizeButton: { borderWidth: 1, borderColor: "#ccc", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginRight: 8, marginBottom: 8 },
  selectedSizeButton: { backgroundColor: "#4da6ff", borderColor: "#4da6ff" },
  sizeButtonText: { color: "#fff" },
  selectedSizeButtonText: { color: "#fff", fontWeight: "bold" },
  colorContainer: { flexDirection: "row", flexWrap: "wrap" },
  colorSwatch: { width: 36, height: 36, borderRadius: 18, marginRight: 12, marginBottom: 12, borderWidth: 2, borderColor: "#fff" },
  selectedColorSwatch: { borderColor: "#4da6ff", borderWidth: 3 },
  selectedNoneColor: { borderColor: "#4da6ff", borderWidth: 3, backgroundColor: "#1f1f1f" },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  qtyBtn: { padding: 8, backgroundColor: "#333", borderRadius: 6 },
  qtyBtnText: { color: "#fff", fontSize: 18 },
  qtyText: { color: "#fff", marginHorizontal: 16, fontSize: 16 },
  confirmBtn: { backgroundColor: "#4da6ff", padding: 12, borderRadius: 8, alignItems: "center" },
  confirmBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#fff", fontSize: 18 },
});

export default ProductCustomization;
