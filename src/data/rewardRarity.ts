/**
 * rewardRarity — reward rarity tiers + their visual treatment.
 *
 *   common    → simple border
 *   rare      → blue glow
 *   epic      → purple glow
 *   legendary → gold glow + sparkle
 *
 * Rarity is derived from how far into the journey a reward unlocks (it gets
 * rarer as you progress), with premium/dream/designer items always legendary.
 */
export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface RarityStyle {
  key: RewardRarity;
  label: string;
  /** Accent colour (border, glow, badge text). */
  color: string;
  /** Soft background tint for the badge. */
  tint: string;
  /** Whether to render a coloured glow (shadow) around the card. */
  glow: boolean;
  /** Whether to add a ✨ sparkle (legendary). */
  sparkle: boolean;
}

export const RARITY_STYLES: Record<RewardRarity, RarityStyle> = {
  common: { key: 'common', label: 'Common', color: '#9AA0A6', tint: '#F1F2F4', glow: false, sparkle: false },
  rare: { key: 'rare', label: 'Rare', color: '#3B82F6', tint: '#E8F0FE', glow: true, sparkle: false },
  epic: { key: 'epic', label: 'Epic', color: '#A855F7', tint: '#F3E8FF', glow: true, sparkle: false },
  legendary: { key: 'legendary', label: 'Legendary', color: '#E0A526', tint: '#FFF6E0', glow: true, sparkle: true },
};

export function rarityStyle(rarity?: RewardRarity): RarityStyle {
  return RARITY_STYLES[rarity ?? 'common'];
}

/** Derive a reward's rarity from its name + unlock level. */
export function rarityForReward(item: { name: string; unlockLevel: number }): RewardRarity {
  const n = item.name.toLowerCase();
  if (n.includes('premium') || n.includes('dream') || n.includes('designer') || n.includes('trophy')) return 'legendary';
  if (item.unlockLevel >= 15) return 'legendary';
  if (item.unlockLevel >= 11) return 'epic';
  if (item.unlockLevel >= 6) return 'rare';
  return 'common';
}
