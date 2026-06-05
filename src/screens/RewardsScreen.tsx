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
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IS_WEB, VIEWPORT_W, VIEWPORT_H, WEB_SCALE } from '../utils/viewport';
import { useAvatar } from '../components/avatar/AvatarContext';
import { useRewards } from '../components/avatar/RewardContext';
import AvatarSetupScreen from './AvatarSetupScreen';
import RewardCategoryTabs from '../components/rewards/RewardCategoryTabs';
import RewardGrid from '../components/rewards/RewardGrid';
import AvatarRewardPreview from '../components/rewards/AvatarRewardPreview';
import DreamHomePreview, { PreviewEntry } from '../components/rewards/DreamHomePreview';
import DreamHomeEditorModal from '../components/rewards/DreamHomeEditorModal';
import {
  REWARD_CATEGORIES,
  RewardCategoryKey,
  CategoryCount,
  RewardItem,
  ALL_REWARD_ITEMS,
  categoryCount,
  overallCount,
  visibleItems,
  isItemUnlocked,
  rewardItemById,
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

const PLACEABLE: RewardCategoryKey[] = ['home', 'garden', 'vehicles'];

const PRIMARY = '#FF7A00';

interface Props {
  onClose: () => void;
  initialCategory?: RewardCategoryKey;
}

export default function RewardsScreen({ onClose, initialCategory = 'wardrobe' }: Props) {
  const { selection } = useAvatar();
  const { equippedKeys, activeOutfit, activeCustomUri, isEquipped, toggleEquip, equippedCount } = useRewards();

  const [completedCount, setCompletedCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(0);
  const [category, setCategory] = useState<RewardCategoryKey>(initialCategory);
  const [showSetup, setShowSetup] = useState(false);

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

  // Effective placed items = unlocked placeable items (minus removed), positioned
  // by the user's override or the category default.
  const placedEntries = useMemo<PreviewEntry[]>(() => {
    const removed = new Set(layout.removed);
    const unlocked = ALL_REWARD_ITEMS.filter(
      (i) => PLACEABLE.includes(i.category) && isItemUnlocked(i, completedCount) && placementFor(i.imageKey)
    );
    // Home & Garden auto-show at defaults; Vehicles show only the BEST by default
    // (others appear once the user explicitly places them).
    const bestVehicleId = unlocked
      .filter((i) => i.category === 'vehicles')
      .sort((a, b) => b.unlockLevel - a.unlockLevel)[0]?.id;
    return unlocked
      .filter((i) => {
        if (removed.has(i.id)) return false;
        if (i.category === 'vehicles') return i.id === bestVehicleId || !!layout.placements[i.id];
        return true;
      })
      .map((i) => {
        const def = placementFor(i.imageKey)!;
        const ov = layout.placements[i.id];
        return {
          item: i,
          xPercent: ov?.xPercent ?? def.xPercent,
          yPercent: ov?.yPercent ?? def.yPercent,
          scale: ov?.scale ?? def.scale,
          isNew: i.unlockLevel === completedCount,
        };
      });
  }, [layout, completedCount]);

  const placedIds = useMemo(() => new Set(placedEntries.map((e) => e.item.id)), [placedEntries]);

  const defaultScaleFor = (id: string) => {
    const item = rewardItemById(id);
    return (item && placementFor(item.imageKey)?.scale) ?? 0.8;
  };

  const moveItem = (id: string, xPercent: number, yPercent: number) => {
    setLayout((prev) => {
      const scale = prev.placements[id]?.scale ?? defaultScaleFor(id);
      const next = updateRewardPlacement(prev, id, { xPercent, yPercent, scale, placedAt: Date.now() });
      saveDreamHomeLayout(next);
      return next;
    });
  };
  const removeItem = (id: string) => {
    setLayout((prev) => { const next = removePlacedReward(prev, id); saveDreamHomeLayout(next); return next; });
    setEditorSelectedId((s) => (s === id ? null : s));
  };
  const resetLayout = () => { commitLayout(resetDreamHomeLayout()); setEditorSelectedId(null); };

  // "Place" from a grid card: ensure it's on the canvas (un-remove + give it an
  // explicit placement if it had none), then open the editor focused on it.
  const placeItem = (item: RewardItem) => {
    setLayout((prev) => {
      let next = restorePlacedReward(prev, item.id);
      if (!next.placements[item.id]) {
        const def = placementFor(item.imageKey);
        next = updateRewardPlacement(next, item.id, {
          xPercent: def?.xPercent ?? 50,
          yPercent: def?.yPercent ?? 50,
          scale: def?.scale ?? 0.8,
          placedAt: Date.now(),
        });
      }
      saveDreamHomeLayout(next);
      return next;
    });
    setEditorSelectedId(item.id);
    setEditorOpen(true);
  };

  const profile = { gender: selection.gender, age: selection.age, userType: selection.userType };

  const counts = useMemo(() => {
    const out = {} as Record<RewardCategoryKey, CategoryCount>;
    REWARD_CATEGORIES.forEach((c) => { out[c.key] = categoryCount(c.key, completedCount, profile); });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedCount, selection.gender, selection.age, selection.userType]);

  const overall = useMemo(
    () => overallCount(completedCount, profile),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [completedCount, selection.gender, selection.age, selection.userType]
  );

  const items = useMemo(
    () => visibleItems(category, profile),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, selection.gender, selection.age, selection.userType]
  );

  return (
    <Modal visible transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.frame}>
          {/* 1. Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={10} style={styles.close}><Text style={styles.closeX}>✕</Text></Pressable>
            <Text style={styles.title}>🎁  My World</Text>
            <Pressable onPress={() => setShowSetup(true)} style={({ pressed }) => [styles.editPill, pressed && { opacity: 0.85 }]}>
              <Text style={styles.editPillText}>✏️ Edit</Text>
            </Pressable>
          </View>
          <Text style={styles.subtitle}>
            {overall.unlocked}/{overall.total} rewards  •  {coins} coins  •  Level {level}
          </Text>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {/* 2. My Dream Home showcase */}
            <DreamHomePreview
              placed={placedEntries}
              selection={selection}
              equippedKeys={equippedKeys}
              outfit={activeOutfit}
              customUri={activeCustomUri}
              onOpenEditor={() => { setEditorSelectedId(null); setEditorOpen(true); }}
            />

            {/* 3. Category tabs */}
            <View style={styles.tabsWrap}>
              <RewardCategoryTabs selected={category} counts={counts} onSelect={setCategory} />
            </View>

            {/* 3. Avatar preview */}
            <View style={styles.previewWrap}>
              <AvatarRewardPreview
                selection={selection}
                equippedKeys={equippedKeys}
                outfit={activeOutfit}
                customUri={activeCustomUri}
                level={level}
                equippedCount={equippedCount}
                coins={coins}
                onEditAvatar={() => setShowSetup(true)}
              />
            </View>

            {/* 4. Category content */}
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>
                {REWARD_CATEGORIES.find((c) => c.key === category)?.icon}{' '}
                {REWARD_CATEGORIES.find((c) => c.key === category)?.name}
              </Text>
              <Text style={styles.sectionCount}>{counts[category]?.unlocked}/{counts[category]?.total} unlocked</Text>
            </View>
            {category === 'wardrobe' && (
              <Text style={styles.filterNote}>Showing outfits that suit your avatar's profile.</Text>
            )}

            <RewardGrid
              items={items}
              completedCount={completedCount}
              isEquipped={isEquipped}
              onEquip={toggleEquip}
              isPlaced={(id) => placedIds.has(id)}
              onPlace={placeItem}
            />
          </ScrollView>
        </View>
      </View>

      {showSetup && <AvatarSetupScreen onClose={() => setShowSetup(false)} />}

      {editorOpen && (
        <DreamHomeEditorModal
          items={placedEntries}
          selectedId={editorSelectedId}
          onSelect={setEditorSelectedId}
          onMove={moveItem}
          onRemove={removeItem}
          onReset={resetLayout}
          onClose={() => setEditorOpen(false)}
          selection={selection}
          equippedKeys={equippedKeys}
          outfit={activeOutfit}
          customUri={activeCustomUri}
        />
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
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 4, backgroundColor: '#FFFFFF',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  close: { width: 56, height: 30, justifyContent: 'center' },
  closeX: { fontSize: 18, fontWeight: '800', color: '#2A2E33' },
  title: { fontSize: 18, fontWeight: '900', color: '#21242B' },
  editPill: {
    width: 56, alignItems: 'flex-end',
  },
  editPillText: { color: PRIMARY, fontWeight: '900', fontSize: 13 },
  subtitle: { textAlign: 'center', fontSize: 12, color: '#9AA0A6', fontWeight: '700', backgroundColor: '#FFFFFF', paddingBottom: 12 },

  body: { padding: 14, paddingBottom: 40 },
  tabsWrap: { marginTop: 20 },
  previewWrap: { marginTop: 14 },

  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#21242B' },
  sectionCount: { fontSize: 12, fontWeight: '800', color: '#9AA0A6' },
  filterNote: { fontSize: 11.5, color: '#9AA0A6', fontWeight: '600', marginBottom: 12 },
});
