import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
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
      contentContainerStyle={{ paddingBottom: 20 }}
      renderItem={({ item }) => (

        <View style={styles.orderCard}>
          <Text style={styles.title}>
            Order #{item._id}</Text>
          <Text>User: {item.userName ?? item.user?.name ?? "Unknown"}</Text>
          <Text>Total: Rs.{item.totalAmount}</Text>

          <Text style={{ marginTop: 8 }}>Status:</Text>
          <Picker
            selectedValue={item.status}
            onValueChange={(value) => updateStatus(item._id, value as Order["status"])}
            style={{ width: undefined }} // unset fixed width
          >
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Shipped" value="shipped" />
            <Picker.Item label="Delivered" value="delivered" />
          </Picker>
        </View>
      )}
    />
  );
}
