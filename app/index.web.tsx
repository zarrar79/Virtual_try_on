import React, { useEffect, useState } from "react";
import OrdersScreen from "./Orders";
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
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import { tw } from "./utils/tw"; // Adjust path as needed
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useRouter } from "expo-router";
import ProductForm from "./components/ProductForm/ProductForm";
import ProductsList from "./components/ProductsList";


export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState("create");
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // This runs only on the client
    async function checkToken() {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.push('/auth');
        } else {
          Alert.alert('Please Login First!');
        }
      } catch (err) {
        console.error('Error reading token', err);
      }
    }

    checkToken();
  }, [router]);


  const startEdit = (item) => {
    setIsEditing(true);
    setEditProductData(item);
    setActiveTab("create");
  };


  const cancelEdit = () => {
    setIsEditing(false);
    setEditProductData(null);
  };

  return (
    <ScrollView contentContainerStyle={[tw("bg-black min-h-full"), { padding: 24, paddingTop: 50 }]}>
      <AdminHeader />
      <Text style={tw("text-green-500 text-4xl font-extrabold text-center mb-7")}>
        Welcome Back, Admin
      </Text>

      <View style={tw("flex-row justify-center flex-wrap mb-7")}>
        {["create", "products", "orders"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={tw(`px-5 py-3 mx-2 my-2 rounded-lg ${activeTab === tab ? "bg-green-700" : "bg-gray-800"}`)}
          >
            <View style={tw("flex-row items-center")}>
              {tab === "create" && <Feather name="plus-circle" size={20} color="white" />}
              {tab === "products" && <MaterialCommunityIcons name="basket" size={20} color="white" />}
              {tab === "orders" && <MaterialCommunityIcons name="cart" size={20} color="white" />}
              <Text style={tw("text-white text-base ml-2 font-semibold")}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
