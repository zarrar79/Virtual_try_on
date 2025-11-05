import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1f1f1f",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        width: "45%",
        marginTop: 25,
        marginLeft: "auto",
        marginRight: "auto",
    },
    title: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    inputWrapper: {
        marginBottom: 12,
    },
    label: {
        color: "#D1D5DB", // gray-300
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
    },
    input: {
        backgroundColor: "#27272a",
        color: "#ffffff",
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 15,
        borderColor: "#10B981",
    },
    description: {
        height: 80,
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: "#10B981",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },
    submitButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 12,
        alignItems: "center",
    },
    cancelText: {
        color: "#f87171",
        fontSize: 14,
    },
});

export default styles;