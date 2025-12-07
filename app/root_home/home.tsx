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
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
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

  // ----------------- Fabrics -----------------
  const [topFabricUri, setTopFabricUri] = useState(null);
  const [bottomFabricUri, setBottomFabricUri] = useState(null);
  const [selectedPart, setSelectedPart] = useState("top");

  // ----------------- Designs -----------------
  const [topPlaced, setTopPlaced] = useState([]);
  const [bottomPlaced, setBottomPlaced] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [designs] = useState([
    { id: "d1", uri: "https://i.imgur.com/3n9bG2V.png", name: "Star" },
    { id: "d2", uri: "https://i.imgur.com/2yaf2wb.png", name: "Flower" },
  ]);

  // ----------------- Mask positions & scales -----------------
  const [topMaskPos, setTopMaskPos] = useState({ x: 0, y: 0 });
  const [topMaskScale, setTopMaskScale] = useState(1);

  const [bottomMaskPos, setBottomMaskPos] = useState({ x: 0, y: 0 });
  const [bottomMaskScale, setBottomMaskScale] = useState(1);

  // Scale limits - WIDER RANGE for more flexibility
  const MIN_SCALE = 0.1;    // 10% - Can make very small
  const MAX_SCALE = 5.0;    // 500% - Can make very large
  
  // Default preset scales for common sizes
  const SCALE_PRESETS = {
    MIN: MIN_SCALE,      // 10%
    XS: 0.25,           // 25%
    SM: 0.5,            // 50%
    MD: 1.0,            // 100% (default)
    LG: 2.0,            // 200%
    XL: 3.0,            // 300%
    MAX: MAX_SCALE      // 500%
  };

  // ----------------- Pick Fabric -----------------
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

  // ----------------- Add design -----------------
  const addDesign = (design) => {
    const instance = {
      id: `${design.id}_${Date.now()}`,
      designUri: design.uri,
      x: canvasW / 4,
      y: canvasH / 4,
      scale: 1,
      rotation: 0,
    };
    if (selectedPart === "top") setTopPlaced((p) => [...p, instance]);
    else setBottomPlaced((p) => [...p, instance]);
    setSelectedId(instance.id);
  };

  // ----------------- SIMPLE Draggable Mask Component -----------------
  const DraggableMask = React.useCallback(({
    maskSource,
    fabricUri,
    pos,
    setPos,
    scale,
    designsArray,
    setDesignsArray,
  }) => {
    const offset = useRef({ x: pos.x, y: pos.y });

    const onGestureEvent = (event) => {
      const { translationX, translationY } = event.nativeEvent;
      
      setPos({
        x: offset.current.x + translationX,
        y: offset.current.y + translationY,
      });
    };

    const onHandlerStateChange = (event) => {
      const { state } = event.nativeEvent;
      
      if (state === State.END || state === State.CANCELLED) {
        offset.current = { x: pos.x, y: pos.y };
      }
      
      if (state === State.BEGAN) {
        offset.current = { x: pos.x, y: pos.y };
      }
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
              source={{ uri: fabricUri || "https://i.imgur.com/6KQ2c0n.jpg" }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            
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
              />
            ))}
          </MaskedView>
        </View>
      </PanGestureHandler>
    );
  }, [canvasW, canvasH, selectedId, setSelectedId]);

  // ----------------- Enhanced Percentage Controls -----------------
  const renderPercentageControls = () => {
    const currentScale = selectedPart === "top" ? topMaskScale : bottomMaskScale;
    const percentage = Math.round(((currentScale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)) * 100);
    const actualPercentage = Math.round(currentScale * 100); // Actual percentage of original size
    
    return (
      <View style={styles.percentageContainer}>
        {/* Header with current percentage */}
        <View style={styles.percentageHeader}>
          <Text style={styles.percentageLabel}>Size: {actualPercentage}% of original</Text>
          <Text style={styles.percentageValue}>Position: {percentage}% of range</Text>
        </View>
        
        {/* Main Slider */}
        <View style={styles.sliderContainer}>
          <TouchableOpacity 
            style={styles.sliderLimitButton}
            onPress={() => {
              if (selectedPart === "top") setTopMaskScale(MIN_SCALE);
              else setBottomMaskScale(MIN_SCALE);
            }}
          >
            <Text style={styles.sliderLimitText}>Min</Text>
            <Text style={styles.sliderLimitPercent}>10%</Text>
          </TouchableOpacity>
          
          <View style={styles.sliderWrapper}>
            <Slider
              style={styles.slider}
              minimumValue={MIN_SCALE}
              maximumValue={MAX_SCALE}
              step={0.01} // Very fine control
              value={currentScale}
              onValueChange={(value) => {
                if (selectedPart === "top") {
                  setTopMaskScale(value);
                } else {
                  setBottomMaskScale(value);
                }
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
            <Text style={styles.sliderLimitText}>Max</Text>
            <Text style={styles.sliderLimitPercent}>500%</Text>
          </TouchableOpacity>
        </View>
        
        {/* Quick Percentage Presets */}
        <View style={styles.quickPresetsContainer}>
          <Text style={styles.presetsLabel}>Quick Presets:</Text>
          <View style={styles.presetButtons}>
            {Object.entries(SCALE_PRESETS).map(([key, value]) => {
              const presetPercentage = Math.round(value * 100);
              const isActive = Math.abs(currentScale - value) < 0.01;
              
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.presetButton,
                    isActive && styles.presetButtonActive
                  ]}
                  onPress={() => {
                    if (selectedPart === "top") {
                      setTopMaskScale(value);
                    } else {
                      setBottomMaskScale(value);
                    }
                  }}
                >
                  <Text style={[
                    styles.presetButtonText,
                    isActive && styles.presetButtonTextActive
                  ]}>
                    {key === 'MIN' ? 'Min' : 
                     key === 'MAX' ? 'Max' : 
                     `${presetPercentage}%`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Fine Adjustment Buttons */}
        <View style={styles.fineAdjustmentContainer}>
          <Text style={styles.fineAdjustmentLabel}>Fine Adjust:</Text>
          <View style={styles.fineAdjustmentButtons}>
            <TouchableOpacity
              style={[styles.fineAdjustButton, styles.fineAdjustButtonSmall]}
              onPress={() => {
                if (selectedPart === "top") {
                  setTopMaskScale(Math.max(MIN_SCALE, topMaskScale - 0.01));
                } else {
                  setBottomMaskScale(Math.max(MIN_SCALE, bottomMaskScale - 0.01));
                }
              }}
            >
              <Text style={styles.fineAdjustButtonText}>-1%</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.fineAdjustButton, styles.fineAdjustButtonLarge]}
              onPress={() => {
                if (selectedPart === "top") {
                  setTopMaskScale(Math.max(MIN_SCALE, topMaskScale - 0.1));
                } else {
                  setBottomMaskScale(Math.max(MIN_SCALE, bottomMaskScale - 0.1));
                }
              }}
            >
              <Text style={styles.fineAdjustButtonText}>-10%</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.fineAdjustButton, styles.fineAdjustButtonReset]}
              onPress={() => {
                if (selectedPart === "top") {
                  setTopMaskScale(1);
                } else {
                  setBottomMaskScale(1);
                }
              }}
            >
              <Text style={styles.fineAdjustButtonText}>100%</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.fineAdjustButton, styles.fineAdjustButtonLarge]}
              onPress={() => {
                if (selectedPart === "top") {
                  setTopMaskScale(Math.min(MAX_SCALE, topMaskScale + 0.1));
                } else {
                  setBottomMaskScale(Math.min(MAX_SCALE, bottomMaskScale + 0.1));
                }
              }}
            >
              <Text style={styles.fineAdjustButtonText}>+10%</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.fineAdjustButton, styles.fineAdjustButtonSmall]}
              onPress={() => {
                if (selectedPart === "top") {
                  setTopMaskScale(Math.min(MAX_SCALE, topMaskScale + 0.01));
                } else {
                  setBottomMaskScale(Math.min(MAX_SCALE, bottomMaskScale + 0.01));
                }
              }}
            >
              <Text style={styles.fineAdjustButtonText}>+1%</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Extreme Size Buttons */}
        <View style={styles.extremeButtonsContainer}>
          <TouchableOpacity
            style={[styles.extremeButton, styles.extremeMinButton]}
            onPress={() => {
              if (selectedPart === "top") {
                setTopMaskScale(MIN_SCALE);
              } else {
                setBottomMaskScale(MIN_SCALE);
              }
            }}
          >
            <Text style={styles.extremeButtonText}>Make Smallest (10%)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.extremeButton, styles.extremeMaxButton]}
            onPress={() => {
              if (selectedPart === "top") {
                setTopMaskScale(MAX_SCALE);
              } else {
                setBottomMaskScale(MAX_SCALE);
              }
            }}
          >
            <Text style={styles.extremeButtonText}>Make Largest (500%)</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ----------------- Resize Buttons -----------------
  const renderResizeButtons = () => (
    <View style={styles.resizeButtons}>
      <TouchableOpacity
        onPress={() => {
          if (selectedPart === "top") 
            setTopMaskScale(Math.max(MIN_SCALE, topMaskScale - 0.1));
          else
            setBottomMaskScale(Math.max(MIN_SCALE, bottomMaskScale - 0.1));
        }}
        style={styles.resizeBtn}
      >
        <Text style={{ fontSize: 20 }}>-</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (selectedPart === "top") 
            setTopMaskScale(Math.min(MAX_SCALE, topMaskScale + 0.1));
          else
            setBottomMaskScale(Math.min(MAX_SCALE, bottomMaskScale + 0.1));
        }}
        style={styles.resizeBtn}
      >
        <Text style={{ fontSize: 20 }}>+</Text>
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
        <Text style={{ fontSize: 16 }}>Reset</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Topbar */}
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
        
        <TouchableOpacity 
          style={styles.btn} 
          onPress={() => {
            if (selectedPart === "top") {
              setTopMaskPos({ x: 0, y: 0 });
              setTopMaskScale(1);
            } else {
              setBottomMaskPos({ x: 0, y: 0 });
              setBottomMaskScale(1);
            }
          }}
        >
          <Text>🔄 Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Canvas */}
      <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.95 }}>
        <View style={styles.canvasWrap}>
          <Image
            source={require("../../assets/images/model.png")}
            style={{ width: canvasW, height: canvasH }}
            resizeMode="contain"
          />

          {/* Top Mask */}
          <DraggableMask
            maskSource={require("../../assets/images/topMask.png")}
            fabricUri={topFabricUri}
            pos={topMaskPos}
            setPos={setTopMaskPos}
            scale={topMaskScale}
            designsArray={topPlaced}
            setDesignsArray={setTopPlaced}
          />

          {/* Bottom Mask */}
          <DraggableMask
            maskSource={require("../../assets/images/bottomMask.png")}
            fabricUri={bottomFabricUri}
            pos={bottomMaskPos}
            setPos={setBottomMaskPos}
            scale={bottomMaskScale}
            designsArray={bottomPlaced}
            setDesignsArray={setBottomPlaced}
          />

          {renderResizeButtons()}
        </View>
      </ViewShot>

      {/* Enhanced Percentage Controls */}
      {renderPercentageControls()}

      {/* Debug Position Info */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          {selectedPart === "top" 
            ? `Top: X=${topMaskPos.x.toFixed(1)}, Y=${topMaskPos.y.toFixed(1)}, Scale=${topMaskScale.toFixed(3)} (${Math.round(topMaskScale * 100)}%)`
            : `Bottom: X=${bottomMaskPos.x.toFixed(1)}, Y=${bottomMaskPos.y.toFixed(1)}, Scale=${bottomMaskScale.toFixed(3)} (${Math.round(bottomMaskScale * 100)}%)`
          }
        </Text>
        <Text style={styles.debugText}>
          Touch and drag the {selectedPart} fabric to move it
        </Text>
      </View>

      {/* Palette */}
      <View style={styles.palette}>
        <FlatList
          horizontal
          data={designs}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => addDesign(item)}
              style={styles.design}
            >
              <Image source={{ uri: item.uri }} style={styles.designImg} />
              <Text style={styles.designLabel}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30 : 40,
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
  palette: {
    height: 120,
    marginTop: 10,
    paddingLeft: 10,
  },
  design: {
    width: 90,
    height: 90,
    margin: 8,
    backgroundColor: "#fff",
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
  resizeButtons: {
    position: "absolute",
    right: 10,
    top: 10,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  resizeBtn: {
    paddingHorizontal: 10,
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
    color: "#4a90e2",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
  sliderLimitPercent: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
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
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
  },
  presetButtonTextActive: {
    color: "#fff",
  },
  fineAdjustmentContainer: {
    marginBottom: 15,
  },
  fineAdjustmentLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  fineAdjustmentButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fineAdjustButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  fineAdjustButtonSmall: {
    backgroundColor: "#e8f0fe",
    flex: 1,
    marginHorizontal: 2,
  },
  fineAdjustButtonLarge: {
    backgroundColor: "#d0e0ff",
    flex: 1.2,
    marginHorizontal: 2,
  },
  fineAdjustButtonReset: {
    backgroundColor: "#4a90e2",
    flex: 1.5,
    marginHorizontal: 4,
  },
  fineAdjustButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4a90e2",
  },
  fineAdjustButtonResetText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  extremeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  extremeButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    elevation: 2,
  },
  extremeMinButton: {
    backgroundColor: "#ffebee",
  },
  extremeMaxButton: {
    backgroundColor: "#e8f5e8",
  },
  extremeButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
});