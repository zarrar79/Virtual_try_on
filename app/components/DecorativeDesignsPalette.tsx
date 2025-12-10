import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DecorativeDesign {
    id: string;
    uri: string;
    name: string;
}

interface DecorativeDesignsPaletteProps {
    decorativeDesigns: DecorativeDesign[];
    onSelectDesign: (design: DecorativeDesign) => void;
}

const DecorativeDesignsPalette: React.FC<DecorativeDesignsPaletteProps> = ({
    decorativeDesigns,
    onSelectDesign,
}) => {
    return (
        <View style={styles.palette}>
            <Text style={styles.paletteTitle}>Decorative Designs</Text>
            <FlatList
                horizontal
                data={decorativeDesigns}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => onSelectDesign(item)}
                        style={styles.design}
                    >
                        <Image source={{ uri: item.uri }} style={styles.designImg} />
                        <Text style={styles.designLabel}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    palette: {
        height: 120,
        marginTop: 10,
        paddingLeft: 10,
        backgroundColor: "#fff",
        paddingTop: 10,
    },
    paletteTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginLeft: 10,
        marginBottom: 8,
    },
    design: {
        width: 90,
        height: 90,
        margin: 8,
        backgroundColor: "#f8f8f8",
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    designImg: {
        width: 70,
        height: 70,
        resizeMode: "contain",
    },
    designLabel: {
        fontSize: 12,
        textAlign: "center",
        marginTop: 2,
    },
});

export default DecorativeDesignsPalette;
