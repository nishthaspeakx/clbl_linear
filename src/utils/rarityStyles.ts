/**
 * rarityStyles — UI styling for reward rarity. Conveys value visually (icon +
 * border + glow) so users recognise it without reading a label:
 *   ⭕ Common · 🔷 Rare · 🌟 Epic · 👑 Legendary
 *   grey = normal · blue = better · purple = exciting · gold = very special
 */
import { ViewStyle } from 'react-native';
import { RewardRarity } from '../data/rewardRarity';

export interface RarityUIStyle {
  rarity: RewardRarity;
  name: string;
  icon: string;
  /** Accent colour (icon tint, shine). */
  color: string;
  borderColor: string;
  shadowColor: string;
  /** Epic gets a small sparkle; Legendary gets a shine sweep. */
  sparkle: boolean;
  shineSweep: boolean;
  /** Ready-to-spread card style (border + glow shadow). */
  glowStyle: ViewStyle;
}

interface Base { icon: string; name: string; color: string; borderColor: string; shadowColor: string; glow: boolean; sparkle: boolean; shineSweep: boolean; }

const BASE: Record<RewardRarity, Base> = {
  common: { icon: '⭕', name: 'Common', color: '#B0B0B0', borderColor: '#DCDCDC', shadowColor: '#B0B0B0', glow: false, sparkle: false, shineSweep: false },
  rare: { icon: '🔷', name: 'Rare', color: '#4A90E2', borderColor: '#4A90E2', shadowColor: '#4A90E2', glow: true, sparkle: false, shineSweep: false },
  epic: { icon: '🌟', name: 'Epic', color: '#9B59B6', borderColor: '#9B59B6', shadowColor: '#9B59B6', glow: true, sparkle: true, shineSweep: false },
  legendary: { icon: '👑', name: 'Legendary', color: '#F5B041', borderColor: '#F5B041', shadowColor: '#F5B041', glow: true, sparkle: false, shineSweep: true },
};

function glowStyleFor(b: Base): ViewStyle {
  if (!b.glow) return { borderColor: b.borderColor };
  return {
    borderColor: b.borderColor,
    shadowColor: b.shadowColor,
    shadowOpacity: 0.5,
    shadowRadius: 11,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  };
}

export function getRarityStyle(rarity: RewardRarity = 'common'): RarityUIStyle {
  const b = BASE[rarity];
  return {
    rarity, name: b.name, icon: b.icon, color: b.color,
    borderColor: b.borderColor, shadowColor: b.shadowColor,
    sparkle: b.sparkle, shineSweep: b.shineSweep,
    glowStyle: glowStyleFor(b),
  };
}
