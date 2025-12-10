// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import {
//   Alert,
//   BackHandler,
//   FlatList,
//   SafeAreaView,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';

// import ReviewPopup from '@/components/ReviewPopup';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ProductCard from '../components/ProductCard';
// import { useApi } from '../context/ApiContext';
// import styles from '../CSS/Home.styles';

// type GenderFilter = 'all' | 'male' | 'female';
// interface ReviewProduct {
//   productId: string;
//   orderId: string;
// }

// // Custom hook for gender filtering
// const useGenderFilter = (products: any[]) => {
//   const [selectedGender, setSelectedGender] = useState<GenderFilter>('all');

//   const filterProductsByGender = useCallback((productsList: any[], gender: GenderFilter) => {
//     if (gender === 'all') return productsList;

//     const genderKeywords = {
//       male: ['male', 'men', 'man', 'boy'],
//       female: ['female', 'women', 'woman', 'girl']
//     };

//     return productsList.filter(product => {
//       const searchText = [
//         product.name?.toLowerCase(),
//         product.category?.toLowerCase(),
//         product.description?.toLowerCase()
//       ].join(' ');

//       return genderKeywords[gender].some(keyword => {
//         // Use EXACT word matching with word boundaries
//         const regex = new RegExp(`\\b${keyword}\\b`, 'i'); 
//         return regex.test(searchText);
//       });
//     });
//   }, []);

//   const filteredProducts = useMemo(() =>
//     filterProductsByGender(products, selectedGender),
//     [products, selectedGender, filterProductsByGender]
//   );

//   return {
//     selectedGender,
//     setSelectedGender,
//     filteredProducts,
//   };
// };

// // Custom hook for reviews management
// const useReviews = (userId: string, BASE_URL: string) => {
//   const [reviewProduct, setReviewProduct] = useState<ReviewProduct | null>(null);
//   const [dismissedReviews, setDismissedReviews] = useState<string[]>([]);

//   const loadDismissedReviews = useCallback(async () => {
//     try {
//       const dismissedRaw = await AsyncStorage.getItem('dismissedReviews');
//       const dismissed = dismissedRaw ? JSON.parse(dismissedRaw) : [];
//       setDismissedReviews(dismissed);
//     } catch (error) {
//       console.error('Error loading dismissed reviews:', error);
//     }
//   }, []);

//   const checkForReviews = useCallback(async () => {
//     if (!userId) return;

//     try {
//       const ordersRes = await fetch(`${BASE_URL}/orders/${userId}`);
//       const orders = await ordersRes.json();

//       for (const order of orders) {
//         if (order.status === 'delivered' || order.status === 'shipped') {
//           for (const item of order.items) {
//             if (dismissedReviews.includes(item.productId)) continue;

//             const checkRes = await fetch(
//               `${BASE_URL}/review/check/${order._id}/${item.productId}/${userId}`
//             );
//             const checkData = await checkRes.json();

//             if (!checkData.reviewed) {
//               setReviewProduct({ productId: item.productId, orderId: order._id });
//               return;
//             }
//           }
//         }
//       }
//       setReviewProduct(null);
//     } catch (err) {
//       console.error('Error checking reviews:', err);
//     }
//   }, [userId, dismissedReviews, BASE_URL]);

//   const dismissReview = useCallback(async (productId: string) => {
//     const updatedDismissed = [...dismissedReviews, productId];
//     setDismissedReviews(updatedDismissed);
//     await AsyncStorage.setItem('dismissedReviews', JSON.stringify(updatedDismissed));
//     setReviewProduct(null);
//   }, [dismissedReviews]);

//   return {
//     reviewProduct,
//     dismissedReviews,
//     loadDismissedReviews,
//     checkForReviews,
//     dismissReview
//   };
// };

