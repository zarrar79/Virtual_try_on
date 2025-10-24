import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product List</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            {item.imageUrl && (
              <Image
                source={{ uri: `${API_BASE}${item.imageUrl}`}}
                style={styles.productImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.productInfo}>
              <View style={styles.infoText}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDetails}>
                  Brand: {item.brand} | Price: Rs. {item.price}
                </Text>
                <Text style={styles.productDetails}>Qty: {item.quantity}</Text>
                <Text style={styles.productDescription}>{item.description}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => onEdit(item)}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ProductsList;
