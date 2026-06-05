/**
 * DraggableRewardObject — a reward object the user can drag to reposition inside
 * the Dream Home editor. Positions are committed as PERCENTAGES of the image.
 *
 *  • Drag (one-finger Pan) to move; live-follows the finger, commits on release.
 *  • Selected → thin orange outline + a ✕ remove button.
 *  • No circle/bubble — just the object (ObjectVisual) + its soft shadow.
 */
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { RewardItem } from '../../data/rewardCategories';
import { ObjectVisual } from './placedObjects';

interface Props {
  item: RewardItem;
  xPercent: number;
  yPercent: number;
  size: number;
  imgW: number;
  imgH: number;
  selected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, xPercent: number, yPercent: number) => void;
  onRemove: (id: string) => void;
}

export default function DraggableRewardObject({
  item, xPercent, yPercent, size, imgW, imgH, selected, onSelect, onMove, onRemove,
}: Props) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  // bottom-centre anchor on the ground line
  const left = (xPercent / 100) * imgW - size / 2;
  const top = (yPercent / 100) * imgH - size;

  const pan = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      runOnJS(onSelect)(item.id);
    })
    .onChange((e) => {
      'worklet';
      tx.value += e.changeX;
      ty.value += e.changeY;
    })
    .onFinalize(() => {
      'worklet';
      const nx = Math.min(100, Math.max(0, xPercent + (tx.value / imgW) * 100));
      const ny = Math.min(100, Math.max(0, yPercent + (ty.value / imgH) * 100));
      runOnJS(onMove)(item.id, nx, ny);
      tx.value = 0;
      ty.value = 0;
    });

  const aStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
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
  selected: { borderWidth: 2, borderColor: '#FF7A00', borderStyle: 'dashed', borderRadius: 10 },
  removeBtn: {
    position: 'absolute', top: -12, right: -12, width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#E1473D', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#FFFFFF',
  },
  removeX: { color: '#FFFFFF', fontWeight: '900', fontSize: 11 },
});