// // Custom hook for products data
// const useProducts = (BASE_URL: string) => {
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchProductsWithRatings = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${BASE_URL}/products`);
//       const data = await res.json();

//       const productsWithRatings = await Promise.all(
//         data.map(async (product: any) => {
//           try {
//             const reviewRes = await fetch(`${BASE_URL}/review/product/${product._id}`);
//             const reviews = await reviewRes.json();

//             const avgRating = reviews.length > 0 
//               ? parseFloat((reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1))
//               : 0;

//             return { ...product, avgRating };
//           } catch {
//             return { ...product, avgRating: 0 };
//           }
//         })
//       );

//       setProducts(productsWithRatings);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       Alert.alert("Error", "Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   }, [BASE_URL]);

//   return {
//     products,
//     loading,
//     fetchProductsWithRatings
//   };
// };

// // Custom hook for user data
// const useUser = () => {
//   const [userId, setUserId] = useState('');

//   const loadUserId = useCallback(async () => {
//     try {
//       const id = await AsyncStorage.getItem('user');
//       if (id) setUserId(id);
//     } catch (err) {
//       console.error('Error loading user ID:', err);
//     }
//   }, []);

//   return {
//     userId,
//     loadUserId
//   };
// };

// // Gender Tabs Component
// const GenderTabs = React.memo(({ 
//   selectedGender, 
//   onGenderSelect 
// }: { 
//   selectedGender: GenderFilter;
//   onGenderSelect: (gender: GenderFilter) => void;
// }) => (
//   <ScrollView 
//     horizontal 
//     showsHorizontalScrollIndicator={false}
//     style={styles.tabsContainer}
//   >
//     {(['all', 'male', 'female'] as GenderFilter[]).map(gender => (
//       <TouchableOpacity
//         key={gender}
//         style={[
//           styles.tab,
//           selectedGender === gender && styles.tabActive
//         ]}
//         onPress={() => onGenderSelect(gender)}
//       >
//         <Text style={[
//           styles.tabText,
//           selectedGender === gender && styles.tabTextActive
//         ]}>
//           {gender === 'all' ? 'All Products' : gender.charAt(0).toUpperCase() + gender.slice(1)}
//         </Text>
//       </TouchableOpacity>
//     ))}
//   </ScrollView>
// ));

// // Results Counter Component
// const ResultsCounter = React.memo(({ 
//   count, 
//   gender 
// }: { 
//   count: number; 
//   gender: GenderFilter;
// }) => (
//   <View style={styles.resultsContainer}>
//     <Text style={styles.resultsText}>
//       {count} product{count !== 1 ? 's' : ''} 
//       {gender !== 'all' && ` for ${gender}`}
//     </Text>
//   </View>
// ));

// // Empty State Component
// const EmptyState = React.memo(({ gender }: { gender: GenderFilter }) => (
//   <View style={styles.emptyContainer}>
//     <Text style={styles.emptyText}>
//       {gender === 'all' 
//         ? 'No products available' 
//         : `No ${gender} products found`
//       }
//     </Text>
//   </View>
// ));

// export default function Home() {
//   const navigation = useNavigation<any>();
//   const BASE_URL = useApi();

//   // Custom hooks
//   const { userId, loadUserId } = useUser();
//   const { products, fetchProductsWithRatings } = useProducts(BASE_URL);
//   const { selectedGender, setSelectedGender, filteredProducts } = useGenderFilter(products);
//   const { 
//     reviewProduct, 
//     loadDismissedReviews, 
//     checkForReviews, 
//     dismissReview 
//   } = useReviews(userId, BASE_URL);

//   // Load user data and reviews
//   useFocusEffect(
//     useCallback(() => {
//       const initializeUserData = async () => {
//         await loadUserId();
//         await loadDismissedReviews();
//       };
//       initializeUserData();
//     }, [loadUserId, loadDismissedReviews])
//   );

//   // Check for reviews when user or dismissed reviews change
//   useEffect(() => {
//     checkForReviews();
//   }, [userId, checkForReviews]);

//   // Fetch products on focus
//   useFocusEffect(
//     useCallback(() => {
//       fetchProductsWithRatings();
//     }, [fetchProductsWithRatings])
//   );

//   // Handle back button press
//   useEffect(() => {
//     const handleBackPress = () => {
//       Alert.alert('Exit App', 'Do you want to exit the app?', [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Exit', onPress: () => BackHandler.exitApp() },
//       ]);
//       return true;
//     };

//     const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
//     return () => backHandler.remove();
//   }, []);

//   // Handle review popup close
//   const handleReviewClose = useCallback(async () => {
//     if (reviewProduct) {
//       await dismissReview(reviewProduct.productId);
//       setTimeout(() => checkForReviews(), 500);
//     }
//   }, [reviewProduct, dismissReview, checkForReviews]);

//   // Get product name for review popup
//   const reviewProductName = useMemo(() => 
//     products.find(p => p._id === reviewProduct?.productId)?.name || 'Product',
//     [products, reviewProduct]
//   );

//   // Render product item
//   const renderProductItem = useCallback(({ item }: { item: any }) => (
//     <TouchableOpacity
//       onPress={() => navigation.navigate("ProductCustomization", { product: item })}
//       activeOpacity={0.8}
//     >
//       <ProductCard product={item} />
//     </TouchableOpacity>
//   ), [navigation]);

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Gender Filter Tabs */}
//       <GenderTabs 
//         selectedGender={selectedGender} 
//         onGenderSelect={setSelectedGender} 
//       />

//       {/* Results Count */}
//       <ResultsCounter 
//         count={filteredProducts.length} 
//         gender={selectedGender} 
//       />

//       {/* Products List */}
//       <FlatList
//         data={filteredProducts}
//         keyExtractor={(item) => item._id}
//         renderItem={renderProductItem}
//         contentContainerStyle={styles.productList}
//         ListEmptyComponent={<EmptyState gender={selectedGender} />}
//         initialNumToRender={10}
//         maxToRenderPerBatch={10}
//         windowSize={5}
//       />

//       {/* Review Popup */}
//       {reviewProduct && (
//         <ReviewPopup
//           visible={!!reviewProduct}
//           productId={reviewProduct.productId}
//           orderId={reviewProduct.orderId}
//           userId={userId}
//           productName={reviewProductName}
//           onClose={handleReviewClose}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// Home.js
// Home.js
import MaskedView from "@react-native-masked-view/masked-view";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState, useCallback } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import Slider from "@react-native-community/slider";
import ViewShot from "react-native-view-shot";
import MovableDesign from "./MovableDesign";

const { width: SCREEN_W } = Dimensions.get("window");

export default function Home() {
  const viewShotRef = useRef();

  const canvasW = SCREEN_W - 40;
  const canvasH = SCREEN_W - 40;

  // Fabric (remote URIs from image picker)
  const [topFabricUri, setTopFabricUri] = useState(null);
  const [bottomFabricUri, setBottomFabricUri] = useState(null);
  const [selectedPart, setSelectedPart] = useState("top");

  // placed movable designs inside masks
  const [topPlaced, setTopPlaced] = useState([]);
  const [bottomPlaced, setBottomPlaced] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // Patterns (local requires) — using `src` everywhere
  const [maskDesigns] = useState([
    { id: "pattern1", src: require("../../assets/images/jp1.jpg"), name: "Jeans", type: "pattern" },
    { id: "pattern2", src: require("../../assets/images/jp2.jpg"), name: "Jeans 2", type: "pattern" },
    { id: "pattern3", src: require("../../assets/images/p1.jpg"), name: "Shirt", type: "pattern" },
    { id: "pattern4", src: require("../../assets/images/p2.jpg"), name: "Shirt 2", type: "pattern" },
  ]);

  // Top mask states (store selected pattern as require() in *src* vars)
  const [topMaskPos, setTopMaskPos] = useState({ x: 0, y: 0 });
  const [topMaskScale, setTopMaskScale] = useState(1);
  const [topMaskDesignSrc, setTopMaskDesignSrc] = useState(null);
  const [topMaskOpacity, setTopMaskOpacity] = useState(1.0);

  // Bottom mask states
  const [bottomMaskPos, setBottomMaskPos] = useState({ x: 0, y: 0 });
  const [bottomMaskScale, setBottomMaskScale] = useState(1);
  const [bottomMaskDesignSrc, setBottomMaskDesignSrc] = useState(null);
  const [bottomMaskOpacity, setBottomMaskOpacity] = useState(1.0);

  const MIN_SCALE = 0.1;
  const MAX_SCALE = 5.0;

  // Image picker
  const pickFabric = async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res.granted) return alert("Permission required");

    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!r.canceled && r.assets && r.assets.length > 0) {
      if (selectedPart === "top") setTopFabricUri(r.assets[0].uri);
      else setBottomFabricUri(r.assets[0].uri);
    }
  };

  // Add movable design (use design.src)
  const addDesign = (design) => {
    const instance = {
      id: `${design.id}_${Date.now()}`,
      designSrc: design.src, // use src (require) for local patterns
      x: canvasW / 4,
      y: canvasH / 4,
      scale: 1,
      rotation: 0,
    };
    if (selectedPart === "top") setTopPlaced((p) => [...p, instance]);
    else setBottomPlaced((p) => [...p, instance]);
    setSelectedId(instance.id);
  };

  // Select pattern for mask overlay (store require() object)
  const addMaskDesign = (design) => {
    if (selectedPart === "top") setTopMaskDesignSrc(design.src);
    else setBottomMaskDesignSrc(design.src);
  };

  const clearMaskDesign = () => {
    if (selectedPart === "top") {
      setTopMaskDesignSrc(null);
      setTopMaskOpacity(1.0);
    } else {
      setBottomMaskDesignSrc(null);
      setBottomMaskOpacity(1.0);
    }
  };

  // DraggableMask: draggable, scaled mask that contains fabric + overlay + movable designs
  const DraggableMask = useCallback(({
    maskSource,
    fabricUri,
    maskDesignSrc,
    opacity,
    pos,
    setPos,
    scale,
    designsArray,
    setDesignsArray,
  }) => {
    const offset = useRef({ x: pos.x, y: pos.y });

    // disable moving mask while a design inside it is selected (so user can move design instead)
    const disableMaskMove = selectedId && designsArray.some(d => d.id === selectedId);

    const onGestureEvent = (event) => {
      if (disableMaskMove) return;
      const { translationX = 0, translationY = 0 } = event.nativeEvent;
      setPos({
        x: offset.current.x + translationX,
        y: offset.current.y + translationY,
      });
    };

    const onHandlerStateChange = (event) => {
      const { state } = event.nativeEvent;
      if (state === State.END || state === State.CANCELLED) offset.current = { x: pos.x, y: pos.y };
      if (state === State.BEGAN) offset.current = { x: pos.x, y: pos.y };
    };

    return (
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: canvasW,
            height: canvasH,
            transform: [
              { translateX: pos.x },
              { translateY: pos.y },
              { scale: scale },
            ],
          }}
        >
          <MaskedView
            style={{ flex: 1 }}
            maskElement={
              <Image
                source={maskSource}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            }
          >
            <Image
              source={fabricUri ? { uri: fabricUri } : require("../../assets/images/p1.jpg")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />

            {/* Pattern overlay (local require stored in maskDesignSrc) */}
            {maskDesignSrc && (
              <Image
                source={maskDesignSrc}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  opacity: opacity,
                  resizeMode: "repeat",
                }}
              />
            )}

            {/* Movable designs placed on mask */}
            {designsArray.map((it) => (
              <MovableDesign
                key={it.id}
                item={it}
                selected={selectedId === it.id}
                canvasSize={{ width: canvasW, height: canvasH }}
                onUpdate={(changes) =>
                  setDesignsArray((prev) =>
                    prev.map((d) => (d.id === it.id ? { ...d, ...changes } : d))
                  )
                }
                onDelete={() =>
                  setDesignsArray((prev) => prev.filter((d) => d.id !== it.id))
                }
                onSelect={() => setSelectedId(it.id)}
                onDeselect={() => setSelectedId(null)}
              />
            ))}
          </MaskedView>
        </View>
      </PanGestureHandler>
    );
  }, [canvasW, canvasH, selectedId]);

  const renderResizeButtons = () => (
    <View style={styles.resizeButtons}>
      <TouchableOpacity
        onPress={() => {
          if (selectedPart === "top") setTopMaskScale(Math.max(MIN_SCALE, topMaskScale - 0.01));
          else setBottomMaskScale(Math.max(MIN_SCALE, bottomMaskScale - 0.01));
        }}
        style={styles.resizeBtn}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-1%</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (selectedPart === "top") setTopMaskScale(Math.min(MAX_SCALE, topMaskScale + 0.01));
          else setBottomMaskScale(Math.min(MAX_SCALE, bottomMaskScale + 0.01));
        }}
        style={styles.resizeBtn}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+1%</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (selectedPart === "top") {
            setTopMaskPos({ x: 0, y: 0 });
            setTopMaskScale(1);
          } else {
            setBottomMaskPos({ x: 0, y: 0 });
            setBottomMaskScale(1);
          }
        }}
        style={[styles.resizeBtn, { marginLeft: 10 }]}
      >
        <Text style={{ fontSize: 14, fontWeight: '600' }}>Reset</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPercentageControls = () => {
    const currentScale = selectedPart === "top" ? topMaskScale : bottomMaskScale;
    const currentOpacity = selectedPart === "top" ? topMaskOpacity : bottomMaskOpacity;
    const actualPercentage = Math.round(currentScale * 100);
    const opacityPercentage = Math.round(currentOpacity * 100);

    return (
      <View style={styles.percentageContainer}>
        <View style={styles.percentageHeader}>
          <Text style={styles.percentageLabel}>Size: {actualPercentage}%</Text>
          <Text style={styles.percentageValue}>Opacity: {opacityPercentage}%</Text>
        </View>

        <View style={styles.sliderGroup}>
          <Text style={styles.sliderLabel}>Mask Size Control</Text>
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              style={styles.sliderLimitButton}
              onPress={() => {
                if (selectedPart === "top") setTopMaskScale(MIN_SCALE);
                else setBottomMaskScale(MIN_SCALE);
              }}
            >
              <Text style={styles.sliderLimitText}>10%</Text>
            </TouchableOpacity>

            <View style={styles.sliderWrapper}>
              <Slider
                style={styles.slider}
                minimumValue={MIN_SCALE}
                maximumValue={MAX_SCALE}
                step={0.01}
                value={currentScale}
                onValueChange={(value) => {
                  if (selectedPart === "top") setTopMaskScale(value);
                  else setBottomMaskScale(value);
                }}
                minimumTrackTintColor="#4a90e2"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#4a90e2"
              />
              <Text style={styles.currentScaleText}>{actualPercentage}%</Text>
            </View>

            <TouchableOpacity
              style={styles.sliderLimitButton}
              onPress={() => {
                if (selectedPart === "top") setTopMaskScale(MAX_SCALE);
                else setBottomMaskScale(MAX_SCALE);
              }}
            >
              <Text style={styles.sliderLimitText}>500%</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sliderGroup}>
          <Text style={styles.sliderLabel}>Pattern Opacity</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLimitText}>0%</Text>
            <View style={styles.sliderWrapper}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                value={currentOpacity}
                onValueChange={(value) => {
                  if (selectedPart === "top") setTopMaskOpacity(value);
                  else setBottomMaskOpacity(value);
                }}
                minimumTrackTintColor="#ff6b6b"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#ff6b6b"
              />
              <Text style={styles.currentScaleText}>{opacityPercentage}%</Text>
            </View>
            <Text style={styles.sliderLimitText}>100%</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity
          style={[styles.btn, selectedPart === "top" && { backgroundColor: "#cce5ff" }]}
          onPress={() => setSelectedPart("top")}
        >
          <Text>👕 Top</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, selectedPart === "bottom" && { backgroundColor: "#cce5ff" }]}
          onPress={() => setSelectedPart("bottom")}
        >
          <Text>👖 Bottom</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={pickFabric}>
          <Text>🎨 Pick Fabric</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={clearMaskDesign}>
          <Text>🗑️ Clear Pattern</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={true}>
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.95 }}>
          <View style={styles.canvasWrap}>
            <Image
              source={require("../../assets/images/model.png")}
              style={{ width: canvasW, height: canvasH }}
              resizeMode="contain"
            />

            <DraggableMask
              maskSource={require("../../assets/images/topMask.png")}
              fabricUri={topFabricUri}
              maskDesignSrc={topMaskDesignSrc}
              opacity={topMaskOpacity}
              pos={topMaskPos}
              setPos={setTopMaskPos}
              scale={topMaskScale}
              designsArray={topPlaced}
              setDesignsArray={setTopPlaced}
            />

            <DraggableMask
              maskSource={require("../../assets/images/bottomMask.png")}
              fabricUri={bottomFabricUri}
              maskDesignSrc={bottomMaskDesignSrc}
              opacity={bottomMaskOpacity}
              pos={bottomMaskPos}
              setPos={setBottomMaskPos}
              scale={bottomMaskScale}
              designsArray={bottomPlaced}
              setDesignsArray={setBottomPlaced}
            />

            {renderResizeButtons()}
          </View>
        </ViewShot>

        {renderPercentageControls()}

        <View style={styles.patternsContainer}>
          <Text style={styles.patternsTitle}>Mask Patterns (For {selectedPart})</Text>
          <FlatList
            horizontal
            data={maskDesigns}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => {
              const isActive =
                (selectedPart === "top" && topMaskDesignSrc === item.src) ||
                (selectedPart === "bottom" && bottomMaskDesignSrc === item.src);

              return (
                <TouchableOpacity
                  onPress={() => addMaskDesign(item)}
                  style={[styles.patternItem, isActive && styles.patternItemActive]}
                >
                  <Image source={item.src} style={styles.patternImage} />
                  <Text style={styles.patternLabel}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Editing: {selectedPart.toUpperCase()} | 
            Size: {Math.round((selectedPart === "top" ? topMaskScale : bottomMaskScale) * 100)}% | 
            Pattern: {(selectedPart === "top" ? (topMaskDesignSrc ? "Yes" : "No") : (bottomMaskDesignSrc ? "Yes" : "No"))}
          </Text>
          <Text style={styles.debugText}>
            Drag to move • +/- 1% buttons for precision zoom
          </Text>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Platform.OS === "android" ? 30 : 40,
    backgroundColor: "#f5f5f5",
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  btn: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 6,
    elevation: 2,
    margin: 4,
  },
  canvasWrap: {
    width: SCREEN_W - 40,
    height: SCREEN_W - 40,
    alignSelf: "center",
    backgroundColor: "#ddd",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 10,
  },
  resizeButtons: {
    position: "absolute",
    right: 10,
    top: 10,
    flexDirection: "column",
    gap: 12,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    elevation: 3,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  resizeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  
  // Patterns Container
  patternsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    elevation: 2,
  },
  patternsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  patternItem: {
    width: 80,
    height: 80,
    margin: 6,
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  patternItemActive: {
    borderColor: "#4a90e2",
    backgroundColor: "#e8f0fe",
  },
  patternImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  patternLabel: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
    color: "#666",
  },
  
  // Palette
  palette: {
    height: 120,
    marginTop: 10,
    paddingLeft: 10,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  paletteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
    marginBottom: 8,
  },
  design: {
    width: 90,
    height: 90,
    margin: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  designImg: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  designLabel: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  
  debugInfo: {
    padding: 10,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 6,
    marginTop: 5,
    marginBottom: 5,
  },
  debugText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  
  // Enhanced Percentage Controls Styles
  percentageContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    elevation: 2,
  },
  percentageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  percentageLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  percentageValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ff6b6b",
  },
  sliderGroup: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sliderWrapper: {
    flex: 1,
    alignItems: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  currentScaleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4a90e2",
    marginTop: 5,
  },
  sliderLimitButton: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  sliderLimitText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  
  // Precision Controls
  precisionControls: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  precisionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  precisionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  precisionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: 70,
    alignItems: "center",
    elevation: 2,
  },
  decreaseButton: {
    backgroundColor: "#ffebee",
  },
  increaseButton: {
    backgroundColor: "#e8f5e8",
  },
  precisionButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  percentageDisplay: {
    alignItems: "center",
  },
  currentPercentage: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4a90e2",
  },
  currentLabel: {
    fontSize: 11,
    color: "#999",
  },
  
  // Quick Presets
  quickPresetsContainer: {
    marginBottom: 15,
  },
  presetsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  presetButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
    marginBottom: 8,
    minWidth: 50,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  presetButtonActive: {
    backgroundColor: "#4a90e2",
    borderColor: "#4a90e2",
  },
  presetButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  presetButtonTextActive: {
    color: "#fff",
  },
  
  // Reset Buttons
  resetButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    elevation: 2,
  },
  resetSizeButton: {
    backgroundColor: "#e8f0fe",
  },
  resetPositionButton: {
    backgroundColor: "#fff0f0",
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
});