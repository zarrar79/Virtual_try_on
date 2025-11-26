import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderCard: {
    backgroundColor: "#1E1E1E", // dark gray for contrast on black background
    borderRadius: 12,
    padding: 16,
    shadowColor: "#00FFFF",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 6,
    width: "30%",
    minWidth: 250,
    alignSelf: "flex-start",
    marginTop: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#00FFFF", // bright cyan that stands out on black/dark background
  },

  userText: {
    fontSize: 14,
    color: "white",
    marginBottom: 4,
  },

  totalText: {
    fontSize: 14,
    color: "white",
    marginBottom: 8,
  },

  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#E0E0E0", // light gray for good contrast on dark background
  },

  statusPicker: {
    backgroundColor: "#1E1E1E", // match card tone
    borderRadius: 8,
    color: "white",
    marginTop: 4,
    paddingHorizontal: 8,
    height: 40,
    borderWidth: 2,
    borderColor: "#00FFFF33", // subtle cyan border
  },

  picker: {
    backgroundColor: "#2B2B2B", // darker gray for dropdown box
    color: "#FFFFFF",
    borderRadius: 10,
    marginTop: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: "#00FFFF",
  },

  orderCardHover: {
    transform: [{ scale: 1.03 }],
    shadowColor: "#00ffff",
    shadowOpacity: 0.6,
  },

  pickerHover: {
    borderColor: "#ffffff",
    backgroundColor: "#3a3a3a",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  filterButton: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#222",
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 15,
    fontSize: 16,
    width: 12,
  },
  itemName: {
  color: "#fff",
  fontSize: 18,
  marginBottom: 4,
},
modalBackground: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#141212",
    borderRadius: 10,
    padding: 20,
    marginLeft: "auto",
    marginRight: "auto",
    width: "auto",
    maxHeight: "auto",
    display: "flex",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },

  activeFilterButton: {
    backgroundColor: "#0db760",
  },

  filterText: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "500",
  },

  activeFilterText: {
    color: "#fff",
    fontWeight: "bold",
  },
horizontalScroll: {
  flexGrow: 0,
},
itemsRow: {
  flexDirection: 'row',
  paddingVertical: 10,
},
productCard: {
  backgroundColor: '#141212',
  borderRadius: 8,
  padding: 12,
  marginRight: 12,
  minWidth: 200,
  borderWidth: 1,
  borderColor: '#e9ecef',
},
itemDetail: {
  fontSize: 12,
  color: '#141212',
  backgroundColor: '#141212',
  marginBottom: 4,
},
imagesColumn: {
  marginTop: 8,
},
productImage: {
  width: 120,
  height: 120,
  borderRadius: 6,
  marginBottom: 6,
},
closeButton: {
  marginTop: 15,
  backgroundColor: '#FF6347',
  padding: 12,
  borderRadius: 6,
  alignSelf: 'center',
  width: '100%',
  alignItems: 'center',
},
closeButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
orderSummary: {
  backgroundColor: '#e8f5e8',
  padding: 12,
  borderRadius: 8,
  marginBottom: 15,
},
summaryText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#2d5016',
  marginBottom: 4,
},
designInfo: {
  backgroundColor: '#141212',
  padding: 8,
  // borderRadius: 6,
  marginBottom: 8,
  // borderWidth: 1,
  // borderColor: '#ddd',
},
designText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#007AFF',
  marginBottom: 4,
},
quantityText: {
  fontSize: 14,
  fontWeight: '500',
  color: '#fff',
  marginBottom: 4,
},
priceText: {
  fontSize: 13,
  fontWeight: '500',
  color: '#27ae60',
},
});
export default styles;
