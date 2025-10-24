import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../context/ApiContext";
import styles from "../CSS/ProductCustomization.styles";

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
          source={{ uri: `${BASE_URL}${product.imageUrl}`}}
          style={styles.image}
          resizeMode="contain"
        />
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
export default ProductCustomization;
