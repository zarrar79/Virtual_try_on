import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { Design, Product, SelectedDesign } from '../types/product';
import styles from '../CSS/ProductCustomization.styles';

interface OrderModalProps {
  visible: boolean;
  product: Product;
  selectedDesigns: SelectedDesign[];
  baseUrl: string;
  totalQuantity: number;
  totalPrice: number;
  onClose: () => void;
  onPlaceOrder: () => void;
  onUpdateQuantity: (imageUrl: string, quantity: number) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  visible,
  product,
  selectedDesigns,
  baseUrl,
  totalQuantity,
  totalPrice,
  onClose,
  onPlaceOrder,
  onUpdateQuantity,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Review Your Order</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.selectedDesignsContainer}>
              <Text style={styles.sectionTitle}>Selected Designs</Text>
              {selectedDesigns.map((selectedDesign) => {
                const design = product.designs?.[selectedDesign.designIndex];
                return (
                  <DesignOrderItem
                    key={selectedDesign.imageUrl}
                    selectedDesign={selectedDesign}
                    design={design}
                    baseUrl={baseUrl}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                );
              })}
            </View>

            <OrderSummary
              totalQuantity={totalQuantity}
              price={product.price}
              totalPrice={totalPrice}
            />
          </ScrollView>

          <ModalFooter onCancel={onClose} onPlaceOrder={onPlaceOrder} />
        </View>
      </View>
    </Modal>
  );
};

const DesignOrderItem: React.FC<{
  selectedDesign: SelectedDesign;
  design?: Design;
  baseUrl: string;
  onUpdateQuantity: (imageUrl: string, quantity: number) => void;
}> = ({ selectedDesign, design, baseUrl, onUpdateQuantity }) => (
  <View style={styles.selectedDesignItem}>
    <Image
      source={{ uri: baseUrl + selectedDesign.imageUrl }}
      style={styles.selectedDesignImage}
    />
    <View style={styles.selectedDesignInfo}>
      <Text style={styles.designLabel}>Design {selectedDesign.designIndex + 1}</Text>
      <Text style={styles.stockText}>Available: {design?.stock || 0}</Text>
      
      <QuantityControls
        quantity={selectedDesign.quantity}
        onDecrease={() => onUpdateQuantity(selectedDesign.imageUrl, selectedDesign.quantity - 1)}
        onIncrease={() => onUpdateQuantity(selectedDesign.imageUrl, selectedDesign.quantity + 1)}
        onQuantityChange={(newQty) => onUpdateQuantity(selectedDesign.imageUrl, newQty)}
      />
    </View>
  </View>
);

const QuantityControls: React.FC<{
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onQuantityChange: (quantity: number) => void;
}> = ({ quantity, onDecrease, onIncrease, onQuantityChange }) => (
  <View style={styles.designQuantityContainer}>
    <Text style={styles.quantityLabel}>Quantity:</Text>
    <View style={styles.designQuantityControls}>
      <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
        <Text style={styles.qtyBtnText}>-</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.qtyInput}
        value={quantity.toString()}
        keyboardType="numeric"
        onChangeText={(text) => {
          const newQty = parseInt(text) || 1;
          onQuantityChange(newQty);
        }}
      />

      <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
        <Text style={styles.qtyBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const OrderSummary: React.FC<{
  totalQuantity: number;
  price: number;
  totalPrice: number;
}> = ({ totalQuantity, price, totalPrice }) => (
  <View style={styles.orderSummary}>
    <Text style={styles.summaryTitle}>Order Summary</Text>
    <Text style={styles.summaryText}>Total Items: {totalQuantity}</Text>
    <Text style={styles.summaryText}>Price per item: Rs. {price}</Text>
    <Text style={styles.summaryTotal}>Total Price: Rs. {totalPrice}</Text>
  </View>
);

const ModalFooter: React.FC<{
  onCancel: () => void;
  onPlaceOrder: () => void;
}> = ({ onCancel, onPlaceOrder }) => (
  <View style={styles.modalFooter}>
    <TouchableOpacity style={styles.cancelOrderBtn} onPress={onCancel}>
      <Text style={styles.cancelOrderText}>Cancel</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.placeOrderBtn} onPress={onPlaceOrder}>
      <Text style={styles.placeOrderText}>Place Order (COD)</Text>
    </TouchableOpacity>
  </View>
);