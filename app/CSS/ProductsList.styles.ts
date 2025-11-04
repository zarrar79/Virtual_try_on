import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginVertical: 10,
    textAlign: "center",
  },
  gridContainer: {
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: "flex-start", // ✅ keeps alignment neat
    marginBottom: 20,
    gap: 3,
  },
  productCard: {
    backgroundColor: "#b1bfd3",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 280,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 14,
    color: "#555",
  },
  productQuantity: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  productDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#3498db",
    color: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontWeight: "500",
    overflow: "hidden",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontWeight: "500",
    overflow: "hidden",
  },
});
