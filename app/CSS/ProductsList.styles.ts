import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: "#101010",
  },
  gridContainer: {
    justifyContent: "space-between",
    paddingBottom: 50,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  productImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    flex: 1,
    paddingRight: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  productDetails: {
    color: "#ccc",
    fontSize: 14,
  },
  productDescription: {
    color: "#aaa",
    fontSize: 12,
  },
  actionButtons: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  editButton: {
    color: "#4da6ff",
    fontWeight: "600",
    marginBottom: 8,
  },
  deleteButton: {
    color: "#ff4d4d",
    fontWeight: "600",
  },
});

export default styles;
