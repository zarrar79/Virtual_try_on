// components/ProductForm/useProductForm.ts
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../../context/ApiContext";
import Toast from "react-native-toast-message";

type Product = {
  _id?: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  quantity: number;
  sku: string;
  description: string;
  imageUrls?: string[];
};

type ImageData = {
  uri: string;
  base64?: string;
  type?: string;
  name?: string;
};

type UseProductFormProps = {
  isEditing: boolean;
  editProductData?: Product;
  onSuccess: () => void;
};

export const useProductForm = ({ isEditing, editProductData, onSuccess }: UseProductFormProps) => {
  const BASE_URL = useApi();

  const [product, setProduct] = useState<Product>({
    name: "",
    brand: "",
    category: "",
    price: 0,
    quantity: 0,
    sku: "",
    description: "",
  });

  // MULTIPLE IMAGES
  const [images, setImages] = useState<ImageData[]>([]);

  // Load existing data when editing
  useEffect(() => {
    if (isEditing && editProductData) {
      setProduct(editProductData);

      if (editProductData.imageUrls?.length) {
        setImages(
          editProductData.imageUrls.map((url) => ({
            uri: `${BASE_URL}${url}`,
          }))
        );
      }
    } else {
      resetForm();
    }
  }, [isEditing, editProductData]);

  const resetForm = () => {
    setProduct({
      name: "",
      brand: "",
      category: "",
      price: 0,
      quantity: 0,
      sku: "",
      description: "",
    });
    setImages([]);
  };

  const handleChange = (key: keyof Product, value: string | number) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  // 📌 Pick Multiple Images
  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera roll permission is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: false, // IMPORTANT – do NOT fetch base64 here
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const selectedImages = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.type || "image/jpeg",
        name: asset.fileName || "image.jpg",
      }));

      setImages((prev) => [...prev, ...selectedImages]);
    }
  };

  // 📌 Compress Image (small but high-quality)
  const compressImage = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 600 } }], // reduce width for massive size drop
      {
        compress: 0.4, // clear & small
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );

    return `data:image/jpeg;base64,${result.base64}`;
  };

  // 📌 Submit
  const handleSubmit = async () => {
    if (!product.name.trim()) {
      Alert.alert("Validation", "Please enter product name.");
      return;
    }

    let payload: any = { ...product };

    // Compress and attach multiple images
    if (images.length > 0) {
      const base64Images: string[] = [];

      for (const img of images) {
        const compressed = await compressImage(img.uri);
        base64Images.push(compressed);
      }

      payload.images = base64Images;
    }

    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert("Error", "Not authenticated.");
      return;
    }

    try {
      const res = await fetch(
        isEditing ? `${BASE_URL}/products/${product._id}` : `${BASE_URL}/products`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Toast.show({
          type: "success",
          text1: isEditing ? "Product updated!" : "Product added!",
          position: "top",
        });

        resetForm();
        onSuccess();
      } else {
        Toast.show({
          type: "error",
          text1: data.error || "Failed to save product",
          position: "top",
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        position: "top",
      });
    }
  };

  return {
    product,
    images,
    handleChange,
    pickImages,
    handleSubmit,
    resetForm,
    setImages,
  };
};
