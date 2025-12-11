import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DesignThumbnail } from "../components/DesignThumbnail";
import { OrderModal } from "../components/OrderModal";
import { ReviewsSection } from "../components/ReviewsSection";
import { useApi } from "../context/ApiContext";
import styles from "../CSS/tryYourDress";
import { useDesignSelection } from "../hooks/useDesignSelection";
import { useProductReviews } from "../hooks/useProductReviews";
import { Design, Product } from "../types/product";

type TryOnStep = "upload" | "result";

const ProductCustomization: React.FC = () => {
  const BASE_URL = useApi();
  const route = useRoute();
  const navigation = useNavigation<any>();
  const product: Product = (route.params as any)?.product;

  const { reviews, loading: loadingReviews, error } = useProductReviews(
    product._id
  );
  const {
    selectedDesigns,
    isOutOfStock,
    isDesignSelected,
    toggleDesignSelection,
    updateDesignQuantity,
    resetSelection,
    totalQuantity,
  } = useDesignSelection(product.designs);

  // Local state
  const [mainImage, setMainImage] = useState<string | null>(
    product?.designs?.length ? BASE_URL + product.designs[0].imageUrl : null
  );
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [tryOnModalVisible, setTryOnModalVisible] = useState(false);
  const [tryOnStep, setTryOnStep] = useState<TryOnStep>("upload");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Animation value for Try-On icon
  const [pulseAnim] = useState(new Animated.Value(1));

  // Derived values
  const totalPrice = totalQuantity * product.price;

  // sizes for user image and tryOn result
  const [userImgSize, setUserImgSize] = useState({ w: 1, h: 1 });
  const [resultImgSize, setResultImgSize] = useState({ w: 1, h: 1 });

  // Compute image sizes when URIs change
  useEffect(() => {
    let cancelled = false;
    const loadSize = async (uri: string | null, setter: (s: any) => void) => {
      if (!uri) return;
      // Image.getSize works for remote and local (file://) URIs
      Image.getSize(
        uri,
        (w, h) => {
          if (!cancelled) setter({ w, h });
        },
        (err) => {
          // fallback: keep default ratio 1:1 if can't get size
          console.warn("Image.getSize failed for", uri, err);
          if (!cancelled) setter({ w: 1, h: 1 });
        }
      );
    };

    loadSize(userImage, setUserImgSize);
    loadSize(tryOnResult, setResultImgSize);

    return () => {
      cancelled = true;
    };
  }, [userImage, tryOnResult]);

  // Pulse animation for Try-On icon
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startPulseAnimation();
  }, []);

  // Request image picker permission using Expo ImagePicker
  const requestImagePickerPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        return newStatus === "granted";
      }
      return true;
    } catch (error) {
      console.error("Error requesting image picker permission:", error);
      return false;
    }
  };

  // Event handlers
  const setThumbnailAsMain = (design: Design, designIndex: number) => {
    if (isOutOfStock(design)) {
      Alert.alert("Out of Stock", "This design is currently out of stock.");
      return;
    }
    setMainImage(BASE_URL + design.imageUrl);
  };

  const openOrderModal = () => {
    if (selectedDesigns.length === 0) {
      Alert.alert(
        "No Designs Selected",
        "Please select at least one design to order."
      );
      return;
    }
    setOrderModalVisible(true);
  };

  const closeOrderModal = () => setOrderModalVisible(false);

  const openTryOnModal = () => {
    setTryOnModalVisible(true);
    setTryOnStep("upload");
    setUserImage(null);
    setTryOnResult(null);
    setUserImgSize({ w: 1, h: 1 });
    setResultImgSize({ w: 1, h: 1 });
  };

  const closeTryOnModal = () => {
    setTryOnModalVisible(false);
    setTryOnStep("upload");
    setUserImage(null);
    setTryOnResult(null);
    setIsProcessing(false);
    setUserImgSize({ w: 1, h: 1 });
    setResultImgSize({ w: 1, h: 1 });
  };

  // Image picker with Expo ImagePicker
  const pickUserImage = async () => {
    try {
      const permissionGranted = await requestImagePickerPermission();

      if (!permissionGranted) {
        Alert.alert(
          "Permission Required",
          "Photo library access is required to upload photos for virtual try-on.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Try Again",
              onPress: pickUserImage,
            },
          ]
        );
        return;
      }

      // No cropping - upload as-is
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // important: no crop UI
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.uri) {
          setUserImage(asset.uri);
          // reset possible previous result
          setTryOnResult(null);
        } else {
          Alert.alert("Error", "Could not get image URI");
        }
      } else if (result.canceled) {
        // user cancelled - nothing to do
      } else {
        Alert.alert("Error", "No image selected");
      }
    } catch (error) {
      console.error("Error with Expo ImagePicker:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Process try-on (unchanged except for leaving apiKey handling as-is)
  const processTryOn = async () => {
    if (!userImage || !mainImage) {
      Alert.alert("Error", "Please upload your photo first");
      return;
    }

    setIsProcessing(true);

    try {
      // const apiKey = 'YOUR_API_KEY_HERE'; // <-- ensure you set this securely

      // ---------- 1️⃣ Upload Person Image ----------
      const personResponse = await fetch(userImage);
      const personBlob = await personResponse.blob();

      const personUploadConfig = await axios.post(
        "https://api.lightxeditor.com/external/api/v2/uploadImageUrl",
        { uploadType: "imageUrl", size: personBlob.size, contentType: "image/jpeg" },
        { headers: { "Content-Type": "application/json", "x-api-key": apiKey } }
      );

      const { uploadImage: personUploadUrl, imageUrl: personUrl } = personUploadConfig.data.body;
      await fetch(personUploadUrl, { method: "PUT", headers: { "Content-Type": "image/jpeg" }, body: personBlob });

      // ---------- 2️⃣ Upload Garment Image ----------
      const garmentResponse = await fetch(mainImage);
      const garmentBlob = await garmentResponse.blob();

      const garmentUploadConfig = await axios.post(
        "https://api.lightxeditor.com/external/api/v2/uploadImageUrl",
        { uploadType: "imageUrl", size: garmentBlob.size, contentType: "image/png" },
        { headers: { "Content-Type": "application/json", "x-api-key": apiKey } }
      );

      const { uploadImage: garmentUploadUrl, imageUrl: garmentUrl } = garmentUploadConfig.data.body;
      await fetch(garmentUploadUrl, { method: "PUT", headers: { "Content-Type": "image/png" }, body: garmentBlob });

      // ---------- 3️⃣ Call Virtual Try-On ----------
      const tryonResponse = await axios.post(
        "https://api.lightxeditor.com/external/api/v2/aivirtualtryon",
        {
          imageUrl: personUrl,
          outfitImageUrl: garmentUrl,
          segmentationType: 2,
        },
        { headers: { "Content-Type": "application/json", "x-api-key": apiKey } }
      );

      if (!tryonResponse.data.body || !tryonResponse.data.body.orderId) {
        throw new Error("Invalid API response from LightX");
      }

      const orderId = tryonResponse.data.body.orderId;

      // ---------- 4️⃣ Poll for Status ----------
      let status = "init";
      let retries = 0;
      const maxRetries = 30;

      while (status === "init" && retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const statusResponse = await axios.post(
          "https://api.lightxeditor.com/external/api/v2/order-status",
          { orderId },
          { headers: { "Content-Type": "application/json", "x-api-key": apiKey } }
        );

        status = statusResponse.data?.body?.status;

        if (status === "active") {
          const resultUrl = statusResponse.data.body.output;
          setTryOnResult(resultUrl);
          setTryOnStep("result");
          // load size for result image (useEffect will pick it up)
          return;
        } else if (status === "failed") {
          throw new Error("Try-on processing failed on server");
        }

        retries++;
      }

      if (status === "init") {
        throw new Error("Try-on timed out");
      }
    } catch (err: any) {
      console.error("TRYON ERROR:", err);
      Alert.alert("Error", err?.message || "Try-on failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceCODOrder = async () => {
    const userId = await AsyncStorage.getItem("user");
    const user_name = await AsyncStorage.getItem("user_name");

    if (!userId) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    // Stock validation
    const stockIssues = selectedDesigns.filter((selectedDesign) => {
      const design = product.designs?.[selectedDesign.designIndex];
      return design && selectedDesign.quantity > design.stock;
    });

    if (stockIssues.length > 0) {
      Alert.alert("Stock Issue", "Some designs have insufficient stock.");
      return;
    }

    Alert.alert(
      "Confirm Order",
      `Place order for ${totalQuantity} item${totalQuantity !== 1 ? "s" : ""} across ${selectedDesigns.length} design${selectedDesigns.length !== 1 ? "s" : ""}? Total: Rs. ${totalPrice}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const orderItems = selectedDesigns.map((selectedDesign) => {
                const design = product.designs?.[selectedDesign.designIndex];
                return {
                  _id: product._id,
                  name: product.name,
                  price: product.price,
                  quantity: selectedDesign.quantity,
                  imageUrls: [selectedDesign.imageUrl],
                  designIndex: selectedDesign.designIndex,
                  designStock: design?.stock || 0,
                  itemTotal: product.price * selectedDesign.quantity,
                };
              });

              const response = await axios.post(`${BASE_URL}/order/cod`, {
                userId,
                user_name,
                cart: orderItems,
              });

              if (response.status === 201) {
                Alert.alert(
                  "Success",
                  `Order placed!\n\nSummary:\n• ${response.data.summary.designsOrdered} design${response.data.summary.designsOrdered !== 1 ? "s" : ""}\n• ${response.data.summary.totalItems} item${response.data.summary.totalItems !== 1 ? "s" : ""}\n• Total: Rs. ${response.data.summary.totalAmount}`,
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        resetSelection();
                        setOrderModalVisible(false);
                        setMainImage(product?.designs?.length ? BASE_URL + product.designs[0].imageUrl : null);
                        navigation.navigate("home");
                      },
                    },
                  ]
                );
              }
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Order failed");
            }
          },
        },
      ]
    );
  };

  // Render upload step
  const renderUploadStep = () => (
    <View style={styles.tryOnModalContent}>
      <Text style={styles.tryOnModalText}>
        Upload your photo to try "{product.name}" virtually
      </Text>

      {/* User Photo Upload */}
      <View style={styles.uploadSection}>
        {userImage ? (
          <ScrollView
            contentContainerStyle={styles.uploadedImageContainer}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={{ uri: userImage }}
              style={{
                width: "100%",
                height: undefined,
                aspectRatio: userImgSize.w / userImgSize.h,
                resizeMode: "contain",
              }}
            />
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={pickUserImage}
            >
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <TouchableOpacity
            style={styles.uploadPlaceholder}
            onPress={pickUserImage}
            activeOpacity={0.7}
          >
            <Text style={styles.uploadIcon}>📁</Text>
            <Text style={styles.uploadText}>Tap to Upload Photo</Text>
            <Text style={styles.uploadSubtext}>Select from your gallery</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Try On Button */}
      {userImage && (
        <TouchableOpacity
          style={styles.tryOnProcessButton}
          onPress={processTryOn}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.tryOnProcessText}>Try It On! 🎭</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Debug Info - Remove in production */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>Platform: {Platform.OS}</Text>
          <Text style={styles.debugText}>
            User Image: {userImage ? "Uploaded" : "Not uploaded"}
          </Text>
        </View>
      )}
    </View>
  );

  // Render result step - simplified
  const renderResultStep = () => (
    <View style={styles.tryOnModalContent}>
      <Text style={styles.tryOnModalText}>
        Here's how "{product.name}" looks on you!
      </Text>

      {tryOnResult ? (
        <ScrollView contentContainerStyle={styles.resultContainer} showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: tryOnResult }}
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: resultImgSize.w / resultImgSize.h,
              resizeMode: "contain",
            }}
          />
        </ScrollView>
      ) : (
        <Text style={styles.tryOnResultSubtext}>No result yet</Text>
      )}

      <Text style={styles.tryOnResultSubtext}>
        You can take a screenshot to save this image.
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{product.name}</Text>

      {/* Main Image with Try-On Button */}
      <View style={styles.imageWrapper}>
        {mainImage ? (
          <>
            <Image
              source={{ uri: mainImage }}
              style={styles.image}
              resizeMode="contain"
            />

            {/* Try-On Icon - Absolute positioned */}
            <TouchableOpacity
              style={styles.tryOnIconContainer}
              onPress={openTryOnModal}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[styles.tryOnIcon, { transform: [{ scale: pulseAnim }] }]}
              >
                <Text style={styles.tryOnIconText}>🎭</Text>
              </Animated.View>
            </TouchableOpacity>
          </>
        ) : (
          <Text>No image selected</Text>
        )}
      </View>

      {/* Design Thumbnails */}
      <View style={styles.thumbnailRow}>
        {product.designs?.map((design, index) => (
          <DesignThumbnail
            key={index}
            design={design}
            designIndex={index}
            baseUrl={BASE_URL}
            mainImage={mainImage}
            isSelected={isDesignSelected(design.imageUrl)}
            isOutOfStock={isOutOfStock(design)}
            onPress={setThumbnailAsMain}
            onLongPress={toggleDesignSelection}
          />
        ))}
      </View>

      {/* User Guidance */}
      <View style={styles.guidanceContainer}>
        <Text style={styles.guidanceTitle}>How to Order:</Text>
        <Text style={styles.guidanceText}>• Tap any design to preview it</Text>
        <Text style={styles.guidanceText}>• Long press to select for ordering</Text>
        <Text style={styles.guidanceText}>• Selected designs will show checkmark</Text>
      </View>

      {/* Quick Order Button */}
      {selectedDesigns.length > 0 && (
        <View style={styles.quickOrderContainer}>
          <Text style={styles.selectedCount}>
            {selectedDesigns.length} design
            {selectedDesigns.length !== 1 ? "s" : ""} selected
          </Text>
          <TouchableOpacity style={styles.quickOrderBtn} onPress={openOrderModal}>
            <Text style={styles.quickOrderBtnText}>
              Review Order ({totalQuantity} items)
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product Details */}
      <Text style={styles.brand}>Brand: {product.brand}</Text>
      <Text style={styles.price}>Price: Rs. {product.price} per item</Text>
      <Text style={styles.description}>{product.description}</Text>

      {/* Order Button */}
      <TouchableOpacity
        style={[styles.confirmBtn, selectedDesigns.length === 0 && styles.disabledBtn]}
        onPress={openOrderModal}
        disabled={selectedDesigns.length === 0}
      >
        <Text style={styles.confirmBtnText}>
          {selectedDesigns.length === 0
            ? "Select Designs to Order (Long Press)"
            : `Review Order - ${totalQuantity} items`}
        </Text>
      </TouchableOpacity>

      {/* Order Modal */}
      <OrderModal
        visible={orderModalVisible}
        product={product}
        selectedDesigns={selectedDesigns}
        baseUrl={BASE_URL}
        totalQuantity={totalQuantity}
        totalPrice={totalPrice}
        onClose={closeOrderModal}
        onPlaceOrder={handlePlaceCODOrder}
        onUpdateQuantity={updateDesignQuantity}
      />

      {/* Try-On Modal */}
      <Modal
        visible={tryOnModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeTryOnModal}
      >
        <View style={styles.tryOnModalOverlay}>
          <View style={styles.tryOnModalContainer}>
            <View style={styles.tryOnModalHeader}>
              <Text style={styles.tryOnModalTitle}>
                {tryOnStep === "upload" ? "Virtual Try-On" : "Try-On Result"}
              </Text>
              <TouchableOpacity onPress={closeTryOnModal}>
                <Text style={styles.tryOnModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {tryOnStep === "upload" ? renderUploadStep() : renderResultStep()}
          </View>
        </View>
      </Modal>

      {/* Reviews Section */}
      <ReviewsSection reviews={reviews} loading={loadingReviews} error={error} />
    </ScrollView>
  );
};

export default ProductCustomization;
