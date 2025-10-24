import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: "#db3022",
    fontWeight: "bold",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
  },
  addToCartBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  addToWishlistBtn: {
    backgroundColor: "#db3022",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  addToWishlistText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default styles;