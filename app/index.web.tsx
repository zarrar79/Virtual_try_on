import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { PieChart, BarChart } from "react-native-chart-kit";
import { tw } from "./utils/tw"; // Adjust path as needed

const API_BASE = "http://10.0.0.4:5000/products";
const screenWidth = Dimensions.get("window").width;

const AdminHeader = () => (
  <View style={tw("flex-row items-center mb-5")}>
    <Image
      source={{ uri: "https://i.pravatar.cc/100?img=3" }}
      style={tw("w-12 h-12 rounded-full mr-3 border-2 border-emerald-500")}
    />
    <View>
      <Text style={tw("text-gray-300 text-sm")}>Welcome Back,</Text>
      <Text style={tw("text-white text-lg font-bold")}>Reyan Iqbal</Text>
    </View>
  </View>
);

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
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      setImage({
        uri: selected.uri,
        base64: selected.base64,
        type: selected.type || "image/jpeg",
        name: selected.fileName || "photo.jpg",
      });
    }
  };

  const compressImage = async (uri) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    return `data:image/jpeg;base64,${result.base64}`;
  };

  const handleAddProduct = async () => {
    if (!product.name || !image) {
      Alert.alert("Validation", "Please enter product name and select image.");
      return;
    }

    const base64Image = await compressImage(image.uri);

    try {
      const payload = { image: base64Image, ...product };
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Product added!");
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
        onProductCreated();
      } else {
        Alert.alert("Error", data.message || "Failed to add product.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={tw("bg-neutral-900 rounded-xl p-5 mb-6")}>
      <Text style={tw("text-white text-lg font-bold mb-4")}>Add New Product</Text>

      {["name", "brand", "category", "price", "quantity"].map((field) => (
        <TextInput
          key={field}
          style={tw("bg-zinc-800 text-white px-3 py-2 rounded-md border border-emerald-400 mb-3")}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          placeholderTextColor="#aaa"
          keyboardType={["price", "quantity"].includes(field) ? "numeric" : "default"}
          value={product[field]?.toString()}
          onChangeText={(text) => handleChange(field, text)}
        />
      ))}

      <TextInput
        style={tw("bg-zinc-800 text-white px-3 py-2 rounded-md border border-emerald-400 mb-3 h-20")}
        placeholder="Description"
        multiline
        value={product.description}
        onChangeText={(text) => handleChange("description", text)}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={tw("bg-emerald-600 py-3 rounded-md items-center")} onPress={pickImage}>
        <Text style={tw("text-white")}>{image ? "Change Image" : "Select Image"}</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image.uri }} style={tw("w-24 h-24 mt-3")} />}

      <TouchableOpacity style={tw("bg-emerald-600 py-3 rounded-md mt-3 items-center")} onPress={handleAddProduct}>
        <Text style={tw("text-white font-bold")}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProductsList = ({ refresh }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [refresh]);

  return (
    <View style={tw("bg-neutral-900 rounded-xl p-5 mb-6")}>
      <Text style={tw("text-white text-lg font-bold mb-4")}>Product List</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={tw("mb-3 flex items-center")}>
            <Text style={tw("text-white font-bold")}>{item.name}</Text>
            <Text style={tw("text-gray-300")}>
              Brand: {item.brand} | Price: Rs. {item.price}
            </Text>
            <Text style={tw("text-gray-300")}>Qty: {item.quantity}</Text>
            <Text style={tw("text-gray-400")}>{item.description}</Text>
            {item.imageUrl && (
              <Image
                source={{ uri: `http://10.0.0.4:5000${item.imageUrl}`}}
                style={tw("w-24 h-24 mt-2")}
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
    <View style={tw("bg-neutral-900 rounded-xl p-5 mb-6")}>
      <Text style={tw("text-white text-lg font-bold mb-4")}>Analytics Overview</Text>
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
      <BarChart
        data={barData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={{ marginTop: 16 }}
        fromZero
      />
    </View>
  );
};

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState("create");
  const [refreshProducts, setRefreshProducts] = useState(false);

  return (
    <ScrollView contentContainerStyle={[tw("bg-black min-h-full"), { padding: 24, paddingTop: 50 }]}>
      <AdminHeader />
      <Text style={tw("text-green-500 text-4xl font-extrabold text-center mb-7")}>
        Welcome Back, Admin
      </Text>

      <View style={tw("flex-row justify-center flex-wrap mb-7")}>
        {["create", "products", "analytics"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={tw(`px-5 py-3 mx-2 my-2 rounded-lg ${activeTab === tab ? "bg-green-700" : "bg-gray-800"}`)}
          >
            <View style={tw("flex-row items-center")}>
              {tab === "create" && <Feather name="plus-circle" size={20} color="white" />}
              {tab === "products" && <MaterialCommunityIcons name="basket" size={20} color="white" />}
              {tab === "analytics" && <MaterialCommunityIcons name="chart-bar" size={20} color="white" />}
              <Text style={tw("text-white text-base ml-2 font-semibold")}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "create" && (
        <CreateProductForm onProductCreated={() => setRefreshProducts(!refreshProducts)} />
      )}
      {activeTab === "products" && <ProductsList refresh={refreshProducts} />}
      {activeTab === "analytics" && <AnalyticsTab />}
    </ScrollView>
  );
}
