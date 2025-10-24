import React from "react";
import { View, Text, Image, Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface AdminHeaderProps {
    styles: any;
}


const AdminHeader: React.FC<AdminHeaderProps> = ({styles}) => {
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

export default AdminHeader;