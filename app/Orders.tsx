import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useApi } from "./context/ApiContext";
import styles from "./CSS/OrdersWeb.styles";
import Toast from "react-native-toast-message";

interface Order {
  _id: string;
  userName?: string;
  user?: { name: string };
  totalAmount: number;
  status: "pending" | "shipped" | "delivered";
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
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
      setFilteredOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: Order["status"]) => {
  try {
    await axios.put(`${BASE_URL}/orders/${orderId}/status`, { status: newStatus });

    // Update locally
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Reset filters to "All"
    setSelectedStatus("all");
    setSearchQuery(""); // optional: clear search bar too

    // Reapply filters with the new "all" state
    applyFilters("all", "");
    Toast.show({
            type: "success",
            text1: "Order status updated successfully!",
            position: "top",
            visibilityTime: 2500,
          });

    // Optionally refetch fresh data from backend
    fetchOrders();
  } catch (err) {
    Toast.show({
            type: "error",
            text1: "Failed to update order status.",
            position: "top",
            visibilityTime: 2500,
          });
  }
};


  const applyFilters = (status: string, query: string) => {
    let filtered = [...orders];

    if (status !== "all") {
      filtered = filtered.filter((o) => o.status === status);
    }

    if (query.trim() !== "") {
      filtered = filtered.filter((o) =>
        o._id.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    applyFilters(status, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(selectedStatus, query);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>Loading orders...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>No orders found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Filter & Search Bar */}
      <View style={styles.filterBar}>
        <View style={styles.filterContainer}>
          {["all", "pending", "shipped", "delivered"].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => handleStatusChange(status)}
              style={[
                styles.filterButton,
                selectedStatus === status && styles.activeFilterButton,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedStatus === status && styles.activeFilterText,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Order ID..."
          placeholderTextColor="#aaaa"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item._id}
        numColumns={3}
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
            onPressIn={() => setHovered(item._id)}
            onPressOut={() => setHovered(null)}
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
    </View>
  );
}
