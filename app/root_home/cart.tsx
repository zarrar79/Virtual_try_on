import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useCart } from '../context/CartContext';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen() {
    const { cart, removeFromCart } = useCart();

    const handleCheckout = async () => {
        const userId = await AsyncStorage.getItem("user");
        const user_name = await AsyncStorage.getItem("user_name");
        
        
    try {
        
      // 1. Ask backend for Checkout Session
      const response = await axios.post("http://192.168.137.1:5000/create-checkout-session", { cart, userId, user_name });
      const { url } = response.data; 

      // 2. Open Stripe-hosted checkout
      router.push(url); // opens in webview/browser
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
                {/* Cart Icon */}
                {/* <TouchableOpacity onPress={handleCheckout}>
                    <Text style={styles.logoutText}>Checkout</Text>
                </TouchableOpacity> */}

            {/* Cart Items */}
            <View style={{ flex: 1, padding: 16 }}>
                {cart.length === 0 ? (
                    <Text>Your cart is empty</Text>
                ) : (
                    <FlatList
                        data={cart}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.cartCard}>
                                <Image
                                    source={{ uri: `http://192.168.1.22:5000${item.imageUrl}` }}
                                    style={styles.cartImage}
                                />
                                <View style={styles.cartDetails}>
                                    <Text style={styles.cartName}>{item.name}</Text>
                                    <Text style={styles.cartPrice}>Rs.{item.price}.00</Text>
                                    <Text style={styles.cartQty}>Quantity: {item.quantity}</Text>
                                </View>

                                {/* ❌ Delete Button */}
                                <TouchableOpacity
                                    style={styles.deleteBtn}
                                    onPress={() => removeFromCart(item._id)}
                                >
                                    <Text style={styles.deleteText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />


                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    deleteBtn: {
  padding: 8,
  justifyContent: 'center',
  alignItems: 'center',
},
deleteText: {
  fontSize: 14,
  color: 'red',
},

    container: {
        flex: 1,
        padding: 0,
        backgroundColor: '#f5f5f5', // light background to make cards pop
    },
    header: {
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 25,
        backgroundColor: '#db3022',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 4, // shadow for header
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    logoutText: {
        fontSize: 16,
        color: 'white',
        textDecorationLine: 'underline',
    },
    content: {
        flex: 1,
        padding: 16,
    },

    // ✅ Card Styles
    cartCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,

        // Shadow (iOS)
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,

        // Shadow (Android)
        elevation: 3,
    },
    cartImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 12,
    },
    cartDetails: {
        flex: 1,
    },
    cartName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cartPrice: {
        fontSize: 15,
        color: '#db3022',
        fontWeight: '600',
        marginBottom: 2,
    },
    cartQty: {
        fontSize: 14,
        color: '#666',
    },
});


