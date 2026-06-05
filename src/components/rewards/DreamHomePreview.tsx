/**
 * DreamHomePreview — the Dream Home showcase on the Rewards page.
 *
 * Shows the FULL house image (full aspect ratio, not cropped/zoomed) in a
 * rounded card, with the learner's placed rewards laid on top as natural
 * isometric objects (read-only here). Tapping the card opens the full-screen
 * editor where items can be dragged and arranged.
 *
 * The placed items + their positions are supplied by the parent (the effective
 * Dream Home layout = defaults + the user's saved overrides).
 */
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { AvatarSelection } from '../../storage/avatarStorage';
import { EquipKey } from '../../data/rewards';
import { OutfitOverride } from '../../data/avatarOutfits';
import { RewardItem } from '../../data/rewardCategories';
import { VIEWPORT_W } from '../../utils/viewport';
import UserAvatar from '../avatar/UserAvatar';
import PlacedRewardObject from './PlacedRewardObject';

const DREAM_HOME = require('../../assets/dream-home/dream_home_base.jpeg');
const IMG_ASPECT = 2816 / 1536;
const CARD_W = VIEWPORT_W - 28;
const IMG_H = Math.round(CARD_W / IMG_ASPECT);   // full house, full aspect (no crop)
const OBJ_BASE = 42;

export interface PreviewEntry {
  item: RewardItem;
  xPercent: number;
  yPercent: number;
  scale: number;
  isNew?: boolean;
}

interface Props {
  placed: PreviewEntry[];
  selection: AvatarSelection;
  equippedKeys: EquipKey[];
  outfit?: OutfitOverride;
  customUri: string | null;
  /** Dream Home progress: placeable items unlocked / total. */
  unlockedItems: number;
  totalItems: number;
  onOpenEditor: () => void;
}

export default function DreamHomePreview({ placed, selection, equippedKeys, outfit, customUri, unlockedItems, totalItems, onOpenEditor }: Props) {
  return (
    <View>
      <Text style={styles.title}>🏡  My Dream Home</Text>

      {/* glow wrapper → premium soft halo behind the card */}
      <View style={styles.glowWrap}>
        <Pressable style={styles.card} onPress={onOpenEditor}>
          <Image source={DREAM_HOME} style={{ width: CARD_W, height: IMG_H }} resizeMode="cover" />

          {/* placed objects (read-only; taps fall through to open the editor) */}
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            {placed.map((e) => {
              const x = (e.xPercent / 100) * CARD_W;
              const y = (e.yPercent / 100) * IMG_H;
              const size = Math.round(OBJ_BASE * e.scale);
              return (
                <PlacedRewardObject
                  key={e.item.id}
                  item={e.item}
                  left={x - size / 2}
                  top={y - size}
                  size={size}
                  zIndex={Math.round(e.yPercent)}
                  isNew={e.isNew}
                  onPress={() => {}}
                />
              );
            })}

            {/* avatar near the porch */}
            <View style={[styles.avatarWrap, { left: (44 / 100) * CARD_W - 18, top: (78 / 100) * IMG_H - 44 }]}>
              {customUri ? (
                <Image source={{ uri: customUri }} style={styles.avatarImg} resizeMode="cover" />
              ) : (
                <UserAvatar userType={selection.userType} gender={selection.gender} age={selection.age} size={44} equipped={equippedKeys} outfit={outfit} shadow />
              )}
            </View>
          </View>

          {/* bottom scrim for legible hero text */}
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Svg width={CARD_W} height={IMG_H}>
              <Defs>
                <LinearGradient id="dh_scrim" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0.5" stopColor="#000000" stopOpacity="0" />
                  <Stop offset="1" stopColor="#000000" stopOpacity="0.62" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width={CARD_W} height={IMG_H} fill="url(#dh_scrim)" />
            </Svg>
          </View>

          {/* Dream Home progress badge (top-left) */}
          <View style={styles.progressBadge}>
            <Text style={styles.progressLabel}>🏡 Dream Home Progress</Text>
            <Text style={styles.progressCount}>{unlockedItems} / {totalItems} Items Unlocked</Text>
          </View>

          {/* hero overlay text + CTA (bottom) */}
          <View pointerEvents="none" style={styles.heroOverlay}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Your world is growing</Text>
              <Text style={styles.heroSub}>Claim rewards to fill your dream home</Text>
            </View>
            <View style={styles.expandPill}>
              <Text style={styles.expandText}>Tap to expand  ⤢</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '900', color: '#21242B', marginTop: 4, marginBottom: 10 },
  // soft warm halo behind the card for a premium glow
  glowWrap: {
    borderRadius: 26,
    shadowColor: '#FF8A3D',
    shadowOpacity: 0.28,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  card: {
    width: CARD_W,
    height: IMG_H,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#DCE8D8',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  avatarWrap: { position: 'absolute', alignItems: 'center', width: 36 },
  avatarImg: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#FFFFFF' },
  progressBadge: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: 'rgba(255,122,0,0.95)', borderRadius: 13, paddingHorizontal: 12, paddingVertical: 7,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  progressLabel: { color: 'rgba(255,255,255,0.92)', fontWeight: '800', fontSize: 9.5, letterSpacing: 0.2 },
  progressCount: { color: '#FFFFFF', fontWeight: '900', fontSize: 13, marginTop: 1 },
  heroOverlay: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingBottom: 12,
  },
  heroTitle: { color: '#FFFFFF', fontWeight: '900', fontSize: 19, textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 6, textShadowOffset: { width: 0, height: 1 } },
  heroSub: { color: 'rgba(255,255,255,0.88)', fontWeight: '700', fontSize: 11.5, marginTop: 2 },
  expandPill: {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 13, paddingHorizontal: 11, paddingVertical: 7,
    marginBottom: 2,
  },
  expandText: { color: '#21242B', fontWeight: '900', fontSize: 11.5 },
});
