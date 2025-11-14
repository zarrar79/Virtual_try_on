import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApi } from "./context/ApiContext";
import styles from "./ProductPage.style";
import Adminstyles from "./CSS/Index.styles";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminHeader from "./components/AdminHeader";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  quantity: number;
  category: string;
  imageUrls: string[];
}

const ProductsPageWeb: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = useApi();
  const navigation = useNavigation();

  // Animation refs
  const fadeAnim = useRef<Animated.Value[]>([]);
  const slideAnim = useRef<Animated.Value[]>([]);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Initialize animations for each product
  useEffect(() => {
    if (products.length > 0) {
      fadeAnim.current = products.map(() => new Animated.Value(0));
      slideAnim.current = products.map(() => new Animated.Value(20));

      // Run animations with staggered delay
      const animations = products.map((_, index) =>
        Animated.parallel([
          Animated.timing(fadeAnim.current[index], {
            toValue: 1,
            duration: 600,
            useNativeDriver: false, 
          }),
          Animated.timing(slideAnim.current[index], {
            toValue: 0,
            duration: 600,
            useNativeDriver: false,
          }),
        ])
      );

      Animated.stagger(100, animations).start();
    }
  }, [products]);

  if (loading)
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loaderText}>Loading products...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.loaderContainer}>
        <Text style={[styles.loaderText, { color: "#EF4444" }]}>
          Error: {error}
        </Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <AdminHeader styles={Adminstyles} />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>All Products</Text>
        <TouchableOpacity
          style={styles.manageBtn}
          onPress={() => navigation.navigate("manage" as never)}
        >
          <Text style={styles.manageBtnText}>Manage Products</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {products.length === 0 ? (
          <Text style={styles.noProducts}>No products available.</Text>
        ) : (
          <View style={styles.productGrid}>
            {products.map((product, index) => (
              <Animated.View
                key={product._id}
                style={[
                  styles.productCard,
                  {
                    opacity: fadeAnim.current[index],
                    transform: [{ translateY: slideAnim.current[index] }],
                  },
                ]}
              >
                {console.log(product.imageUrls)}
                <Image
                  source={{ uri: `${BASE_URL}${product.imageUrls[0]}` }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productBrand}>{product.brand}</Text>
                  <Text style={styles.productDesc} numberOfLines={2}>
                    {product.description}
                  </Text>

                  <View style={styles.productInfo}>
                    <Text style={styles.productPrice}>PKR{product.price}</Text>
                    <Text style={styles.productQty}>
                      {product.quantity} in stock
                    </Text>
                  </View>

                  <Text style={styles.productCategory}>
                    Category: {product.category}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProductsPageWeb;
