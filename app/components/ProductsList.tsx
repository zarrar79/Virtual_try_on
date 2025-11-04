import React, { useEffect, useState } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../context/ApiContext";
import styles from "../CSS/ProductsList.styles";

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl?: string;
}

interface ProductsListProps {
  refresh: boolean;
  onEdit: (product: Product) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ refresh, onEdit }) => {
  const API_BASE = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [numColumns, setNumColumns] = useState<number>(4);
  const [cardWidth, setCardWidth] = useState<number>(0);

  // 🔹 Responsive grid setup
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

  // 🔹 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const data: Product[] = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [refresh]);

  // 🔹 Delete product
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
        setProducts((prev) => prev.filter((p) => p._id !== item._id));
      } else {
        Alert.alert("Error", data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Render Product Card
  const renderCard = ({ item }: { item: Product }) => {
    const scaleAnim = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.productCard,
          { width: cardWidth, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
          {item.imageUrl && (
            <Image
              source={{
                uri: `${API_BASE}/${item.imageUrl}`, // ✅ guaranteed valid image
                // uri: "https://placehold.co/400x300?text=No+Image&font=roboto", // ✅ guaranteed valid image
              }}
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
      <Text style={styles.header}>Product List</Text>

      <FlatList
        key={numColumns}
        data={products}
        numColumns={numColumns}
        keyExtractor={(item) => item._id}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContainer}
        renderItem={renderCard}
      />
    </View>
  );
};

export default ProductsList;
