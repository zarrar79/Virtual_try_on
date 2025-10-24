import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, SafeAreaView, FlatList, Alert, BackHandler,TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from '../components/ProductCard';
import { useApi } from '../context/ApiContext';
import ReviewPopup from '@/components/ReviewPopup';
import styles from '../CSS/Home.styles';

export default function Home() {
  // If using TypeScript, define the navigation type for your stack
  // Replace 'RootStackParamList' with your actual stack param list type
  // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
  // type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
  // const navigation = useNavigation<HomeScreenNavigationProp>();
  const navigation = useNavigation<any>();
  const BASE_URL = useApi();
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState('');
  const [reviewProduct, setReviewProduct] = useState(null);
  const [dismissedReviews, setDismissedReviews] = useState<string[]>([]);

  // Load dismissed reviews from AsyncStorage
  const loadDismissedReviews = useCallback(async () => {
    const dismissedRaw = await AsyncStorage.getItem('dismissedReviews');
    const dismissed: string[] = dismissedRaw ? JSON.parse(dismissedRaw) : [];
    setDismissedReviews(dismissed);
  }, []);

  // Check for unreviewed delivered products
  const checkForReviews = useCallback(async () => {
    if (!userId) return;

    try {
      const ordersRes = await fetch(`${BASE_URL}/orders/${userId}`);
      const orders = await ordersRes.json();

      for (const order of orders) {
        if (order.status === 'delivered' || order.status === 'shipped') {
          for (const item of order.items) {
            if (dismissedReviews.includes(item.productId)) continue;

            const checkRes = await fetch(`${BASE_URL}/review/check/${order._id}/${item.productId}/${userId}`);
            const checkData = await checkRes.json();

            if (!checkData.reviewed) {
              setReviewProduct({ productId: item.productId, orderId: order._id });
              return; // show only one popup at a time
            }
          }
        }
      }

      setReviewProduct(null);
    } catch (err) {
      console.error('Error checking reviews:', err);
    }
  }, [userId, dismissedReviews, BASE_URL]);

  // Load user ID and dismissed reviews when screen focuses
  useFocusEffect(
    useCallback(() => {
      const loadUserIdAndReviews = async () => {
        try {
          const id = await AsyncStorage.getItem('user');
          if (id) {
            setUserId(id);
            await loadDismissedReviews();
          }
        } catch (err) {
          console.error('Error loading user ID:', err);
        }
      };
      loadUserIdAndReviews();
    }, [loadDismissedReviews])
  );

  // Trigger review check whenever userId or dismissedReviews changes
  useEffect(() => {
    checkForReviews();
  }, [userId, dismissedReviews]);

  // Fetch products when screen focuses
  useFocusEffect(
    useCallback(() => {
      const fetchProducts = async () => {
        try {
          const res = await fetch(`${BASE_URL}/products`);
          const data = await res.json();
          setProducts(data);
        } catch (err) {
          console.error('Error fetching products:', err);
        }
      };
      fetchProducts();
    }, [BASE_URL])
  );

  // Handle back button
  useEffect(() => {
    const handleBackPress = () => {
      Alert.alert('Exit App', 'Do you want to exit the app?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("ProductCustomization",{ product: item })}
            activeOpacity={0.8}
          >
            <ProductCard product={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.productList}
      />


      {reviewProduct && (
        <ReviewPopup
          visible={!!reviewProduct}
          productId={reviewProduct.productId}
          orderId={reviewProduct.orderId}
          userId={userId}
          productName={products.find(p => p._id === reviewProduct.productId)?.name || 'Product'} // 👈 pass name
          onClose={async () => {
            if (reviewProduct) {
              const updatedDismissed = [...dismissedReviews, reviewProduct.productId];
              setDismissedReviews(updatedDismissed);
              await AsyncStorage.setItem('dismissedReviews', JSON.stringify(updatedDismissed));
            }
            setReviewProduct(null);
            setTimeout(() => checkForReviews(), 500);
          }}
        />
      )}

    </SafeAreaView>
  );
}