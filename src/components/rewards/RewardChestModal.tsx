/**
 * RewardChestModal — premium "hero reward" popup shown after a level / topic.
 *
 * Design goal (Duolingo / Monopoly GO / Royal Match): the REWARD is the hero,
 * not the button. A heavily-dimmed background, one centered glass card, a single
 * header line, and a large glowing reward that breathes, sways and sparkles.
 *
 *   ┌────────────────────────────┐
 *   │     ✅ Level 1 Complete     │   ← one header (level OR topic, never both)
 *   │                            │
 *   │        ✨  (reward)  ✨       │   ← 160px, glow + sparkles + breathing
 *   │                            │
 *   │      Reward Unlocked        │
 *   │        Sunglasses           │
 *   │      Looking stylish!       │   ← randomized line
 *   │                            │
 *   │       [ 👓 Wear Now ]        │   ← 220×52 primary
 *   │        Maybe Later          │   ← text-only secondary
 *   └────────────────────────────┘
 *
 * Voice: "Great job!" on appear, "You look nice!" after Wear Now.
 * Mount one per reward (key by id) so each starts fresh.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming,
} from 'react-native-reanimated';
import { RewardItem } from '../../data/rewardCategories';
import { VIEWPORT_W } from '../../utils/viewport';
import { playSound } from '../../services/soundService';
import { triggerHaptic } from '../../services/hapticService';
import { speak, speakApplied } from '../../services/voiceService';
import { primaryActionLabel, isPlaceable } from '../../services/RewardClaimFlow';
import { ObjectVisual } from './placedObjects';
import ConfettiLayer from './reveal/ConfettiLayer';
import SparkleLayer from './reveal/SparkleLayer';

const GOLD = '#F5B431';
const CARD_W = Math.round(VIEWPORT_W * 0.8);
const REWARD = 160;
const GLOW = 230;
const MESSAGES = ['Looking stylish!', 'You look nice!', 'Awesome choice!'];

interface Props {
  reward: RewardItem | null;
  /** Single header: a normal level completion or a topic completion. */
  headerKind?: 'level' | 'topic';
  levelNumber?: number | null;
  onApply: (item: RewardItem) => void;
  onClose: () => void;
}

