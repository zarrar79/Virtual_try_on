import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#1f1f1f" },
  name: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  imageWrapper: { width: "100%", height: 250, borderRadius: 12, overflow: "hidden", marginBottom: 8 },
  image: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, opacity: 0.4 },
  brand: { color: "#ccc", fontSize: 16, marginBottom: 4 },
  price: { color: "#4da6ff", fontSize: 18, marginBottom: 8 },
  description: { color: "#aaa", fontSize: 14, marginBottom: 12 },
  label: { color: "#fff", marginBottom: 8, fontSize: 16 },
  sizeContainer: { flexDirection: "row", flexWrap: "wrap" },
  sizeButton: { borderWidth: 1, borderColor: "#ccc", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginRight: 8, marginBottom: 8 },
  selectedSizeButton: { backgroundColor: "#4da6ff", borderColor: "#4da6ff" },
  sizeButtonText: { color: "#fff" },
  selectedSizeButtonText: { color: "#fff", fontWeight: "bold" },
  colorContainer: { flexDirection: "row", flexWrap: "wrap" },
  colorSwatch: { width: 36, height: 36, borderRadius: 18, marginRight: 12, marginBottom: 12, borderWidth: 2, borderColor: "#fff" },
  selectedColorSwatch: { borderColor: "#4da6ff", borderWidth: 3 },
  selectedNoneColor: { borderColor: "#4da6ff", borderWidth: 3, backgroundColor: "#1f1f1f" },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  qtyBtn: { padding: 8, backgroundColor: "#333", borderRadius: 6 },
  qtyBtnText: { color: "#fff", fontSize: 18 },
  qtyText: { color: "#fff", marginHorizontal: 16, fontSize: 16 },
  confirmBtn: { backgroundColor: "#4da6ff", padding: 12, borderRadius: 8, alignItems: "center" },
  confirmBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#fff", fontSize: 18 },
});

export default styles;