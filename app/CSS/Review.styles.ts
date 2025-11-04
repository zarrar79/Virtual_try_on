import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
 reviewCard: {
  backgroundColor: "#1E1E1E",
  borderRadius: 12,
  padding: 16,
  marginBottom: 15,
  width: "30%", // fits 3 per row
  minWidth: 250,
  shadowColor: "#00FFFF",
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 6,
  elevation: 3,
  color: "#FFFFFF",
},

reviewCardHover: {
  backgroundColor: "#2C2C2C",
  shadowOpacity: 0.4,
  transform: [{ scale: 1.02 }],
},

reviewTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#FFFFFF",
  marginBottom: 8,
},

reviewMeta: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 6,
},

reviewAuthor: {
  fontSize: 14,
  color: "#FFFFFF",
},

reviewRating: {
  fontSize: 14,
  fontWeight: "600",
  color: "#FFD700", // gold for stars
},

reviewComment: {
  fontSize: 15,
  color: "#EAEAEA",
  lineHeight: 20,
  marginTop: 5,
},
});

export default styles;
