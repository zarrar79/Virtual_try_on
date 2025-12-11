import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import styles from "../../CSS/ProductForm.styles";
import ImagePickerField from "./ImagePickerField";
import { useProductForm } from "./useProductForm";

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
  const {
    product,
    designs,
    fabricImages,
    patternImages,
    handleChange,
    pickSingleImage,
    pickFabricImage,
    pickPatternImage,
    setFabricImages,
    setPatternImages,
    handleSubmit,
    setDesigns,
    markDesignAsRemoved, // NEW: Import the function
    addNewDesign // NEW: Import the function
  } = useProductForm({ isEditing, editProductData, onSuccess });

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

  // Handle design image pick for a specific design
  const handleDesignImagePick = async (designIndex: number) => {
    try {
      const selectedImages = await pickSingleImage();
      if (selectedImages && selectedImages.length > 0) {
        const updatedDesigns = [...designs];
        updatedDesigns[designIndex] = {
          ...updatedDesigns[designIndex],
          images: selectedImages,
          isRemoved: false // Ensure it's not marked as removed when adding image
        };
        setDesigns(updatedDesigns);
      }
    } catch (error) {
      console.error("Error picking design image:", error);
      showToast("error", "Failed to pick design image");
    }
  };

  // Handle design image removal
  const handleDesignImageRemove = (designIndex: number) => {
    const updatedDesigns = [...designs];
    updatedDesigns[designIndex] = {
      ...updatedDesigns[designIndex],
      images: [],
    };
    setDesigns(updatedDesigns);
  };

  // Handle fabric image pick
  const handleFabricImagePick = async () => {
    try {
      const selectedImages = await pickFabricImage();
      if (selectedImages && selectedImages.length > 0) {
        setFabricImages(selectedImages);
      }
    } catch (error) {
      console.error("Error picking fabric image:", error);
      showToast("error", "Failed to pick fabric image");
    }
  };

  // Handle fabric image removal
  const handleFabricImageRemove = () => {
    setFabricImages([]);
  };

  // Handle pattern image pick
  const handlePatternImagePick = async () => {
    try {
      const selectedImages = await pickPatternImage();
      if (selectedImages && selectedImages.length > 0) {
        setPatternImages(selectedImages);
      }
    } catch (error) {
      console.error("Error picking pattern image:", error);
      showToast("error", "Failed to pick pattern image");
    }
  };

  // Handle pattern image removal
  const handlePatternImageRemove = () => {
    setPatternImages([]);
  };

  // Handle design stock change
  const handleDesignStockChange = (designIndex: number, stock: string) => {
    const updatedDesigns = [...designs];
    updatedDesigns[designIndex] = {
      ...updatedDesigns[designIndex],
      stock,
      isRemoved: false // Ensure it's not marked as removed when updating stock
    };
    setDesigns(updatedDesigns);
  };

  // Remove a specific design - UPDATED: Use markDesignAsRemoved
  const handleRemoveDesign = (designIndex: number) => {
    markDesignAsRemoved(designIndex);
  };

  // Restore a removed design - NEW FUNCTION
  const handleRestoreDesign = (designIndex: number) => {
    const updatedDesigns = [...designs];
    updatedDesigns[designIndex] = {
      ...updatedDesigns[designIndex],
      isRemoved: false
    };
    setDesigns(updatedDesigns);
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

    // Validate designs - UPDATED: Consider only non-removed designs
    const activeDesigns = designs.filter(design => !design.isRemoved);

    if (activeDesigns.length === 0) {
      showToast("error", "Please add at least one design.");
      return;
    }

    const invalidDesigns = activeDesigns.filter(
      design => design.images.length === 0 || !design.stock || parseInt(design.stock) <= 0
    );

    if (invalidDesigns.length > 0) {
      showToast("error", "Please add image and stock for all designs.");
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
      await handleSubmit(designs);
    } catch (error) {
      console.error("Error submitting product:", error);
      showToast("error", "Something went wrong while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

      {/* Fabric Image Field */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Fabric Image (Optional)</Text>
        <ImagePickerField
          images={fabricImages}
          onPick={handleFabricImagePick}
          onRemove={handleFabricImageRemove}
        />
      </View>

      {/* Pattern Image Field */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Pattern Image (Optional)</Text>
        <ImagePickerField
          images={patternImages}
          onPick={handlePatternImagePick}
          onRemove={handlePatternImageRemove}
        />
      </View>

      {/* Sizes Selection */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Available Sizes (Optional)</Text>
        <View style={styles.sizeCheckboxContainer}>
          {['S', 'M', 'L'].map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeCheckbox,
                product.sizes?.includes(size) && styles.sizeCheckboxActive
              ]}
              onPress={() => {
                const currentSizes = product.sizes || [];
                const newSizes = currentSizes.includes(size)
                  ? currentSizes.filter(s => s !== size)
                  : [...currentSizes, size];
                handleChange("sizes", newSizes);
              }}
            >
              <Text style={[
                styles.sizeCheckboxText,
                product.sizes?.includes(size) && styles.sizeCheckboxTextActive
              ]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {product.sizes && product.sizes.length > 0 && (
          <Text style={styles.sizeSelectionText}>
            Selected: {product.sizes.join(', ')}
          </Text>
        )}
      </View>

      {/* Designs Section */}
      <View style={styles.designsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Product Designs ({designs.filter(d => !d.isRemoved).length} active)
          </Text>
          <TouchableOpacity
            style={styles.addDesignButton}
            onPress={addNewDesign}
          >
            <Text style={styles.addDesignButtonText}>+ Add New Design</Text>
          </TouchableOpacity>
        </View>

        {designs.map((design, designIndex) => (
          <View
            key={design.id}
            style={[
              styles.designCard,
              design.isRemoved && styles.removedDesignCard // NEW: Style for removed designs
            ]}
          >
            <View style={styles.designHeader}>
              <View style={styles.designTitleContainer}>
                <Text style={[
                  styles.designTitle,
                  design.isRemoved && styles.removedDesignText
                ]}>
                  Design {designIndex + 1}
                  {design.isRemoved && " (Removed)"}
                  {design.isOld && !design.isRemoved && " (Existing)"}
                  {!design.isOld && !design.isRemoved && " (New)"}
                </Text>
              </View>

              <View style={styles.designActions}>
                {design.isRemoved ? (
                  <TouchableOpacity
                    style={styles.restoreDesignButton}
                    onPress={() => handleRestoreDesign(designIndex)}
                  >
                    <Text style={styles.restoreDesignText}>Restore</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.removeDesignButton}
                    onPress={() => handleRemoveDesign(designIndex)}
                  >
                    <Text style={styles.removeDesignText}>
                      {design.isOld ? "Remove" : "Delete"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Design Image - Hide if removed */}
            {!design.isRemoved && (
              <View style={styles.designImageSection}>
                <Text style={styles.designLabel}>Design Image*</Text>
                <ImagePickerField
                  images={design.images}
                  onPick={() => handleDesignImagePick(designIndex)}
                  onRemove={() => handleDesignImageRemove(designIndex)}
                />
              </View>
            )}

            {/* Design Stock - Hide if removed */}
            {!design.isRemoved && (
              <View style={styles.designInputWrapper}>
                <Text style={styles.designLabel}>Stock for Design {designIndex + 1}*</Text>
                <TextInput
                  style={styles.designInput}
                  placeholder={`Enter stock for Design ${designIndex + 1}`}
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={design.stock}
                  onChangeText={(text) => handleDesignStockChange(designIndex, text)}
                />
              </View>
            )}
          </View>
        ))}
      </View>

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
    </ScrollView>
  );
};

export default ProductForm;