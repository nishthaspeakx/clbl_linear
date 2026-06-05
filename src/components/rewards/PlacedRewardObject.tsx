/**
 * PlacedRewardObject — a reward rendered ON the Dream Home preview as a natural
 * object (no circle / bubble / border / background — soft shadow only). Read-only
 * version used in the preview card; the editor uses DraggableRewardObject.
 * Anchored bottom-centre so it sits on the ground. Optional ✨ for new unlocks.
 */
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { RewardItem } from '../../data/rewardCategories';
import { ObjectVisual } from './placedObjects';

interface Props {
  item: RewardItem;
  left: number;
  top: number;
  size: number;
  zIndex: number;
  rotate?: number;
  isNew?: boolean;
  onPress: () => void;
}

export default function PlacedRewardObject({ item, left, top, size, zIndex, rotate = 0, isNew, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.obj, { left, top, width: size, height: size, zIndex, transform: rotate ? [{ rotate: `${rotate}deg` }] : undefined }]}
      hitSlop={4}
    >
      <ObjectVisual item={item} size={size} />
      {isNew && <Text style={[styles.sparkle, { fontSize: Math.max(10, size * 0.26) }]}>✨</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  obj: { position: 'absolute', alignItems: 'center', justifyContent: 'flex-end' },
  sparkle: { position: 'absolute', top: -2, right: -2 },
});
