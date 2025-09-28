import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useCart } from "../context/CartContext";
import { useApi } from "../context/ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const BASE_URL = useApi();
  const { addToCart } = useCart();
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert("Cart", `${product.name} added to cart!`);
  };

  const handleAddToWishlist = async () => {
    try {
      setLoadingWishlist(true);
      const userId = await AsyncStorage.getItem("user");

      if (!userId) {
        Alert.alert("Login Required", "Please login to add items to wishlist.");
        return;
      }
      const response = await fetch(`${BASE_URL}/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId.replace(/"/g, ""),
          productId: product._id,
        }),
      });


      if (!response.ok) {
        console.log(response, '----response');

        throw new Error("Failed to add to wishlist");
      }

      Alert.alert("Wishlist", `${product.name} added to wishlist!`);
    } catch (err) {
      console.error("Wishlist Error:", err);
      Alert.alert("Error", "Could not add to wishlist.");
    } finally {
      setLoadingWishlist(false);
    }
  };


  return (
    <View style={styles.productCard}>
      {product.imageUrl && (
        <Image
          source={{ uri: `${BASE_URL}${product.imageUrl}` }}
          style={styles.productImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>Rs. {product.price}</Text>
        {product.description && (
          <Text style={styles.productDescription}>
            {product.description}
          </Text>
        )}

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

        {/* Add to Wishlist Button */}
        <TouchableOpacity
          style={styles.addToWishlistBtn}
          onPress={handleAddToWishlist}
          disabled={loadingWishlist}
        >
          <Text style={styles.addToWishlistText}>
            {loadingWishlist ? "Adding..." : "Add to Wishlist"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: "#db3022",
    fontWeight: "bold",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
  },
  addToCartBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  addToWishlistBtn: {
    backgroundColor: "#db3022",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  addToWishlistText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
