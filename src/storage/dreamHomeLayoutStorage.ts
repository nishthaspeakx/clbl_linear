/**
 * dreamHomeLayoutStorage — persists the learner's MANUAL Dream Home layout.
 *
 * The Dream Home starts populated with each placeable reward at its default
 * position (see data/dreamHomePlacements). This store records the user's
 * *overrides*:
 *   • placements — items the user dragged to a custom spot (percentage coords)
 *   • removed    — items the user removed from the canvas
 * The effective layout = defaults, with these overrides applied.
 *
 * Positions are stored as PERCENTAGES (0–100) of the image, never pixels, so
 * they stay correct at any render size.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@english_town_map/dream_home_layout_v1';

export interface PlacedItem {
  xPercent: number;
  yPercent: number;
  scale: number;
  rotation: number;
  placedAt: number;
}

export interface DreamHomeLayout {
  placements: Record<string, PlacedItem>;
  removed: string[];
}

export const DEFAULT_LAYOUT: DreamHomeLayout = { placements: {}, removed: [] };

export async function getDreamHomeLayout(): Promise<DreamHomeLayout> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { placements: {}, removed: [] };
    const p = JSON.parse(raw);
    return {
      placements: p && typeof p.placements === 'object' && p.placements ? p.placements : {},
      removed: Array.isArray(p?.removed) ? p.removed.filter((x: unknown) => typeof x === 'string') : [],
    };
  } catch {
    return { placements: {}, removed: [] };
  }
}

export async function saveDreamHomeLayout(layout: DreamHomeLayout): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(layout));
  } catch {
    // ignore
  }
}

/** Pure helper: set/replace a reward's placement (also un-removes it). */
export function updateRewardPlacement(
  layout: DreamHomeLayout,
  rewardId: string,
  pos: Partial<PlacedItem>,
): DreamHomeLayout {
  const prev = layout.placements[rewardId];
  const next: PlacedItem = {
    xPercent: pos.xPercent ?? prev?.xPercent ?? 50,
    yPercent: pos.yPercent ?? prev?.yPercent ?? 50,
    scale: pos.scale ?? prev?.scale ?? 0.8,
    rotation: pos.rotation ?? prev?.rotation ?? 0,
    placedAt: prev?.placedAt ?? pos.placedAt ?? 0,
  };
  return {
    placements: { ...layout.placements, [rewardId]: next },
    removed: layout.removed.filter((id) => id !== rewardId),
  };
}

/** Pure helper: remove a reward from the canvas. */
export function removePlacedReward(layout: DreamHomeLayout, rewardId: string): DreamHomeLayout {
  const placements = { ...layout.placements };
  delete placements[rewardId];
  return {
    placements,
    removed: layout.removed.includes(rewardId) ? layout.removed : [...layout.removed, rewardId],
  };
}

/** Pure helper: re-add a previously removed reward (so defaults show again). */
export function restorePlacedReward(layout: DreamHomeLayout, rewardId: string): DreamHomeLayout {
  return {
    placements: layout.placements,
    removed: layout.removed.filter((id) => id !== rewardId),
  };
}

export function resetDreamHomeLayout(): DreamHomeLayout {
  return { placements: {}, removed: [] };
}
