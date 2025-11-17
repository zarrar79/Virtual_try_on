import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useCart } from "../context/CartContext";
import { useApi } from "../context/ApiContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../CSS/ProductCard.styles";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const BASE_URL = useApi();
  const { addToCart } = useCart();
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await fetch(`${BASE_URL}/review/product/${product._id}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();

      if (data.length > 0) {
        const totalRating = data.reduce((acc: number, r: any) => acc + r.rating, 0);
        setAvgRating(Number((totalRating / data.length).toFixed(1)));
        setReviewCount(data.length);
      } else {
        setAvgRating(null);
        setReviewCount(0);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId.replace(/"/g, ""),
          productId: product._id,
        }),
      });

      if (!response.ok) throw new Error("Failed to add to wishlist");
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
      {product.imageUrls && (
        <Image
          source={{ uri: `${BASE_URL}${product.imageUrls[0]}` }}
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

        {/* Rating Section */}
        {loadingReviews ? (
          <ActivityIndicator size="small" color="#000" />
        ) : avgRating ? (
          <Text style={styles.productRating}>
            ⭐ {avgRating} ({reviewCount} reviews)
          </Text>
        ) : (
          <Text style={styles.productRating}>No reviews yet</Text>
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
