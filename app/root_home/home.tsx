import { useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const dummyDresses = [
  {
    id: '1',
    name: 'Floral Summer Dress',
    price: 'PKR2,499',
    image: require('../../assets/images/img1.jpg'),
    description: 'Lightweight floral dress perfect for summer occasions',
  },
  {
    id: '2',
    name: 'Elegant Evening Gown',
    price: 'PKR5,999',
    image: require('../../assets/images/img2.jpg'),
    description: 'Stunning floor-length gown for special events',
  },
  {
    id: '3',
    name: 'Casual Cotton Dress',
    price: 'PKR1,799',
    image: require('../../assets/images/img3.jpg'),
    description: 'Comfortable everyday wear with stylish design',
  },
  {
    id: '4',
    name: 'Designer Party Dress',
    price: 'PKR4,500',
    image: require('../../assets/images/img4.jpg'),
    description: 'Trendy sequin dress for night outs and parties',
  },
  {
    id: '5',
    name: 'Traditional Embroidered Dress',
    price: 'PKR6,999',
    image: require('../../assets/images/img5.jpg'),
    description: 'Hand-embroidered cultural dress with intricate details',
  },
  {
    id: '6',
    name: 'Office Formal Dress',
    price: 'PKR3,200',
    image: require('../../assets/images/img6.jpg'),
    description: 'Professional yet fashionable work attire',
  },
];

export default function Home(){
  useEffect(() => {
    const handleBackPress = () => {
      // Optional: Confirm before exiting the app
      Alert.alert('Exit App', 'Do you want to exit the app?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => BackHandler.exitApp() },
      ]);
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandler.remove(); // Clean up listener on unmount
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          router.replace('/'); // Navigate back to login screen
        },
      },
    ]);
  };

  const renderDress = ({ item }: { item: typeof dummyDresses[0] }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fashion Dresses</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dummyDresses}
        renderItem={renderDress}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 30,
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
