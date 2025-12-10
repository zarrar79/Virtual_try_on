import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MaskDesign {
    id: string;
    uri: string;
    name: string;
    type?: string;
}

interface PatternsPaletteProps {
    maskDesigns: MaskDesign[];
    selectedPart: "top" | "bottom";
    topMaskDesignUri: string | null;
    bottomMaskDesignUri: string | null;
    onSelectPattern: (design: MaskDesign) => void;
}

const PatternsPalette: React.FC<PatternsPaletteProps> = ({
    maskDesigns,
    selectedPart,
    topMaskDesignUri,
    bottomMaskDesignUri,
    onSelectPattern,
}) => {
    return (
        <View style={styles.patternsContainer}>
            <Text style={styles.patternsTitle}>Mask Patterns (For {selectedPart})</Text>
            <FlatList
                horizontal
                data={maskDesigns}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => onSelectPattern(item)}
                        style={[
                            styles.patternItem,
                            ((selectedPart === "top" && topMaskDesignUri === item.uri) ||
                                (selectedPart === "bottom" && bottomMaskDesignUri === item.uri)) &&
                            styles.patternItemActive,
                        ]}
                    >
                        <Image source={{ uri: item.uri }} style={styles.patternImage} />
                        <Text style={styles.patternLabel}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    patternsContainer: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 8,
        padding: 12,
        marginTop: 10,
        elevation: 2,
    },
    patternsTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 10,
    },
    patternItem: {
        width: 80,
        height: 80,
        margin: 6,
        backgroundColor: "#f8f8f8",
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    patternItemActive: {
        borderColor: "#4a90e2",
        backgroundColor: "#e8f0fe",
    },
    patternImage: {
        width: 60,
        height: 60,
        resizeMode: "contain",
    },
    patternLabel: {
        fontSize: 10,
        textAlign: "center",
        marginTop: 4,
        color: "#666",
    },
});

export default PatternsPalette;
