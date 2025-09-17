// components/WebAuthWrapper.tsx
import React, { useEffect, useState, ReactNode } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface WebAuthWrapperProps {
  children: ReactNode;
}

const WebAuthWrapper: React.FC<WebAuthWrapperProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (isMounted) {
          if (token) {
            alert("You are Already Logged In");
            router.replace("/");
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error reading token:", err);
        setLoading(false);
      }
    };

    checkToken();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};

export default WebAuthWrapper;
