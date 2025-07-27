import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { PieChart, BarChart } from "react-native-chart-kit";

const API_BASE = "http://10.0.0.8:5000/products";
const screenWidth = Dimensions.get("window").width;

const AdminHeader = () => (
  <View style={styles.headerContainer}>
    <Image
      source={{ uri: "https://i.pravatar.cc/100?img=3" }}
      style={styles.profileImage}
    />
    <View>
      <Text style={styles.welcomeText}>Welcome Back,</Text>
      <Text style={styles.adminName}>Reyan Iqbal</Text>
    </View>
  </View>
);

// Form Component
const CreateProductForm = ({ onProductCreated }) => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    category: "",
    price: 0,
    quantity: 0,
    sku: "",
    description: "",
  });
  const [image, setImage] = useState(null);

  const handleChange = (key, value) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleAddProduct = async () => {
    if (!product.name || !image) {
      Alert.alert("Validation", "Please enter product name and select image.");
      return;
    }

    try {
      const formData = new FormData();
      if (product.image && product.image.uri) {
        formData.append('image', {
          uri: product.image.uri,
          type: product.image.type || 'image/jpeg',
          name: product.image.fileName || 'upload.jpg',
        });
      } else {
        console.warn("Image not selected yet.");
      }
      const response = await fetch(API_BASE, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Product added!");
        onProductCreated(data);
        setProduct({
          name: "",
          brand: "",
          category: "",
          price: 0,
          quantity: 0,
          sku: "",
          description: "",
        });
        setImage(null);
      } else {
        Alert.alert("Error", data.message || "Failed to add product.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>Add New Product</Text>

      {/* Inputs */}
      {["name", "brand", "category", "price", "quantity"].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          placeholderTextColor="#aaa"
          keyboardType={["price", "quantity"].includes(field) ? "numeric" : "default"}
          value={product[field]}
          onChangeText={(text) => handleChange(field, text)}
        />
      ))}

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        multiline
        value={product.description}
        onChangeText={(text) => handleChange("description", text)}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
        <Text style={{ color: "#fff" }}>{image ? "Change Image" : "Select Image"}</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image.uri }} style={{ width: 100, height: 100, marginTop: 10 }} />}

      <TouchableOpacity style={styles.addBtn} onPress={handleAddProduct}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
};

// Products List
const ProductsList = ({ refresh }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>Product List:</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: "#eee", fontWeight: "bold" }}>{item.name}</Text>
            <Text style={{ color: "#ccc" }}>
              Brand: {item.brand} | Price: Rs. {item.price}
            </Text>
            <Text style={{ color: "#ccc" }}>Qty: {item.quantity} | SKU: {item.sku}</Text>
            <Text style={{ color: "#aaa" }}>{item.description}</Text>
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: 100, height: 100, marginTop: 5 }}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

const AnalyticsTab = () => {
  const pieData = [
    { name: "Category A", population: 40, color: "#34d399", legendFontColor: "#fff", legendFontSize: 14 },
    { name: "Category B", population: 30, color: "#3b82f6", legendFontColor: "#fff", legendFontSize: 14 },
    { name: "Category C", population: 30, color: "#f59e0b", legendFontColor: "#fff", legendFontSize: 14 },
  ];
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [{ data: [14, 80, 45, 60, 34] }],
  };
  const chartConfig = {
    backgroundGradientFrom: "#1e1e1e",
    backgroundGradientTo: "#1e1e1e",
    color: (opacity = 1) => `rgba(52, 211, 153, ${opacity})`,
    labelColor: () => "#ccc",
    strokeWidth: 2,
    barPercentage: 0.7,
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>Analytics Overview</Text>
      <PieChart data={pieData} width={screenWidth - 40} height={200} chartConfig={chartConfig} accessor={"population"} backgroundColor={"transparent"} paddingLeft={"15"} absolute />
      <BarChart data={barData} width={screenWidth - 40} height={220} chartConfig={chartConfig} style={{ marginTop: 16 }} fromZero />
    </View>
  );
};

// Main Admin Component
export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState("create");
  const [refreshProducts, setRefreshProducts] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AdminHeader />
      <Text style={styles.title}>Welcome Back, Admin</Text>

      <View style={styles.tabContainer}>
        {["create", "products", "analytics"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, activeTab === tab ? styles.activeTab : styles.inactiveTab]}
          >
            <View style={styles.tabContent}>
              {tab === "create" && <Feather name="plus-circle" size={20} color="white" />}
              {tab === "products" && <MaterialCommunityIcons name="basket" size={20} color="white" />}
              {tab === "analytics" && <MaterialCommunityIcons name="chart-bar" size={20} color="white" />}
              <Text style={styles.tabLabel}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "create" && <CreateProductForm onProductCreated={() => setRefreshProducts(!refreshProducts)} />}
      {activeTab === "products" && <ProductsList refresh={refreshProducts} />}
      {activeTab === "analytics" && <AnalyticsTab />}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 50,
    backgroundColor: "#121212",
    minHeight: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#10b981",
  },
  welcomeText: {
    color: "#ccc",
    fontSize: 14,
  },
  adminName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#22c55e",
    textAlign: "center",
    marginBottom: 28,
    letterSpacing: 1.2,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 28,
    flexWrap: "wrap",
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  activeTab: {
    backgroundColor: "#16a34a",
    elevation: 3,
  },
  inactiveTab: {
    backgroundColor: "#1f2937",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabLabel: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
  },
  cardText: {
    color: "#f5f5f5",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  col: {
    flex: 1,
    minWidth: "47%",
    marginBottom: 10,
  },
  label: {
    color: "#ccc",
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#2e2e2e",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#4ade80",
  },
  addBtn: {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  chartLabel: {
    color: "#ccc",
    marginTop: 18,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});
