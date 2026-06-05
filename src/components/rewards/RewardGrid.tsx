/**
 * RewardGrid — 2-column grid of reward cards for the selected category.
 * One-tap lifecycle (no intermediate Claim/Place step):
 *   • wardrobe        → Wear (single — replaces the previous wardrobe item)
 *   • lifestyle       → Wear toggles worn on/off (many at once)
 *   • home/garden/veh → Claim (instantly places it in the Dream Home;
 *                       removal happens in the editor)
 *   • locked          → "Complete Level N to unlock" toast
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RewardItem, isItemUnlocked } from '../../data/rewardCategories';
import RewardItemCard from './RewardItemCard';

const PLACEABLE = ['home', 'garden', 'vehicles'];

interface Props {
  items: RewardItem[];
  completedCount: number;
  isWearingWardrobe: (id: string) => boolean;
  isWearingLifestyle: (id: string) => boolean;
  isPlaced: (id: string) => boolean;
  onWearWardrobe: (id: string) => void;
  onToggleLifestyle: (id: string) => void;
  onClaimPlaceable: (item: RewardItem) => void;
  onLockedTap: (item: RewardItem) => void;
}

export default function RewardGrid({
  items, completedCount, isWearingWardrobe, isWearingLifestyle, isPlaced,
  onWearWardrobe, onToggleLifestyle, onClaimPlaceable, onLockedTap,
}: Props) {
  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const unlocked = isItemUnlocked(item, completedCount);
        const placeable = PLACEABLE.includes(item.category);
        const active = placeable
          ? isPlaced(item.id)
          : item.category === 'wardrobe'
            ? isWearingWardrobe(item.id)
            : isWearingLifestyle(item.id);

        const onAction = () => {
          if (!unlocked) return onLockedTap(item);
          if (item.category === 'wardrobe') return onWearWardrobe(item.id);   // Wear (single)
          if (item.category === 'lifestyle') return onToggleLifestyle(item.id); // Wear toggle
          if (!isPlaced(item.id)) return onClaimPlaceable(item);              // Claim → place
          // already placed (Claimed ✓) — removal happens in the editor only
        };

        return (
          <RewardItemCard key={item.id} item={item} unlocked={unlocked} active={active} onAction={onAction} />
        );
      })}
      {items.length % 2 === 1 && <View style={styles.filler} />}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  filler: { width: '48%' },
});
