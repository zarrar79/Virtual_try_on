import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ImagePickerField from "./ImagePickerField";
import { useProductForm } from "./useProductForm";
import styles from "../../CSS/ProductForm.styles";
import Toast from "react-native-toast-message";

interface ProductFormProps {
  isEditing: boolean;
  editProductData?: any;
  onSuccess: () => void;
  cancelEdit?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  isEditing,
  editProductData,
  onSuccess,
  cancelEdit,
}) => {
  const { product, images, handleChange, pickImages, handleSubmit } =
    useProductForm({ isEditing, editProductData, onSuccess });

  const [loading, setLoading] = useState(false);
  const MIN_AMOUNT_PKR = 5000;

  const showToast = (type: "success" | "error", message: string) => {
    Toast.show({
      type,
      text1: message,
      position: "top",
      visibilityTime: 2500,
    });
  };

  const handleSubmitButton = async () => {
    if (
      !product.name ||
      !product.brand ||
      !product.category ||
      !product.price ||
      !product.quantity ||
      !product.description
    ) {
      showToast("error", "Please fill all required fields.");
      return;
    }

    // 🚨 Updated validation for multiple images
    if (!images || images.length === 0) {
      showToast("error", "Please select at least 1 image.");
      return;
    }

    const totalAmount = Number(product.price) * Number(product.quantity);
    if (totalAmount < MIN_AMOUNT_PKR) {
      showToast(
        "error",
        `Total amount must be at least Rs.${MIN_AMOUNT_PKR} for Stripe payment.`
      );
      return;
    }

    try {
      setLoading(true);
      await handleSubmit();
    } catch (error) {
      console.error("Error submitting product:", error);
      showToast("error", "Something went wrong while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "Edit Product" : "Add New Product"}
      </Text>

      {(["name", "brand", "category", "price", "quantity"] as (keyof typeof product)[]).map(
        (field) => (
          <View key={field} style={styles.inputWrapper}>
            <Text style={styles.label}>
              {field.charAt(0).toUpperCase() + field.slice(1)}*
            </Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${field}`}
              placeholderTextColor="#aaa"
              keyboardType={
                ["price", "quantity"].includes(field) ? "numeric" : "default"
              }
              value={product[field]?.toString() || ""}
              onChangeText={(text) => handleChange(field, text)}
            />
          </View>
        )
      )}

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Description*</Text>
        <TextInput
          style={[styles.input, styles.description]}
          placeholder="Enter description"
          multiline
          value={product.description || ""}
          onChangeText={(text) => handleChange("description", text)}
          placeholderTextColor="#aaa"
        />
      </View>

      {/* 🔥 Updated to support multiple images */}
      <ImagePickerField images={images} onPick={pickImages} />

      <TouchableOpacity
        style={[styles.submitButton, loading && { opacity: 0.6 }]}
        onPress={handleSubmitButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isEditing ? "Update Product" : "Add Product"}
          </Text>
        )}
      </TouchableOpacity>

      {isEditing && cancelEdit && (
        <TouchableOpacity onPress={cancelEdit} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProductForm;
