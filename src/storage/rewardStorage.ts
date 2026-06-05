/**
 * rewardStorage — persists the learner's reward-world state:
 *  - equippedIds: which outfit/accessory rewards the avatar is wearing
 *  - customAvatarUri: a photo/selfie the learner used to "generate" a custom
 *    avatar (prototype: stored but not yet sent to an AI service)
 *  - customAvatarActive: whether the learner chose the custom avatar over a preset
 *
 * NOTE: `unlockedRewardIds` and `currentLevel` are intentionally NOT stored here
 * — they are derived from progressStorage (single source of truth for level
 * progress). See data/rewards.ts → isRewardUnlocked.
 *
 * ── FUTURE API INTEGRATION ──────────────────────────────────────────────────
 * Swap the AsyncStorage bodies for backend calls (GET/PUT /user/world) keeping
 * the same RewardState shape so the UI stays unchanged.
 * ────────────────────────────────────────────────────────────────────────────
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@english_town_map/reward_world_v1';

export interface RewardState {
  /** Ids of equipped reward items (string ids from the reward registry). */
  equippedItemIds: string[];
  customAvatarUri: string | null;
  customAvatarActive: boolean;
}

export const DEFAULT_REWARD_STATE: RewardState = {
  equippedItemIds: [],
  customAvatarUri: null,
  customAvatarActive: false,
};

export async function loadRewardState(): Promise<RewardState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_REWARD_STATE };
    const p = JSON.parse(raw);
    return {
      equippedItemIds: Array.isArray(p?.equippedItemIds)
        ? p.equippedItemIds.filter((x: unknown) => typeof x === 'string')
        : [],
      customAvatarUri: typeof p?.customAvatarUri === 'string' ? p.customAvatarUri : null,
      customAvatarActive: !!p?.customAvatarActive,
    };
  } catch {
    return { ...DEFAULT_REWARD_STATE };
  }
}

export async function saveRewardState(state: RewardState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export async function resetRewardState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
