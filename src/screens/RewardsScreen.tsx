/**
 * RewardsScreen — the redesigned "My World" reward page.
 *
 * Structure (top → bottom):
 *   1. Header   — ✕ · 🎁 My World · ✏️ Edit Avatar, then "X/Y rewards • coins"
 *   2. Tabs     — 4 category cards (Wardrobe / Home / Vehicles / Lifestyle)
 *   3. Avatar   — compact avatar preview strip with Edit Avatar
 *   4. Grid     — 2-column item grid for the selected category
 *
 * Avatar is intentionally NOT a top category — it's edited via the header /
 * preview buttons. Wardrobe is filtered to the avatar's profile; the other
 * categories show everything. Unlock state is derived from completed levels.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IS_WEB, VIEWPORT_W, VIEWPORT_H, WEB_SCALE } from '../utils/viewport';
import { useAvatar } from '../components/avatar/AvatarContext';
import { useRewards } from '../components/avatar/RewardContext';
import AvatarSetupScreen from './AvatarSetupScreen';
import RewardCategoryTabs, { CategoryProgress } from '../components/rewards/RewardCategoryTabs';
import RewardGrid from '../components/rewards/RewardGrid';
import AvatarRewardPreview from '../components/rewards/AvatarRewardPreview';
import NextRewardCard from '../components/rewards/NextRewardCard';
import DreamHomePreview, { PreviewEntry } from '../components/rewards/DreamHomePreview';
import DreamHomeEditorScreen from './DreamHomeEditorScreen';
import {
  REWARD_CATEGORIES,
  RewardCategoryKey,
  RewardItem,
  ALL_REWARD_ITEMS,
  visibleItems,
  isItemUnlocked,
  rewardItemById,
  featuredRewardForLevel,
} from '../data/rewardCategories';
import { placementFor } from '../data/dreamHomePlacements';
import {
  DreamHomeLayout,
  getDreamHomeLayout,
  saveDreamHomeLayout,
  updateRewardPlacement,
  removePlacedReward,
  restorePlacedReward,
  resetDreamHomeLayout,
} from '../storage/dreamHomeLayoutStorage';
import { COINS_PER_LEVEL, loadProgress } from '../storage/progressStorage';
import { statusForLevel } from '../data/avatarMilestones';
import { playSound } from '../services/soundService';
import { triggerHaptic } from '../services/hapticService';
import SoundToggle from '../components/settings/SoundToggle';

const PLACEABLE: RewardCategoryKey[] = ['home', 'garden', 'vehicles'];

const PRIMARY = '#FF7A00';

interface Props {
  onClose: () => void;
  initialCategory?: RewardCategoryKey;
}

export default function RewardsScreen({ onClose, initialCategory = 'wardrobe' }: Props) {
  const { selection } = useAvatar();
  const {
    state, equippedKeys, activeOutfit, activeCustomUri, claimedCount,
    isClaimed, claim, isWearingWardrobe, wearWardrobe, isWearingLifestyle, toggleLifestyle,
  } = useRewards();

  const [completedCount, setCompletedCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(0);
  const [category, setCategory] = useState<RewardCategoryKey>(initialCategory);
  const [showSetup, setShowSetup] = useState(false);
  const [night, setNight] = useState(false); // shared by the header toggle + Dream Home image
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (m: string) => {
    setToast(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1900);
  };
  const toggleNight = () => { playSound('day_night_toggle'); setNight((n) => !n); };

  // Dream Home manual layout (placements + removals)
  const [layout, setLayout] = useState<DreamHomeLayout>({ placements: {}, removed: [] });
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorSelectedId, setEditorSelectedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const p = await loadProgress();
      setCompletedCount(p.completedIds.length);
      setLevel(p.currentId);
      setCoins(p.coins ?? p.completedIds.length * COINS_PER_LEVEL);
      setLayout(await getDreamHomeLayout());
    })();
  }, []);

  const commitLayout = (next: DreamHomeLayout) => { setLayout(next); saveDreamHomeLayout(next); };

  // Placed items = ONLY the ones the learner explicitly placed (an entry in
  // layout.placements). Nothing auto-shows — the Dream Home fills as you place.
  const placedEntries = useMemo<PreviewEntry[]>(() => {
    return Object.entries(layout.placements)
      .map(([id, p]) => {
        const item = rewardItemById(id);
        if (!item) return null;
        return { item, xPercent: p.xPercent, yPercent: p.yPercent, scale: p.scale };
      })
      .filter((e): e is PreviewEntry => !!e);
  }, [layout]);

  const placedIds = useMemo(() => new Set(Object.keys(layout.placements)), [layout]);

  // Editor entries carry rotation too (decoration mode).
  const editorEntries = useMemo(
    () => placedEntries.map((e) => ({
      item: e.item,
      xPercent: e.xPercent,
      yPercent: e.yPercent,
      scale: e.scale,
      rotation: layout.placements[e.item.id]?.rotation ?? placementFor(e.item.imageKey)?.rotate ?? 0,
    })),
    [placedEntries, layout]
  );

  // Unlocked placeable rewards NOT currently on the canvas → the "Add Item" drawer.
  const availableItems = useMemo(
    () => ALL_REWARD_ITEMS.filter(
      (i) => PLACEABLE.includes(i.category) && isItemUnlocked(i, completedCount) && placementFor(i.imageKey) && !placedIds.has(i.id)
    ),
    [completedCount, placedIds]
  );

  // Dream Home progress = placeable rewards (home/garden/vehicles) unlocked / total.
  const homeProgress = useMemo(() => {
    const items = ALL_REWARD_ITEMS.filter((i) => PLACEABLE.includes(i.category));
    return { total: items.length, unlocked: items.filter((i) => isItemUnlocked(i, completedCount)).length };
  }, [completedCount]);

  // Editor: update any subset of a placement (x/y/scale/rotation), keeping the
  // rest from the current override or the category default.
  const updatePlacement = (id: string, partial: { xPercent?: number; yPercent?: number; scale?: number; rotation?: number }) => {
    setLayout((prev) => {
      const cur = prev.placements[id];
      const item = rewardItemById(id);
      const def = item ? placementFor(item.imageKey) : undefined;
      const base = {
        xPercent: cur?.xPercent ?? def?.xPercent ?? 50,
        yPercent: cur?.yPercent ?? def?.yPercent ?? 50,
        scale: cur?.scale ?? def?.scale ?? 0.8,
        rotation: cur?.rotation ?? def?.rotate ?? 0,
      };
      const next = updateRewardPlacement(prev, id, { ...base, ...partial, placedAt: cur?.placedAt ?? Date.now() });
      saveDreamHomeLayout(next);
      return next;
    });
  };

  // Place an item on the Dream Home at its default spot (claims it too). Used by
  // the grid "Place" button and the editor's Add-Item drawer.
  const addItemToCanvas = (item: RewardItem) => {
    claim(item.id);
    setLayout((prev) => {
      let next = restorePlacedReward(prev, item.id);
      const def = placementFor(item.imageKey);
      next = updateRewardPlacement(next, item.id, {
        xPercent: def?.xPercent ?? 50, yPercent: def?.yPercent ?? 50,
        scale: def?.scale ?? 0.8, rotation: def?.rotate ?? 0, placedAt: Date.now(),
      });
      saveDreamHomeLayout(next);
      return next;
    });
  };

  const removeItem = (id: string) => {
    setLayout((prev) => { const next = removePlacedReward(prev, id); saveDreamHomeLayout(next); return next; });
    setEditorSelectedId((s) => (s === id ? null : s));
  };
  const resetLayout = () => { commitLayout(resetDreamHomeLayout()); setEditorSelectedId(null); };

  const profile = { gender: selection.gender, age: selection.age, userType: selection.userType };

  // A reward is CLAIMED once the learner claims it (and stays claimed when worn,
  // placed, or set aside). Locked-but-unclaimed never counts.
  const claimedIds = useMemo(
    () => new Set<string>([
      ...state.claimedRewardIds,
      ...(state.wearingWardrobeId ? [state.wearingWardrobeId] : []),
      ...state.wearingLifestyleIds,
      ...Object.keys(layout.placements),
    ]),
    [state.claimedRewardIds, state.wearingWardrobeId, state.wearingLifestyleIds, layout.placements]
  );

  // Per-category collection progress (claimed / total, after profile filtering).
  const counts = useMemo(() => {
    const out = {} as Record<RewardCategoryKey, CategoryProgress>;
    REWARD_CATEGORIES.forEach((c) => {
      const list = visibleItems(c.key, profile);
      out[c.key] = { total: list.length, claimed: list.filter((i) => claimedIds.has(i.id)).length };
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimedIds, selection.gender, selection.age, selection.userType]);

  const items = useMemo(
    () => visibleItems(category, profile),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, selection.gender, selection.age, selection.userType]
  );

  return (
    <Modal visible transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.frame}>
          {/* 1. Header — minimal: close · small icon · mute. No repeated stats. */}
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={10} style={styles.headerSide}><Text style={styles.closeX}>✕</Text></Pressable>
            <Text style={styles.headerTitle} numberOfLines={1}>🏡  My Dream Home</Text>
            <View style={styles.headerActions}>
              <SoundToggle size={30} />
              <Pressable onPress={toggleNight} hitSlop={8} style={styles.dayNight}>
                <Text style={styles.dayNightIcon}>{night ? '🌙' : '☀️'}</Text>
              </Pressable>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {/* 1. My Dream Home hero (title now lives in the header) */}
            <DreamHomePreview
              placed={placedEntries}
              selection={selection}
              equippedKeys={equippedKeys}
              outfit={activeOutfit}
              customUri={activeCustomUri}
              unlockedItems={homeProgress.unlocked}
              totalItems={homeProgress.total}
              completedCount={completedCount}
              night={night}
              onOpenEditor={() => { setEditorSelectedId(null); setEditorOpen(true); }}
            />

            {/* 2. Avatar identity */}
            <View style={styles.avatarWrap}>
              <AvatarRewardPreview
                selection={selection}
                equippedKeys={equippedKeys}
                outfit={activeOutfit}
                customUri={activeCustomUri}
                level={level}
                statusTitle={statusForLevel(level).title}
                statusEmoji={statusForLevel(level).emoji}
                equippedCount={claimedIds.size}
                coins={coins}
                onEditAvatar={() => setShowSetup(true)}
              />
            </View>

            {/* 3. Next reward (always the next locked headline reward) */}
            <NextRewardCard reward={featuredRewardForLevel(completedCount + 1) ?? null} completedCount={completedCount} />

            {/* 4. Category tabs */}
            <View style={styles.tabsWrap}>
              <RewardCategoryTabs selected={category} counts={counts} onSelect={setCategory} />
            </View>

            {/* 4. Category content */}
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>
                {REWARD_CATEGORIES.find((c) => c.key === category)?.icon}{' '}
                {REWARD_CATEGORIES.find((c) => c.key === category)?.name}
              </Text>
              <Text style={styles.sectionCount}>{counts[category]?.claimed}/{counts[category]?.total} claimed</Text>
            </View>
            {category === 'wardrobe' && (
              <Text style={styles.filterNote}>Showing outfits that suit your avatar's profile.</Text>
            )}

            <RewardGrid
              items={items}
              completedCount={completedCount}
              isClaimed={isClaimed}
              isWearingWardrobe={isWearingWardrobe}
              isWearingLifestyle={isWearingLifestyle}
              isPlaced={(id) => placedIds.has(id)}
              onClaim={(item) => { playSound('claim_reward'); triggerHaptic('medium'); claim(item.id); }}
              onWearWardrobe={(id) => { playSound('avatar_changed'); triggerHaptic('light'); wearWardrobe(id); }}
              onToggleLifestyle={(id) => { playSound('avatar_changed'); triggerHaptic('light'); toggleLifestyle(id); }}
              onPlace={(item) => { playSound('item_placed'); triggerHaptic('medium'); addItemToCanvas(item); }}
              onLockedTap={(item) => showToast(`Complete Level ${item.unlockLevel} to unlock`)}
            />
          </ScrollView>
        </View>
      </View>

      {showSetup && <AvatarSetupScreen onClose={() => setShowSetup(false)} />}

      {editorOpen && (
        <DreamHomeEditorScreen
          placed={editorEntries}
          available={availableItems}
          selection={selection}
          equippedKeys={equippedKeys}
          outfit={activeOutfit}
          customUri={activeCustomUri}
          onUpdate={updatePlacement}
          onAdd={addItemToCanvas}
          onRemove={removeItem}
          onReset={resetLayout}
          onClose={() => setEditorOpen(false)}
          initialSelectedId={editorSelectedId}
        />
      )}

      {!!toast && !editorOpen && (
        <View pointerEvents="none" style={styles.toastWrap}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: IS_WEB ? '#0B0C10' : '#FFFFFF',
    alignItems: IS_WEB ? 'center' : 'stretch',
    justifyContent: IS_WEB ? 'center' : 'flex-start',
  },
  frame: IS_WEB
    ? { width: VIEWPORT_W, height: VIEWPORT_H, backgroundColor: '#F6F7F9', overflow: 'hidden', borderRadius: 44, transform: [{ scale: WEB_SCALE }] }
    : { flex: 1, backgroundColor: '#F6F7F9' },
  header: {
    paddingTop: 44, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: '#FFFFFF',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerSide: { width: 76, height: 30, justifyContent: 'center' },
  closeX: { fontSize: 18, fontWeight: '800', color: '#2A2E33' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '900', color: '#21242B' },
  headerActions: { width: 76, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  dayNight: {
    width: 30, height: 30, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3,
    borderWidth: 1, borderColor: '#EEF0F2',
  },
  dayNightIcon: { fontSize: 15 },

  body: { padding: 14, paddingBottom: 40 },
  tabsWrap: { marginTop: 20 },
  avatarWrap: { marginTop: 14 },

  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#21242B' },
  sectionCount: { fontSize: 12, fontWeight: '800', color: '#9AA0A6' },
  filterNote: { fontSize: 11.5, color: '#9AA0A6', fontWeight: '600', marginBottom: 12 },
  toastWrap: { position: 'absolute', left: 0, right: 0, bottom: 70, alignItems: 'center' },
  toastText: {
    backgroundColor: 'rgba(33,36,43,0.95)', color: '#FFFFFF', fontWeight: '800', fontSize: 13,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, overflow: 'hidden',
  },
});
