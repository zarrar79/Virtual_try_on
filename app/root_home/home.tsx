import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, SafeAreaView, FlatList, Alert, BackHandler, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from '../components/ProductCard';
import { useApi } from '../context/ApiContext';
import ReviewPopup from '@/components/ReviewPopup';
import styles from '../CSS/Home.styles';

export default function Home() {
  const navigation = useNavigation<any>();
  const BASE_URL = useApi();
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState('');
  const [reviewProduct, setReviewProduct] = useState(null);
  const [dismissedReviews, setDismissedReviews] = useState<string[]>([]);

  const loadDismissedReviews = useCallback(async () => {
    const dismissedRaw = await AsyncStorage.getItem('dismissedReviews');
    const dismissed: string[] = dismissedRaw ? JSON.parse(dismissedRaw) : [];
    setDismissedReviews(dismissed);
  }, []);

  const checkForReviews = useCallback(async () => {
    if (!userId) return;

    try {
      const ordersRes = await fetch(`${BASE_URL}/orders/${userId}`);
      const orders = await ordersRes.json();

      for (const order of orders) {
        if (order.status === 'delivered' || order.status === 'shipped') {
          for (const item of order.items) {
            if (dismissedReviews.includes(item.productId)) continue;

            const checkRes = await fetch(
              `${BASE_URL}/review/check/${order._id}/${item.productId}/${userId}`
            );
            const checkData = await checkRes.json();

            if (!checkData.reviewed) {
              setReviewProduct({ productId: item.productId, orderId: order._id });
              return;
            }
          }
        }
      }

      setReviewProduct(null);
    } catch (err) {
      console.error('Error checking reviews:', err);
    }
  }, [userId, dismissedReviews, BASE_URL]);

  useFocusEffect(
    useCallback(() => {
      const loadUserIdAndReviews = async () => {
        try {
          const id = await AsyncStorage.getItem('user');
          console.log(id,'---->id');
          
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

  useEffect(() => {
    checkForReviews();
  }, [userId, dismissedReviews]);

  useFocusEffect(
    useCallback(() => {
      const fetchProductsWithRatings = async () => {
        try {
          const res = await fetch(`${BASE_URL}/products`);
          const data = await res.json();

          const productsWithRatings = await Promise.all(
            data.map(async (product: any) => {
              try {
                const reviewRes = await fetch(`${BASE_URL}/review/product/${product._id}`);
                const reviews = await reviewRes.json();

                if (reviews.length > 0) {
                  const avg =
                    reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) /
                    reviews.length;
                  product.avgRating = parseFloat(avg.toFixed(1));
                } else {
                  product.avgRating = 0;
                }
              } catch {
                product.avgRating = 0;
              }
              return product;
            })
          );

          setProducts(productsWithRatings);
        } catch (err) {
          console.error("Error fetching products:", err);
        }
      };

      fetchProductsWithRatings();
    }, [BASE_URL])
  );

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
            onPress={() => navigation.navigate("ProductCustomization", { product: item })}
            activeOpacity={0.8}
          >
            <ProductCard product={item} avgRating={item.avgRating} />
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
          productName={products.find(p => p._id === reviewProduct.productId)?.name || 'Product'}
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
