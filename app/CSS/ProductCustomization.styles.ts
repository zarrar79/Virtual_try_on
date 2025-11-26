import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#1f1f1f" },
  name: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  imageWrapper: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  image: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, opacity: 0.4 },
  brand: { color: "#ccc", fontSize: 16, marginBottom: 4 },
  price: { color: "#4da6ff", fontSize: 18, marginBottom: 8 },
  description: { color: "#aaa", fontSize: 14, marginBottom: 12 },
  label: { color: "#fff", marginBottom: 8, fontSize: 16 },
  sizeContainer: { flexDirection: "row", flexWrap: "wrap" },
  sizeButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSizeButton: { backgroundColor: "#4da6ff", borderColor: "#4da6ff" },
  sizeButtonText: { color: "#fff" },
  selectedSizeButtonText: { color: "#fff", fontWeight: "bold" },
  colorContainer: { flexDirection: "row", flexWrap: "wrap" },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },
  selectedColorSwatch: { borderColor: "#4da6ff", borderWidth: 3 },
  selectedNoneColor: {
    borderColor: "#4da6ff",
    borderWidth: 3,
    backgroundColor: "#1f1f1f",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  qtyBtn: { padding: 8, backgroundColor: "#333", borderRadius: 6 },
  qtyBtnText: { color: "#fff", fontSize: 18 },
  qtyText: { color: "#fff", marginHorizontal: 16, fontSize: 16 },
  confirmBtn: {
    backgroundColor: "#4da6ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#fff", fontSize: 18 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#aaa",
  },
  reviewCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  rating: {
    fontSize: 14,
    color: "#ffb400",
    marginVertical: 4,
  },
  comment: {
    fontSize: 14,
    color: "#555",
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 6,
    textAlign: "right",
  },
  noReviewsText: {
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  reviewerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007bff", // You can use random or brand colors
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  thumbnailRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 10,
  justifyContent: "center",
  gap: 10,
},

thumbnailContainer: {
  padding: 4,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
},

selectedThumbnail: {
  borderColor: "blue",
  borderWidth: 2,
},

thumbnail: {
  width: 60,
  height: 60,
  borderRadius: 6,
},
mainThumbnail: {
  borderWidth: 3,
  borderColor: '#007AFF', // Blue border for main image
},

// Main image indicator
mainImageIndicator: {
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: '#007AFF',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 4,
},
mainImageText: {
  color: '#fff',
  fontSize: 10,
  fontWeight: 'bold',
},

// Selected info
selectedInfo: {
  marginVertical: 10,
  paddingHorizontal: 16,
},
selectedText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
},
helpText: {
  fontSize: 12,
  color: '#666',
  marginTop: 4,
  fontStyle: 'italic',
},
// Add these to your CSS/ProductCustomization.styles.ts

// Out of stock styles
outOfStockThumbnail: {
  opacity: 0.6,
},
outOfStockImage: {
  opacity: 0.4,
},
outOfStockOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
},
outOfStockText: {
  color: '#ff4444',
  fontSize: 12,
  fontWeight: 'bold',
  textAlign: 'center',
},

// Stock info
stockInfo: {
  position: 'absolute',
  bottom: 4,
  left: 4,
  right: 4,
  backgroundColor: 'rgba(0,0,0,0.7)',
  padding: 4,
  borderRadius: 4,
},
stockText: {
  color: '#fff',
  fontSize: 10,
  textAlign: 'center',
},

// Selected designs container
selectedDesignsContainer: {
  marginVertical: 16,
  padding: 16,
  backgroundColor: '#f8f9fa',
  borderRadius: 8,
},
selectedDesignItem: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: 12,
  borderRadius: 8,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: '#e9ecef',
},
selectedDesignImage: {
  width: 60,
  height: 60,
  borderRadius: 8,
  marginRight: 12,
},
selectedDesignInfo: {
  flex: 1,
},
designLabel: {
  fontSize: 14,
  fontWeight: '600',
  color: '#333',
  marginBottom: 4,
},

// Design quantity controls
designQuantityContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 8,
},
quantityLabel: {
  fontSize: 14,
  color: '#666',
},
designQuantityControls: {
  flexDirection: 'row',
  alignItems: 'center',
},
qtyInput: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 4,
  padding: 8,
  marginHorizontal: 8,
  width: 50,
  textAlign: 'center',
  backgroundColor: '#fff',
},

// Order summary
orderSummary: {
  backgroundColor: '#e8f5e8',
  padding: 16,
  borderRadius: 8,
  marginVertical: 16,
},
summaryTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2d5016',
  marginBottom: 8,
},
summaryText: {
  fontSize: 14,
  color: '#2d5016',
  marginBottom: 4,
},

// Disabled button
disabledBtn: {
  backgroundColor: '#ccc',
},
// Add these to your CSS/ProductCustomization.styles.ts

// Selection indicator
selectionIndicator: {
  position: 'absolute',
  top: 4,
  left: 4,
  backgroundColor: '#4CAF50',
  width: 20,
  height: 20,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
},
selectionText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
},

// Guidance container
guidanceContainer: {
  backgroundColor: '#e3f2fd',
  padding: 16,
  borderRadius: 8,
  marginVertical: 12,
},
guidanceTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#1976d2',
  marginBottom: 8,
},
guidanceText: {
  fontSize: 14,
  color: '#1976d2',
  marginBottom: 4,
},

