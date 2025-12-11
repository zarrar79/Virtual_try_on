// Home.js
import Slider from "@react-native-community/slider";
import MaskedView from "@react-native-masked-view/masked-view";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    GestureHandlerRootView,
    PanGestureHandler,
    State,
} from "react-native-gesture-handler";
import ViewShot from "react-native-view-shot";
import OrderPlacement from "../components/OrderPlacement";
import { useApi } from "../context/ApiContext";
import { placeCODOrder } from "../utils/orderHelpers";
import MovableDesign from "./MovableDesign";

const { width: SCREEN_W } = Dimensions.get("window");

interface DesignInstance {
    id: string;
    designSrc: any;
    x: number;
    y: number;
    scale: number;
    rotation: number;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    brand: string;
    quantity: number;
    category: string;
    fabric?: string;  // top-level attribute
    pattern?: string; // top-level attribute
    designs?: any[];
    sizes?: any[];
}

export default function Home() {
    const viewShotRef = useRef();
    const BASE_URL = useApi();
    const canvasW = SCREEN_W - 40;
    const canvasH = SCREEN_W - 40;

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [topFabricUri, setTopFabricUri] = useState<string | null>(null);
    const [bottomFabricUri, setBottomFabricUri] = useState<string | null>(null);
    const [topMaskDesignSrc, setTopMaskDesignSrc] = useState<string | null>(null);
    const [bottomMaskDesignSrc, setBottomMaskDesignSrc] = useState<string | null>(null);

    const [selectedPart, setSelectedPart] = useState<"top" | "bottom">("top");
    const [topMaskPos, setTopMaskPos] = useState({ x: 0, y: 0 });
    const [topMaskScale, setTopMaskScale] = useState(1);
    const [topMaskOpacity, setTopMaskOpacity] = useState(1.0);
    const [bottomMaskPos, setBottomMaskPos] = useState({ x: 0, y: 0 });
    const [bottomMaskScale, setBottomMaskScale] = useState(1);
    const [bottomMaskOpacity, setBottomMaskOpacity] = useState(1.0);

    const [topPlaced, setTopPlaced] = useState<DesignInstance[]>([]);
    const [bottomPlaced, setBottomPlaced] = useState<DesignInstance[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const MIN_SCALE = 0.1;
    const MAX_SCALE = 5.0;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${BASE_URL}/products`);
                const data: Product[] = await res.json();
                setProducts(data);

                if (data.length > 0) {
                    setSelectedProduct(data[0]);
                    setTopFabricUri(data[0].fabric ? `${BASE_URL}${data[0].fabric}` : null);
                    setTopMaskDesignSrc(data[0].pattern ? `${BASE_URL}${data[0].pattern}` : null);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, [BASE_URL]);

    const applyFabric = (fabricUrl: string | null) => {
        if (selectedPart === "top") setTopFabricUri(fabricUrl);
        else setBottomFabricUri(fabricUrl);
    };

    const applyPattern = (patternUrl: string | null) => {
        if (selectedPart === "top") setTopMaskDesignSrc(patternUrl);
        else setBottomMaskDesignSrc(patternUrl);
    };

    const clearMaskDesign = () => {
        if (selectedPart === "top") {
            setTopMaskDesignSrc(null);
            setTopMaskOpacity(1.0);
        } else {
            setBottomMaskDesignSrc(null);
            setBottomMaskOpacity(1.0);
        }
    };

    const addDesign = (design) => {
        const instance: DesignInstance = {
            id: `${design.id}_${Date.now()}`,
            designSrc: design.src,
            x: canvasW / 4,
            y: canvasH / 4,
            scale: 1,
            rotation: 0,
        };
        if (selectedPart === "top") setTopPlaced((p) => [...p, instance]);
        else setBottomPlaced((p) => [...p, instance]);
        setSelectedId(instance.id);
    };

    const DraggableMask = useCallback(
        ({
            maskSource,
            fabricUri,
            maskDesignSrc,
            opacity,
            pos,
            setPos,
            scale,
            designsArray,
            setDesignsArray,
        }) => {
            const offset = useRef({ x: pos.x, y: pos.y });
            const disableMaskMove = selectedId && designsArray.some((d) => d.id === selectedId);

            const onGestureEvent = (event) => {
                if (disableMaskMove) return;
                const { translationX = 0, translationY = 0 } = event.nativeEvent;
                setPos({
                    x: offset.current.x + translationX,
                    y: offset.current.y + translationY,
                });
            };

            const onHandlerStateChange = (event) => {
                const { state } = event.nativeEvent;
                if (state === State.END || state === State.CANCELLED) offset.current = { x: pos.x, y: pos.y };
                if (state === State.BEGAN) offset.current = { x: pos.x, y: pos.y };
            };

            return (
                <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
                    <View
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: canvasW,
                            height: canvasH,
                            transform: [{ translateX: pos.x }, { translateY: pos.y }, { scale: scale }],
                        }}
                    >
                        <MaskedView
                            style={{ flex: 1 }}
                            maskElement={<Image source={maskSource} style={{ width: "100%", height: "100%" }} resizeMode="contain" />}
                        >
                            <Image
                                source={fabricUri ? { uri: fabricUri } : require("../../assets/images/p1.jpg")}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="cover"
                            />

                            {maskDesignSrc && (
                                <Image
                                    source={typeof maskDesignSrc === "string" ? { uri: maskDesignSrc } : maskDesignSrc}
                                    style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        opacity: opacity,
                                        resizeMode: "repeat",
                                    }}
                                />
                            )}

                            {designsArray.map((it) => (
                                <MovableDesign
                                    key={it.id}
                                    item={it}
                                    selected={selectedId === it.id}
                                    canvasSize={{ width: canvasW, height: canvasH }}
                                    onUpdate={(changes) =>
                                        setDesignsArray((prev) => prev.map((d) => (d.id === it.id ? { ...d, ...changes } : d)))
                                    }
                                    onDelete={() => setDesignsArray((prev) => prev.filter((d) => d.id !== it.id))}
                                    onSelect={() => setSelectedId(it.id)}
                                    onDeselect={() => setSelectedId(null)}
                                />
                            ))}
                        </MaskedView>
                    </View>
                </PanGestureHandler>
            );
        },
        [canvasW, canvasH, selectedId]
    );

    // Resize / opacity controls
    const renderResizeButtons = () => (
        <View style={styles.resizeButtons}>
            <TouchableOpacity
                onPress={() => {
                    if (selectedPart === "top") setTopMaskScale(Math.max(MIN_SCALE, topMaskScale - 0.01));
                    else setBottomMaskScale(Math.max(MIN_SCALE, bottomMaskScale - 0.01));
                }}
                style={styles.resizeBtn}
            >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>-1%</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    if (selectedPart === "top") setTopMaskScale(Math.min(MAX_SCALE, topMaskScale + 0.01));
                    else setBottomMaskScale(Math.min(MAX_SCALE, bottomMaskScale + 0.01));
                }}
                style={styles.resizeBtn}
            >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>+1%</Text>
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
                <Text style={{ fontSize: 14, fontWeight: "600" }}>Reset</Text>
            </TouchableOpacity>
        </View>
    );

    const renderPercentageControls = () => {
        const currentScale = selectedPart === "top" ? topMaskScale : bottomMaskScale;
        const currentOpacity = selectedPart === "top" ? topMaskOpacity : bottomMaskOpacity;
        const actualPercentage = Math.round(currentScale * 100);
        const opacityPercentage = Math.round(currentOpacity * 100);

        return (
            <View style={styles.percentageContainer}>
                <View style={styles.percentageHeader}>
                    <Text style={styles.percentageLabel}>Size: {actualPercentage}%</Text>
                    <Text style={styles.percentageValue}>Opacity: {opacityPercentage}%</Text>
                </View>

                <View style={styles.sliderGroup}>
                    <Text style={styles.sliderLabel}>Mask Size Control</Text>
                    <View style={styles.sliderContainer}>
                        <TouchableOpacity
                            style={styles.sliderLimitButton}
                            onPress={() => (selectedPart === "top" ? setTopMaskScale(MIN_SCALE) : setBottomMaskScale(MIN_SCALE))}
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
                                onValueChange={(value) =>
                                    selectedPart === "top" ? setTopMaskScale(value) : setBottomMaskScale(value)
                                }
                                minimumTrackTintColor="#4a90e2"
                                maximumTrackTintColor="#d3d3d3"
                                thumbTintColor="#4a90e2"
                            />
                            <Text style={styles.currentScaleText}>{actualPercentage}%</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.sliderLimitButton}
                            onPress={() => (selectedPart === "top" ? setTopMaskScale(MAX_SCALE) : setBottomMaskScale(MAX_SCALE))}
                        >
                            <Text style={styles.sliderLimitText}>500%</Text>
                        </TouchableOpacity>
                    </View>
                </View>

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
                                onValueChange={(value) =>
                                    selectedPart === "top" ? setTopMaskOpacity(value) : setBottomMaskOpacity(value)
                                }
                                minimumTrackTintColor="#ff6b6b"
                                maximumTrackTintColor="#d3d3d3"
                                thumbTintColor="#ff6b6b"
                            />
                            <Text style={styles.currentScaleText}>{opacityPercentage}%</Text>
                        </View>
                        <Text style={styles.sliderLimitText}>100%</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.topbar}>
                <TouchableOpacity
                    style={[styles.btn, selectedPart === "top" && { backgroundColor: "#cce5ff" }]}
                    onPress={() => setSelectedPart("top")}
                >
                    <Text>👕 Top</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.btn, selectedPart === "bottom" && { backgroundColor: "#cce5ff" }]}
                    onPress={() => setSelectedPart("bottom")}
                >
                    <Text>👖 Bottom</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={clearMaskDesign}>
                    <Text>🗑️ Clear Pattern</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
                <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.95 }}>
                    <View style={styles.canvasWrap}>
                        <Image
                            source={require("../../assets/images/model.png")}
                            style={{ width: canvasW, height: canvasH }}
                            resizeMode="contain"
                        />

                        <DraggableMask
                            maskSource={require("../../assets/images/topMask.png")}
                            fabricUri={topFabricUri}
                            maskDesignSrc={topMaskDesignSrc}
                            opacity={topMaskOpacity}
                            pos={topMaskPos}
                            setPos={setTopMaskPos}
                            scale={topMaskScale}
                            designsArray={topPlaced}
                            setDesignsArray={setTopPlaced}
                        />

                        <DraggableMask
                            maskSource={require("../../assets/images/bottomMask.png")}
                            fabricUri={bottomFabricUri}
                            maskDesignSrc={bottomMaskDesignSrc}
                            opacity={bottomMaskOpacity}
                            pos={bottomMaskPos}
                            setPos={setBottomMaskPos}
                            scale={bottomMaskScale}
                            designsArray={bottomPlaced}
                            setDesignsArray={setBottomPlaced}
                        />

                        {renderResizeButtons()}
                    </View>
                </ViewShot>

                {renderPercentageControls()}

                {/* Fabrics */}
                <View style={styles.patternsContainer}>
                    <Text style={styles.patternsTitle}>Fabrics</Text>
                    <FlatList
                        horizontal
                        data={products.filter((p) => p.fabric)}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => {
                            const fabricUrl = `${BASE_URL}${item.fabric}`;
                            const isActive = topFabricUri === fabricUrl || bottomFabricUri === fabricUrl;
                            return (
                                <TouchableOpacity
                                    style={[styles.patternItem, isActive && styles.patternItemActive]}
                                    onPress={() => applyFabric(fabricUrl)}
                                >
                                    <Image source={{ uri: fabricUrl }} style={styles.patternImage} />
                                    <Text style={styles.patternLabel}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

                {/* Patterns */}
                <View style={styles.patternsContainer}>
                    <Text style={styles.patternsTitle}>Patterns</Text>
                    <FlatList
                        horizontal
                        data={products.filter((p) => p.pattern)}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => {
                            const patternUrl = `${BASE_URL}${item.pattern}`;
                            const isActive = topMaskDesignSrc === patternUrl || bottomMaskDesignSrc === patternUrl;
                            return (
                                <TouchableOpacity
                                    style={[styles.patternItem, isActive && styles.patternItemActive]}
                                    onPress={() => applyPattern(patternUrl)}
                                >
                                    <Image source={{ uri: patternUrl }} style={styles.patternImage} />
                                    <Text style={styles.patternLabel}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

                <OrderPlacement
                    BASE_URL={BASE_URL}
                    price={selectedProduct?.price || 0}
                    selectedDesigns={[
                        // flatten topPlaced + bottomPlaced
                        ...topPlaced.map((d) => ({ id: d.id, designSrc: d.designSrc, quantity: 1 })),
                        ...bottomPlaced.map((d) => ({ id: d.id, designSrc: d.designSrc, quantity: 1 })),
                    ]}
                    productName={selectedProduct?.name || ""}
                    onPlaceOrder={(size) =>
                        placeCODOrder({
                            BASE_URL,
                            price: selectedProduct?.price || 0,
                            selectedDesigns: [
                                ...topPlaced.map((d) => ({ id: d.id, designSrc: d.designSrc, quantity: 1 })),
                                ...bottomPlaced.map((d) => ({ id: d.id, designSrc: d.designSrc, quantity: 1 })),
                            ],
                            productName: selectedProduct?.name || "",
                            size,
                            onSuccess: () => {
                                // Reset placed designs after order
                                setTopPlaced([]);
                                setBottomPlaced([]);
                            },
                        })
                    }
                />
            </ScrollView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    topbar: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, marginBottom: 10 },
    btn: { padding: 10, backgroundColor: "#fff", borderRadius: 6, elevation: 2, margin: 4 },
    canvasWrap: { width: SCREEN_W - 40, height: SCREEN_W - 40, alignSelf: "center", backgroundColor: "#ddd", borderRadius: 6, overflow: "hidden", marginBottom: 10 },
    resizeButtons: { position: "absolute", right: 10, top: 10, flexDirection: "column", gap: 12, backgroundColor: "#fff", padding: 8, borderRadius: 8, elevation: 3, alignItems: "center" },
    resizeBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#f0f0f0", borderRadius: 4, marginHorizontal: 4 },
    percentageContainer: { marginVertical: 10 },
    percentageHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, paddingHorizontal: 10 },
    percentageLabel: { fontWeight: "600" },
    percentageValue: { fontWeight: "600" },
    sliderGroup: { marginVertical: 6 },
    sliderLabel: { fontWeight: "600", marginBottom: 4, paddingHorizontal: 10 },
    sliderContainer: { flexDirection: "row", alignItems: "center" },
    sliderWrapper: { flex: 1, paddingHorizontal: 8 },
    slider: { width: "100%" },
    sliderLimitButton: { paddingHorizontal: 6 },
    sliderLimitText: { fontSize: 12, fontWeight: "500" },
    currentScaleText: { position: "absolute", right: 0, top: -20, fontSize: 12, fontWeight: "500" },
    patternsContainer: { backgroundColor: "#fff", padding: 10, marginVertical: 10 },
    patternsTitle: { fontWeight: "600", fontSize: 18, marginBottom: 6 },
    patternItem: { padding: 8, marginRight: 10, borderRadius: 6, backgroundColor: "#f0f0f0", alignItems: "center" },
    patternItemActive: { borderWidth: 2, borderColor: "#4a90e2" },
    patternImage: { width: 60, height: 60, resizeMode: "contain", marginBottom: 4 },
    patternLabel: { fontSize: 12, textAlign: "center" },
});
