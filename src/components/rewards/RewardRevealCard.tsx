/**
 * RewardRevealCard — the clean, premium reward card shown after a level.
 *
 * Just the reward: a soft white card with the reward image, gentle golden
 * particles + a sparkle, "{name} Unlocked", and two actions (Wear Now / Later).
 * No gift box, no topic/level/rarity text, no overlapping confetti.
 */
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming,
} from 'react-native-reanimated';
import { RewardItem } from '../../data/rewardCategories';
import { primaryActionLabel } from '../../services/RewardClaimFlow';
import { ObjectVisual } from './placedObjects';

const PRIMARY = '#FF7A00';
const GOLD = '#F5B431';
const PARTICLES = 9;
const RING = 64; // radius the particles orbit

interface Props {
  item: RewardItem;
  success: boolean;
  onPrimary: () => void;
  onLater: () => void;
}

export default function RewardRevealCard({ item, success, onPrimary, onLater }: Props) {
  const intro = useSharedValue(0);
  useEffect(() => {
    intro.value = withSpring(1, { damping: 11, stiffness: 130 });
  }, [intro]);
  const cardStyle = useAnimatedStyle(() => ({
    opacity: intro.value,
    transform: [{ scale: 0.85 + intro.value * 0.15 }],
  }));

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      {/* reward + golden particles */}
      <View style={styles.stage}>
        <View pointerEvents="none" style={styles.glow} />
        {Array.from({ length: PARTICLES }).map((_, i) => <Particle key={i} index={i} />)}
        <Sparkle />
        <View style={styles.imageWrap}>
          {success ? (
            <Text style={styles.check}>✅</Text>
          ) : (
            <ObjectVisual item={item} size={76} />
          )}
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>{item.name} Unlocked</Text>

      {!success && (
        <View style={styles.actions}>
          <Pressable onPress={onPrimary} style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }]}>
            <Text style={styles.primaryText}>{primaryActionLabel(item)}</Text>
          </Pressable>
          <Pressable onPress={onLater} hitSlop={8} style={styles.laterBtn}>
            <Text style={styles.laterText}>Later</Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
}

/** A small golden dot orbiting the reward, gently pulsing. */
function Particle({ index }: { index: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      index * 90,
      withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true),
    );
  }, [t, index]);
  const angle = (index / PARTICLES) * Math.PI * 2;
  const baseX = Math.cos(angle) * RING;
  const baseY = Math.sin(angle) * RING * 0.78;
  const style = useAnimatedStyle(() => ({
    opacity: 0.2 + t.value * 0.7,
    transform: [
      { translateX: baseX * (0.9 + t.value * 0.18) },
      { translateY: baseY * (0.9 + t.value * 0.18) },
      { scale: 0.6 + t.value * 0.7 },
    ],
  }));
  const size = 5 + (index % 3) * 2;
  return <Animated.View style={[styles.particle, { width: size, height: size, borderRadius: size }, style]} />;
}

function Sparkle() {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withSequence(withTiming(1, { duration: 650 }), withTiming(0.2, { duration: 650 })), -1, true);
  }, [t]);
  const style = useAnimatedStyle(() => ({ opacity: 0.4 + t.value * 0.6, transform: [{ scale: 0.7 + t.value * 0.5 }] }));
  return <Animated.Text style={[styles.sparkle, style]}>✨</Animated.Text>;
}

const styles = StyleSheet.create({
  card: {
    width: 280, backgroundColor: '#FFFFFF', borderRadius: 26, paddingTop: 18, paddingBottom: 18, paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.28, shadowRadius: 26, shadowOffset: { width: 0, height: 14 }, elevation: 16,
  },
  stage: { width: 180, height: 150, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  glow: {
    position: 'absolute', width: 124, height: 124, borderRadius: 62, backgroundColor: GOLD, opacity: 0.16,
  },
  imageWrap: {
    width: 104, height: 104, borderRadius: 52, backgroundColor: '#FFF8E9',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#F6E2B0',
  },
  check: { fontSize: 60 },
  particle: { position: 'absolute', backgroundColor: GOLD },
  sparkle: { position: 'absolute', top: 6, right: 26, fontSize: 20 },
  title: { fontSize: 19, fontWeight: '900', color: '#21242B', textAlign: 'center', marginTop: 6, marginBottom: 14 },
  actions: { alignSelf: 'stretch', alignItems: 'center' },
  primaryBtn: {
    alignSelf: 'stretch', backgroundColor: PRIMARY, borderRadius: 16, paddingVertical: 13, alignItems: 'center',
    shadowColor: PRIMARY, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
  },
  primaryText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  laterBtn: { paddingVertical: 11, paddingHorizontal: 16, marginTop: 4 },
  laterText: { color: '#9AA0A6', fontWeight: '800', fontSize: 14 },
});
