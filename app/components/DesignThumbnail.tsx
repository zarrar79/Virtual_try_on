import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Design } from '../types/product';
import styles from '../CSS/ProductCustomization.styles';

interface DesignThumbnailProps {
  design: Design;
  designIndex: number;
  baseUrl: string;
  mainImage: string | null;
  isSelected: boolean;
  isOutOfStock: boolean;
  onPress: (design: Design, index: number) => void;
  onLongPress: (design: Design, index: number) => void;
}

export const DesignThumbnail: React.FC<DesignThumbnailProps> = ({
  design,
  designIndex,
  baseUrl,
  mainImage,
  isSelected,
  isOutOfStock,
  onPress,
  onLongPress,
}) => {
  const imageUrl = design.imageUrl.startsWith('http') ? design.imageUrl : baseUrl + design.imageUrl;
  const isMainImage = mainImage === imageUrl;

  return (
    <TouchableOpacity
      onPress={() => onPress(design, designIndex)}
      onLongPress={() => onLongPress(design, designIndex)}
      style={[
        styles.thumbnailContainer,
        isSelected && styles.selectedThumbnail,
        isMainImage && styles.mainThumbnail,
        isOutOfStock && styles.outOfStockThumbnail,
      ]}
      disabled={isOutOfStock}
    >
      <Image
        source={{ uri: imageUrl }}
        style={[styles.thumbnail, isOutOfStock && styles.outOfStockImage]}
      />
      
      {isOutOfStock && (
        <View style={styles.outOfStockOverlay}>
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        </View>
      )}
      
      {isMainImage && !isOutOfStock && (
        <View style={styles.mainImageIndicator}>
          <Text style={styles.mainImageText}>Main</Text>
        </View>
      )}

      {isSelected && !isOutOfStock && (
        <View style={styles.selectionIndicator}>
          <Text style={styles.selectionText}>✓</Text>
        </View>
      )}

      <View style={styles.stockInfo}>
        <Text style={[styles.stockText, isOutOfStock && styles.outOfStockText]}>
          Stock: {design.stock}
        </Text>
      </View>
    </TouchableOpacity>
  );
};