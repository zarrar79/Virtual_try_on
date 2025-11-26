import React from "react";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { View, Text } from "react-native";

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#4CAF50", backgroundColor: "#222" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
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
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#f44336", backgroundColor: "#222" }}
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
