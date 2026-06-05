/**
 * RewardChestModal — a treasure-chest reward reveal (Clash Royale / Coin Master
 * style) shown after a level.
 *
 * Flow: dark overlay → a glowing gift box drops & bounces → wiggles for ~1s with
 * a rattle + escaping sparkles → bursts open (gold rays, confetti, sparkles) →
 * the reward rises out (scale 0→1.2→1, gentle sway, golden glow) → "🎉 Reward
 * Unlocked" + name + a category CTA. Voice (TTS) celebrates the unlock.
 *
 * Wear Now / Add To My World → applies the reward immediately (avatar updates
 * live on the map behind the overlay), the reward flies toward the avatar with
 * a sparkle burst + a spoken line, then the modal closes. Maybe Later just closes.
 *
 * Mount one per reward (key by id) so each starts fresh.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View, Vibration } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming,
} from 'react-native-reanimated';
import { RewardItem } from '../../data/rewardCategories';
import { VIEWPORT_W, VIEWPORT_H } from '../../utils/viewport';
import { playSound } from '../../services/soundService';
import { triggerHaptic } from '../../services/hapticService';
import { speakUnlock, speakApplied } from '../../services/voiceService';
import { primaryActionLabel, isPlaceable } from '../../services/RewardClaimFlow';
import { ObjectVisual } from './placedObjects';
import GiftBox from './reveal/GiftBox';
import ConfettiLayer from './reveal/ConfettiLayer';
import SparkleLayer from './reveal/SparkleLayer';
import ParticleLayer from './reveal/ParticleLayer';

type Phase = 'drop' | 'shake' | 'opening' | 'revealed' | 'flying';

const GOLD = '#F5B431';
const STAGE_W = Math.min(VIEWPORT_W - 40, 300);
const STAGE_H = 250;
const BOX = 130;

interface Props {
  reward: RewardItem | null;
  onApply: (item: RewardItem) => void;
  onClose: () => void;
}

export default function RewardChestModal({ reward, onApply, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('drop');
  const phaseRef = useRef<Phase>('drop');
  const setP = (p: Phase) => { phaseRef.current = p; setPhase(p); };
  const [confetti, setConfetti] = useState(false);

  const dropY = useSharedValue(-380);
  const glow = useSharedValue(0);
  const shake = useSharedValue(0);
  const open = useSharedValue(0);
  const flash = useSharedValue(0);
  const rays = useSharedValue(0);
  const rScale = useSharedValue(0);
  const rRot = useSharedValue(0);
  const rOpacity = useSharedValue(0);
  const card = useSharedValue(0);
  const flyY = useSharedValue(0);
  const flyScale = useSharedValue(1);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const after = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };

  useEffect(() => {
    if (!reward) return;
    playSound('reward_box_appear');
    dropY.value = withSpring(0, { damping: 7, stiffness: 130, mass: 0.9 });
    glow.value = withRepeat(withTiming(1, { duration: 850, easing: Easing.inOut(Easing.ease) }), -1, true);
    after(640, startShake);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reward]);

  const startShake = () => {
    if (phaseRef.current !== 'drop') return;
    setP('shake');
    playSound('reward_box_shake'); // rattle
    triggerHaptic('light');
    shake.value = withRepeat(withSequence(
      withTiming(1, { duration: 70 }), withTiming(-1, { duration: 70 }),
      withTiming(1, { duration: 70 }), withTiming(0, { duration: 70 }),
    ), -1, false);
    after(1050, openBox); // ~1s anticipation → auto open
  };

  const openBox = () => {
    if (phaseRef.current !== 'shake' && phaseRef.current !== 'drop') return;
    setP('opening');
    shake.value = withTiming(0, { duration: 80 });
    open.value = withTiming(1, { duration: 430, easing: Easing.out(Easing.cubic) });
    flash.value = withSequence(withTiming(1, { duration: 120 }), withTiming(0, { duration: 520 }));
    rays.value = withTiming(1, { duration: 650 });
    playSound('reward_box_open');
    triggerHaptic('success');
    setConfetti(true);
    after(320, reveal);
  };

  const reveal = () => {
    setP('revealed');
    playSound('reward_unlocked');
    rOpacity.value = withTiming(1, { duration: 200 });
    rScale.value = withSequence(
      withTiming(0, { duration: 1 }),
      withTiming(1.2, { duration: 340, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 200 }),
    );
    rRot.value = withRepeat(withSequence(withTiming(1, { duration: 1500 }), withTiming(-1, { duration: 1500 })), -1, true);
    card.value = withDelay(280, withTiming(1, { duration: 300 }));
    if (Platform.OS !== 'web') Vibration.vibrate(26);
    if (reward) speakUnlock(reward.name);
  };

  const onPrimary = () => {
    if (!reward || phaseRef.current === 'flying') return;
    setP('flying');
    onApply(reward); // apply now → avatar updates live on the map behind the overlay
    playSound(isPlaceable(reward) ? 'item_placed' : 'claim_reward');
    triggerHaptic('medium');
    speakApplied();
    flyY.value = withTiming(VIEWPORT_H * 0.34, { duration: 520, easing: Easing.in(Easing.cubic) });
    flyScale.value = withTiming(0.18, { duration: 520 });
    card.value = withTiming(0, { duration: 160 });
    after(560, onClose);
  };

  const boxStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dropY.value }, { translateX: shake.value * 5 }, { rotate: `${shake.value * 5}deg` }, { scale: 1 + glow.value * 0.04 }],
  }));
  const haloStyle = useAnimatedStyle(() => ({ opacity: 0.22 + glow.value * 0.4 + rays.value * 0.3, transform: [{ scale: 0.8 + glow.value * 0.18 + rays.value * 0.5 }] }));
  const flashStyle = useAnimatedStyle(() => ({ opacity: flash.value }));
  const rewardStyle = useAnimatedStyle(() => ({
    opacity: rOpacity.value,
    transform: [{ translateY: flyY.value }, { scale: rScale.value * flyScale.value }, { rotate: `${rRot.value * 7}deg` }],
  }));
  const cardStyle = useAnimatedStyle(() => ({ opacity: card.value, transform: [{ translateY: (1 - card.value) * 14 }] }));

  if (!reward) return null;
  const boxVisible = phase === 'drop' || phase === 'shake' || phase === 'opening';

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.overlay}>
        {confetti && <ConfettiLayer count={26} />}

        <View style={styles.stage}>
          {/* golden glow halo */}
          <Animated.View pointerEvents="none" style={[styles.halo, haloStyle]}>
            <Svg width={240} height={240}>
              <Defs>
                <RadialGradient id="rc_halo" cx="0.5" cy="0.5" rx="0.5" ry="0.5">
                  <Stop offset="0" stopColor={GOLD} stopOpacity="0.7" />
                  <Stop offset="1" stopColor={GOLD} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Rect width={240} height={240} fill="url(#rc_halo)" />
            </Svg>
          </Animated.View>

          {/* open flash */}
          <Animated.View pointerEvents="none" style={[styles.halo, flashStyle]}>
            <Svg width={240} height={240}><Rect width={240} height={240} fill="url(#rc_halo)" /></Svg>
          </Animated.View>

          {/* sparkles (from shake onward) + rising gold particles (on open) */}
          {phase !== 'drop' && <SparkleLayer width={STAGE_W} height={STAGE_H} color={GOLD} count={14} />}
          {(phase === 'opening' || phase === 'revealed') && (
            <ParticleLayer originX={STAGE_W / 2} originY={STAGE_H * 0.52} count={16} color={GOLD} rise={150} />
          )}

          {/* gift box (tap to open early during shake) */}
          {boxVisible && (
            <Pressable disabled={phase !== 'shake'} onPress={openBox} style={[styles.boxPress, { left: STAGE_W / 2 - BOX / 2, top: STAGE_H - BOX - 8 }]}>
              <Animated.View style={[{ width: BOX, height: BOX }, boxStyle]}>
                <GiftBox size={BOX} open={open} glowColor={GOLD} />
              </Animated.View>
            </Pressable>
          )}

          {/* reward rising */}
          {(phase === 'revealed' || phase === 'flying') && (
            <Animated.View pointerEvents="none" style={[styles.rewardWrap, { left: STAGE_W / 2 - 58, top: STAGE_H * 0.20 }, rewardStyle]}>
              <View style={styles.rewardGlow} />
              <ObjectVisual item={reward} size={88} />
            </Animated.View>
          )}
        </View>

        {/* copy + CTA */}
        {phase === 'revealed' && (
          <Animated.View style={[styles.copy, cardStyle]}>
            <Text style={styles.kicker}>🎉  Reward Unlocked</Text>
            <Text style={styles.name} numberOfLines={2}>{reward.name}</Text>
            <Pressable onPress={onPrimary} style={({ pressed }) => [styles.primary, pressed && { opacity: 0.92 }]}>
              <Text style={styles.primaryText}>{primaryActionLabel(reward)}</Text>
            </Pressable>
            <Pressable onPress={onClose} hitSlop={8} style={styles.later}>
              <Text style={styles.laterText}>Maybe Later</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(8,10,14,0.5)', alignItems: 'center', justifyContent: 'center' },
  stage: { width: STAGE_W, height: STAGE_H, alignItems: 'center', justifyContent: 'flex-end' },
  halo: { position: 'absolute', width: 240, height: 240, top: STAGE_H * 0.5 - 120, left: STAGE_W / 2 - 120, alignItems: 'center', justifyContent: 'center' },
  boxPress: { position: 'absolute' },
  rewardWrap: { position: 'absolute', width: 116, height: 116, alignItems: 'center', justifyContent: 'center' },
  rewardGlow: {
    position: 'absolute', width: 108, height: 108, borderRadius: 54, backgroundColor: GOLD, opacity: 0.22,
    shadowColor: GOLD, shadowOpacity: 0.9, shadowRadius: 22, shadowOffset: { width: 0, height: 0 },
  },
  copy: { alignItems: 'center', marginTop: 18, paddingHorizontal: 24, width: VIEWPORT_W },
  kicker: { color: GOLD, fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },
  name: { color: '#FFFFFF', fontWeight: '900', fontSize: 26, textAlign: 'center', marginTop: 6, marginBottom: 20 },
  primary: {
    alignSelf: 'stretch', backgroundColor: '#FF7A00', borderRadius: 18, paddingVertical: 15, alignItems: 'center',
    shadowColor: '#FF7A00', shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  primaryText: { color: '#FFFFFF', fontWeight: '900', fontSize: 17 },
  later: { paddingVertical: 12, marginTop: 4 },
  laterText: { color: '#C7CDD3', fontWeight: '800', fontSize: 14.5 },
});
