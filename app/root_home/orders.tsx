import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

export default function Orders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchOrders = async () => {
                try {
                    const userId = await AsyncStorage.getItem("user");
                    if (!userId) return;

                    const response = await fetch(`http://192.168.71.201:5000/orders/${userId}`);
                    const data = await response.json();
                    setOrders(data);
                } catch (err) {
                    console.error("Error fetching orders", err);
                } finally {
                    setLoading(false);
                }
            };

            fetchOrders();
        }, [])
    );

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Orders</Text>
            {orders.length === 0 ? (
                <Text>No orders found.</Text>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.orderCard}>
                            <Text>Order ID: {item.id}</Text>
                            <Text>Price: ${item.price}</Text>
                            <Text>Status: {item.status}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    orderCard: {
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#ccc",
    },
});
