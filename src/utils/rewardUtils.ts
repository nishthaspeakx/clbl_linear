/**
 * rewardUtils — coin-trail generation + sound/haptic placeholders for the
 * level-completion "walk and collect" moment.
 */
import { playSound } from './sound';

/** Coin pickup blip. Wired to the synthesized coin WAV. */
export function playCoinSound(): void {
  playSound('coin');
}

/**
 * Light haptic placeholder. No-op for now (web has no haptics); wire
 * expo-haptics here later:
 *   import * as Haptics from 'expo-haptics';
 *   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
 */
export function triggerLightHaptic(): void {
  // intentionally a no-op placeholder
}

export interface TrailCoin {
  /** order index (0-based) — also the collection order. */
  index: number;
  /** fraction along the path from current pin (0) to next pin (1). */
  t: number;
  /** coin value awarded when collected. */
  value: number;
}

/**
 * Lay out `count` coins evenly along the path between two levels, summing to
 * `total` coins. Coins sit between t=0.14 and t=0.9 so they hug the road, not
 * the pins themselves.
 */
export function generateCoinTrail(total = 10, count = 5): TrailCoin[] {
  const n = Math.max(3, Math.min(7, count));
  const base = Math.floor(total / n);
  const remainder = total - base * n;
  const coins: TrailCoin[] = [];
  for (let i = 0; i < n; i++) {
    const t = 0.14 + (0.76 * i) / (n - 1);
    // push the remainder onto the last coins so it still sums to `total`
    const value = base + (i >= n - remainder ? 1 : 0);
    coins.push({ index: i, t, value });
  }
  return coins;
}
