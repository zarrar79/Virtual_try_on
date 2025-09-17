// components/ProductForm/ProductForm.js
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import ImagePickerField from "./ImagePickerField";
import { useProductForm } from "./useProductForm";

const ProductForm = ({ isEditing, editProductData, onSuccess, cancelEdit }) => {
  const { product, image, handleChange, pickImage, handleSubmit } =
    useProductForm({ isEditing, editProductData, onSuccess });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "Edit Product" : "Add New Product"}
      </Text>

      {["name", "brand", "category", "price", "quantity"].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          placeholderTextColor="#aaa"
          keyboardType={["price", "quantity"].includes(field) ? "numeric" : "default"}
          value={product[field]?.toString()}
          onChangeText={(text) => handleChange(field, text)}
        />
      ))}

      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Description"
        multiline
        value={product.description}
        onChangeText={(text) => handleChange("description", text)}
        placeholderTextColor="#aaa"
      />

      <ImagePickerField image={image} onPick={pickImage} />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isEditing ? "Update Product" : "Add Product"}
        </Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity onPress={cancelEdit} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProductForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f", // neutral-900
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#27272a", // zinc-800
    color: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#10B981", // emerald-400
    marginBottom: 12,
  },
  description: {
    height: 80,
  },
  submitButton: {
    backgroundColor: "#10B981", // emerald-600
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  submitButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#f87171", // red-400
    fontSize: 14,
  },
});
