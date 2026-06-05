/**
 * RewardGrid — 2-column grid of reward cards for the selected category.
 * Maps each card to the reward lifecycle (Claim → Wear/Place → Wearing ✓/Placed ✓)
 * and a single tap action:
 *   • not claimed     → claim
 *   • wardrobe        → wear (single — replaces the previous wardrobe item)
 *   • lifestyle       → toggle worn (many at once)
 *   • home/garden/veh → place (if not placed; removal happens in the editor)
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
  isClaimed: (id: string) => boolean;
  isWearingWardrobe: (id: string) => boolean;
  isWearingLifestyle: (id: string) => boolean;
  isPlaced: (id: string) => boolean;
  onClaim: (item: RewardItem) => void;
  onWearWardrobe: (id: string) => void;
  onToggleLifestyle: (id: string) => void;
  onPlace: (item: RewardItem) => void;
  onLockedTap: (item: RewardItem) => void;
}

export default function RewardGrid({
  items, completedCount, isClaimed, isWearingWardrobe, isWearingLifestyle, isPlaced,
  onClaim, onWearWardrobe, onToggleLifestyle, onPlace, onLockedTap,
}: Props) {
  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const unlocked = isItemUnlocked(item, completedCount);
        const claimed = isClaimed(item.id);
        const placeable = PLACEABLE.includes(item.category);
        const active = placeable
          ? isPlaced(item.id)
          : item.category === 'wardrobe'
            ? isWearingWardrobe(item.id)
            : isWearingLifestyle(item.id);

        const onAction = () => {
          if (!unlocked) return onLockedTap(item);
          if (!claimed) return onClaim(item);
          if (item.category === 'wardrobe') return onWearWardrobe(item.id);
          if (item.category === 'lifestyle') return onToggleLifestyle(item.id);
          if (!isPlaced(item.id)) return onPlace(item); // place once; remove via editor
          // already placed → stays Placed ✓ (no-op)
        };

        return (
          <RewardItemCard
            key={item.id}
            item={item}
            unlocked={unlocked}
            claimed={claimed}
            active={active}
            onAction={onAction}
          />
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
