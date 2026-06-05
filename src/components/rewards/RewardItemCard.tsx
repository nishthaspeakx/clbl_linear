/**
 * RewardItemCard — a clean SpeakX-style reward card (2-column grid).
 *
 *   [ image ]
 *   Name
 *   [ action button ]
 *
 * No badges / sparkles / glow borders / corner checks. Rarity shows only as a
 * small corner icon. Button label is standardised by kind + state:
 *   wear    → Claim · Wear · Wearing ✓
 *   place   → Claim · Place · Placed ✓
 *   use     → Claim · Use · Active ✓
 *   collect → Claim · Claimed ✓
 *   locked  → 🔒 Level N
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RewardItem } from '../../data/rewardCategories';
import RarityIcon from './RarityIcon';
import { ObjectVisual } from './placedObjects';

const PRIMARY = '#FF7A00';
export type CardKind = 'wear' | 'place' | 'use' | 'collect';

interface Props {
  item: RewardItem;
  unlocked: boolean;
  kind: CardKind;
  owned: boolean;
  active: boolean;
  onAction?: () => void;
}

const LABELS: Record<CardKind, { active: string; owned: string }> = {
  wear: { active: 'Wearing ✓', owned: 'Wear' },
  place: { active: 'Placed ✓', owned: 'Place' },
  use: { active: 'Active ✓', owned: 'Use' },
  collect: { active: 'Claimed ✓', owned: 'Claimed ✓' },
};

export default function RewardItemCard({ item, unlocked, kind, owned, active, onAction }: Props) {
  const phase = active ? 'active' : owned ? 'owned' : 'claim';
  const label = active ? LABELS[kind].active : owned ? LABELS[kind].owned : 'Claim';

  return (
    <View style={styles.card}>
      <View style={[styles.imageArea, !unlocked && styles.imageAreaLocked]}>
        <View style={[styles.visual, !unlocked && styles.visualLocked]}>
          <ObjectVisual item={item} size={44} />
        </View>
        <View style={styles.rarityCorner}><RarityIcon rarity={item.rarity} size={12} muted={!unlocked} /></View>
        {!unlocked && <View style={styles.lockOverlay}><Text style={styles.lockIcon}>🔒</Text></View>}
      </View>

      <Text style={[styles.name, !unlocked && styles.nameLocked]} numberOfLines={1}>{item.name}</Text>

      {!unlocked ? (
        <View style={[styles.btn, styles.btnLocked]}>
          <Text style={styles.btnLockedText}>🔒 Level {item.unlockLevel}</Text>
        </View>
      ) : (
        <Pressable onPress={onAction} style={({ pressed }) => [styles.btn, BTN[phase], pressed && { opacity: 0.85 }]}>
          <Text style={[styles.btnText, BTN_TEXT[phase]]}>{label}</Text>
        </Pressable>
      )}
    </View>
  );
}

const BTN: Record<string, object> = {
  claim: { backgroundColor: PRIMARY },
  owned: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: PRIMARY },
  active: { backgroundColor: '#EAF7EE' },
};
const BTN_TEXT: Record<string, object> = {
  claim: { color: '#FFFFFF' },
  owned: { color: PRIMARY },
  active: { color: '#1F8B50' },
};

const styles = StyleSheet.create({
  card: {
    width: '48%', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 7, marginBottom: 11,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  imageArea: {
    width: '100%', height: 52, borderRadius: 11, backgroundColor: '#F6F7F9',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  imageAreaLocked: { backgroundColor: '#ECEEF1' },
  visual: { width: 46, height: 46, alignItems: 'center', justifyContent: 'flex-end' },
  visualLocked: { opacity: 0.3 },
  lockOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  lockIcon: { fontSize: 18 },
  rarityCorner: { position: 'absolute', top: 5, left: 5 },
  name: { fontSize: 12.5, fontWeight: '800', color: '#21242B', textAlign: 'center', marginTop: 5 },
  nameLocked: { color: '#9AA0A6' },
  btn: { marginTop: 6, alignSelf: 'stretch', borderRadius: 10, paddingVertical: 6, alignItems: 'center' },
  btnText: { fontWeight: '800', fontSize: 12.5 },
  btnLocked: { backgroundColor: '#F1F2F4' },
  btnLockedText: { color: '#9AA0A6', fontWeight: '700', fontSize: 11 },
});
