import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import ReviewPopup from '@/components/ReviewPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from '../components/ProductCard';
import { useApi } from '../context/ApiContext';
import styles from '../CSS/Home.styles';

type GenderFilter = 'all' | 'male' | 'female';
interface ReviewProduct {
  productId: string;
  orderId: string;
}

// Custom hook for gender filtering
const useGenderFilter = (products: any[]) => {
  const [selectedGender, setSelectedGender] = useState<GenderFilter>('all');

  const filterProductsByGender = useCallback((productsList: any[], gender: GenderFilter) => {
    if (gender === 'all') return productsList;

    const genderKeywords = {
      male: ['male', 'men', 'man', 'boy'],
      female: ['female', 'women', 'woman', 'girl']
    };

    return productsList.filter(product => {
      const searchText = [
        product.name?.toLowerCase(),
        product.category?.toLowerCase(),
        product.description?.toLowerCase()
      ].join(' ');

      return genderKeywords[gender].some(keyword => {
        // Use EXACT word matching with word boundaries
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        return regex.test(searchText);
      });
    });
  }, []);

  const filteredProducts = useMemo(() =>
    filterProductsByGender(products, selectedGender),
    [products, selectedGender, filterProductsByGender]
  );

  return {
    selectedGender,
    setSelectedGender,
    filteredProducts,
  };
};

// Custom hook for reviews management
const useReviews = (userId: string, BASE_URL: string) => {
  const [reviewProduct, setReviewProduct] = useState<ReviewProduct | null>(null);
  const [dismissedReviews, setDismissedReviews] = useState<string[]>([]);

  const loadDismissedReviews = useCallback(async () => {
    try {
      const dismissedRaw = await AsyncStorage.getItem('dismissedReviews');
      const dismissed = dismissedRaw ? JSON.parse(dismissedRaw) : [];
      setDismissedReviews(dismissed);
    } catch (error) {
      console.error('Error loading dismissed reviews:', error);
    }
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

  const dismissReview = useCallback(async (productId: string) => {
    const updatedDismissed = [...dismissedReviews, productId];
    setDismissedReviews(updatedDismissed);
    await AsyncStorage.setItem('dismissedReviews', JSON.stringify(updatedDismissed));
    setReviewProduct(null);
  }, [dismissedReviews]);

  return {
    reviewProduct,
    dismissedReviews,
    loadDismissedReviews,
    checkForReviews,
    dismissReview
  };
};

// Custom hook for products data
const useProducts = (BASE_URL: string) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProductsWithRatings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/products`);
      const data = await res.json();

      const productsWithRatings = await Promise.all(
        data.map(async (product: any) => {
          try {
            const reviewRes = await fetch(`${BASE_URL}/review/product/${product._id}`);
            const reviews = await reviewRes.json();

            const avgRating = reviews.length > 0
              ? parseFloat((reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1))
              : 0;

            return { ...product, avgRating };
          } catch {
            return { ...product, avgRating: 0 };
          }
        })
      );

      setProducts(productsWithRatings);
    } catch (err) {
      console.error("Error fetching products:", err);
      Alert.alert("Error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  return {
    products,
    loading,
    fetchProductsWithRatings
  };
};

// Custom hook for user data
const useUser = () => {
  const [userId, setUserId] = useState('');

  const loadUserId = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem('user');
      if (id) setUserId(id);
    } catch (err) {
      console.error('Error loading user ID:', err);
    }
  }, []);

  return {
    userId,
    loadUserId
  };
};

// Gender Tabs Component
const GenderTabs = React.memo(({
  selectedGender,
  onGenderSelect
}: {
  selectedGender: GenderFilter;
  onGenderSelect: (gender: GenderFilter) => void;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.tabsContainer}
  >
    {(['all', 'male', 'female'] as GenderFilter[]).map(gender => (
      <TouchableOpacity
        key={gender}
        style={[
          styles.tab,
          selectedGender === gender && styles.tabActive
        ]}
        onPress={() => onGenderSelect(gender)}
      >
        <Text style={[
          styles.tabText,
          selectedGender === gender && styles.tabTextActive
        ]}>
          {gender === 'all' ? 'All Products' : gender.charAt(0).toUpperCase() + gender.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
));

// Results Counter Component
const ResultsCounter = React.memo(({
  count,
  gender
}: {
  count: number;
  gender: GenderFilter;
}) => (
  <View style={styles.resultsContainer}>
    <Text style={styles.resultsText}>
      {count} product{count !== 1 ? 's' : ''}
      {gender !== 'all' && ` for ${gender}`}
    </Text>
  </View>
));

// Empty State Component
const EmptyState = React.memo(({ gender }: { gender: GenderFilter }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>
      {gender === 'all'
        ? 'No products available'
        : `No ${gender} products found`
      }
    </Text>
  </View>
));

export default function Home() {
  const navigation = useNavigation<any>();
  const BASE_URL = useApi();

  // Custom hooks
  const { userId, loadUserId } = useUser();
  const { products, fetchProductsWithRatings } = useProducts(BASE_URL);
  const { selectedGender, setSelectedGender, filteredProducts } = useGenderFilter(products);
  const {
    reviewProduct,
    loadDismissedReviews,
    checkForReviews,
    dismissReview
  } = useReviews(userId, BASE_URL);

  // Load user data and reviews
  useFocusEffect(
    useCallback(() => {
      const initializeUserData = async () => {
        await loadUserId();
        await loadDismissedReviews();
      };
      initializeUserData();
    }, [loadUserId, loadDismissedReviews])
  );

  // Check for reviews when user or dismissed reviews change
  useEffect(() => {
    checkForReviews();
  }, [userId, checkForReviews]);

  // Fetch products on focus
  useFocusEffect(
    useCallback(() => {
      fetchProductsWithRatings();
    }, [fetchProductsWithRatings])
  );

  // Handle back button press
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

  // Handle review popup close
  const handleReviewClose = useCallback(async () => {
    if (reviewProduct) {
      await dismissReview(reviewProduct.productId);
      setTimeout(() => checkForReviews(), 500);
    }
  }, [reviewProduct, dismissReview, checkForReviews]);

  // Get product name for review popup
  const reviewProductName = useMemo(() =>
    products.find(p => p._id === reviewProduct?.productId)?.name || 'Product',
    [products, reviewProduct]
  );

  // Render product item
  const renderProductItem = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("tryYourDress", { product: item })}
      activeOpacity={0.8}
    >
      <ProductCard product={item} />
    </TouchableOpacity>
  ), [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Gender Filter Tabs */}
      <GenderTabs
        selectedGender={selectedGender}
        onGenderSelect={setSelectedGender}
      />

      {/* Results Count */}
      <ResultsCounter
        count={filteredProducts.length}
        gender={selectedGender}
      />

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={<EmptyState gender={selectedGender} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      {/* Review Popup */}
      {reviewProduct && (
        <ReviewPopup
          visible={!!reviewProduct}
          productId={reviewProduct.productId}
          orderId={reviewProduct.orderId}
          userId={userId}
          productName={reviewProductName}
          onClose={handleReviewClose}
        />
      )}
    </SafeAreaView>
  );
}