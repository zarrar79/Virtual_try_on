import React, { useEffect, useState } from "react";
import OrdersScreen from "./Orders";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import ProductForm from "./components/ProductForm/ProductForm";
import ProductsList from "./components/ProductsList";

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  imageUrl?: string;
  sku?: string;
}

type Tab = "create" | "products" | "orders";

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("create");
  const [refreshProducts, setRefreshProducts] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editProductData, setEditProductData] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkToken() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.push("/auth");
        } else {
          Alert.alert("Please Login First!");
        }
      } catch (err) {
        console.error("Error reading token", err);
      }
    }
    checkToken();
  }, [router]);

  const startEdit = (item: Product) => {
    setIsEditing(true);
    setEditProductData(item);
    setActiveTab("create");
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditProductData(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <AdminHeader />

      <Text style={styles.welcomeTitle}>Welcome Back, Admin</Text>

      <View style={styles.tabsContainer}>
        {["create", "products", "orders"].map((tabName) => {
          const tab = tabName as Tab;
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
            >
              <View style={styles.tabContent}>
                {tab === "create" && <Feather name="plus-circle" size={20} color="#fff" />}
                {tab === "products" && <MaterialCommunityIcons name="basket" size={20} color="#fff" />}
                {tab === "orders" && <MaterialCommunityIcons name="cart" size={20} color="#fff" />}
                <Text style={styles.tabText}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeTab === "create" && (
        <ProductForm
          isEditing={isEditing}
          editProductData={editProductData}
          cancelEdit={cancelEdit}
          onSuccess={() => {
            cancelEdit();
            setRefreshProducts(!refreshProducts);
          }}
        />
      )}

      {activeTab === "products" && <ProductsList refresh={refreshProducts} onEdit={startEdit} />}

      {activeTab === "orders" && <OrdersScreen />}
    </ScrollView>
  );
}

const AdminHeader: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.replace("/auth");
    } catch (error) {
      Alert.alert("Logout Error", "Something went wrong.");
      console.error(error);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: "https://i.pravatar.cc/100?img=3" }} style={styles.avatar} />
        <View>
          <Text style={styles.welcomeText}>Welcome Back,</Text>
          <Text style={styles.nameText}>Reyan Iqbal</Text>
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 24,
    paddingTop: 50,
    backgroundColor: "#000",
    minHeight: "100%",
  },
  welcomeTitle: {
    fontSize: 32,
    color: "#22c55e",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 28,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 28,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 6,
    borderRadius: 10,
    backgroundColor: "#1f1f1f",
  },
  tabButtonActive: {
    backgroundColor: "#16a34a",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#10B981",
  },
  welcomeText: {
    color: "#D1D5DB",
    fontSize: 13,
  },
  nameText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
