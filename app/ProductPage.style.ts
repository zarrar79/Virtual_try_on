import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Adjust for screen width (3 per row on desktop, 2 on tablet, 1 on phone)
let NUM_COLUMNS = 3;
if (SCREEN_WIDTH < 1024) NUM_COLUMNS = 2;
if (SCREEN_WIDTH < 640) NUM_COLUMNS = 1;

const CARD_MARGIN = 12;
const TOTAL_MARGIN = CARD_MARGIN * (NUM_COLUMNS + 1);
const CARD_WIDTH = (SCREEN_WIDTH - TOTAL_MARGIN) / NUM_COLUMNS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
    minHeight: "100vh",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#22c55e",
  },
  manageBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  manageBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    marginHorizontal: CARD_MARGIN / 2,
    marginBottom: CARD_MARGIN * 2,
    overflow: "hidden",
    maxWidth: 230,
  },
  productImage: {
    width: "100%",
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#22c55e",
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: "#D1D5DB",
    marginBottom: 6,
  },
  productDesc: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
    height: 40,
    overflow: "hidden",
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#22c55e",
  },
  productQty: {
    fontSize: 13,
    color: "#D1D5DB",
  },
  productCategory: {
    fontSize: 12,
    color: "#16a34a",
    borderWidth: 1,
    borderColor: "#16a34a",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  loaderText: {
    color: "#22c55e",
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  noProducts: {
    textAlign: "center",
    color: "#D1D5DB",
    fontSize: 16,
    marginTop: 20,
  },
});

export default styles;
