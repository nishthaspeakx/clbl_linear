/**
 * avatarAnchorPoints — where a reward should "land" on the avatar when it flies
 * out of the reward popup. Offsets are relative to the avatar's centre (in the
 * map's screen space); negative y = up. Used by the Wear-Now fly animation to
 * bias the flight target by reward type so it visually snaps to the right spot.
 */
import type { RewardItem } from '../data/rewardCategories';

export type AnchorKey = 'eyewear' | 'headwear' | 'bag' | 'shoes' | 'watch' | 'outfit';

export const avatarAnchorPoints: Record<AnchorKey, { xOffset: number; yOffset: number }> = {
  eyewear: { xOffset: 0, yOffset: -45 },
  headwear: { xOffset: 0, yOffset: -65 },
  bag: { xOffset: 25, yOffset: -10 },
  shoes: { xOffset: 0, yOffset: 45 },
  watch: { xOffset: -22, yOffset: 5 },
  outfit: { xOffset: 0, yOffset: 0 },
};

/** Map a reward to its avatar anchor. */
export function anchorForReward(item: RewardItem): AnchorKey {
  const k = item.imageKey;
  if (k === 'sunglasses') return 'eyewear';
  if (k === 'cap') return 'headwear';
  if (k === 'backpack' || k === 'laptop_bag') return 'bag';
  if (k === 'sneakers' || k === 'shoes') return 'shoes';
  if (k === 'watch' || k === 'smartwatch') return 'watch';
  return 'outfit';
}

export function anchorOffset(item: RewardItem): { xOffset: number; yOffset: number } {
  return avatarAnchorPoints[anchorForReward(item)];
}
