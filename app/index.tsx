import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AdminHeader from "./components/AdminHeader";
import ProductForm from "./components/ProductForm/ProductForm";
import ProductsList from "./components/ProductsList";
import ReviewsList from "./components/Review";
import styles from "./CSS/Index.styles";
import OrdersScreen from "./Orders";

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

type Tab = "create" | "products" | "orders" | "reviews";

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
      <AdminHeader styles={styles} />

      <Text style={styles.welcomeTitle}>Welcome Back, Admin</Text>

      <View style={styles.tabsContainer}>
        {["create", "products", "orders", "reviews"].map((tabName) => {
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
                {tab === "reviews" && <MaterialCommunityIcons name="star" size={20} color="#fff" />}
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

      {activeTab === "reviews" && <ReviewsList styles={styles} />}
    </ScrollView>
  );
}