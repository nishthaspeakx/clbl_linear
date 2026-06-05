/**
 * RewardContext — shares reward-world state (equipped items + custom avatar)
 * across the app so the map character, avatar previews and the Rewards page
 * stay in sync and update live. Persists via rewardStorage.
 *
 * Equipped items are tracked by their string reward-item id; `equippedKeys`
 * derives the avatar-overlay keys for the equipped items that have one.
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_REWARD_STATE,
  RewardState,
  loadRewardState,
  saveRewardState,
} from '../../storage/rewardStorage';
import { EquipKey } from '../../data/rewards';
import { rewardItemById } from '../../data/rewardCategories';
import { OutfitOverride, outfitForImageKey } from '../../data/avatarOutfits';

interface RewardCtx {
  state: RewardState;
  loaded: boolean;
  /** Avatar-overlay keys for the worn wardrobe + lifestyle items. */
  equippedKeys: EquipKey[];
  /** The worn wardrobe item's outfit override (clothes change), or undefined. */
  activeOutfit: OutfitOverride | undefined;
  /** The custom caricature image to show, or null if a preset persona is active. */
  activeCustomUri: string | null;

  // ── lifecycle (Wear / Wearing ✓) ─────────────────────────────────────────
  /** Wardrobe: wear this item (only ONE wardrobe item at a time). */
  isWearingWardrobe: (itemId: string) => boolean;
  wearWardrobe: (itemId: string) => void;
  /** Lifestyle: toggle this accessory on/off (MANY at a time). */
  isWearingLifestyle: (itemId: string) => boolean;
  toggleLifestyle: (itemId: string) => void;

  /** Save a custom avatar photo + activate it. */
  setCustomAvatar: (uri: string) => void;
  /** Switch back to a preset (persona) avatar. */
  useCustomAvatar: (active: boolean) => void;
}

const Ctx = createContext<RewardCtx>({
  state: DEFAULT_REWARD_STATE,
  loaded: false,
  equippedKeys: [],
  activeOutfit: undefined,
  activeCustomUri: null,
  isWearingWardrobe: () => false,
  wearWardrobe: () => {},
  isWearingLifestyle: () => false,
  toggleLifestyle: () => {},
  setCustomAvatar: () => {},
  useCustomAvatar: () => {},
});

export function RewardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<RewardState>(DEFAULT_REWARD_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      setState(await loadRewardState());
      setLoaded(true);
    })();
  }, []);

  const update = (next: RewardState) => {
    setState(next);
    saveRewardState(next);
  };

  // Wardrobe: exactly one item worn at a time — wearing a new one replaces it.
  const wearWardrobe = (itemId: string) => {
    setState((prev) => {
      const next: RewardState = { ...prev, wearingWardrobeId: itemId };
      saveRewardState(next);
      return next;
    });
  };

  // Lifestyle: many at once — Wear toggles the accessory on/off the avatar.
  const toggleLifestyle = (itemId: string) => {
    setState((prev) => {
      const has = prev.wearingLifestyleIds.includes(itemId);
      const next: RewardState = {
        ...prev,
        wearingLifestyleIds: has
          ? prev.wearingLifestyleIds.filter((id) => id !== itemId)
          : [...prev.wearingLifestyleIds, itemId],
      };
      saveRewardState(next);
      return next;
    });
  };

  // Avatar overlay keys = the worn wardrobe item + all worn lifestyle items.
  const equippedKeys = useMemo(() => {
    const ids = [state.wearingWardrobeId, ...state.wearingLifestyleIds].filter((x): x is string => !!x);
    return ids.map((id) => rewardItemById(id)?.equipKey).filter((k): k is EquipKey => !!k);
  }, [state.wearingWardrobeId, state.wearingLifestyleIds]);

  // Active outfit = the single worn wardrobe item's clothes override.
  const activeOutfit = useMemo<OutfitOverride | undefined>(() => {
    if (!state.wearingWardrobeId) return undefined;
    const item = rewardItemById(state.wearingWardrobeId);
    return item ? outfitForImageKey(item.imageKey) : undefined;
  }, [state.wearingWardrobeId]);

  const value: RewardCtx = {
    state,
    loaded,
    equippedKeys,
    activeOutfit,
    activeCustomUri: state.customAvatarActive ? state.customAvatarUri : null,
    isWearingWardrobe: (id) => state.wearingWardrobeId === id,
    wearWardrobe,
    isWearingLifestyle: (id) => state.wearingLifestyleIds.includes(id),
    toggleLifestyle,
    setCustomAvatar: (uri) => update({ ...state, customAvatarUri: uri, customAvatarActive: true }),
    useCustomAvatar: (active) => update({ ...state, customAvatarActive: active }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRewards(): RewardCtx {
  return useContext(Ctx);
}
