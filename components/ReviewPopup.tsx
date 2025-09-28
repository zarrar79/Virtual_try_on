import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useApi } from "../app/context/ApiContext"; // 👈 import context

interface ReviewPopupProps {
  visible: boolean;
  onClose: () => void;
  productId: string;
  orderId: string;
  userId: string;
  productName: string;
}

const ReviewPopup: React.FC<ReviewPopupProps> = ({
  visible,
  onClose,
  productId,
  orderId,
  userId,
  productName
}) => {
  const BASE_URL = useApi();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const submitReview = async () => {
    try {
      const response = await fetch(`${BASE_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId,
          orderId,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("❌ Review error:", errorData.message);
        return;
      }

      console.log("✅ Review submitted");

      // ✅ Option 1: Delay closing to allow backend to update
      setTimeout(() => {
        onClose();
      }, 1000); // 1 second delay
    } catch (err) {
      console.log("❌ Network error:", err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
           <Text style={styles.title}>Rate: {productName}</Text>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={{ fontSize: 30, color: star <= rating ? "gold" : "gray" }}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Leave a comment"
            style={styles.input}
            value={comment}
            onChangeText={setComment}
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={submitReview}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "gray" }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReviewPopup;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  container: { width: "80%", padding: 20, backgroundColor: "white", borderRadius: 12 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  stars: { flexDirection: "row", justifyContent: "center", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 },
  buttons: { flexDirection: "row", justifyContent: "space-between" },
  button: { backgroundColor: "blue", padding: 10, borderRadius: 8, flex: 1, marginHorizontal: 5 },
  buttonText: { color: "white", textAlign: "center" },
});
