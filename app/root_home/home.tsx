import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  BackHandler,
} from 'react-native';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigation = useNavigation(); // ✅ call useNavigation here
  const [cartItems, setCart] = useState([]);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    fetch('http://192.168.71.201:5000/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  // useEffect(() => {
  //   const handleBackPress = () => {
  //     Alert.alert('Exit App', 'Do you want to exit the app?', [
  //       { text: 'Cancel', style: 'cancel' },
  //       { text: 'Exit', onPress: () => BackHandler.exitApp() },
  //     ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     handleBackPress
  //   );

  //   return () => backHandler.remove();
  // }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          router.replace('/');
        },
      },
    ]);
  };
  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };


  // ✅ Valid hook usage: renderDress uses navigation from above
  const renderDress = ({ item }: { item: typeof products[0] }) => (
    <TouchableOpacity style={styles.productCard} activeOpacity={0.9}>
      <Image
        source={{ uri: `http://192.168.137.1:5000${item.imageUrl}` }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('root_home/Try', { product: item })}
          >
            <Text style={styles.tryText}>Try it</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.productPrice}>Rs.{item.price}.00</Text>
        <Text style={styles.productDescription}>{item.description}</Text>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderDress}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.productList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addToCartBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tryText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  header: {
    paddingTop: 40,
    paddingBottom : 20,
    paddingHorizontal: 25,
    backgroundColor: '#db3022',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  productList: {
    padding: 8,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#db3022',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
  },
});
