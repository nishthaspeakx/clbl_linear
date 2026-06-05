/**
 * RewardGrid — 2-column grid of reward cards for the selected category.
 * Derives each card's kind + owned/active state and a single tap action:
 *   • wear (wardrobe / equippable lifestyle) → equip/unequip
 *   • place (home / garden)                  → place / edit
 *   • use (vehicles)                         → place / edit
 *   • collect (non-wearable lifestyle)       → toggle owned
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RewardItem, RewardCategoryKey, isItemUnlocked } from '../../data/rewardCategories';
import RewardItemCard, { CardKind } from './RewardItemCard';

const PLACEABLE: RewardCategoryKey[] = ['home', 'garden', 'vehicles'];

function kindFor(item: RewardItem): CardKind {
  if (item.category === 'vehicles') return 'use';
  if (PLACEABLE.includes(item.category)) return 'place';
  if (item.isEquippable) return 'wear';
  return 'collect';
}

interface Props {
  items: RewardItem[];
  completedCount: number;
  isEquipped: (itemId: string) => boolean;
  isPlaced: (itemId: string) => boolean;
  isOwned: (itemId: string) => boolean;
  onEquipToggle: (itemId: string) => void;
  onPlace: (item: RewardItem) => void;
  markOwned: (itemId: string) => void;
  onCollectToggle: (itemId: string) => void;
}

export default function RewardGrid({
  items, completedCount, isEquipped, isPlaced, isOwned, onEquipToggle, onPlace, markOwned, onCollectToggle,
}: Props) {
  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const unlocked = isItemUnlocked(item, completedCount);
        const kind = kindFor(item);
        const active =
          kind === 'wear' ? isEquipped(item.id)
            : kind === 'collect' ? isOwned(item.id)
              : isPlaced(item.id);
        const owned = isOwned(item.id);

        const onAction = !unlocked
          ? undefined
          : kind === 'collect'
            ? () => onCollectToggle(item.id)
            : kind === 'wear'
              ? () => { if (!active) markOwned(item.id); onEquipToggle(item.id); }
              : () => { if (!active) markOwned(item.id); onPlace(item); }; // place / use

        return (
          <RewardItemCard
            key={item.id}
            item={item}
            unlocked={unlocked}
            kind={kind}
            owned={owned}
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
