/**
 * RarityCardFx — subtle rarity animations layered inside a reward card's image
 * area (which clips with overflow:hidden):
 *   • Epic       → a small twinkling sparkle
 *   • Legendary  → a soft diagonal shine sweep
 * Common/Rare render nothing (rare conveys value via its blue border + glow).
 * Kept lightweight (one looping shared value each) for smooth performance.
 */
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { RewardRarity } from '../../data/rewardRarity';

interface Props { rarity?: RewardRarity; width: number; height: number; }

export default function RarityCardFx({ rarity, width, height }: Props) {
  if (!width || !height) return null;
  if (rarity === 'legendary') return <ShineSweep width={width} height={height} />;
  if (rarity === 'epic') return <EpicSparkle />;
  return null;
}

function ShineSweep({ width, height }: { width: number; height: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withRepeat(
      withSequence(
        withDelay(900, withTiming(1, { duration: 950, easing: Easing.inOut(Easing.quad) })),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
  }, [p]);
  const band = Math.max(26, width * 0.34);
  const st = useAnimatedStyle(() => ({
    transform: [{ translateX: -band + p.value * (width + 2 * band) }, { skewX: '-18deg' }],
  }));
  return (
    <Animated.View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.band, { width: band, height: height * 1.6, top: -height * 0.3 }, st]} />
    </Animated.View>
  );
}

function EpicSparkle() {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withRepeat(withSequence(withTiming(1, { duration: 720 }), withTiming(0.15, { duration: 720 })), -1, true);
  }, [p]);
  const st = useAnimatedStyle(() => ({ opacity: 0.35 + p.value * 0.65, transform: [{ scale: 0.7 + p.value * 0.5 }] }));
  return <Animated.Text style={[styles.sparkle, st]}>✨</Animated.Text>;
}

const styles = StyleSheet.create({
  band: { position: 'absolute', left: 0, backgroundColor: 'rgba(255,255,255,0.45)', borderRadius: 6 },
  sparkle: { position: 'absolute', bottom: 5, right: 7, fontSize: 13, pointerEvents: 'none' },
});
