import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../context/ApiContext";
import { Design, Product } from "../types/product";
import { useProductReviews } from "../hooks/useProductReviews";
import { useDesignSelection } from "../hooks/useDesignSelection";
import { DesignThumbnail } from "../components/DesignThumbnail";
import { OrderModal } from "../components/OrderModal";
import { ReviewsSection } from "../components/ReviewsSection";
import styles from "../CSS/ProductCustomization.styles";

const ProductCustomization: React.FC = () => {
  const BASE_URL = useApi();
  const route = useRoute();
  const navigation = useNavigation<any>();
  const product: Product = (route.params as any)?.product;

  const { reviews, loading: loadingReviews, error } = useProductReviews(product._id);
  const {
    selectedDesigns,
    isOutOfStock,
    isDesignSelected,
    toggleDesignSelection,
    updateDesignQuantity,
    resetSelection,
    totalQuantity
  } = useDesignSelection(product.designs);

  // Local state
  const [mainImage, setMainImage] = useState<string | null>(
    product?.designs?.length ? BASE_URL + product.designs[0].imageUrl : null
  );
  const [orderModalVisible, setOrderModalVisible] = useState(false);

  // Derived values
  const totalPrice = totalQuantity * product.price;

  // Event handlers
  const setThumbnailAsMain = (design: Design, designIndex: number) => {
    if (isOutOfStock(design)) {
      Alert.alert("Out of Stock", "This design is currently out of stock.");
      return;
    }
    setMainImage(BASE_URL + design.imageUrl);
  };

  const openOrderModal = () => {
    if (selectedDesigns.length === 0) {
      Alert.alert("No Designs Selected", "Please select at least one design to order.");
      return;
    }
    setOrderModalVisible(true);
  };

  const closeOrderModal = () => setOrderModalVisible(false);

  const handlePlaceCODOrder = async () => {
    const userId = await AsyncStorage.getItem("user");
    const user_name = await AsyncStorage.getItem("user_name");

    if (!userId) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    // Stock validation
    const stockIssues = selectedDesigns.filter(selectedDesign => {
      const design = product.designs?.[selectedDesign.designIndex];
      return design && selectedDesign.quantity > design.stock;
    });

    if (stockIssues.length > 0) {
      Alert.alert("Stock Issue", "Some designs have insufficient stock.");
      return;
    }

    Alert.alert(
      "Confirm Order",
      `Place order for ${totalQuantity} item${totalQuantity !== 1 ? 's' : ''} across ${selectedDesigns.length} design${selectedDesigns.length !== 1 ? 's' : ''}? Total: Rs. ${totalPrice}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const orderItems = selectedDesigns.map(selectedDesign => {
                const design = product.designs?.[selectedDesign.designIndex];
                return {
                  _id: product._id,
                  name: product.name,
                  price: product.price,
                  quantity: selectedDesign.quantity,
                  imageUrls: [selectedDesign.imageUrl],
                  designIndex: selectedDesign.designIndex,
                  designStock: design?.stock || 0,
                  itemTotal: product.price * selectedDesign.quantity
                };
              });

              const response = await axios.post(`${BASE_URL}/order/cod`, {
                userId,
                user_name,
                cart: orderItems,
              });

              if (response.status === 201) {
                Alert.alert("Success", `Order placed!\n\nSummary:\n• ${response.data.summary.designsOrdered} design${response.data.summary.designsOrdered !== 1 ? 's' : ''}\n• ${response.data.summary.totalItems} item${response.data.summary.totalItems !== 1 ? 's' : ''}\n• Total: Rs. ${response.data.summary.totalAmount}`, [
                  {
                    text: "OK",
                    onPress: () => {
                      resetSelection();
                      setOrderModalVisible(false);
                      setMainImage(product?.designs?.length ? BASE_URL + product.designs[0].imageUrl : null);
                      navigation.navigate('home');
                    }
                  }
                ]);
              }
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Order failed");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{product.name}</Text>

      {/* Main Image */}
      <View style={styles.imageWrapper}>
        {mainImage ? (
          <Image source={{ uri: mainImage }} style={styles.image} resizeMode="contain" />
        ) : (
          <Text>No image selected</Text>
        )}
      </View>

      {/* Design Thumbnails */}
      <View style={styles.thumbnailRow}>
        {product.designs?.map((design, index) => (
          <DesignThumbnail
            key={index}
            design={design}
            designIndex={index}
            baseUrl={BASE_URL}
            mainImage={mainImage}
            isSelected={isDesignSelected(design.imageUrl)}
            isOutOfStock={isOutOfStock(design)}
            onPress={setThumbnailAsMain}
            onLongPress={toggleDesignSelection}
          />
        ))}
      </View>

      {/* User Guidance */}
      <View style={styles.guidanceContainer}>
        <Text style={styles.guidanceTitle}>How to Order:</Text>
        <Text style={styles.guidanceText}>• Tap any design to preview it</Text>
        <Text style={styles.guidanceText}>• Long press to select for ordering</Text>
        <Text style={styles.guidanceText}>• Selected designs will show checkmark</Text>
      </View>

      {/* Quick Order Button */}
      {selectedDesigns.length > 0 && (
        <View style={styles.quickOrderContainer}>
          <Text style={styles.selectedCount}>
            {selectedDesigns.length} design{selectedDesigns.length !== 1 ? 's' : ''} selected
          </Text>
          <TouchableOpacity style={styles.quickOrderBtn} onPress={openOrderModal}>
            <Text style={styles.quickOrderBtnText}>Review Order ({totalQuantity} items)</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product Details */}
      <Text style={styles.brand}>Brand: {product.brand}</Text>
      <Text style={styles.price}>Price: Rs. {product.price} per item</Text>
      <Text style={styles.description}>{product.description}</Text>

      {/* Order Button */}
      <TouchableOpacity
        style={[styles.confirmBtn, selectedDesigns.length === 0 && styles.disabledBtn]}
        onPress={openOrderModal}
        disabled={selectedDesigns.length === 0}
      >
        <Text style={styles.confirmBtnText}>
          {selectedDesigns.length === 0
            ? "Select Designs to Order (Long Press)"
            : `Review Order - ${totalQuantity} items`
          }
        </Text>
      </TouchableOpacity>

      {/* Order Modal */}
      <OrderModal
        visible={orderModalVisible}
        product={product}
        selectedDesigns={selectedDesigns}
        baseUrl={BASE_URL}
        totalQuantity={totalQuantity}
        totalPrice={totalPrice}
        onClose={closeOrderModal}
        onPlaceOrder={handlePlaceCODOrder}
        onUpdateQuantity={updateDesignQuantity}
      />

      {/* Reviews Section */}
      <ReviewsSection reviews={reviews} loading={loadingReviews} error={error} />
    </ScrollView>
  );
};

export default ProductCustomization;