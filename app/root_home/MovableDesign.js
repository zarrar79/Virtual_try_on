// MovableDesign.js
import React, { useRef, useEffect } from "react";
import { StyleSheet, Image } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from "react-native-reanimated";
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";

export default function MovableDesign({
  item,
  selected = false,
  onSelect,
  onUpdate,
  onDelete,
  canvasSize = { width: 0, height: 0 },
}) {
  const panRef = useRef();
  const pinchRef = useRef();
  const rotationRef = useRef();
  const tapRef = useRef();

  const x = useSharedValue(item.x);
  const y = useSharedValue(item.y);
  const scale = useSharedValue(item.scale ?? 1);
  const rotation = useSharedValue(item.rotation ?? 0);

  useEffect(() => {
    x.value = item.x;
    y.value = item.y;
    scale.value = item.scale ?? 1;
    rotation.value = item.rotation ?? 0;
  }, [item.x, item.y, item.scale, item.rotation]);

  const commitPosition = () => {
    onUpdate({
      x: x.value,
      y: y.value,
      scale: scale.value,
      rotation: rotation.value,
    });
  };

  // ----------------- Gesture Handlers -----------------
  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: (tx) => (x.value = item.x + tx), translationY: (ty) => (y.value = item.y + ty) } }],
    { useNativeDriver: true }
  );

  const onPanHandlerStateChange = (e) => {
    if (e.nativeEvent.state === 5) { // END
      commitPosition();
    }
  };

  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: (s) => (scale.value = Math.max(0.2, item.scale * s)) } }],
    { useNativeDriver: true }
  );

  const onPinchHandlerStateChange = (e) => {
    if (e.nativeEvent.state === 5) commitPosition();
  };

  const onRotationGestureEvent = Animated.event(
    [{ nativeEvent: { rotation: (r) => (rotation.value = item.rotation + (r * 180) / Math.PI) } }],
    { useNativeDriver: true }
  );

  const onRotationHandlerStateChange = (e) => {
    if (e.nativeEvent.state === 5) commitPosition();
  };

  const onDoubleTap = (e) => {
    if (e.nativeEvent.state === 5) onDelete();
  };

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: x.value,
    top: y.value,
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    borderWidth: selected ? 2 : 0,
    borderColor: selected ? "#00f" : "transparent",
  }));

  return (
    <TapGestureHandler
      ref={tapRef}
      numberOfTaps={2}
      onHandlerStateChange={onDoubleTap}
    >
      <RotationGestureHandler
        ref={rotationRef}
        simultaneousHandlers={[panRef, pinchRef, tapRef]}
        onGestureEvent={onRotationGestureEvent}
        onHandlerStateChange={onRotationHandlerStateChange}
      >
        <PinchGestureHandler
          ref={pinchRef}
          simultaneousHandlers={[panRef, rotationRef, tapRef]}
          onGestureEvent={onPinchGestureEvent}
          onHandlerStateChange={onPinchHandlerStateChange}
        >
          <PanGestureHandler
            ref={panRef}
            simultaneousHandlers={[pinchRef, rotationRef, tapRef]}
            onGestureEvent={onPanGestureEvent}
            onHandlerStateChange={onPanHandlerStateChange}
            onBegan={onSelect}
          >
            <Animated.View style={[styles.box, style]} collapsable={false}>
              <Image
                source={{ uri: item.designUri }}
                style={styles.img}
                pointerEvents="none"
              />
            </Animated.View>
          </PanGestureHandler>
        </PinchGestureHandler>
      </RotationGestureHandler>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  box: { width: 140, height: 140, justifyContent: "center", alignItems: "center" },
  img: { width: 140, height: 140, resizeMode: "contain" },
});
