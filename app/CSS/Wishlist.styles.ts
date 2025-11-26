import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#fff",
    },
    image: {
        width: "100%",
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
    },
    price: {
        fontSize: 16,
        marginVertical: 4,
    },
    cartBtn: {
        backgroundColor: "#007bff",
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 8,
        alignItems: "center",
    },
    cartBtnText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    removeBtn: {
        backgroundColor: "#411900",
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 8,
        alignItems: "center",
    },
    removeBtnText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
});
export default styles;