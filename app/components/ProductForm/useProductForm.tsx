// components/ProductForm/useProductForm.ts
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    imageUrl?: string;
    image?: string;
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

    const [image, setImage] = useState<ImageData | null>(null);

    useEffect(() => {
        if (isEditing && editProductData) {
            setProduct(editProductData);
            if (editProductData.imageUrl) {
                setImage({ uri: `${BASE_URL}/${editProductData.imageUrl}` });
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
        setImage(null);
    };

    const handleChange = (key: keyof Product, value: string | number) => {
        setProduct((prev) => ({ ...prev, [key]: value }));
    };

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission required", "You need to grant camera roll permissions.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            base64: true,
        });

        if (!result.canceled && result.assets?.length) {
            const selected = result.assets[0];
            setImage({
                uri: selected.uri,
                base64: selected.base64 ?? undefined,
                type: selected.type || "image/jpeg",
                name: selected.fileName || "photo.jpg",
            });
        }
    };

    const compressImage = async (uri: string) => {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        return `data:image/jpeg;base64,${result.base64}`;
    };

    const handleSubmit = async () => {
        if (!product.name.trim()) {
            Alert.alert("Validation", "Please enter product name.");
            return;
        }

        let payload = { ...product };

        // Only add image if base64 exists
        if (image?.uri && image?.base64) {
            const base64 = image.base64; // string | undefined
            if (base64) {
                payload.image = await compressImage(image.uri);
            }
        }


        const token = await AsyncStorage.getItem("token");
        if (!token) {
            Alert.alert("Error", "You are not authenticated.");
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
                Alert.alert("Success", isEditing ? "Product updated!" : "Product added!");
                resetForm();
                onSuccess();
            } else {
                Alert.alert("Error", data.message || "Failed to save product.");
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    return { product, image, handleChange, pickImage, handleSubmit, resetForm, setImage };
};
