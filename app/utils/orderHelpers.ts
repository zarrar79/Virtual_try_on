import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

interface DesignItem {
  id: string;
  designSrc: string;
  quantity: number;
}

interface PlaceCODOrderParams {
  BASE_URL: string;
  price: number;
  selectedDesigns: DesignItem[];
  productName: string;
  size: string;
  onSuccess?: () => void;
}

export const placeCODOrder = async ({
  BASE_URL,
  price,
  selectedDesigns,
  productName,
  size,
  onSuccess,
}: PlaceCODOrderParams) => {
  try {
    const userId = await AsyncStorage.getItem("user");
    const user_name = await AsyncStorage.getItem("user_name");

    if (!userId) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    if (!selectedDesigns || selectedDesigns.length === 0) {
      Alert.alert("Error", "No designs selected for order");
      return;
    }

    const totalQuantity = selectedDesigns.reduce((sum, d) => sum + d.quantity, 0);
    const totalPrice = totalQuantity * price;

    Alert.alert(
      "Confirm Order",
      `Place order for ${totalQuantity} item${totalQuantity !== 1 ? "s" : ""} from "${productName}" (Size: ${size})? Total: Rs. ${totalPrice}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const orderItems = selectedDesigns.map((d) => ({
                name: productName,
                price,
                quantity: d.quantity,
                imageUrls: [d.designSrc],
                size: size,
              }));

              const response = await axios.post(`${BASE_URL}/order/cod`, {
                userId,
                user_name,
                cart: orderItems,
              });

              if (response.status === 201) {
                Alert.alert(
                  "Success",
                  `Order placed!\nTotal Items: ${totalQuantity}\nTotal Amount: Rs. ${totalPrice}`,
                  [{ text: "OK", onPress: onSuccess }]
                );
              } else {
                Alert.alert("Error", "Failed to place order");
              }
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Order failed");
            }
          },
        },
      ]
    );
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Order failed");
  }
};
