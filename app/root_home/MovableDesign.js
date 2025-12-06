// MovableDesign.js
import React, { useEffect } from "react";
import { StyleSheet, Image } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function MovableDesign({
  item,
  selected = false,
  onSelect,
  onUpdate,
  onDelete,
  canvasSize = { width: 0, height: 0 },
}) {
  // Shared values
  const x = useSharedValue(item.x);
  const y = useSharedValue(item.y);
  const scale = useSharedValue(item.scale ?? 1);
  const rotation = useSharedValue(item.rotation ?? 0);

  const commitPosition = () => {
    onUpdate({ x: x.value, y: y.value, scale: scale.value, rotation: rotation.value });
  };

  useEffect(() => {
    x.value = item.x;
    y.value = item.y;
    scale.value = item.scale ?? 1;
    rotation.value = item.rotation ?? 0;
  }, [item.x, item.y, item.scale, item.rotation]);

  // ---------------- Gestures ----------------
  const pan = Gesture.Pan()
    .onStart(() => runOnJS(onSelect) && runOnJS(onSelect)())
    .onUpdate((e) => {
      x.value = item.x + e.translationX;
      y.value = item.y + e.translationY;
    })
    .onEnd(() => {
      // clamp inside canvas
      const maxX = canvasSize.width - 60; // reduce for design size
      const maxY = canvasSize.height - 60;
      if (x.value < 0) x.value = 0;
      if (y.value < 0) y.value = 0;
      if (x.value > maxX) x.value = maxX;
      if (y.value > maxY) y.value = maxY;
      runOnJS(commitPosition)();
    });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(0.2, item.scale * e.scale);
    })
    .onEnd(() => runOnJS(commitPosition)());

  const rotationGest = Gesture.Rotation()
    .onUpdate((e) => {
      const deg = (e.rotation * 180) / Math.PI;
      rotation.value = item.rotation + deg;
    })
    .onEnd(() => runOnJS(commitPosition)());

  // Double tap to delete
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => runOnJS(onDelete)());

  const composed = Gesture.Simultaneous(pan, pinch, rotationGest, doubleTap);

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
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.box, style]} collapsable={false}>
        <Image
          source={{ uri: item.designUri }}
          style={styles.img}
          pointerEvents="none"
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  box: { width: 140, height: 140, justifyContent: "center", alignItems: "center" },
  img: { width: 140, height: 140, resizeMode: "contain" },
});
