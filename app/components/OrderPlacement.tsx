import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OrderPlacementProps {
    BASE_URL: string;
    price?: number;
    selectedDesigns?: any[];
    productName?: string;
    onPlaceOrder?: (size: string) => void;
}

const OrderPlacement: React.FC<OrderPlacementProps> = ({
    BASE_URL,
    price = 1000,
    onPlaceOrder
}) => {
    const [selectedSize, setSelectedSize] = useState("");
    const [orderModalVisible, setOrderModalVisible] = useState(false);

    const handlePlaceCODOrder = async () => {
        if (!selectedSize) {
            Alert.alert("Size Required", "Please select a size before placing order.");
            return;
        }

        const userId = await AsyncStorage.getItem("user");
        const user_name = await AsyncStorage.getItem("user_name");

        if (!userId) {
            Alert.alert("Error", "User not logged in");
            return;
        }

        Alert.alert(
            "Confirm Order",
            `Place order for this custom design? Size: ${selectedSize}\\nPrice: Rs. ${price}`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes",
                    onPress: async () => {
                        if (onPlaceOrder) {
                            onPlaceOrder(selectedSize);
                            setOrderModalVisible(false);
                            return;
                        }
                        try {
                            const orderItems = [{
                                _id: "custom-design",
                                name: "Custom Design",
                                price: price,
                                quantity: 1,
                                imageUrls: [],
                                size: selectedSize,
                                itemTotal: price,
                            }];

                            const response = await axios.post(`${BASE_URL}/order/cod`, {
                                userId,
                                user_name,
                                cart: orderItems,
                            });

                            if (response.status === 201) {
                                Alert.alert(
                                    "Success",
                                    `Order placed successfully!\\nSize: ${selectedSize}\\nTotal: Rs. ${price}`,
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => {
                                                setSelectedSize("");
                                                setOrderModalVisible(false);
                                            },
                                        },
                                    ]
                                );
                            }
                        } catch (err) {
                            console.error(err);
                            Alert.alert("Error", "Order failed");
                        }
                    },
                },
            ]
        );
    };

    const handlePlaceOnlineOrder = async () => {
        if (!selectedSize) {
            Alert.alert("Size Required", "Please select a size before placing order.");
            return;
        }

        const userId = await AsyncStorage.getItem("user");

        if (!userId) {
            Alert.alert("Error", "User not logged in");
            return;
        }

        try {
            const orderItems = [{
                _id: "custom-design",
                name: "Custom Design",
                price: price,
                quantity: 1,
                size: selectedSize,
            }];

            const response = await axios.post(`${BASE_URL}/create-checkout-session`, {
                userId,
                cart: orderItems,
            });

            if (response.data.url) {
                Alert.alert(
                    "Checkout",
                    "Payment gateway ready. (In production, this would open Stripe checkout)",
                    [{ text: "OK" }]
                );
                // In production: await Linking.openURL(response.data.url);
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Payment failed");
        }
    };

    return (
        <View style={styles.container}>
            {/* Size Selection */}
            <View style={styles.sizeSection}>
                <Text style={styles.sectionTitle}>Select Size</Text>
                <View style={styles.sizeButtons}>
                    {['S', 'M', 'L'].map((size) => (
                        <TouchableOpacity
                            key={size}
                            style={[
                                styles.sizeButton,
                                selectedSize === size && styles.sizeButtonActive
                            ]}
                            onPress={() => setSelectedSize(size)}
                        >
                            <Text style={[
                                styles.sizeButtonText,
                                selectedSize === size && styles.sizeButtonTextActive
                            ]}>
                                {size}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {selectedSize && (
                    <Text style={styles.selectedText}>Selected: {selectedSize}</Text>
                )}
            </View>

            {/* Place Order Button */}
            <TouchableOpacity
                style={styles.placeOrderButton}
                onPress={() => setOrderModalVisible(true)}
            >
                <Text style={styles.placeOrderText}>Place Order</Text>
            </TouchableOpacity>

            {/* Order Modal */}
            <Modal
                visible={orderModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setOrderModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Payment Method</Text>
                        <Text style={styles.modalSubtitle}>
                            Size: {selectedSize} | Price: Rs. {price}
                        </Text>

                        <TouchableOpacity
                            style={styles.codButton}
                            onPress={handlePlaceCODOrder}
                        >
                            <Text style={styles.paymentButtonText}>Cash on Delivery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.onlineButton}
                            onPress={handlePlaceOnlineOrder}
                        >
                            <Text style={styles.paymentButtonText}>Pay Online (Stripe)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setOrderModalVisible(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
    },
    sizeSection: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    sizeButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    sizeButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    sizeButtonActive: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    sizeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    sizeButtonTextActive: {
        color: '#fff',
    },
    selectedText: {
        fontSize: 14,
        color: '#4CAF50',
        marginTop: 8,
        fontStyle: 'italic',
    },
    placeOrderButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    placeOrderText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 25,
        width: '85%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    modalSubtitle: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#666',
    },
    codButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    onlineButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    paymentButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelText: {
        color: '#999',
        fontSize: 14,
    },
});

export default OrderPlacement;
