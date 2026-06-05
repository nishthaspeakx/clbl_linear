/**
 * RewardClaimFlow — small helpers for the reward unlock reveal: what the primary
 * action is for a reward, the "applied" toast copy, and placing a placeable
 * reward straight into the Dream Home from the reveal.
 *
 * Wearables (wardrobe/lifestyle) → "Wear Now". Home/Garden/Vehicles → "Place Now".
 */
import { RewardItem } from '../data/rewardCategories';
import { placementFor } from '../data/dreamHomePlacements';
import { getDreamHomeLayout, saveDreamHomeLayout, updateRewardPlacement } from '../storage/dreamHomeLayoutStorage';

const PLACEABLE = ['home', 'garden', 'vehicles'];

export function isPlaceable(item: RewardItem): boolean {
  return PLACEABLE.includes(item.category);
}

export function primaryActionLabel(item: RewardItem): string {
  return isPlaceable(item) ? 'Place Now' : 'Wear Now';
}

export function appliedToast(item: RewardItem): string {
  return isPlaceable(item) ? `✨ ${item.name} Placed` : `✨ ${item.name} Applied`;
}

/** Place a placeable reward on the Dream Home at its default spot (persisted). */
export async function placeRewardInDreamHome(item: RewardItem): Promise<void> {
  try {
    const layout = await getDreamHomeLayout();
    const def = placementFor(item.imageKey);
    const next = updateRewardPlacement(layout, item.id, {
      xPercent: def?.xPercent ?? 50,
      yPercent: def?.yPercent ?? 50,
      scale: def?.scale ?? 0.8,
      rotation: def?.rotate ?? 0,
      placedAt: Date.now(),
    });
    await saveDreamHomeLayout(next);
  } catch {
    // best effort — placement is non-critical
  }
}
