import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../context/ApiContext";
import styles from "../CSS/ProductCustomization.styles";

// Add Design interface
interface Design {
  imageUrl: string;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  designs?: Design[];
}

interface SelectedDesign {
  imageUrl: string;
  quantity: number;
  designIndex: number;
}

const ProductCustomization: React.FC = () => {
  const BASE_URL = useApi();
  const route = useRoute();
  const navigation = useNavigation();

  const product: Product = (route.params as any)?.product;

  // ✅ Main image for display (prepend BASE_URL)
  const [mainImage, setMainImage] = useState<string | null>(
    product?.designs?.length ? BASE_URL + product.designs[0].imageUrl : null
  );

  // ✅ Selected designs state with individual quantities
  const [selectedDesigns, setSelectedDesigns] = useState<SelectedDesign[]>([]);

  // ✅ Order modal state
  const [orderModalVisible, setOrderModalVisible] = useState(false);

  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/review/product/${product._id}`);
        setReviews(response.data);
        console.log(response.data,'--->data');
        
      } catch (err: any) {
        setError("Failed to load reviews");
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [product._id]);

  // Check if a design is out of stock
  const isOutOfStock = (design: Design) => {
    return design.stock <= 0;
  };

  // Check if a design is selected
  const isDesignSelected = (imageUrl: string) => {
    return selectedDesigns.some(design => design.imageUrl === imageUrl);
  };

  // Get quantity for a specific design
  const getDesignQuantity = (imageUrl: string) => {
    const selected = selectedDesigns.find(design => design.imageUrl === imageUrl);
    return selected ? selected.quantity : 0;
  };

  // Handle clicking on thumbnail to set as main image (Preview only)
  const setThumbnailAsMain = (design: Design, designIndex: number) => {
    if (isOutOfStock(design)) {
      Alert.alert("Out of Stock", "This design is currently out of stock.");
      return;
    }

    setMainImage(BASE_URL + design.imageUrl);
  };

  // Handle selecting/deselecting a design for ordering
  const toggleDesignSelection = (design: Design, designIndex: number) => {
    if (isOutOfStock(design)) {
      Alert.alert("Out of Stock", "This design is currently out of stock.");
      return;
    }

    if (isDesignSelected(design.imageUrl)) {
      // Deselect
      setSelectedDesigns(prev => 
        prev.filter(item => item.imageUrl !== design.imageUrl)
      );
    } else {
      // Select with default quantity of 1
      const newSelectedDesign: SelectedDesign = {
        imageUrl: design.imageUrl,
        quantity: 1,
        designIndex: designIndex
      };
      
      setSelectedDesigns(prev => [...prev, newSelectedDesign]);
    }
  };

  // Update quantity for a specific design
  const updateDesignQuantity = (imageUrl: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Minimum quantity is 1
    
    // Check stock availability
    const design = product.designs?.find(d => d.imageUrl === imageUrl);
    if (design && newQuantity > design.stock) {
      Alert.alert("Insufficient Stock", `Only ${design.stock} items available for this design.`);
      return;
    }

    setSelectedDesigns(prev =>
      prev.map(item =>
        item.imageUrl === imageUrl ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Open order modal
  const openOrderModal = () => {
    if (selectedDesigns.length === 0) {
      Alert.alert("No Designs Selected", "Please select at least one design to order.");
      return;
    }
    setOrderModalVisible(true);
  };

  // Close order modal
  const closeOrderModal = () => {
    setOrderModalVisible(false);
  };

  // Calculate total quantity and price
  const totalQuantity = selectedDesigns.reduce((total, design) => total + design.quantity, 0);
  const totalPrice = totalQuantity * product.price;

const handlePlaceCODOrder = async () => {
  const userId = await AsyncStorage.getItem("user");
  const user_name = await AsyncStorage.getItem("user_name");

  if (!userId) {
    Alert.alert("Error", "User not logged in");
    return;
  }

  // Check stock availability for all selected designs
  const stockIssues = selectedDesigns.filter(selectedDesign => {
    const design = product.designs?.[selectedDesign.designIndex];
    return design && selectedDesign.quantity > design.stock;
  });

  if (stockIssues.length > 0) {
    Alert.alert("Stock Issue", "Some selected designs have insufficient stock. Please adjust quantities.");
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
            // Create order items for each selected design
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
                size: selectedSize,
                color: selectedColor,
                itemTotal: product.price * selectedDesign.quantity
              };
            });

            const response = await axios.post(`${BASE_URL}/order/cod`, {
              userId,
              user_name,
              cart: orderItems,
            });

            if (response.status === 201) {
              Alert.alert(
                "Success", 
                `Order placed!\n\nSummary:\n• ${response.data.summary.designsOrdered} design${response.data.summary.designsOrdered !== 1 ? 's' : ''}\n• ${response.data.summary.totalItems} item${response.data.summary.totalItems !== 1 ? 's' : ''}\n• Total: Rs. ${response.data.summary.totalAmount}`,
                [
                  {
                    text: "OK",
                    onPress: () => {
                      // Reset all states
                      resetAllStates();
                      // Navigate to home page
                      navigation.navigate('home'); // Adjust based on your navigation structure
                    }
                  }
                ]
              );
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

// Function to reset all states
const resetAllStates = () => {
  // Reset selected designs
  setSelectedDesigns([]);
  
  // Reset main image to first design
  setMainImage(
    product?.designs?.length ? BASE_URL + product.designs[0].imageUrl : null
  );
  
  // Reset order modal
  setOrderModalVisible(false);
  
  // Reset size and color selections
  setSelectedSize(undefined);
  setSelectedColor(undefined);
  
  // Note: We don't reset reviews as they are fetched from API
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

      {/* THUMBNAILS - Preview only on tap */}
      <View style={styles.thumbnailRow}>
        {product.designs?.map((design: Design, i: number) => {
          const imageUrl = design.imageUrl.startsWith('http') 
            ? design.imageUrl 
            : BASE_URL + design.imageUrl;
          
          const isSelected = isDesignSelected(design.imageUrl);
          const isMainImage = mainImage === imageUrl;
          const outOfStock = isOutOfStock(design);
          
          return (
            <TouchableOpacity
              key={i}
              onPress={() => setThumbnailAsMain(design, i)} // Tap for preview only
              onLongPress={() => toggleDesignSelection(design, i)} // Long press to select for order
              style={[
                styles.thumbnailContainer,
                isSelected && styles.selectedThumbnail,
                isMainImage && styles.mainThumbnail,
                outOfStock && styles.outOfStockThumbnail,
              ]}
              disabled={outOfStock}
            >
              <Image
                source={{ uri: imageUrl }}
                style={[
                  styles.thumbnail,
                  outOfStock && styles.outOfStockImage
                ]}
              />
              
              {/* Out of Stock Overlay */}
              {outOfStock && (
                <View style={styles.outOfStockOverlay}>
                  <Text style={styles.outOfStockText}>Out of Stock</Text>
                </View>
              )}
              
              {/* Main Image Indicator */}
              {isMainImage && !outOfStock && (
                <View style={styles.mainImageIndicator}>
                  <Text style={styles.mainImageText}>Main</Text>
                </View>
              )}

              {/* Selection Indicator */}
              {isSelected && !outOfStock && (
                <View style={styles.selectionIndicator}>
                  <Text style={styles.selectionText}>✓</Text>
                </View>
              )}

              {/* Stock Info */}
              <View style={styles.stockInfo}>
                <Text style={[
                  styles.stockText,
                  outOfStock && styles.outOfStockText
                ]}>
                  Stock: {design.stock}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
          <TouchableOpacity 
            style={styles.quickOrderBtn}
            onPress={openOrderModal}
          >
            <Text style={styles.quickOrderBtnText}>
              Review Order ({totalQuantity} items)
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.brand}>Brand: {product.brand}</Text>
      <Text style={styles.price}>Price: Rs. {product.price} per item</Text>
      <Text style={styles.description}>{product.description}</Text>

      {/* Order Button */}
      <TouchableOpacity 
        style={[
          styles.confirmBtn, 
          selectedDesigns.length === 0 && styles.disabledBtn
        ]} 
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

      {/* ORDER MODAL */}
      <Modal
        visible={orderModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeOrderModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Review Your Order</Text>
              <TouchableOpacity onPress={closeOrderModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Selected Designs in Modal */}
              <View style={styles.selectedDesignsContainer}>
                <Text style={styles.sectionTitle}>Selected Designs</Text>
                {selectedDesigns.map((selectedDesign, index) => {
                  const design = product.designs?.[selectedDesign.designIndex];
                  return (
                    <View key={selectedDesign.imageUrl} style={styles.selectedDesignItem}>
                      <Image
                        source={{ uri: BASE_URL + selectedDesign.imageUrl }}
                        style={styles.selectedDesignImage}
                      />
                      <View style={styles.selectedDesignInfo}>
                        <Text style={styles.designLabel}>Design {selectedDesign.designIndex + 1}</Text>
                        <Text style={styles.stockText}>Available: {design?.stock || 0}</Text>
                        
                        {/* Quantity Controls */}
                        <View style={styles.designQuantityContainer}>
                          <Text style={styles.quantityLabel}>Quantity:</Text>
                          <View style={styles.designQuantityControls}>
                            <TouchableOpacity 
                              style={styles.qtyBtn} 
                              onPress={() => updateDesignQuantity(selectedDesign.imageUrl, selectedDesign.quantity - 1)}
                            >
                              <Text style={styles.qtyBtnText}>-</Text>
                            </TouchableOpacity>

                            <TextInput
                              style={styles.qtyInput}
                              value={selectedDesign.quantity.toString()}
                              keyboardType="numeric"
                              onChangeText={(text) => {
                                const newQty = parseInt(text) || 1;
                                updateDesignQuantity(selectedDesign.imageUrl, newQty);
                              }}
                            />

                            <TouchableOpacity 
                              style={styles.qtyBtn} 
                              onPress={() => updateDesignQuantity(selectedDesign.imageUrl, selectedDesign.quantity + 1)}
                            >
                              <Text style={styles.qtyBtnText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Order Summary */}
              <View style={styles.orderSummary}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                <Text style={styles.summaryText}>Total Items: {totalQuantity}</Text>
                <Text style={styles.summaryText}>Price per item: Rs. {product.price}</Text>
                <Text style={styles.summaryTotal}>Total Price: Rs. {totalPrice}</Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelOrderBtn}
                onPress={closeOrderModal}
              >
                <Text style={styles.cancelOrderText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.placeOrderBtn}
                onPress={handlePlaceCODOrder}
              >
                <Text style={styles.placeOrderText}>Place Order (COD)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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