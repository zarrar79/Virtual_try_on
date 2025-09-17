// components/ProductForm/ProductForm.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import ImagePickerField from "./ImagePickerField";
import { useProductForm } from "./useProductForm";

interface ProductFormProps {
    isEditing: boolean;
    editProductData?: any;
    onSuccess: () => void;
    cancelEdit?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ isEditing, editProductData, onSuccess, cancelEdit }) => {
    const { product, image, handleChange, pickImage, handleSubmit: submitForm } =
        useProductForm({ isEditing, editProductData, onSuccess });
    const MIN_AMOUNT_PKR = 5000;

    const handleSubmit = () => {
        // Required fields validation
        if (!product.name || !product.brand || !product.category || !product.price || !product.quantity) {
            return Alert.alert("Validation Error", "Please fill all required fields.");
        }

        // Image validation
        if (!image) {
            return Alert.alert("Validation Error", "Please select an image.");
        }

        // Quantity validation for Stripe minimum
        const totalAmount = Number(product.price) * Number(product.quantity);
        if (totalAmount < MIN_AMOUNT_PKR) {
            return Alert.alert(
                "Validation Error",
                `Total amount must be at least Rs.${MIN_AMOUNT_PKR} for Stripe payment.`
            );
        }

        submitForm();
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {isEditing ? "Edit Product" : "Add New Product"}
            </Text>

            {(["name", "brand", "category", "price", "quantity"] as (keyof typeof product)[]).map((field) => (
                <View key={field} style={styles.inputWrapper}>
                    <Text style={styles.label}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={`Enter ${field}`}
                        placeholderTextColor="#aaa"
                        keyboardType={["price", "quantity"].includes(field) ? "numeric" : "default"}
                        value={product[field]?.toString() || ""}
                        onChangeText={(text) => handleChange(field, text)}
                    />
                </View>
            ))}

            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.description]}
                    placeholder="Enter description"
                    multiline
                    value={product.description || ""}
                    onChangeText={(text) => handleChange("description", text)}
                    placeholderTextColor="#aaa"
                />
            </View>

            <ImagePickerField image={image} onPick={pickImage} />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>
                    {isEditing ? "Update Product" : "Add Product"}
                </Text>
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1f1f1f",
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
    inputWrapper: {
        marginBottom: 12,
    },
    label: {
        color: "#D1D5DB", // gray-300
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 4,
    },
    input: {
        backgroundColor: "#27272a",
        color: "#ffffff",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#10B981",
    },
    description: {
        height: 80,
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: "#10B981",
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
        color: "#f87171",
        fontSize: 14,
    },
});
