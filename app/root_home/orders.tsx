import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useApi } from "../context/ApiContext";

export default function Orders() {
  const BASE_URL = useApi();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        try {
          const userId = await AsyncStorage.getItem("user");
          if (!userId) return;

          const response = await fetch(`${BASE_URL}/orders/${userId}`);
          const data = await response.json();
          setOrders(data);
        } catch (err) {
          console.error("Error fetching orders", err);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Orders</Text>
      {orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={styles.orderId}>Order ID: {item._id}</Text>
              <Text style={styles.orderTotal}>
                Total: {item.totalAmount} {item.currency.toUpperCase()}
              </Text>
              <Text style={styles.orderStatus}>Status: {item.status}</Text>
              <Text style={styles.orderDate}>
                Date: {new Date(item.createdAt).toLocaleDateString()}
              </Text>

              <Text style={styles.itemsHeader}>Items:</Text>
              {item.items.map((product: any, index: number) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemName}>
                    • {product.name} x {product.quantity}
                  </Text>
                  {product.size && <Text>Size: {product.size}</Text>}
                  {product.color && <Text>Color: {product.color}</Text>}
                  <Text style={styles.itemPrice}>Price: {product.price}Rs.</Text>
                </View>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  orderCard: {
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  orderId: { fontSize: 14, color: "#666", marginBottom: 4 },
  orderTotal: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  orderStatus: { fontSize: 16, fontWeight: "600", color: "#007BFF", marginBottom: 4 },
  orderDate: { fontSize: 14, color: "#999", marginBottom: 10 },
  itemsHeader: { fontSize: 16, fontWeight: "600", marginTop: 8 },
  itemRow: { marginTop: 5 },
  itemName: { fontSize: 15 },
  itemPrice: { fontSize: 14, color: "#555" },
});
