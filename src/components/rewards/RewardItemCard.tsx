/**
 * RewardItemCard — a single reward in the grid.
 *
 * Shows the SAME visual asset as the Dream Home (ObjectVisual: full isometric
 * object, or shadowed emoji), greyed with a lock when locked. The footer action
 * depends on the item's mode:
 *   • place  (Home/Garden/Vehicles)        → "Place" / "✓ Placed · Edit"
 *   • equip  (Wardrobe + wearable Lifestyle) → "Claim Reward" / "✅ Claimed"
 *   • view   (non-wearable Lifestyle)        → "✓ Unlocked"
 */
import React, { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { RewardItem } from '../../data/rewardCategories';
import { getRarityStyle } from '../../utils/rarityStyles';
import RarityIcon from './RarityIcon';
import RarityCardFx from './RarityCardFx';
import { ObjectVisual } from './placedObjects';

const PRIMARY = '#FF7A00';
export type CardMode = 'place' | 'equip' | 'view';

interface Props {
  item: RewardItem;
  unlocked: boolean;
  mode: CardMode;
  /** place mode: is the item currently on the Dream Home canvas? */
  placed?: boolean;
  /** equip mode: is the item equipped on the avatar? */
  equipped?: boolean;
  /** Place / Edit / Equip action (omitted when there's nothing to do). */
  onAction?: () => void;
}

export default function RewardItemCard({ item, unlocked, mode, placed, equipped, onAction }: Props) {
  const active = (mode === 'equip' && equipped) || (mode === 'place' && placed);
  const r = getRarityStyle(item.rarity);
  const [area, setArea] = useState({ w: 0, h: 0 });
  const onArea = (e: LayoutChangeEvent) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  // Rarity border + glow (rare/epic/legendary glow; common stays a clean grey border).
  // Locked cards keep a muted neutral border so the rarity reads from the icon, not a glow.
  return (
    <View style={[styles.card, active && styles.cardActive, unlocked && r.glowStyle]}>
      <View style={[styles.imageArea, !unlocked && styles.imageAreaLocked]} onLayout={onArea}>
        <View style={[styles.visual, !unlocked && styles.visualLocked]}>
          <ObjectVisual item={item} size={62} />
        </View>
        {/* rarity shine/sparkle (unlocked only, clipped to the image area) */}
        {unlocked && <RarityCardFx rarity={item.rarity} width={area.w} height={area.h} />}
        {/* rarity icon — top-left corner (hover/long-press for the name) */}
        <View style={[styles.rarityCorner, { borderColor: r.borderColor }]}>
          <RarityIcon rarity={item.rarity} size={13} muted={!unlocked} />
        </View>
        {!unlocked && (
          <View style={styles.lockOverlay}><Text style={styles.lockIcon}>🔒</Text></View>
        )}
        {active && <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>✓</Text></View>}
      </View>

      <Text style={[styles.name, !unlocked && styles.nameLocked]} numberOfLines={1}>{item.name}</Text>
      {!!item.topic && <Text style={styles.topic} numberOfLines={1}>🗺️ {item.topic}</Text>}

      {!unlocked ? (
        <View style={styles.lockTag}><Text style={styles.lockTagText}>🔒 Unlock at Level {item.unlockLevel}</Text></View>
      ) : mode === 'view' ? (
        <View style={styles.unlockedTag}><Text style={styles.unlockedTagText}>✓ Unlocked</Text></View>
      ) : mode === 'equip' ? (
        <Pressable onPress={onAction} style={({ pressed }) => [styles.btn, equipped ? styles.btnOn : styles.btnPrimary, pressed && { opacity: 0.85 }]}>
          <Text style={[styles.btnText, equipped && styles.btnTextOn]}>{equipped ? '✅ Claimed' : 'Claim Reward'}</Text>
        </Pressable>
      ) : (
        <Pressable onPress={onAction} style={({ pressed }) => [styles.btn, placed ? styles.btnOn : styles.btnPrimary, pressed && { opacity: 0.85 }]}>
          <Text style={[styles.btnText, placed && styles.btnTextOn]}>{placed ? '✓ Placed · Edit' : 'Place'}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12, marginBottom: 14,
    alignItems: 'center', borderWidth: 1.5, borderColor: '#EEF0F2',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  cardActive: { backgroundColor: '#FFF9F3' },
  imageArea: {
    width: '100%', height: 84, borderRadius: 14, backgroundColor: '#F6F7F9',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  imageAreaLocked: { backgroundColor: '#ECEEF1' },
  visual: { width: 66, height: 66, alignItems: 'center', justifyContent: 'flex-end' },
  visualLocked: { opacity: 0.32 },
  lockOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  lockIcon: { fontSize: 24 },
  activeBadge: {
    position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: 10,
    backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center',
  },
  activeBadgeText: { color: '#FFFFFF', fontWeight: '900', fontSize: 11 },
  rarityCorner: {
    position: 'absolute', top: 6, left: 6, borderRadius: 9, borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.94)', paddingHorizontal: 4, paddingVertical: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: 13, fontWeight: '800', color: '#21242B', textAlign: 'center', marginTop: 9 },
  nameLocked: { color: '#9AA0A6' },
  topic: { fontSize: 9.5, fontWeight: '700', color: '#2E9E63', marginTop: 2, textAlign: 'center' },
  btn: { marginTop: 8, alignSelf: 'stretch', borderRadius: 11, paddingVertical: 8, alignItems: 'center' },
  btnPrimary: { backgroundColor: PRIMARY },
  btnOn: { backgroundColor: '#EAF7EE', borderWidth: 1, borderColor: '#BFE6CC' },
  btnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12.5 },
  btnTextOn: { color: '#1F8B50' },
  unlockedTag: { marginTop: 8, backgroundColor: '#EAF7EE', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  unlockedTagText: { color: '#1F8B50', fontWeight: '800', fontSize: 11.5 },
  lockTag: { marginTop: 8, backgroundColor: '#F1F2F4', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  lockTagText: { color: '#9AA0A6', fontWeight: '700', fontSize: 11 },
});
