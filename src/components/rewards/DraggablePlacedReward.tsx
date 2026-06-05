/**
 * DraggablePlacedReward — a single placed reward in the Dream Home editor.
 *
 *  • One-finger Pan to move; movement is divided by the live canvas zoom so the
 *    item tracks the finger 1:1 on screen at any zoom level.
 *  • Commits new xPercent/yPercent (bottom-centre anchored) on release; movement
 *    is clamped to the canvas (0–100%) so an item can't leave the image, but it
 *    can otherwise be dropped ANYWHERE (no zone restrictions).
 *  • Selected → orange glow + ✕ remove.
 *  • Honors per-item scale (size) + rotation.
 */
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { runOnJS, SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { RewardItem } from '../../data/rewardCategories';
import { ObjectVisual } from './placedObjects';

interface Props {
  item: RewardItem;
  xPercent: number;
  yPercent: number;
  size: number;        // rendered px (already includes the item's scale)
  rotation: number;    // degrees
  baseW: number;
  baseH: number;
  canvasScale: SharedValue<number>; // live zoom factor
  selected: boolean;
  onSelect: (id: string) => void;
  onDrop: (id: string, xPercent: number, yPercent: number) => void;
  onRemove: (id: string) => void;
}

export default function DraggablePlacedReward({
  item, xPercent, yPercent, size, rotation, baseW, baseH, canvasScale, selected, onSelect, onDrop, onRemove,
}: Props) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const left = (xPercent / 100) * baseW - size / 2;
  const top = (yPercent / 100) * baseH - size;

  const pan = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      runOnJS(onSelect)(item.id);
    })
    .onChange((e) => {
      'worklet';
      const s = canvasScale.value || 1;
      tx.value += e.changeX / s; // un-zoom the finger delta → base-image px
      ty.value += e.changeY / s;
    })
    .onFinalize(() => {
      'worklet';
      const nx = Math.min(100, Math.max(0, xPercent + (tx.value / baseW) * 100));
      const ny = Math.min(100, Math.max(0, yPercent + (ty.value / baseH) * 100));
      tx.value = 0; // always snap offset back; parent re-renders at new (or old) %
      ty.value = 0;
      runOnJS(onDrop)(item.id, nx, ny);
    });

  const aStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { rotate: `${rotation}deg` }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.obj,
          { left, top, width: size, height: size, zIndex: selected ? 9999 : Math.round(yPercent) },
          aStyle,
          selected && styles.selected,
        ]}
      >
        <ObjectVisual item={item} size={size} />
        {selected && (
          <Pressable onPress={() => onRemove(item.id)} style={styles.removeBtn} hitSlop={8}>
            <Text style={styles.removeX}>✕</Text>
          </Pressable>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  obj: { position: 'absolute', alignItems: 'center', justifyContent: 'flex-end' },
  selected: {
    borderWidth: 2, borderColor: '#FF7A00', borderRadius: 10,
    shadowColor: '#FF7A00', shadowOpacity: 0.7, shadowRadius: 9, shadowOffset: { width: 0, height: 0 },
  },
  removeBtn: {
    position: 'absolute', top: -12, right: -12, width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#E1473D', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#FFFFFF', zIndex: 2,
  },
  removeX: { color: '#FFFFFF', fontWeight: '900', fontSize: 11 },
});
