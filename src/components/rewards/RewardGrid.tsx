/**
 * RewardGrid — 2-column grid of reward items for the selected category.
 * Decides each card's mode:
 *   • Home/Garden/Vehicles → "place" (Dream Home)
 *   • equippable Wardrobe/Lifestyle → "equip" (avatar)
 *   • everything else → "view"
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RewardItem, RewardCategoryKey, isItemUnlocked } from '../../data/rewardCategories';
import RewardItemCard, { CardMode } from './RewardItemCard';

const PLACEABLE: RewardCategoryKey[] = ['home', 'garden', 'vehicles'];

function modeFor(item: RewardItem): CardMode {
  if (PLACEABLE.includes(item.category)) return 'place';
  if (item.isEquippable) return 'equip';
  return 'view';
}

interface Props {
  items: RewardItem[];
  completedCount: number;
  isEquipped: (itemId: string) => boolean;
  onEquip: (itemId: string) => void;
  isPlaced: (itemId: string) => boolean;
  onPlace: (item: RewardItem) => void;
}

export default function RewardGrid({ items, completedCount, isEquipped, onEquip, isPlaced, onPlace }: Props) {
  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const unlocked = isItemUnlocked(item, completedCount);
        const mode = modeFor(item);
        return (
          <RewardItemCard
            key={item.id}
            item={item}
            unlocked={unlocked}
            mode={mode}
            placed={mode === 'place' && isPlaced(item.id)}
            equipped={mode === 'equip' && isEquipped(item.id)}
            onAction={
              !unlocked ? undefined
                : mode === 'place' ? () => onPlace(item)
                : mode === 'equip' ? () => onEquip(item.id)
                : undefined
            }
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
