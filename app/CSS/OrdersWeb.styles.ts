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
    shadowColor: "#00FFFF", // subtle cyan glow
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 6,
    width: "30%", // 👈 fits 3 per row with space-between
    minWidth: 250,
    alignSelf: "flex-start",
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
});
export default styles;
