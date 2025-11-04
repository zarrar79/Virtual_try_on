// components/ProductForm/ProductForm.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import ImagePickerField from "./ImagePickerField";
import { useProductForm } from "./useProductForm";
import styles from "../../CSS/ProductForm.styles";

interface ProductFormProps {
    isEditing: boolean;
    editProductData?: any;
    onSuccess: () => void;
    cancelEdit?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ isEditing, editProductData, onSuccess, cancelEdit }) => {
    const { product, image, handleChange, pickImage, handleSubmit } =
        useProductForm({ isEditing, editProductData, onSuccess });
    const MIN_AMOUNT_PKR = 5000;

    const handleSubmitButton = () => {
        // Required fields validation
        if (!product.name || !product.brand || !product.category || !product.price || !product.quantity) {
            return Alert.alert("Validation Error", "Please fill all required fields.");
        }

        // // Image validation
        // if (!image) {
        //     return Alert.alert("Validation Error", "Please select an image.");
        // }

        // Quantity validation for Stripe minimum
        const totalAmount = Number(product.price) * Number(product.quantity);
        if (totalAmount < MIN_AMOUNT_PKR) {
            return Alert.alert(
                "Validation Error",
                `Total amount must be at least Rs.${MIN_AMOUNT_PKR} for Stripe payment.`
            );
        }

        handleSubmit();
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

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitButton}>
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
