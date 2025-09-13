import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker"; // make sure to install this

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://192.168.1.22:5000/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://192.168.1.22:5000/orders/${orderId}/status`, {
        status: newStatus,
      });
      // update local state after success
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
      renderItem={({ item }) => (
        <View style={styles.orderCard}>
          <Text style={styles.title}>Order #{item._id}</Text>
          <Text>User: {item.userName || item.user?.name}</Text>
          <Text>Total: Rs.{item.totalAmount}</Text>

          <Text style={{ marginTop: 8 }}>Status:</Text>
          <Picker
            selectedValue={item.status}
            onValueChange={(value) => updateStatus(item._id, value)}
            style={styles.picker}
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

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderCard: {
    padding: 12,
    margin: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  picker: {
    height: 40,
    width: "100%",
  },
});
