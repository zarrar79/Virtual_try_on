// components/ProductForm/useProductForm.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { useApi } from "../../context/ApiContext";

type Product = {
  _id?: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  quantity: number;
  sku: string;
  description: string;
  designs?: Design[];
  fabric?: string;
  pattern?: string;
  sizes?: string[];
};

type Design = {
  imageUrl: string;
  stock: number;
};

type DesignForm = {
  id: string;
  images: string[];
  stock: string;
  isOld?: boolean;
  originalImageUrl?: string;
  isRemoved?: boolean; // NEW: Track removed designs
};

export const useProductForm = ({
  isEditing,
  editProductData,
  onSuccess,
}: {
  isEditing: boolean;
  editProductData?: Product;
  onSuccess: () => void;
}) => {
  const BASE_URL = useApi();

  // PRODUCT STATE
  const [product, setProduct] = useState<Product>({
    _id: "",
    name: "",
    brand: "",
    category: "",
    price: 0,
    quantity: 0,
    sku: "",
    description: "",
    fabric: "",
    pattern: "",
    sizes: [],
  });

  // DESIGNS STATE
  const [designs, setDesigns] = useState<DesignForm[]>([]);

  // FABRIC AND PATTERN IMAGE STATE
  const [fabricImages, setFabricImages] = useState<string[]>([]);
  const [patternImages, setPatternImages] = useState<string[]>([]);

  // LOAD INITIAL VALUES FOR EDIT
  useEffect(() => {
    if (isEditing && editProductData) {
      console.log("Editing product data:", editProductData);

      setProduct({
        _id: editProductData._id || "",
        name: editProductData.name || "",
        brand: editProductData.brand || "",
        category: editProductData.category || "",
        price: editProductData.price || 0,
        quantity: editProductData.quantity || 0,
        sku: editProductData.sku || "",
        description: editProductData.description || "",
        fabric: editProductData.fabric || "",
        pattern: editProductData.pattern || "",
        sizes: editProductData.sizes || [],
      });

      // Load existing designs from database
      if (editProductData.designs && editProductData.designs.length > 0) {
        console.log("Loading existing designs:", editProductData.designs);

        const existingDesigns: DesignForm[] = editProductData.designs.map((design, index) => {
          const imageUrl = design.imageUrl
            ? (design.imageUrl.startsWith('http') ? design.imageUrl : `${BASE_URL}${design.imageUrl}`)
            : '';

          return {
            id: `design-${index}-${Date.now()}`,
            images: imageUrl ? [imageUrl] : [],
            stock: design.stock?.toString() || "0",
            isOld: true,
            originalImageUrl: design.imageUrl,
            isRemoved: false // NEW: Initialize as not removed
          };
        });

        setDesigns(existingDesigns);
        console.log("Processed designs for form:", existingDesigns);
      } else {
        console.log("No designs found in product data");
        setDesigns([]);
      }

      // Load fabric image if it exists
      if (editProductData.fabric) {
        const fabricUrl = editProductData.fabric.startsWith('http')
          ? editProductData.fabric
          : `${BASE_URL}${editProductData.fabric}`;
        setFabricImages([fabricUrl]);
      } else {
        setFabricImages([]);
      }

      // Load pattern image if it exists
      if (editProductData.pattern) {
        const patternUrl = editProductData.pattern.startsWith('http')
          ? editProductData.pattern
          : `${BASE_URL}${editProductData.pattern}`;
        setPatternImages([patternUrl]);
      } else {
        setPatternImages([]);
      }
    } else {
      resetForm();
    }
  }, [isEditing, editProductData, BASE_URL]);

  const resetForm = () => {
    setProduct({
      _id: "",
      name: "",
      brand: "",
      category: "",
      price: 0,
      quantity: 0,
      sku: "",
      description: "",
      fabric: "",
      pattern: "",
      sizes: [],
    });
    setDesigns([]);
    setFabricImages([]);
    setPatternImages([]);
  };

  const handleChange = (key: keyof Product, value: string | number | string[]) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  // MARK DESIGN AS REMOVED - NEW FUNCTION
  const markDesignAsRemoved = (designIndex: number) => {
    const updatedDesigns = [...designs];
    const design = updatedDesigns[designIndex];

    if (design.isOld) {
      // For existing designs, mark as removed instead of deleting
      updatedDesigns[designIndex] = {
        ...design,
        isRemoved: true,
        images: [], // Clear images
        stock: "0" // Set stock to 0
      };
    } else {
      // For new designs, just remove from array
      updatedDesigns.splice(designIndex, 1);
    }

    setDesigns(updatedDesigns);
  };

  // ADD NEW DESIGN - NEW FUNCTION
  const addNewDesign = () => {
    const newDesign: DesignForm = {
      id: `new-design-${Date.now()}-${Math.random()}`,
      images: [],
      stock: "",
      isOld: false,
      isRemoved: false
    };

    setDesigns(prev => [...prev, newDesign]);
  };

  // PICK SINGLE IMAGE - For design images
  const pickSingleImage = async (): Promise<string[]> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera roll permission is needed.");
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      return [result.assets[0].uri];
    }

    return [];
  };

  // PICK FABRIC IMAGE
  const pickFabricImage = async (): Promise<string[]> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera roll permission is needed.");
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      return [result.assets[0].uri];
    }

    return [];
  };

  // PICK PATTERN IMAGE
  const pickPatternImage = async (): Promise<string[]> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera roll permission is needed.");
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      return [result.assets[0].uri];
    }

    return [];
  };

  // COMPRESS IMAGE
  const compressImage = async (uri: string) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 600 } }],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );
      return `data:image/jpeg;base64,${result.base64}`;
    } catch (error) {
      console.error("Error compressing image:", error);
      return uri;
    }
  };

  // SUBMIT PRODUCT WITH DESIGNS SUPPORT - UPDATED: Handle removed designs
  const handleSubmit = async (submittedDesigns?: DesignForm[]) => {
    if (!product.name.trim()) {
      Alert.alert("Validation", "Please enter product name.");
      return;
    }

    if (isEditing && !product._id) {
      Alert.alert("Error", "Product ID is missing. Cannot update product.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "Not authenticated.");
      return;
    }

    // Process design images - UPDATED: Handle removed designs
    const designUploads: any[] = [];
    const removedDesigns: string[] = []; // Track removed design URLs

    if (submittedDesigns && submittedDesigns.length > 0) {
      console.log("Processing designs for submission:", submittedDesigns);

      for (let design of submittedDesigns) {
        // Skip designs that are marked as removed
        if (design.isRemoved) {
          if (design.originalImageUrl) {
            removedDesigns.push(design.originalImageUrl);
          }
          continue;
        }

        if (design.images.length > 0) {
          const imageUri = design.images[0];

          // Check if it's an existing image or new image
          if (imageUri.includes(BASE_URL) || imageUri.startsWith('http')) {
            // Existing design - use the original image URL
            const originalUrl = design.originalImageUrl ||
              imageUri.replace(BASE_URL, '').replace(/^https?:\/\/[^/]+/, '');

            console.log("Existing design - using URL:", originalUrl);

            designUploads.push({
              image: originalUrl,
              stock: parseInt(design.stock) || 0
            });
          } else {
            // New design image - compress and convert to base64
            console.log("New design - compressing image");
            const compressedDesignImage = await compressImage(imageUri);
            designUploads.push({
              image: compressedDesignImage,
              stock: parseInt(design.stock) || 0
            });
          }
        } else {
          console.log("Design has no image:", design);
        }
      }
    }

    console.log("Final design uploads:", designUploads);
    console.log("Removed designs:", removedDesigns);

    // Validate that we have at least one design (unless we're removing all)
    if (designUploads.length === 0 && removedDesigns.length === 0) {
      Alert.alert("Validation", "At least one design with image is required.");
      return;
    }

    // Calculate total quantity from designs
    const totalQuantity = designUploads.reduce((total, design) => total + design.stock, 0);

    // Process fabric image
    let fabricImageUrl = undefined;
    if (fabricImages.length > 0) {
      const fabricUri = fabricImages[0];
      if (fabricUri.includes(BASE_URL) || fabricUri.startsWith('http')) {
        // Existing fabric image
        fabricImageUrl = product.fabric || fabricUri.replace(BASE_URL, '').replace(/^https?:\/\/[^/]+/, '');
      } else {
        // New fabric image - compress and upload
        const compressedFabricImage = await compressImage(fabricUri);
        fabricImageUrl = compressedFabricImage;
      }
    }

    // Process pattern image
    let patternImageUrl = undefined;
    if (patternImages.length > 0) {
      const patternUri = patternImages[0];
      if (patternUri.includes(BASE_URL) || patternUri.startsWith('http')) {
        // Existing pattern image
        patternImageUrl = product.pattern || patternUri.replace(BASE_URL, '').replace(/^https?:\/\/[^/]+/, '');
      } else {
        // New pattern image - compress and upload
        const compressedPatternImage = await compressImage(patternUri);
        patternImageUrl = compressedPatternImage;
      }
    }

    // FINAL PAYLOAD - UPDATED: Include fabric, pattern, sizes, and removed designs info
    const payload = {
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      quantity: totalQuantity,
      description: product.description,
      sku: product.sku,
      designs: designUploads,
      removedDesigns: removedDesigns.length > 0 ? removedDesigns : undefined, // NEW: Send removed designs to backend
      fabric: fabricImageUrl,
      pattern: patternImageUrl,
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : undefined,
    };

    console.log("Submitting payload:", payload);
    console.log("Product ID:", product._id);

    const url = isEditing
      ? `${BASE_URL}/products/${product._id}`
      : `${BASE_URL}/products`;

    console.log("Request URL:", url);

    try {
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (res.ok) {
        Toast.show({
          type: "success",
          text1: isEditing ? "Product updated!" : "Product added!",
          position: "top",
        });

        resetForm();
        onSuccess();
      } else {
        console.error("Server error:", data);
        Toast.show({
          type: "error",
          text1: data.error || "Failed to save product",
          position: "top",
        });
      }
    } catch (error) {
      console.error("Network error:", error);
      Toast.show({
        type: "error",
        text1: "Network error. Please try again.",
        position: "top",
      });
    }
  };

  return {
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
    resetForm,
    setDesigns,
    markDesignAsRemoved, // NEW: Export the function
    addNewDesign, // NEW: Export the function
  };
};