// Quick order container
quickOrderContainer: {
  backgroundColor: '#4CAF50',
  padding: 16,
  borderRadius: 8,
  marginVertical: 12,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
selectedCount: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
quickOrderBtn: {
  backgroundColor: '#fff',
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 6,
},
quickOrderBtnText: {
  color: '#4CAF50',
  fontSize: 14,
  fontWeight: '600',
},

// Modal styles
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'flex-end',
},
modalContainer: {
  backgroundColor: '#fff',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  maxHeight: '80%',
},
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 20,
  borderBottomWidth: 1,
  borderBottomColor: '#e0e0e0',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
},
closeButton: {
  fontSize: 20,
  color: '#666',
  padding: 4,
},
modalContent: {
  maxHeight: 400,
  padding: 20,
},
modalFooter: {
  flexDirection: 'row',
  padding: 20,
  borderTopWidth: 1,
  borderTopColor: '#e0e0e0',
  gap: 12,
},
cancelOrderBtn: {
  flex: 1,
  backgroundColor: '#f5f5f5',
  padding: 16,
  borderRadius: 8,
  alignItems: 'center',
},
cancelOrderText: {
  color: '#666',
  fontSize: 16,
  fontWeight: '600',
},
placeOrderBtn: {
  flex: 2,
  backgroundColor: '#4CAF50',
  padding: 16,
  borderRadius: 8,
  alignItems: 'center',
},
placeOrderText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},

// Summary total
summaryTotal: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#2d5016',
  marginTop: 8,
  borderTopWidth: 1,
  borderTopColor: '#ccc',
  paddingTop: 8,
},
tryOnIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  tryOnIcon: {
    backgroundColor: '#411900',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  tryOnIconText: {
    fontSize: 20,
  },
  
  // Try-On Modal Styles
  tryOnModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tryOnModalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 0,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  tryOnModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tryOnModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#411900',
  },
  tryOnModalClose: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  tryOnModalContent: {
    padding: 20,
    alignItems: 'center',
  },
  tryOnModalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 16,
    lineHeight: 22,
  },
  tryOnPreviewImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  tryOnModalSubtext: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  tryOnModalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  tryOnCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tryOnCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  tryOnConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#411900',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tryOnConfirmText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
// Images Container
imagesContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 20,
  gap: 10,
},
imageSection: {
  flex: 1,
  alignItems: 'center',
},
imageSectionTitle: {
  fontSize: 14,
  fontWeight: '600',
  color: '#666',
  marginBottom: 8,
},

// Upload Placeholder
uploadPlaceholder: {
  width: 120,
  height: 160,
  borderRadius: 8,
  borderWidth: 2,
  borderColor: '#ddd',
  borderStyle: 'dashed',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
},
uploadIcon: {
  fontSize: 24,
  marginBottom: 8,
},
uploadText: {
  fontSize: 12,
  color: '#666',
  textAlign: 'center',
},

// Upload Options
uploadOptions: {
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 20,
  marginBottom: 20,
},
uploadOptionButton: {
  alignItems: 'center',
  padding: 12,
  borderRadius: 8,
  backgroundColor: '#f8f9fa',
  minWidth: 80,
},
uploadOptionIcon: {
  fontSize: 20,
  marginBottom: 4,
},
uploadOptionText: {
  fontSize: 12,
  color: '#333',
  fontWeight: '500',
},

// Try-On Process Button
tryOnProcessButton: {
  backgroundColor: '#411900',
  paddingVertical: 14,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 10,
},
tryOnProcessText: {
  fontSize: 16,
  color: 'white',
  fontWeight: 'bold',
},

// Result Styles
tryOnResultImage: {
  width: 250,
  height: 300,
  borderRadius: 12,
  marginVertical: 16,
  alignSelf: 'center',
  borderWidth: 2,
  borderColor: '#f0f0f0',
},
tryOnResultSubtext: {
  fontSize: 14,
  textAlign: 'center',
  color: '#666',
  marginBottom: 20,
},
resultActions: {
  flexDirection: 'row',
  gap: 12,
},
saveResultButton: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 8,
  backgroundColor: '#28a745',
  alignItems: 'center',
  justifyContent: 'center',
},
saveResultText: {
  fontSize: 14,
  color: 'white',
  fontWeight: '600',
},
tryAnotherButton: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 8,
  backgroundColor: '#17a2b8',
  alignItems: 'center',
  justifyContent: 'center',
},
tryAnotherText: {
  fontSize: 14,
  color: 'white',
  fontWeight: '600',
},

// Upload Section
uploadSection: {
  width: '100%',
  alignItems: 'center',
  marginBottom: 20,
},
uploadSubtext: {
  fontSize: 12,
  color: '#666',
  textAlign: 'center',
},

// Uploaded Image
uploadedImageContainer: {
  alignItems: 'center',
},
uploadedImage: {
  width: 200,
  height: 200,
  borderRadius: 12,
  marginBottom: 12,
  borderWidth: 2,
  borderColor: '#f0f0f0',
},
changePhotoButton: {
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 6,
  backgroundColor: '#f0f0f0',
},
changePhotoText: {
  fontSize: 14,
  color: '#333',
  fontWeight: '500',
},
processingContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
processingText: {
  fontSize: 16,
  color: 'white',
  fontWeight: '500',
},

// Result Styles
resultContainer: {
  alignItems: 'center',
  marginBottom: 20,
},
permissionStatus: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    width: '100%',
  },
  permissionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  permissionErrorText: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: '600',
    marginBottom: 4,
  },
  permissionSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default styles;
