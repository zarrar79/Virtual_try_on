import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../context/ApiContext";
import { useCart } from "../context/CartContext";
import styles from "../CSS/Wishlist.styles";
import {
    FlatList,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

type Product = {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
};

export default function Wishlist() {
    const BASE_URL = useApi();
    const { addToCart } = useCart();
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    // Load user ID from AsyncStorage
    useEffect(() => {
        const loadUser = async () => {
            const storedUserId = await AsyncStorage.getItem("user");
            setUserId(storedUserId);
        };
        loadUser();
    }, []);

    // Fetch wishlist once userId is available
    useEffect(() => {
        if (userId) {
            fetchWishlist();
        }
    }, [userId]);

    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${BASE_URL}/wishlist/get`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });

            if (!res.ok) throw new Error("Failed to fetch wishlist");

            const data = await res.json();
            setWishlist(data.products || []);
        } catch (err) {
            console.error("Fetch Wishlist Error:", err);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        try {
            const res = await fetch(`${BASE_URL}/wishlist/remove`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, productId }),
            });

            if (!res.ok) throw new Error("Failed to remove product from wishlist");

            setWishlist((prev) => prev.filter((p) => p._id !== productId));
        } catch (err) {
            console.error("Remove Wishlist Error:", err);
        }
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        alert(`${product.name} added to cart!`);
    };

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
                My Wishlist
            </Text>
            {wishlist.length === 0 ? (
                <Text>Your wishlist is empty.</Text>
            ) : (
                <FlatList
                    data={wishlist}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image
                                source={{ uri: `${BASE_URL}${item.imageUrl}` }}
                                style={styles.image}
                            />
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.price}>PKR {item.price}</Text>

                            {/* Add to Cart Button */}
                            <TouchableOpacity
                                style={styles.cartBtn}
                                onPress={() => handleAddToCart(item)}
                            >
                                <Text style={styles.cartBtnText}>Add to Cart</Text>
                            </TouchableOpacity>

                            {/* Remove from Wishlist */}
                            <TouchableOpacity
                                style={styles.removeBtn}
                                onPress={() => removeFromWishlist(item._id)}
                            >
                                <Text style={styles.removeBtnText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
}