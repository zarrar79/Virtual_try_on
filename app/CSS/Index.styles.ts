import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 24,
    paddingTop: 50,
    backgroundColor: "#000",
    minHeight: "100%",
  },
  welcomeTitle: {
    fontSize: 32,
    color: "#22c55e",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 28,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 28,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 6,
    borderRadius: 10,
    backgroundColor: "#1f1f1f",
  },
  tabButtonActive: {
    backgroundColor: "#16a34a",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#10B981",
  },
  welcomeText: {
    color: "#D1D5DB",
    fontSize: 13,
  },
  nameText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  reviewCard: {
    backgroundColor: "#1f1f1f",
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
  },
  reviewText: {
    color: "#fff",
    marginBottom: 4,
  },
});

export default styles;