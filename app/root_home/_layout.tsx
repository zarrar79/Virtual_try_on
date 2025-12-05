import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Alert } from 'react-native';

export default function DrawerLayout() {

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await AsyncStorage.removeItem('token');
                    await AsyncStorage.removeItem('user');
                    await AsyncStorage.removeItem('user_name');
                    router.replace('/login');
                },
            },
        ]);
    };

    return (
        <Drawer
            screenOptions={{
                headerStyle: {
                    // backgroundColor: "#8A9A5B",
                    backgroundColor: "#808000",

                },
                headerTintColor: "#ffff",
                headerTitleStyle: {
                    color: "#ffff"
                },
                headerRight: () => (
                    <Ionicons
                        name="log-out-outline"
                        size={24}
                        color="white"
                        style={{ marginRight: 15 }}
                        onPress={handleLogout}
                    />
                ),
                drawerActiveTintColor: '#808000',  // Color for active/focused drawer item
                drawerInactiveTintColor: '#555',
            }}
        >
            <Drawer.Screen
                name="home"
                options={{
                    drawerLabel: 'Home',
                    title: 'Home',
                    drawerIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="cart"
                options={{
                    drawerLabel: 'Cart',
                    title: 'Cart',
                    drawerIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="orders"
                options={{
                    drawerLabel: 'Orders',
                    title: 'Orders',
                    drawerIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? 'list' : 'list-outline'} size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="wishlist"
                options={{
                    drawerLabel: 'Wishlist',
                    title: 'Wishlist',
                    drawerIcon: ({ focused, color, size }) => (
                        <Ionicons name={focused ? 'heart' : 'heart-outline'} size={size} color={color} />
                    ),
                }}
            />
        </Drawer>
    );
}
