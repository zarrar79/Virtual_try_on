import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#f5f5f5",
  },

  cartOption: {
  fontSize: 14,
  color: "#444",
  marginTop: 2,
},


  // ✅ Checkout Button in Header
  checkoutBtn: {
    // backgroundColor: "#db3022",
    // backgroundColor: "#808000",
    backgroundColor: "#411900",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  checkoutText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },

  // ✅ Payment Method Toggle
  paymentRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  optionActive: {
    backgroundColor: "#411900",
    // borderColor: "#db3022",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  optionTextActive: {
    color: "#fff",
  },

  // ✅ Cart Styles
  cartCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cartImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  cartDetails: {
    flex: 1,
  },
  cartName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cartPrice: {
    fontSize: 15,
    color: "#db3022",
    fontWeight: "600",
    marginBottom: 2,
  },
  cartQty: {
    fontSize: 14,
    color: "#666",
  },

  // Delete button
  deleteBtn: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    fontSize: 14,
    color: "red",
  },

  emptyText: {
    padding: 24,
    textAlign: "center",
    color: "#666",
  },
});
export default styles;