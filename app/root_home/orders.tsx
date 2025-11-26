import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useApi } from "../context/ApiContext";
import styles from "../CSS/Orders.styles";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Orders() {
  const BASE_URL = useApi();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);

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

  const toggleExpand = (orderId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

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
          renderItem={({ item }) => {
            const isExpanded = expandedOrderIds.includes(item._id);
            return (
              <View style={styles.orderCard}>
                <TouchableOpacity onPress={() => toggleExpand(item._id)}>
                  <Text style={styles.orderId}>Order ID: {item._id}</Text>
                  <Text style={styles.orderTotal}>
                    Total: {item.totalAmount} {item.currency.toUpperCase()}
                  </Text>
                  <Text style={styles.orderStatus}>Status: {item.status}</Text>
                  <Text style={styles.orderDate}>
                    Date: {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.itemsHeader}>
                    Items: {item.items.length} (Tap to {isExpanded ? "collapse" : "expand"})
                  </Text>
                </TouchableOpacity>

                {isExpanded &&
                  item.items.map((product: any, index: number) => (
                    <View key={index} style={styles.itemRow}>
                      <Text style={styles.itemName}>
                        • {product.name} x {product.quantity}
                      </Text>
                      {product.size && <Text>Size: {product.size}</Text>}
                      {product.color && <Text>Color: {product.color}</Text>}
                      <Text style={styles.itemPrice}>Price: {product.price}Rs.</Text>

                      {/* SHOW MULTIPLE IMAGES */}
                      {product.imageUrls?.length > 0 && (
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={styles.imageScroll}
                        >
                          {product.imageUrls.map((img: string, i: number) => (
                            <Image
                              key={i}
                              source={{ uri: `${BASE_URL}${img}` }}
                              style={styles.productImage}
                              resizeMode="cover"
                            />
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  ))}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
