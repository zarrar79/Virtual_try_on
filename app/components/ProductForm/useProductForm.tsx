// components/ProductForm/useProductForm.ts
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
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
  type?: string;
  name?: string;
  isOld?: boolean;  // ⭐ distinguish existing images
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
    name: "",
    brand: "",
    category: "",
    price: 0,
    quantity: 0,
    sku: "",
    description: "",
    imageUrls: [],
  });

  // IMAGES = old URLs + new selected images
  const [images, setImages] = useState<ImageData[]>([]);

  // LOAD INITIAL VALUES FOR EDIT
  useEffect(() => {
    if (isEditing && editProductData) {
      setProduct({
        ...editProductData,
        imageUrls: editProductData.imageUrls ?? [],
      });

      // Merge image URLs (old) into image list
      if (editProductData.imageUrls?.length) {
        setImages(
          editProductData.imageUrls.map((url) => ({
            uri: `${BASE_URL}${url}`,
            isOld: true,
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
      imageUrls: [],
    });
    setImages([]);
  };

  const handleChange = (key: keyof Product, value: string | number) => {
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  // PICK IMAGES (WEB + MOBILE)
  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera roll permission is needed.");
      return;
    }

    let result;

    if (Platform.OS === "web") {
      // ⭐ WEB supports multiple images perfectly
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });
    } else {
      // ⭐ MOBILE fallback (select 1 by 1)
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
    }

    if (!result.canceled) {
      const selected = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.type || "image/jpeg",
        name: asset.fileName || `image-${Date.now()}.jpg`,
        isOld: false,
      }));

      setImages((prev) => [...prev, ...selected]);
    }
  };

  // COMPRESS IMAGE
  const compressImage = async (uri: string) => {
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
  };

  // SUBMIT PRODUCT
  const handleSubmit = async () => {
  if (!product.name.trim()) {
    Alert.alert("Validation", "Please enter product name.");
    return;
  }

  const token = await AsyncStorage.getItem("token");
  if (!token) {
    Alert.alert("Error", "Not authenticated.");
    return;
  }

  // 1️⃣ Extract old image URLs (those coming from DB)
  const oldUrls = images
    .filter((img) => img.isOld)  
    .map((img) => img.uri.replace(BASE_URL, "")); // remove BASE_URL

  // 2️⃣ Extract NEW images (local uri)
  const newImages = images.filter((img) => !img.isOld);

  // 3️⃣ Convert only NEW IMAGES to base64
  const base64Uploads: string[] = [];
  for (let img of newImages) {
    const compressed = await compressImage(img.uri);
    base64Uploads.push(compressed);
}

  // 4️⃣ FINAL PAYLOAD (correct structure)
  const payload = {
    ...product,
    imageUrls: oldUrls,  // keep old images
    images: base64Uploads, // upload only new ones
  };

  // 5️⃣ Send request
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
