/**
 * DreamHomePreview — the "My World Alive" Dream Home hero card on the Rewards
 * page. Renders the living canvas (house image + day/night lighting + level-
 * gated life effects + animated rewards + avatar), a day/night toggle, a Life
 * Score badge and a dynamic world-status line. Tapping the card opens the
 * full-screen Home Builder editor.
 */
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { AvatarSelection } from '../../storage/avatarStorage';
import { EquipKey } from '../../data/rewards';
import { OutfitOverride } from '../../data/avatarOutfits';
import { VIEWPORT_W } from '../../utils/viewport';
import { lifeScore, lifeStatusText } from '../../utils/dreamHomeLifeScore';
import DreamHomeCanvas, { IMG_ASPECT, PreviewEntry } from './DreamHomeCanvas';
import DreamHomeLifeScore from './DreamHomeLifeScore';

export type { PreviewEntry } from './DreamHomeCanvas';

const CARD_W = VIEWPORT_W - 28;
const IMG_H = Math.round(CARD_W / IMG_ASPECT);

interface Props {
  placed: PreviewEntry[];
  selection: AvatarSelection;
  equippedKeys: EquipKey[];
  outfit?: OutfitOverride;
  customUri: string | null;
  unlockedItems: number;
  totalItems: number;
  completedCount: number;
  onOpenEditor: () => void;
}

export default function DreamHomePreview({ placed, selection, equippedKeys, outfit, customUri, unlockedItems, totalItems, completedCount, onOpenEditor }: Props) {
  const [night, setNight] = useState(false);
  const score = lifeScore(unlockedItems, totalItems);

  return (
    <View>
      <Text style={styles.title}>🏡  My Dream Home</Text>

      <View style={styles.glowWrap}>
        <View style={styles.card}>
          <DreamHomeCanvas
            width={CARD_W}
            placed={placed}
            completedCount={completedCount}
            night={night}
            selection={selection}
            equippedKeys={equippedKeys}
            outfit={outfit}
            customUri={customUri}
            interactive={false}
          />

          {/* bottom scrim for legible hero text */}
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Svg width={CARD_W} height={IMG_H}>
              <Defs>
                <LinearGradient id="dh_prev_scrim" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0.55" stopColor="#000000" stopOpacity="0" />
                  <Stop offset="1" stopColor="#000000" stopOpacity="0.6" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width={CARD_W} height={IMG_H} fill="url(#dh_prev_scrim)" />
            </Svg>
          </View>

          {/* open-editor hit area (behind the toggle) */}
          <Pressable style={StyleSheet.absoluteFill} onPress={onOpenEditor} />

          {/* Life Score badge (top-left) */}
          <View pointerEvents="none" style={styles.badgeWrap}>
            <DreamHomeLifeScore score={score} unlocked={unlockedItems} total={totalItems} />
          </View>

          {/* day/night toggle (top-right, on top of the hit area) */}
          <Pressable style={({ pressed }) => [styles.toggle, pressed && { opacity: 0.85 }]} onPress={() => setNight((n) => !n)} hitSlop={8}>
            <Text style={styles.toggleText}>{night ? '🌙' : '☀️'}</Text>
          </Pressable>

          {/* hero status text + CTA (bottom) */}
          <View pointerEvents="none" style={styles.heroOverlay}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle} numberOfLines={2}>{lifeStatusText(score)}</Text>
            </View>
            <View style={styles.expandPill}>
              <Text style={styles.expandText}>Tap to expand  ⤢</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '900', color: '#21242B', marginTop: 4, marginBottom: 10 },
  glowWrap: { borderRadius: 26, shadowColor: '#FF8A3D', shadowOpacity: 0.28, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  card: {
    width: CARD_W, height: IMG_H, borderRadius: 24, overflow: 'hidden', backgroundColor: '#DCE8D8',
    borderWidth: 2, borderColor: '#FFFFFF',
    shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
  },
  badgeWrap: { position: 'absolute', top: 12, left: 12 },
  toggle: {
    position: 'absolute', top: 12, right: 12, width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  toggleText: { fontSize: 18 },
  heroOverlay: {
    position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-between', paddingHorizontal: 14, paddingBottom: 12,
  },
  heroTitle: { color: '#FFFFFF', fontWeight: '900', fontSize: 17, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 6, textShadowOffset: { width: 0, height: 1 } },
  expandPill: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 13, paddingHorizontal: 11, paddingVertical: 7, marginBottom: 2, marginLeft: 8 },
  expandText: { color: '#21242B', fontWeight: '900', fontSize: 11.5 },
});
