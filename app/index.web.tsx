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
  Pressable,
  StyleSheet
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { PieChart, BarChart } from "react-native-chart-kit";
import { tw } from "./utils/tw"; // Adjust path as needed
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useRouter } from "expo-router";
const API_BASE = "http://10.0.0.2:5000/products";
const screenWidth = Dimensions.get("window").width;


const AdminHeader = () => {
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
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100?img=3" }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.welcomeText}>Welcome Back,</Text>
          <Text style={styles.nameText}>Reyan Iqbal</Text>
        </View>
      </View>

      {/* Logout Button */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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



const CreateProductForm = ({ onProductCreated, isEditing, editProductData, onProductUpdated, cancelEdit }) => {
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

  useEffect(() => {
    if (isEditing && editProductData) {
      setProduct(editProductData);
      if (editProductData.imageUrl) {
        setImage({ uri: `http://10.0.0.2:5000${editProductData.imageUrl}` });
      }
    }
  //   else{
  //     setProduct({
  //   name: "",
  //   brand: "",
  //   category: "",
  //   price: 0,
  //   quantity: 0,
  //   sku: "",
  //   description: "",
  // });
  // setImage(null);
  //   }
  }, [isEditing, editProductData]);

  const handleChange = (key, value) =>{
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

  const handleSubmit = async () => {
    if (!product.name) {
      Alert.alert("Validation", "Please enter product name.");
      return;
    }

    let payload = { ...product };
    if (image?.uri && image?.base64) {
      const base64Image = await compressImage(image.uri);
      payload.image = base64Image;
    }
    const token = await AsyncStorage.getItem('token');
    
    try {
      const res = await fetch(isEditing ? `${API_BASE}/${product._id}` : API_BASE, {
        method: isEditing ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", isEditing ? "Product updated!" : "Product added!");
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
        isEditing ? onProductUpdated() : onProductCreated();
      } else {
        Alert.alert("Error", data.message || "Failed to save product.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={tw("bg-neutral-900 rounded-xl p-5 mb-6")}>
      <Text style={tw("text-white text-lg font-bold mb-4")}>
        {isEditing ? "Edit Product" : "Add New Product"}
      </Text>

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

      <TouchableOpacity style={tw("bg-emerald-600 py-3 rounded-md mt-3 items-center")} onPress={handleSubmit}>
        <Text style={tw("text-white font-bold")}>{isEditing ? "Update Product" : "Add Product"}</Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity onPress={cancelEdit} style={tw("mt-3 items-center")}>
          <Text style={tw("text-red-400")}>Cancel Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ProductsList = ({ refresh, onEdit }) => {
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

  const handleDelete = async (item) => {
    try {
      const response = await fetch(`${API_BASE}/${item._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Deleted", data.message);
        setProducts((prev) => prev.filter((p) => p._id !== item._id));
      } else {
        Alert.alert("Error", data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={tw("bg-neutral-900 rounded-xl p-5 mb-6")}>
      <Text style={tw("text-white text-lg font-bold mb-4")}>Product List</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={tw("mb-3")}>
            <View style={tw("flex-row items-start gap-4 bg-gray-800 p-4 rounded-lg")}>
              {item.imageUrl && (
                <Image
                  source={{ uri: `http://10.0.0.2:5000${item.imageUrl}` }}
                  style={tw("w-24 h-24 rounded-md")}
                  resizeMode="cover"
                />
              )}
              <View style={tw("flex-1 flex-row justify-between")}>
                <View style={tw("flex-1 pr-2")}>
                  <Text style={tw("text-white font-bold text-lg")}>{item.name}</Text>
                  <Text style={tw("text-gray-300")}>
                    Brand: {item.brand} | Price: Rs. {item.price}
                  </Text>
                  <Text style={tw("text-gray-300")}>Qty: {item.quantity}</Text>
                  <Text style={tw("text-gray-400")}>{item.description}</Text>
                </View>
                <View style={tw("items-end justify-between")}>
                  <TouchableOpacity onPress={() => onEdit(item)}>
                    <Text style={tw("text-blue-400 font-semibold")}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item)}>
                    <Text style={tw("text-red-400 font-semibold")}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
  const [isEditing, setIsEditing] = useState(false);
  const [editProductData, setEditProductData] = useState(null);


  const startEdit = (item) => {
    setIsEditing(true);
    setEditProductData(item);
    setActiveTab("create");
  };


  const cancelEdit = () =>{
    setIsEditing(false);
    setEditProductData(null);
  };

    const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      Alert.alert('Success', 'Logged out successfully');
      router.replace('/auth'); // Navigate back to login
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

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
        <CreateProductForm
          isEditing={isEditing}
          editProductData={editProductData}
          cancelEdit={cancelEdit}
          onProductCreated={() => setRefreshProducts(!refreshProducts)}
          onProductUpdated={() => {
            cancelEdit();
            setRefreshProducts(!refreshProducts);
          }}
        />
      )}
      {activeTab === "products" && <ProductsList refresh={refreshProducts} onEdit={startEdit} />}
      {activeTab === "analytics" && <AnalyticsTab />}
    </ScrollView>
  );
}