export default function RewardChestModal({ reward, headerKind = 'level', levelNumber, onApply, onClose }: Props) {
  const [flying, setFlying] = useState(false);
  const flyingRef = useRef(false);
  const msg = useRef(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]).current;

  const backdrop = useSharedValue(0);
  const cardS = useSharedValue(0.82);
  const cardO = useSharedValue(0);
  const pop = useSharedValue(0);     // entrance pop
  const breathe = useSharedValue(0); // looping breathing
  const sway = useSharedValue(0);    // looping slow rotation
  const glow = useSharedValue(0);    // looping glow pulse
  const [confetti, setConfetti] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const after = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };

  useEffect(() => {
    if (!reward) return;
    playSound('reward_unlocked');
    triggerHaptic('success');
    backdrop.value = withTiming(1, { duration: 220 });
    cardS.value = withSpring(1, { damping: 13, stiffness: 150, mass: 0.9 });
    cardO.value = withTiming(1, { duration: 240 });
    // reward entrance pop → settle into continuous breathing + sway + glow
    pop.value = withSequence(
      withTiming(0, { duration: 1 }),
      withTiming(1.16, { duration: 320, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 200 }),
    );
    breathe.value = withDelay(520, withRepeat(withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.ease) }), -1, true));
    sway.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.ease) }), -1, true);
    glow.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);
    setConfetti(true);
    speak('Great job!');
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reward]);

  const onPrimary = () => {
    if (!reward || flyingRef.current) return;
    flyingRef.current = true;
    setFlying(true);
    onApply(reward);
    playSound(isPlaceable(reward) ? 'item_placed' : 'claim_reward');
    triggerHaptic('medium');
    speakApplied();
    cardO.value = withTiming(0, { duration: 220 });
    cardS.value = withTiming(0.9, { duration: 220 });
    backdrop.value = withTiming(0, { duration: 260 });
    after(260, onClose);
  };

  const onLater = () => {
    if (flyingRef.current) return;
    flyingRef.current = true;
    cardO.value = withTiming(0, { duration: 180 });
    backdrop.value = withTiming(0, { duration: 200 });
    after(210, onClose);
  };

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const cardStyle = useAnimatedStyle(() => ({ opacity: cardO.value, transform: [{ scale: cardS.value }] }));
  const rewardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: pop.value * (1 + breathe.value * 0.05) },
      { rotate: `${(sway.value - 0.5) * 8}deg` },
    ],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + glow.value * 0.4,
    transform: [{ scale: 0.9 + glow.value * 0.16 + breathe.value * 0.05 }],
  }));

  if (!reward) return null;

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onLater}>
      <Animated.View style={[styles.overlay, backdropStyle]}>
        {confetti && <ConfettiLayer count={24} />}

        <Animated.View style={[styles.card, cardStyle]}>
          {/* header chip */}
          <View style={styles.headerChip}>
            <Text style={styles.headerText}>{headerKind === 'topic' ? '🏆  Topic Complete' : `✅  Level ${levelNumber ?? ''} Complete`}</Text>
          </View>

          {/* hero reward */}
          <View style={styles.stage}>
            <Animated.View pointerEvents="none" style={[styles.glow, glowStyle]}>
              <Svg width={GLOW} height={GLOW}>
                <Defs>
                  <RadialGradient id="rc_glow" cx="0.5" cy="0.5" rx="0.5" ry="0.5">
                    <Stop offset="0" stopColor={GOLD} stopOpacity="0.65" />
                    <Stop offset="0.6" stopColor={GOLD} stopOpacity="0.18" />
                    <Stop offset="1" stopColor={GOLD} stopOpacity="0" />
                  </RadialGradient>
                </Defs>
                <Rect width={GLOW} height={GLOW} fill="url(#rc_glow)" />
              </Svg>
            </Animated.View>
            <SparkleLayer width={REWARD + 60} height={REWARD + 50} color={GOLD} count={12} />
            <Animated.View style={rewardStyle}>
              <ObjectVisual item={reward} size={REWARD} />
            </Animated.View>
          </View>

          {/* copy */}
          <Text style={styles.kicker}>Reward Unlocked</Text>
          <Text style={styles.name} numberOfLines={2}>{reward.name}</Text>
          <Text style={styles.msg}>{msg}</Text>

          {/* CTAs */}
          <Pressable onPress={onPrimary} style={({ pressed }) => [styles.primary, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}>
            <Text style={styles.primaryText} numberOfLines={1}>{primaryActionLabel(reward)}</Text>
          </Pressable>
          <Pressable onPress={onLater} hitSlop={10} style={styles.later}>
            <Text style={styles.laterText}>Maybe Later</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(8,10,14,0.6)', alignItems: 'center', justifyContent: 'center' },
  card: {
    width: CARD_W, borderRadius: 32, paddingTop: 18, paddingBottom: 22, paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.97)', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#000', shadowOpacity: 0.32, shadowRadius: 34, shadowOffset: { width: 0, height: 18 }, elevation: 18,
  },
  headerChip: {
    backgroundColor: '#F1F4F8', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 7,
  },
  headerText: { color: '#3A4250', fontWeight: '900', fontSize: 13.5, letterSpacing: 0.2 },
  stage: { width: REWARD + 60, height: REWARD + 40, alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 2 },
  glow: { position: 'absolute', width: GLOW, height: GLOW, alignItems: 'center', justifyContent: 'center' },
  kicker: { color: GOLD, fontWeight: '900', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 },
  name: { color: '#1B1F26', fontWeight: '900', fontSize: 27, textAlign: 'center', marginTop: 4 },
  msg: { color: '#6B7280', fontWeight: '700', fontSize: 15, marginTop: 6, marginBottom: 20 },
  primary: {
    width: 220, height: 52, borderRadius: 26, backgroundColor: '#FF7A00',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FF7A00', shadowOpacity: 0.45, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  primaryText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16.5 },
  later: { paddingVertical: 11, marginTop: 2 },
  laterText: { color: '#9AA0A6', fontWeight: '800', fontSize: 14 },
});
