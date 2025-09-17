// components/ProductList.js
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

const ProductsList = ({ refresh, onEdit }) => {
   const API_BASE = useApi();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [refresh]);

  const handleDelete = async (item) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE}/${item._id}`, {
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
                source={{ uri: `${API_BASE}${item.imageUrl}` }}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  productImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    flex: 1,
    paddingRight: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  productDetails: {
    color: "#ccc",
    fontSize: 14,
  },
  productDescription: {
    color: "#aaa",
    fontSize: 12,
  },
  actionButtons: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  editButton: {
    color: "#4da6ff",
    fontWeight: "600",
    marginBottom: 8,
  },
  deleteButton: {
    color: "#ff4d4d",
    fontWeight: "600",
  },
});

export default ProductsList;
