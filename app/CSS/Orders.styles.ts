import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  orderCard: {
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  orderId: { fontSize: 14, color: "#666", marginBottom: 4 },
  orderTotal: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  orderStatus: { fontSize: 16, fontWeight: "600", color: "#007BFF", marginBottom: 4 },
  orderDate: { fontSize: 14, color: "#999", marginBottom: 10 },
  itemsHeader: { fontSize: 16, fontWeight: "600", marginTop: 8 },
  itemRow: { marginTop: 5 },
  itemName: { fontSize: 15 },
  itemPrice: { fontSize: 14, color: "#555" },
  imageScroll: { marginTop: 8 },
  productImage: { width: 100, height: 100, marginRight: 8, borderRadius: 8 },
});
export default styles;