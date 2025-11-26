import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Alert,
  ScrollView,
  Text,
  Pressable,
  View,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import AdminHeader from "./components/AdminHeader";
import ProductForm from "./components/ProductForm/ProductForm";
import ProductsList from "./components/ProductsList";
import ReviewsList from "./components/Review";
import OrdersScreen from "./Orders";
import styles from "./CSS/Index.styles";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

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

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#4CAF50", backgroundColor: "#4CAF50" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "medium",
        color: "white",
      }}
      text2Style={{
        color: "#ddd",
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#f44336", backgroundColor: "#f44336" }}
      text1Style={{
        fontSize: 15,
        fontWeight: "bold",
        color: "white",
      }}
      text2Style={{
        color: "#ddd",
      }}
    />
  ),
};

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("create");
  const [refreshProducts, setRefreshProducts] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editProductData, setEditProductData] = useState<Product | null>(null);
  const router = useRouter();

  // ✅ Fade animation for tab switching
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const triggerFadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  // ✅ Fade on mount and tab change
  useEffect(() => {
    triggerFadeIn();
  }, [activeTab]);

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

  // ✅ Animated hover states for each tab
  const hoverScales = {
    create: useRef(new Animated.Value(1)).current,
    products: useRef(new Animated.Value(1)).current,
    orders: useRef(new Animated.Value(1)).current,
    reviews: useRef(new Animated.Value(1)).current,
  };

  const hoverBackgrounds = {
    create: useRef(new Animated.Value(0)).current,
    products: useRef(new Animated.Value(0)).current,
    orders: useRef(new Animated.Value(0)).current,
    reviews: useRef(new Animated.Value(0)).current,
  };

  const handleHoverIn = (tab: Tab) => {
    Animated.parallel([
      Animated.spring(hoverScales[tab], {
        toValue: 1.07,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(hoverBackgrounds[tab], {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleHoverOut = (tab: Tab) => {
    Animated.parallel([
      Animated.spring(hoverScales[tab], {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(hoverBackgrounds[tab], {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const backgroundInterpolation = (tab: Tab) =>
    hoverBackgrounds[tab].interpolate({
      inputRange: [0, 1],
      outputRange: ["#0f0f0f", "#1f1f1f"], // subtle light on hover
    });

  return (
    <>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <AdminHeader styles={styles} />

      <Text style={styles.welcomeTitle}>Welcome Back, Admin</Text>

      {/* Tabs Section */}
      <View style={styles.tabsContainer}>
        {(["create", "products", "orders", "reviews"] as Tab[]).map((tab) => {
          const isActive = activeTab === tab;

          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              onHoverIn={() => handleHoverIn(tab)}
              onHoverOut={() => handleHoverOut(tab)}
            >
              <Animated.View
                style={[
                  styles.tabButton,
                  {
                    transform: [{ scale: hoverScales[tab] }],
                    backgroundColor: backgroundInterpolation(tab),
                  },
                  isActive && styles.tabButtonActive,
                ]}
              >
                <View style={styles.tabContent}>
                  {tab === "create" && (
                    <Feather name="plus-circle" size={20} color="#fff" />
                  )}
                  {tab === "products" && (
                    <MaterialCommunityIcons
                      name="basket"
                      size={20}
                      color="#fff"
                    />
                  )}
                  {tab === "orders" && (
                    <MaterialCommunityIcons
                      name="cart"
                      size={20}
                      color="#fff"
                    />
                  )}
                  {tab === "reviews" && (
                    <MaterialCommunityIcons
                      name="star"
                      size={20}
                      color="#fff"
                    />
                  )}
                  <Text style={styles.tabText}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </View>
              </Animated.View>
            </Pressable>
          );
        })}
      </View>

      {/* Fade In Section on Tab Change */}
      <Animated.View style={{ opacity: fadeAnim }}>
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

        {activeTab === "products" && (
          <ProductsList refresh={refreshProducts} onEdit={startEdit} />
        )}

        {activeTab === "orders" && <OrdersScreen />}

        {activeTab === "reviews" && <ReviewsList />}
      </Animated.View>
    </ScrollView>
    <Toast config={toastConfig}/>
    </>
  );
}
