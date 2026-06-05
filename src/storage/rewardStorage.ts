/**
 * rewardStorage — persists the learner's reward-world state.
 *
 * Reward lifecycle (one tap, no intermediate "claim" step):
 *  - Wardrobe / Lifestyle → Wear → Wearing ✓
 *  - Home / Garden / Vehicles → Claim → Claimed ✓ (Claim places it instantly)
 *
 *  - wearingWardrobeId  : the SINGLE wardrobe item currently worn (outfit)
 *  - wearingLifestyleIds: lifestyle accessories worn (MANY at once)
 * Placeable "claimed" = it has a Dream Home placement (dreamHomeLayoutStorage).
 *
 * customAvatarUri/Active = an optional caricature the learner generated.
 *
 * ── FUTURE API INTEGRATION ──────────────────────────────────────────────────
 * Swap the AsyncStorage bodies for backend calls keeping the same shape.
 * ────────────────────────────────────────────────────────────────────────────
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@english_town_map/reward_world_v1';

export interface RewardState {
  /** The one wardrobe item currently worn (outfit), or null. */
  wearingWardrobeId: string | null;
  /** Lifestyle accessories currently worn (multiple allowed). */
  wearingLifestyleIds: string[];
  customAvatarUri: string | null;
  customAvatarActive: boolean;
}

export const DEFAULT_REWARD_STATE: RewardState = {
  wearingWardrobeId: null,
  wearingLifestyleIds: [],
  customAvatarUri: null,
  customAvatarActive: false,
};

const strArr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);

export async function loadRewardState(): Promise<RewardState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_REWARD_STATE };
    const p = JSON.parse(raw);
    return {
      wearingWardrobeId: typeof p?.wearingWardrobeId === 'string' ? p.wearingWardrobeId : null,
      wearingLifestyleIds: strArr(p?.wearingLifestyleIds),
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
