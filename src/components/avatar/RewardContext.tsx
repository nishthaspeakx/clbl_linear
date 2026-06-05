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
  /** Avatar-overlay keys for currently-equipped items that drive overlays. */
  equippedKeys: EquipKey[];
  /** Equipped wardrobe outfit override (clothes change), or undefined. */
  activeOutfit: OutfitOverride | undefined;
  /** The custom caricature image to show, or null if a preset persona is active. */
  activeCustomUri: string | null;
  /** Toggle an equippable reward item on/off the avatar (by string id). */
  toggleEquip: (itemId: string) => void;
  isEquipped: (itemId: string) => boolean;
  /** How many items are currently equipped. */
  equippedCount: number;
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
  toggleEquip: () => {},
  isEquipped: () => false,
  equippedCount: 0,
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

  const toggleEquip = (itemId: string) => {
    setState((prev) => {
      const has = prev.equippedItemIds.includes(itemId);
      const next: RewardState = {
        ...prev,
        equippedItemIds: has
          ? prev.equippedItemIds.filter((id) => id !== itemId)
          : [...prev.equippedItemIds, itemId],
      };
      saveRewardState(next);
      return next;
    });
  };

  const equippedKeys = useMemo(
    () =>
      state.equippedItemIds
        .map((id) => rewardItemById(id)?.equipKey)
        .filter((k): k is EquipKey => !!k),
    [state.equippedItemIds]
  );

  // Active outfit = the most recently equipped wardrobe item that maps to an
  // outfit override (clothes change). Single outfit at a time (last wins).
  const activeOutfit = useMemo<OutfitOverride | undefined>(() => {
    let out: OutfitOverride | undefined;
    for (const id of state.equippedItemIds) {
      const item = rewardItemById(id);
      if (item && item.category === 'wardrobe') {
        const o = outfitForImageKey(item.imageKey);
        if (o) out = o;
      }
    }
    return out;
  }, [state.equippedItemIds]);

  const value: RewardCtx = {
    state,
    loaded,
    equippedKeys,
    activeOutfit,
    activeCustomUri: state.customAvatarActive ? state.customAvatarUri : null,
    toggleEquip,
    isEquipped: (id) => state.equippedItemIds.includes(id),
    equippedCount: state.equippedItemIds.length,
    setCustomAvatar: (uri) => update({ ...state, customAvatarUri: uri, customAvatarActive: true }),
    useCustomAvatar: (active) => update({ ...state, customAvatarActive: active }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRewards(): RewardCtx {
  return useContext(Ctx);
}
