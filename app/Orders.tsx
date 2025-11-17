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
  Image,
  ScrollView,
  Modal,
  StyleSheet,
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
  items: {
    name: string;
    quantity: number;
    size?: string;
    color?: string;
    price: number;
    imageUrls: string[]; // multiple selected images
  }[];
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // For modal
  const BASE_URL = useApi();

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

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setSelectedStatus("all");
      setSearchQuery("");
      applyFilters("all", "");

      Toast.show({
        type: "success",
        text1: "Order status updated successfully!",
        position: "top",
        visibilityTime: 2500,
      });

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
  numColumns={3} // ✅ set how many columns you want
  columnWrapperStyle={{
    width: "100%",
    justifyContent: "space-between", // ✅ spread items horizontally
    marginBottom: 20, // space between rows
  }}
  contentContainerStyle={{ padding: 20 }}
  renderItem={({ item }) => (
    <Pressable
      onPressIn={() => setHovered(item._id)}
      onPressOut={() => setHovered(null)}
      style={({ pressed }) => [
        {
          flex: 1, // ✅ important for items to fill half of the row
          marginRight: 10, // optional spacing between items
        },
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

      <TouchableOpacity
        onPress={() => setSelectedOrder(item)}
        style={{
          marginTop: 10,
          backgroundColor: "#1E90FF",
          padding: 6,
          borderRadius: 4,
        }}
      >
        <Text style={{ color: "#fff" }}>View Ordered Items</Text>
      </TouchableOpacity>
    </Pressable>
  )}
/>

      {/* Modal for Ordered Images */}
      <Modal
        visible={!!selectedOrder}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Order #{selectedOrder?._id}</Text>
            <ScrollView>
              {selectedOrder?.items.map((product, idx) => (
                <View key={idx} style={{ marginBottom: 20 }}>
                  <Text style={styles.itemName}>
                    • {product.name} x {product.quantity}
                  </Text>
                  {product.size && <Text>Size: {product.size}</Text>}
                  {product.color && <Text>Color: {product.color}</Text>}

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                    {product.imageUrls.map((img, i) => (
                      <Image
                        key={i}
                        source={{ 
                          uri: BASE_URL + img }}
                        style={{ width: 200, height: 200, marginRight: 10, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    ))}
                  </ScrollView>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setSelectedOrder(null)}
              style={{
                marginTop: 10,
                backgroundColor: "#FF6347",
                padding: 10,
                borderRadius: 6,
                alignSelf: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}