import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useApi } from "./context/ApiContext";
import styles from "./CSS/OrdersWeb.styles";

interface Order {
  _id: string;
  userName?: string;
  user?: { name: string };
  totalAmount: number;
  status: "pending" | "shipped" | "delivered";
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = useApi();
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get<Order[]>(`${BASE_URL}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await axios.put(`${BASE_URL}/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No orders found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item._id}
      numColumns={3} // 👈 3 cards per row
      columnWrapperStyle={{
        justifyContent: "space-between",
        marginBottom: 20,
      }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 20,
      }}
      renderItem={({ item }) => (
        <Pressable
  onPressIn={() => setHovered(item._id)}   // simulate hover start
  onPressOut={() => setHovered(null)}      // simulate hover end
  style={({ pressed }) => [
    styles.orderCard,
    (pressed || hovered === item._id) && styles.orderCardHover,
  ]}
>

          <Text style={styles.title}>Order #{item._id}</Text>
          <Text style={styles.userText}>
            User: {item.userName ?? item.user?.name ?? "Unknown"}
          </Text>
          <Text style={styles.totalText}>Total: Rs.{item.totalAmount}</Text>

          <Text style={styles.statusLabel}>Status:</Text>
          <Picker
            selectedValue={item.status}
            onValueChange={(value) =>
              updateStatus(item._id, value as Order["status"])
            }
            style={styles.statusPicker}
          >
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Shipped" value="shipped" />
            <Picker.Item label="Delivered" value="delivered" />
          </Picker>
        </Pressable>
      )}
    />
  );
}
