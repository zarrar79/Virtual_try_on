import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PercentageControlsProps {
    selectedPart: "top" | "bottom";
    topMaskScale: number;
    bottomMaskScale: number;
    setTopMaskScale: (scale: number) => void;
    setBottomMaskScale: (scale: number) => void;
    topMaskOpacity: number;
    bottomMaskOpacity: number;
    setTopMaskOpacity: (opacity: number) => void;
    setBottomMaskOpacity: (opacity: number) => void;
    topMaskPos: { x: number; y: number };
    bottomMaskPos: { x: number; y: number };
    setTopMaskPos: (pos: { x: number; y: number }) => void;
    setBottomMaskPos: (pos: { x: number; y: number }) => void;
    MIN_SCALE: number;
    MAX_SCALE: number;
    SCALE_PRESETS: { [key: string]: number };
}

const PercentageControls: React.FC<PercentageControlsProps> = ({
    selectedPart,
    topMaskScale,
    bottomMaskScale,
    setTopMaskScale,
    setBottomMaskScale,
    topMaskOpacity,
    bottomMaskOpacity,
    setTopMaskOpacity,
    setBottomMaskOpacity,
    topMaskPos,
    bottomMaskPos,
    setTopMaskPos,
    setBottomMaskPos,
    MIN_SCALE,
    MAX_SCALE,
    SCALE_PRESETS,
}) => {
    const currentScale = selectedPart === "top" ? topMaskScale : bottomMaskScale;
    const currentOpacity = selectedPart === "top" ? topMaskOpacity : bottomMaskOpacity;
    const actualPercentage = Math.round(currentScale * 100);
    const opacityPercentage = Math.round(currentOpacity * 100);

    return (
        <View style={styles.percentageContainer}>
            {/* Header with current percentage */}
            <View style={styles.percentageHeader}>
                <Text style={styles.percentageLabel}>Size: {actualPercentage}%</Text>
                <Text style={styles.percentageValue}>Opacity: {opacityPercentage}%</Text>
            </View>

            {/* Scale Slider */}
            <View style={styles.sliderGroup}>
                <Text style={styles.sliderLabel}>Mask Size Control</Text>
                <View style={styles.sliderContainer}>
                    <TouchableOpacity
                        style={styles.sliderLimitButton}
                        onPress={() => {
                            if (selectedPart === "top") setTopMaskScale(MIN_SCALE);
                            else setBottomMaskScale(MIN_SCALE);
                        }}
                    >
                        <Text style={styles.sliderLimitText}>10%</Text>
                    </TouchableOpacity>

                    <View style={styles.sliderWrapper}>
                        <Slider
                            style={styles.slider}
                            minimumValue={MIN_SCALE}
                            maximumValue={MAX_SCALE}
                            step={0.01}
                            value={currentScale}
                            onValueChange={(value) => {
                                if (selectedPart === "top") setTopMaskScale(value);
                                else setBottomMaskScale(value);
                            }}
                            minimumTrackTintColor="#4a90e2"
                            maximumTrackTintColor="#d3d3d3"
                            thumbTintColor="#4a90e2"
                        />
                        <Text style={styles.currentScaleText}>{actualPercentage}%</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.sliderLimitButton}
                        onPress={() => {
                            if (selectedPart === "top") setTopMaskScale(MAX_SCALE);
                            else setBottomMaskScale(MAX_SCALE);
                        }}
                    >
                        <Text style={styles.sliderLimitText}>500%</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Opacity Slider */}
            <View style={styles.sliderGroup}>
                <Text style={styles.sliderLabel}>Pattern Opacity</Text>
                <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLimitText}>0%</Text>
                    <View style={styles.sliderWrapper}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={1}
                            step={0.01}
                            value={currentOpacity}
                            onValueChange={(value) => {
                                if (selectedPart === "top") setTopMaskOpacity(value);
                                else setBottomMaskOpacity(value);
                            }}
                            minimumTrackTintColor="#ff6b6b"
                            maximumTrackTintColor="#d3d3d3"
                            thumbTintColor="#ff6b6b"
                        />
                        <Text style={styles.currentScaleText}>{opacityPercentage}%</Text>
                    </View>
                    <Text style={styles.sliderLimitText}>100%</Text>
                </View>
            </View>

            {/* Precision Zoom Controls */}
            <View style={styles.precisionControls}>
                <Text style={styles.precisionLabel}>Precision Zoom (±1%)</Text>
                <View style={styles.precisionButtons}>
                    <TouchableOpacity
                        style={[styles.precisionButton, styles.decreaseButton]}
                        onPress={() => {
                            if (selectedPart === "top") {
                                setTopMaskScale(Math.max(MIN_SCALE, topMaskScale - 0.01));
                            } else {
                                setBottomMaskScale(Math.max(MIN_SCALE, bottomMaskScale - 0.01));
                            }
                        }}
                    >
                        <Text style={styles.precisionButtonText}>-1%</Text>
                    </TouchableOpacity>

                    <View style={styles.percentageDisplay}>
                        <Text style={styles.currentPercentage}>{actualPercentage}%</Text>
                        <Text style={styles.currentLabel}>Current Size</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.precisionButton, styles.increaseButton]}
                        onPress={() => {
                            if (selectedPart === "top") {
                                setTopMaskScale(Math.min(MAX_SCALE, topMaskScale + 0.01));
                            } else {
                                setBottomMaskScale(Math.min(MAX_SCALE, bottomMaskScale + 0.01));
                            }
                        }}
                    >
                        <Text style={styles.precisionButtonText}>+1%</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Quick Presets */}
            <View style={styles.quickPresetsContainer}>
                <Text style={styles.presetsLabel}>Quick Size Presets:</Text>
                <View style={styles.presetButtons}>
                    {Object.entries(SCALE_PRESETS).map(([key, value]) => {
                        const presetPercentage = Math.round(value * 100);
                        const isActive = Math.abs(currentScale - value) < 0.01;

                        return (
                            <TouchableOpacity
                                key={key}
                                style={[
                                    styles.presetButton,
                                    isActive && styles.presetButtonActive,
                                ]}
                                onPress={() => {
                                    if (selectedPart === "top") setTopMaskScale(value);
                                    else setBottomMaskScale(value);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.presetButtonText,
                                        isActive && styles.presetButtonTextActive,
                                    ]}
                                >
                                    {key === "MIN"
                                        ? "10%"
                                        : key === "MAX"
                                            ? "500%"
                                            : `${presetPercentage}%`}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Reset Buttons */}
            <View style={styles.resetButtons}>
                <TouchableOpacity
                    style={[styles.resetButton, styles.resetSizeButton]}
                    onPress={() => {
                        if (selectedPart === "top") setTopMaskScale(1);
                        else setBottomMaskScale(1);
                    }}
                >
                    <Text style={styles.resetButtonText}>Reset Size to 100%</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.resetButton, styles.resetPositionButton]}
                    onPress={() => {
                        if (selectedPart === "top") {
                            setTopMaskPos({ x: 0, y: 0 });
                            setTopMaskScale(1);
                        } else {
                            setBottomMaskPos({ x: 0, y: 0 });
                            setBottomMaskScale(1);
                        }
                    }}
                >
                    <Text style={styles.resetButtonText}>Reset Position & Size</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    percentageContainer: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 8,
        padding: 15,
        marginTop: 10,
        elevation: 2,
    },
    percentageHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    percentageLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    percentageValue: {
        fontSize: 14,
        fontWeight: "500",
        color: "#ff6b6b",
    },
    sliderGroup: {
        marginBottom: 20,
    },
    sliderLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        marginBottom: 8,
    },
    sliderContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    sliderWrapper: {
        flex: 1,
        alignItems: "center",
    },
    slider: {
        width: "100%",
        height: 40,
    },
    currentScaleText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#4a90e2",
        marginTop: 5,
    },
    sliderLimitButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
    },
    sliderLimitText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666",
    },
    precisionControls: {
        marginBottom: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    precisionLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        marginBottom: 12,
        textAlign: "center",
    },
    precisionButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    precisionButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 80,
        alignItems: "center",
    },
    decreaseButton: {
        backgroundColor: "#ffebee",
    },
    increaseButton: {
        backgroundColor: "#e8f5e9",
    },
    precisionButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#333",
    },
    percentageDisplay: {
        alignItems: "center",
        paddingHorizontal: 20,
    },
    currentPercentage: {
        fontSize: 24,
        fontWeight: "700",
        color: "#4a90e2",
    },
    currentLabel: {
        fontSize: 11,
        color: "#999",
        marginTop: 4,
    },
    quickPresetsContainer: {
        marginBottom: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    presetsLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        marginBottom: 12,
    },
    presetButtons: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    presetButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginBottom: 8,
        backgroundColor: "#f5f5f5",
        minWidth: "22%",
        alignItems: "center",
    },
    presetButtonActive: {
        backgroundColor: "#4a90e2",
    },
    presetButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666",
    },
    presetButtonTextActive: {
        color: "#fff",
    },
    resetButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    resetButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    resetSizeButton: {
        backgroundColor: "#fff3e0",
        marginRight: 8,
    },
    resetPositionButton: {
        backgroundColor: "#e3f2fd",
        marginLeft: 8,
    },
    resetButtonText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#333",
    },
});

export default PercentageControls;
