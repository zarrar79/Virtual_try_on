import { View, Text } from "react-native";

export default function CancelScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, color: "red" }}>❌ Payment Cancelled</Text>
    </View>
  );
}
