import { useState } from 'react';
import { Alert } from 'react-native';
import { Design, SelectedDesign } from '../types/product';

export const useDesignSelection = (designs?: Design[]) => {
  const [selectedDesigns, setSelectedDesigns] = useState<SelectedDesign[]>([]);

  const isOutOfStock = (design: Design) => design.stock <= 0;

  const isDesignSelected = (imageUrl: string) => 
    selectedDesigns.some(design => design.imageUrl === imageUrl);

  const toggleDesignSelection = (design: Design, designIndex: number) => {
    if (isOutOfStock(design)) {
      Alert.alert("Out of Stock", "This design is currently out of stock.");
      return;
    }

    setSelectedDesigns(prev => 
      isDesignSelected(design.imageUrl)
        ? prev.filter(item => item.imageUrl !== design.imageUrl)
        : [...prev, { imageUrl: design.imageUrl, quantity: 1, designIndex }]
    );
  };

  const updateDesignQuantity = (imageUrl: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const design = designs?.find(d => d.imageUrl === imageUrl);
    if (design && newQuantity > design.stock) {
      Alert.alert("Insufficient Stock", `Only ${design.stock} items available.`);
      return;
    }

    setSelectedDesigns(prev =>
      prev.map(item =>
        item.imageUrl === imageUrl ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const resetSelection = () => setSelectedDesigns([]);

  const totalQuantity = selectedDesigns.reduce((total, design) => total + design.quantity, 0);

  return {
    selectedDesigns,
    isOutOfStock,
    isDesignSelected,
    toggleDesignSelection,
    updateDesignQuantity,
    resetSelection,
    totalQuantity
  };
};