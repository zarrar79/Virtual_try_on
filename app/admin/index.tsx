import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { PieChart, BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// Admin Header
const AdminHeader = () => (
  <View style={styles.headerContainer}>
    <Image
      source={{ uri: "https://i.pravatar.cc/100?img=3" }}
      style={styles.profileImage}
    />
    <View>
      <Text style={styles.welcomeText}>Welcome Back,</Text>
      <Text style={styles.adminName}>Zarrar Shah</Text>
    </View>
  </View>
);

// Create Product Form
const CreateProductForm = ({ onAddProduct }) => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });

  const handleChange = (key, value) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    if (product.name.trim()) {
      onAddProduct(product);
      setProduct({
        name: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
      });
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>Add New Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={product.name}
        onChangeText={(text) => handleChange("name", text)}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={product.category}
        onChangeText={(text) => handleChange("category", text)}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={product.price}
        onChangeText={(text) => handleChange("price", text)}
        keyboardType="numeric"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={product.quantity}
        onChangeText={(text) => handleChange("quantity", text)}
        keyboardType="numeric"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        value={product.description}
        onChangeText={(text) => handleChange("description", text)}
        multiline
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
};

// Product List
const ProductsList = ({ products }) => (
  <View style={styles.card}>
    <Text style={styles.cardText}>Product List:</Text>
    <FlatList
      data={products}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: "#eee", fontWeight: "bold" }}>{item.name}</Text>
          <Text style={{ color: "#ccc" }}>Category: {item.category}</Text>
          <Text style={{ color: "#ccc" }}>
            Price: Rs. {item.price} | Qty: {item.quantity}
          </Text>
          <Text style={{ color: "#999" }}>{item.description}</Text>
        </View>
      )}
    />
  </View>
);

// Analytics Tab
const AnalyticsTab = () => {
  const pieData = [
    {
      name: "Category A",
      population: 40,
      color: "#34d399",
      legendFontColor: "#fff",
      legendFontSize: 14,
    },
    {
      name: "Category B",
      population: 30,
      color: "#3b82f6",
      legendFontColor: "#fff",
      legendFontSize: 14,
    },
    {
      name: "Category C",
      population: 30,
      color: "#f59e0b",
      legendFontColor: "#fff",
      legendFontSize: 14,
    },
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
    useShadowColorFromDataset: false,
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>Analytics Overview</Text>

      <Text style={styles.chartLabel}>Pie Chart:</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 40}
        height={200}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />

      <Text style={styles.chartLabel}>Bar Chart:</Text>
      <BarChart
        data={barData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        showValuesOnTopOfBars
        style={{ marginTop: 16 }}
        fromZero
      />
    </View>
  );
};

// Tab Configs
const tabs = [
  {
    id: "create",
    label: "Create Product",
    icon: () => <Feather name="plus-circle" size={20} color="white" />,
  },
  {
    id: "products",
    label: "Products",
    icon: () => (
      <MaterialCommunityIcons name="basket" size={20} color="white" />
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: () => (
      <MaterialCommunityIcons name="chart-bar" size={20} color="white" />
    ),
  },
];

// Main Screen
export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState("create");
  const [products, setProducts] = useState([]);

  const handleAddProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AdminHeader />
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[
              styles.tabButton,
              activeTab === tab.id ? styles.activeTab : styles.inactiveTab,
            ]}
          >
            <View style={styles.tabContent}>
              {tab.icon()}
              <Text style={styles.tabLabel}>{tab.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "create" && (
        <CreateProductForm onAddProduct={handleAddProduct} />
      )}
      {activeTab === "products" && <ProductsList products={products} />}
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: {
    color: "#f5f5f5",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  input: {
    backgroundColor: "#2e2e2e",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#4ade80",
  },
  addBtn: {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  chartLabel: {
    color: "#ccc",
    marginTop: 18,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});