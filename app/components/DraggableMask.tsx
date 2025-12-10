import MaskedView from "@react-native-masked-view/masked-view";
import React, { useRef } from "react";
import { Image, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import MovableDesign from "../root_home/MovableDesign";

interface DraggableMaskProps {
    maskSource: any;
    fabricUri: string | null;
    maskDesignUri: string | null;
    opacity: number;
    pos: { x: number; y: number };
    setPos: (pos: { x: number; y: number }) => void;
    scale: number;
    designsArray: any[];
    setDesignsArray: (designs: any[] | ((prev: any[]) => any[])) => void;
    canvasW: number;
    canvasH: number;
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
}

const DraggableMask: React.FC<DraggableMaskProps> = ({
    maskSource,
    fabricUri,
    maskDesignUri,
    opacity,
    pos,
    setPos,
    scale,
    designsArray,
    setDesignsArray,
    canvasW,
    canvasH,
    selectedId,
    setSelectedId,
}) => {
    const offset = useRef({ x: pos.x, y: pos.y });

    const onGestureEvent = (event: any) => {
        // Disable mask dragging when a pattern is applied
        if (maskDesignUri) return;

        const { translationX, translationY } = event.nativeEvent;

        setPos({
            x: offset.current.x + translationX,
            y: offset.current.y + translationY,
        });
    };

    const onHandlerStateChange = (event: any) => {
        // Disable mask dragging when a pattern is applied
        if (maskDesignUri) return;

        const { state } = event.nativeEvent;

        if (state === State.END || state === State.CANCELLED) {
            offset.current = { x: pos.x, y: pos.y };
        }

        if (state === State.BEGAN) {
            offset.current = { x: pos.x, y: pos.y };
        }
    };

    return (
        <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
        >
            <View
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: canvasW,
                    height: canvasH,
                    transform: [
                        { translateX: pos.x },
                        { translateY: pos.y },
                        { scale: scale },
                    ],
                }}
            >
                <MaskedView
                    style={{ flex: 1 }}
                    maskElement={
                        <Image
                            source={maskSource}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="contain"
                        />
                    }
                >
                    {/* Main fabric layer */}
                    <Image
                        source={{ uri: fabricUri || "https://i.imgur.com/6KQ2c0n.jpg" }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                    />

                    {/* Mask design overlay (pattern) */}
                    {maskDesignUri && (
                        <Image
                            source={{ uri: maskDesignUri }}
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                opacity: opacity,
                                resizeMode: "repeat",
                            }}
                        />
                    )}

                    {/* Decorative designs */}
                    {designsArray.map((it) => (
                        <MovableDesign
                            key={it.id}
                            item={it}
                            selected={selectedId === it.id}
                            canvasSize={{ width: canvasW, height: canvasH }}
                            onUpdate={(changes: any) =>
                                setDesignsArray((prev) =>
                                    prev.map((d) => (d.id === it.id ? { ...d, ...changes } : d))
                                )
                            }
                            onDelete={() =>
                                setDesignsArray((prev) => prev.filter((d) => d.id !== it.id))
                            }
                            onSelect={() => setSelectedId(it.id)}
                        />
                    ))}
                </MaskedView>
            </View>
        </PanGestureHandler>
    );
};

export default DraggableMask;
