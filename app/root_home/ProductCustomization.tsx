import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../context/ApiContext";
import styles from "../CSS/ProductCustomization.styles";

const ProductCustomization: React.FC = () => {
  const BASE_URL = useApi();
  const route = useRoute();
  const navigation = useNavigation();

  const product: any = (route.params as any)?.product;

  // ✅ Selected images state (relative paths)
  const [selectedImages, setSelectedImages] = useState<string[]>(
    product?.imageUrls?.length ? [product.imageUrls[0]] : []
  );

  // ✅ Main image for display (prepend BASE_URL)
  const [mainImage, setMainImage] = useState(
    selectedImages.length ? BASE_URL + selectedImages[0] : null
  );

  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState<number>(1);

  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/review/product/${product._id}`);
        setReviews(response.data);
      } catch (err: any) {
        setError("Failed to load reviews");
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [product._id]);

  // Handle selecting/deselecting a thumbnail
  const toggleImageSelection = (img: string) => {
    if (selectedImages.includes(img)) {
      // Deselect
      const newSelection = selectedImages.filter((i) => i !== img);
      setSelectedImages(newSelection);

      // Update main image
      if (mainImage === BASE_URL + img && newSelection.length > 0) {
        setMainImage(BASE_URL + newSelection[0]);
      } else if (newSelection.length === 0) {
        setMainImage(null);
      }
    } else {
      // Select
      const newSelection = [...selectedImages, img];
      setSelectedImages(newSelection);
      setMainImage(BASE_URL + newSelection[0]);
    }
  };

  const handlePlaceCODOrder = async () => {
    const userId = await AsyncStorage.getItem("user");
    const user_name = await AsyncStorage.getItem("user_name");

    if (!userId) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert("Error", "Please select at least one image");
      return;
    }

    Alert.alert("Confirm Order", "Place order with COD?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const orderItem: any = {
              _id: product._id,
              name: product.name,
              price: product.price,
              quantity,
              imageUrls: selectedImages, // ✅ relative paths
            };

            if (selectedSize) orderItem.size = selectedSize;
            if (selectedColor) orderItem.color = selectedColor;

            const response = await axios.post(`${BASE_URL}/order/cod`, {
              userId,
              user_name,
              cart: [orderItem],
            });

            if (response.status === 201) {
              Alert.alert("Success", "Order placed!");
              navigation.goBack();
            }
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Order failed");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{product.name}</Text>

      {/* MAIN IMAGE */}
      <View style={styles.imageWrapper}>
        {mainImage ? (
          <Image
            source={{ uri: mainImage }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text>No image selected</Text>
        )}
      </View>

      {/* THUMBNAILS */}
      <View style={styles.thumbnailRow}>
        {product.imageUrls?.map((img: string, i: number) => {
          const isSelected = selectedImages.includes(img);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => toggleImageSelection(img)}
              style={[
                styles.thumbnailContainer,
                isSelected && styles.selectedThumbnail,
              ]}
            >
              <Image
                source={{ uri: BASE_URL + img }}
                style={styles.thumbnail}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.brand}>Brand: {product.brand}</Text>
      <Text style={styles.price}>Price: Rs. {product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>

      {/* Quantity */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
          <Text style={styles.qtyBtnText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.qtyText}>{quantity}</Text>

        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.confirmBtn} onPress={handlePlaceCODOrder}>
        <Text style={styles.confirmBtnText}>Place Order (COD)</Text>
      </TouchableOpacity>

      {/* REVIEWS */}
      <View style={{ marginTop: 24 }}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>

        {loadingReviews ? (
          <ActivityIndicator size="small" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : reviews.length === 0 ? (
          <Text style={styles.noReviewsText}>No reviews yet.</Text>
        ) : (
          reviews.map((rev) => (
            <View key={rev._id} style={styles.reviewCard}>
              <Text style={styles.reviewerName}>{rev.user?.name || "User"}</Text>
              <Text>⭐ {rev.rating}/5</Text>
              <Text>{rev.comment}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default ProductCustomization;
