import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  Pressable,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../context/ApiContext";
import styles from "../CSS/ProductsList.styles";
import Toast from "react-native-toast-message";

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

interface ProductsListProps {
  refresh: boolean;
  onEdit: (product: Product) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ refresh, onEdit }) => {
  const API_BASE = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [numColumns, setNumColumns] = useState<number>(4);
  const [cardWidth, setCardWidth] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // ✅ Responsive grid setup
  useEffect(() => {
    const updateColumns = () => {
      const screenWidth = Dimensions.get("window").width;
      const columns = screenWidth < 768 ? 2 : 4;
      setNumColumns(columns);
      const spacing = 24;
      setCardWidth((screenWidth - spacing * (columns + 1)) / columns);
    };

    updateColumns();
    const subscription = Dimensions.addEventListener("change", updateColumns);
    return () => subscription?.remove();
  }, []);

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const data: Product[] = await res.json();
        setProducts(data || []);
        setFilteredProducts(data || []);
        triggerFadeIn();
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [refresh]);

  // ✅ Fade animation
  const triggerFadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  // ✅ Search filter
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(text.toLowerCase()) ||
        p.brand.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // ✅ Delete product
  const handleDelete = async (item: Product) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE}/products/${item._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Deleted", data.message);
        Toast.show({
          type: "success",
          text1: "Product deleted successfully!",
          position: "top",
          visibilityTime: 2500,
        });
        setProducts((prev) => prev.filter((p) => p._id !== item._id));
        setFilteredProducts((prev) => prev.filter((p) => p._id !== item._id));
      } else {
        Alert.alert("Error", data.message || "Delete failed");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to delete product!",
        position: "top",
        visibilityTime: 2500,
      });
      console.error(error);
    }
  };

  // ✅ Show designs popup
  const showDesignsPopup = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
    
    // Reset animations
    modalAnim.setValue(0);
    slideAnim.setValue(50);
    
    // Start animations
    Animated.parallel([
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // ✅ Close designs popup
  const closeDesignsPopup = () => {
    Animated.parallel([
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedProduct(null);
    });
  };

  // ✅ Render design item for horizontal layout
  const renderDesignItem = ({ item, index }: { item: Design; index: number }) => (
    <View style={styles.designItem}>
      <Image
        source={{ uri: `${API_BASE}${item.imageUrl}` }}
        style={styles.designImage}
        resizeMode="cover"
      />
      <View style={styles.designInfo}>
        <Text style={styles.designTitle}>Design {index + 1}</Text>
        <Text style={styles.designStock}>Stock: {item.stock}</Text>
      </View>
    </View>
  );

  // ✅ Render each product card
  const renderCard = ({ item }: { item: Product }) => {
    const scaleAnim = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scaleAnim, { toValue: 1.05, useNativeDriver: true }).start();
    };
    const onPressOut = () => {
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
    };

    return (
      <Animated.View
        style={[
          styles.productCard,
          { width: cardWidth, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Pressable 
          onPressIn={onPressIn} 
          onPressOut={onPressOut}
          onPress={() => showDesignsPopup(item)}
        >
          {item.designs && item.designs.length > 0 && (
            <Image
              source={{ uri: `${API_BASE}${item.designs[0].imageUrl}` }}
              style={styles.productImage}
              resizeMode="cover"
            />
          )}

          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDetails}>
              {item.brand} • Rs. {item.price}
            </Text>
            <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
            <Text
              style={styles.productDescription}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>

            {/* Designs indicator */}
            {item.designs && item.designs.length > 0 && (
              <View style={styles.designsIndicator}>
                <Text style={styles.designsIndicatorText}>
                  {item.designs.length} Design{item.designs.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => onEdit(item)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Products List</Text>

      {/* ✅ Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search by Name or Brand..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <FlatList
          key={numColumns}
          data={filteredProducts}
          numColumns={numColumns}
          keyExtractor={(item) => item._id}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.gridContainer}
          renderItem={renderCard}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products found.</Text>
          }
        />
      </Animated.View>

      {/* ✅ Designs Popup Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeDesignsPopup}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                opacity: modalAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {selectedProduct && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selectedProduct.name} - Designs
                  </Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={closeDesignsPopup}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.designsContainer}>
                  {selectedProduct.designs && selectedProduct.designs.length > 0 ? (
                    <ScrollView 
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.horizontalDesignsList}
                    >
                      {selectedProduct.designs.map((design, index) => (
                        <View key={index} style={styles.designItemHorizontal}>
                          <Image
                            source={{ uri: `${API_BASE}${design.imageUrl}` }}
                            style={styles.designImageHorizontal}
                            resizeMode="cover"
                          />
                          <View style={styles.designInfoHorizontal}>
                            <Text style={styles.designTitle}>Design {index + 1}</Text>
                            <Text style={styles.designStock}>Stock: {design.stock}</Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <Text style={styles.noDesignsText}>No designs available</Text>
                  )}
                </View>

                <View style={styles.modalFooter}>
                  <Text style={styles.totalStock}>
                    Total Stock: {selectedProduct.quantity}
                  </Text>
                  <TouchableOpacity 
                    style={styles.editAllButton}
                    onPress={() => {
                      closeDesignsPopup();
                      onEdit(selectedProduct);
                    }}
                  >
                    <Text style={styles.editAllButtonText}>Edit All Designs</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductsList;