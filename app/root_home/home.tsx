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
import { useNavigation } from '@react-navigation/native';
import { useApi } from '../context/ApiContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigation = useNavigation(); // ✅ call useNavigation here
  const BASE_URL = useApi();

  useEffect(() => {
    fetch(`${BASE_URL}/products`)
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


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ProductCard product={item} />}
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
