import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ResizeButtonsProps {
    selectedPart: "top" | "bottom";
    topMaskScale: number;
    bottomMaskScale: number;
    setTopMaskScale: (scale: number) => void;
    setBottomMaskScale: (scale: number) => void;
    topMaskPos: { x: number; y: number };
    bottomMaskPos: { x: number; y: number };
    setTopMaskPos: (pos: { x: number; y: number }) => void;
    setBottomMaskPos: (pos: { x: number; y: number }) => void;
    topMaskDesignUri: string | null;
    bottomMaskDesignUri: string | null;
    MIN_SCALE: number;
    MAX_SCALE: number;
}

const ResizeButtons: React.FC<ResizeButtonsProps> = ({
    selectedPart,
    topMaskScale,
    bottomMaskScale,
    setTopMaskScale,
    setBottomMaskScale,
    topMaskPos,
    bottomMaskPos,
    setTopMaskPos,
    setBottomMaskPos,
    topMaskDesignUri,
    bottomMaskDesignUri,
    MIN_SCALE,
    MAX_SCALE,
}) => {
    // Check if pattern is applied to the current mask
    const hasPattern = selectedPart === "top" ? topMaskDesignUri : bottomMaskDesignUri;

    if (hasPattern) {
        // Show a message instead of resize buttons when pattern is applied
        return (
            <View style={styles.resizeButtons}>
                <Text style={styles.messageText}>
                    Clear pattern to resize mask
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.resizeButtons}>
            <TouchableOpacity
                onPress={() => {
                    if (selectedPart === "top")
                        setTopMaskScale(Math.max(MIN_SCALE, topMaskScale - 0.01));
                    else
                        setBottomMaskScale(Math.max(MIN_SCALE, bottomMaskScale - 0.01));
                }}
                style={styles.resizeBtn}
            >
                <Text style={styles.buttonText}>-1%</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    if (selectedPart === "top")
                        setTopMaskScale(Math.min(MAX_SCALE, topMaskScale + 0.01));
                    else
                        setBottomMaskScale(Math.min(MAX_SCALE, bottomMaskScale + 0.01));
                }}
                style={styles.resizeBtn}
            >
                <Text style={styles.buttonText}>+1%</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    if (selectedPart === "top") {
                        setTopMaskPos({ x: 0, y: 0 });
                        setTopMaskScale(1);
                    } else {
                        setBottomMaskPos({ x: 0, y: 0 });
                        setBottomMaskScale(1);
                    }
                }}
                style={[styles.resizeBtn, { marginLeft: 10 }]}
            >
                <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    resizeButtons: {
        position: "absolute",
        right: 10,
        top: 10,
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 8,
        elevation: 3,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    resizeBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "#f0f0f0",
        borderRadius: 4,
        marginHorizontal: 4,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    resetText: {
        fontSize: 14,
        fontWeight: "600",
    },
    messageText: {
        fontSize: 12,
        color: "#666",
        fontWeight: "600",
    },
});

export default ResizeButtons;
