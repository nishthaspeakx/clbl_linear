/**
 * DreamHomePreview — the "My World Alive" Dream Home hero on the Rewards page.
 * Renders the living canvas (house image + day/night lighting + level-gated life
 * effects + animated rewards + avatar) with three on-image overlays only:
 *   • top-left    — a premium "❤️ % Alive · items" glass pill
 *   • bottom-left — the dynamic world-status line (white, on a soft gradient)
 *   • bottom-right— a "🎨 Decorate" CTA
 * Day/night is controlled by the parent (header toggle) via the `night` prop.
 * Tapping the image opens the full-screen Home Builder editor.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { AvatarSelection } from '../../storage/avatarStorage';
import { EquipKey } from '../../data/rewards';
import { OutfitOverride } from '../../data/avatarOutfits';
import { VIEWPORT_W } from '../../utils/viewport';
import { lifeScore, lifeStatusText } from '../../utils/dreamHomeLifeScore';
import { playSound } from '../../services/soundService';
import DreamHomeCanvas, { IMG_ASPECT, PreviewEntry } from './DreamHomeCanvas';

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
  night: boolean;
  onOpenEditor: () => void;
}

export default function DreamHomePreview({ placed, selection, equippedKeys, outfit, customUri, unlockedItems, totalItems, completedCount, night, onOpenEditor }: Props) {
  const score = lifeScore(unlockedItems, totalItems);

  return (
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

        {/* soft bottom-left gradient so the status text stays legible on any scene */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Svg width={CARD_W} height={IMG_H}>
            <Defs>
              <LinearGradient id="dh_prev_scrim" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0.55" stopColor="#000000" stopOpacity="0" />
                <Stop offset="1" stopColor="#000000" stopOpacity="0.55" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width={CARD_W} height={IMG_H} fill="url(#dh_prev_scrim)" />
          </Svg>
        </View>

        {/* tap anywhere on the image to open the editor */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onOpenEditor} />

        {/* Life Score pill (top-left) */}
        <View pointerEvents="none" style={styles.lifePill}>
          <Text style={styles.lifeTop}>❤️ <Text style={styles.lifePct}>{score}%</Text> Alive</Text>
          <Text style={styles.lifeItems}>{unlockedItems}/{totalItems} items</Text>
        </View>

        {/* world-status line (bottom-left) */}
        <View pointerEvents="none" style={styles.statusWrap}>
          <Text style={styles.statusText} numberOfLines={2}>{lifeStatusText(score)}</Text>
        </View>

        {/* Decorate CTA (bottom-right) */}
        <Pressable style={({ pressed }) => [styles.decorateBtn, pressed && { opacity: 0.9 }]} onPress={() => { playSound('button_tap'); onOpenEditor(); }}>
          <Text style={styles.decorateText}>🎨  Decorate</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  glowWrap: { borderRadius: 26, marginTop: 2, shadowColor: '#FF8A3D', shadowOpacity: 0.28, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  card: {
    width: CARD_W, height: IMG_H, borderRadius: 24, overflow: 'hidden', backgroundColor: '#DCE8D8',
    borderWidth: 2, borderColor: '#FFFFFF',
    shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
  },
  lifePill: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: 'rgba(255,255,255,0.86)', borderRadius: 14, paddingHorizontal: 11, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(255,138,61,0.55)',
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  lifeTop: { fontSize: 13, fontWeight: '800', color: '#C2410C' },
  lifePct: { fontSize: 15, fontWeight: '900', color: '#21242B' },
  lifeItems: { fontSize: 10.5, fontWeight: '700', color: '#6B7178', marginTop: 1 },
  statusWrap: { position: 'absolute', left: 14, bottom: 14, right: 130 },
  statusText: {
    color: '#FFFFFF', fontWeight: '900', fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.55)', textShadowRadius: 6, textShadowOffset: { width: 0, height: 1 },
  },
  decorateBtn: {
    position: 'absolute', right: 12, bottom: 12,
    backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 9,
    shadowColor: '#000', shadowOpacity: 0.22, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  decorateText: { color: '#21242B', fontWeight: '900', fontSize: 13 },
});
