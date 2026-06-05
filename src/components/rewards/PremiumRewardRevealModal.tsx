/**
 * PremiumRewardRevealModal — a memorable, premium reward-reveal moment
 * (inspired by Royal Match / Monopoly GO / Coin Master).
 *
 * Flow: spotlight darkens the screen → a glowing orange-red gift box drops &
 * bounces in → it glows, shakes and emits golden particles → tap (or auto after
 * 2s) → the lid lifts, a light beam shoots up, the reward rises out (scale
 * 0.5→1.2→1.0, rotate −15→15→0) → confetti + sparkle burst → copy appears →
 * a pulsing "Claim Reward" CTA → on claim the reward flies to the collection
 * with an "Added to My World" success beat.
 *
 * Rarity drives the glow colour + a legendary full-screen golden burst.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { RewardItem } from '../../data/rewardCategories';
import { VIEWPORT_W, VIEWPORT_H } from '../../utils/viewport';
import { getRarityStyle } from '../../utils/rarityStyles';
import RarityIcon from './RarityIcon';
import GiftBox from './reveal/GiftBox';
import SparkleLayer from './reveal/SparkleLayer';
import ParticleLayer from './reveal/ParticleLayer';
import ConfettiLayer from './reveal/ConfettiLayer';

interface Props {
  reward: RewardItem | null;
  levelId: number;
  levelTitle: string;
  onClaim: () => void;
  onContinue: () => void;
}

type Phase = 'drop' | 'glow' | 'opening' | 'revealed' | 'claiming';

const GLOW: Record<string, string> = { common: '#CFCFCF', rare: '#4A90E2', epic: '#9B59B6', legendary: '#F5B041' };
const STAGE_W = Math.min(VIEWPORT_W - 36, 320);
const STAGE_H = 250;
const BOX = 148;

export default function PremiumRewardRevealModal({ reward, levelId, levelTitle, onClaim, onContinue }: Props) {
  const [phase, setPhase] = useState<Phase>('drop');
  const phaseRef = useRef<Phase>('drop');
  const setPhaseBoth = (p: Phase) => { phaseRef.current = p; setPhase(p); };
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const dropY = useSharedValue(-360);
  const glow = useSharedValue(0);
  const shake = useSharedValue(0);
  const open = useSharedValue(0);
  const flash = useSharedValue(0);
  const legend = useSharedValue(0);
  const rewardY = useSharedValue(24);
  const rewardScale = useSharedValue(0);
  const rewardRot = useSharedValue(-15);
  const rewardOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const claimPulse = useSharedValue(0);
  const rarityPulse = useSharedValue(0);
  const flyX = useSharedValue(0);
  const flyY = useSharedValue(0);
  const flyScale = useSharedValue(1);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const after = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };
  const legendary = reward?.rarity === 'legendary';
  const glowColor = GLOW[reward?.rarity ?? 'common'];

  useEffect(() => {
    if (!reward) return;
    // 5–7. drop with bounce, glow pulse, shake, particles
    dropY.value = withSpring(0, { damping: 7, stiffness: 130, mass: 0.9 });
    glow.value = withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
    after(680, () => {
      setPhaseBoth('glow');
      shake.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 80 }), withTiming(-1, { duration: 80 }),
          withTiming(1, { duration: 80 }), withTiming(0, { duration: 80 }),
          withTiming(0, { duration: 1200 }),
        ), -1, false,
      );
    });
    // 8. auto-open after 2s
    after(2300, openBox);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [reward]); // eslint-disable-line react-hooks/exhaustive-deps

  const openBox = () => {
    if (phaseRef.current !== 'glow' && phaseRef.current !== 'drop') return;
    setPhaseBoth('opening');
    // 6–7. lid opens, light beam, flash
    shake.value = withTiming(0, { duration: 100 });
    open.value = withTiming(1, { duration: 440, easing: Easing.out(Easing.cubic) });
    flash.value = withSequence(withTiming(1, { duration: 120 }), withTiming(0, { duration: 520 }));
    if (legendary) legend.value = withSequence(withTiming(1, { duration: 220 }), withTiming(0, { duration: 1000 }));
    after(360, reveal);
  };

  const reveal = () => {
    setPhaseBoth('revealed');
    setShowConfetti(true);
    // legendary experience: a celebratory vibration burst on mobile
    if (Platform.OS !== 'web') Vibration.vibrate(legendary ? [0, 35, 55, 35, 70, 55] : 22);
    // large rarity icon pulses in
    rarityPulse.value = withDelay(220, withRepeat(withTiming(1, { duration: 880, easing: Easing.inOut(Easing.ease) }), -1, true));
    // 9. reward rises out: scale 0.5→1.2→1.0, rotate −15→15→0
    rewardOpacity.value = withTiming(1, { duration: 180 });
    rewardY.value = withTiming(-14, { duration: 420, easing: Easing.out(Easing.cubic) });
    rewardScale.value = withSequence(withTiming(0.5, { duration: 1 }), withTiming(1.2, { duration: 320, easing: Easing.out(Easing.back(2)) }), withTiming(1.0, { duration: 200 }));
    rewardRot.value = withSequence(withTiming(-15, { duration: 1 }), withTiming(15, { duration: 220 }), withTiming(0, { duration: 220 }));
    cardOpacity.value = withDelay(260, withTiming(1, { duration: 320 }));
    claimPulse.value = withDelay(600, withRepeat(withTiming(1, { duration: 760, easing: Easing.inOut(Easing.ease) }), -1, true));
  };

  const claim = () => {
    if (phaseRef.current === 'claiming') return;
    setPhaseBoth('claiming');
    setShowSuccess(true);
    // reward flies to the collection (toward top-right) + shrinks
    flyX.value = withTiming(VIEWPORT_W * 0.32, { duration: 520, easing: Easing.in(Easing.cubic) });
    flyY.value = withTiming(-VIEWPORT_H * 0.34, { duration: 520, easing: Easing.in(Easing.cubic) });
    flyScale.value = withTiming(0.18, { duration: 520 });
    cardOpacity.value = withTiming(0, { duration: 220 });
    after(560, onClaim);
  };

  const backdrop = useAnimatedStyle(() => ({}));
  const boxWrap = useAnimatedStyle(() => ({
    transform: [{ translateY: dropY.value }, { rotate: `${shake.value * 4}deg` }, { scale: 1 + glow.value * 0.035 }],
  }));
  const haloStyle = useAnimatedStyle(() => ({ opacity: 0.25 + glow.value * 0.4, transform: [{ scale: 0.85 + glow.value * 0.2 }] }));
  const flashStyle = useAnimatedStyle(() => ({ opacity: flash.value }));
  const legendStyle = useAnimatedStyle(() => ({ opacity: legend.value, transform: [{ scale: 0.4 + legend.value * 1.4 }] }));
  const rewardStyle = useAnimatedStyle(() => ({
    opacity: rewardOpacity.value,
    transform: [
      { translateX: flyX.value },
      { translateY: rewardY.value + flyY.value },
      { scale: rewardScale.value * flyScale.value },
      { rotate: `${rewardRot.value}deg` },
    ],
  }));
  const cardStyle = useAnimatedStyle(() => ({ opacity: cardOpacity.value, transform: [{ translateY: (1 - cardOpacity.value) * 14 }] }));
  const claimStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + claimPulse.value * 0.05 }] }));
  const rarityBigStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + rarityPulse.value * 0.16 }], opacity: 0.9 + rarityPulse.value * 0.1 }));

  if (!reward) return null;
  const canTap = phase === 'glow' || phase === 'drop';

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={onContinue}>
      <Animated.View style={[styles.backdrop, backdrop]}>
        {/* spotlight */}
        <Svg pointerEvents="none" style={StyleSheet.absoluteFill} width={VIEWPORT_W} height={VIEWPORT_H}>
          <Defs>
            <RadialGradient id="spot" cx="0.5" cy="0.4" rx="0.75" ry="0.6">
              <Stop offset="0" stopColor="#241a3a" stopOpacity="0.35" />
              <Stop offset="1" stopColor="#080610" stopOpacity="0.94" />
            </RadialGradient>
          </Defs>
          <Rect width={VIEWPORT_W} height={VIEWPORT_H} fill="url(#spot)" />
        </Svg>

        {/* legendary full-screen golden burst */}
        {legendary && (
          <Animated.View pointerEvents="none" style={[styles.legend, legendStyle]}>
            <Svg width={VIEWPORT_W} height={VIEWPORT_W}>
              <Defs>
                <RadialGradient id="legend" cx="0.5" cy="0.5" rx="0.5" ry="0.5">
                  <Stop offset="0" stopColor="#FFE9A8" stopOpacity="0.9" />
                  <Stop offset="0.5" stopColor="#FFD24A" stopOpacity="0.45" />
                  <Stop offset="1" stopColor="#FFD24A" stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Rect width={VIEWPORT_W} height={VIEWPORT_W} fill="url(#legend)" />
            </Svg>
          </Animated.View>
        )}

        <View style={styles.center}>
          {/* stage: box + effects */}
          <View style={styles.stage}>
            {(phase === 'glow' || phase === 'opening' || phase === 'revealed') && (
              <>
                <SparkleLayer width={STAGE_W} height={STAGE_H} color={glowColor} count={14} />
                <ParticleLayer originX={STAGE_W / 2} originY={STAGE_H * 0.72} color={glowColor} rise={STAGE_H * 0.66} count={16} />
              </>
            )}

            {/* soft glow halo behind box */}
            <Animated.View pointerEvents="none" style={[styles.halo, { left: STAGE_W / 2 - 110, top: STAGE_H * 0.32 }, haloStyle]}>
              <Svg width={220} height={220}>
                <Defs>
                  <RadialGradient id="halo" cx="0.5" cy="0.5" rx="0.5" ry="0.5">
                    <Stop offset="0" stopColor={glowColor} stopOpacity="0.6" />
                    <Stop offset="1" stopColor={glowColor} stopOpacity="0" />
                  </RadialGradient>
                </Defs>
                <Rect width={220} height={220} fill="url(#halo)" />
              </Svg>
            </Animated.View>

            {/* open flash */}
            <Animated.View pointerEvents="none" style={[styles.halo, { left: STAGE_W / 2 - 90, top: STAGE_H * 0.34 }, flashStyle]}>
              <Svg width={180} height={180}>
                <Rect width={180} height={180} fill="url(#halo)" />
              </Svg>
            </Animated.View>

            {/* gift box (tap to open) */}
            <Pressable disabled={!canTap} onPress={openBox} style={[styles.boxPress, { left: STAGE_W / 2 - BOX / 2, top: STAGE_H - BOX - 6 }]}>
              <Animated.View style={[{ width: BOX, height: BOX }, boxWrap]}>
                <GiftBox size={BOX} open={open} glowColor={glowColor} />
              </Animated.View>
            </Pressable>

            {/* reward rising out */}
            {(phase === 'revealed' || phase === 'claiming') && (
              <Animated.View pointerEvents="none" style={[styles.rewardWrap, { left: STAGE_W / 2 - 56, top: STAGE_H * 0.16 }, rewardStyle]}>
                <View style={[styles.rewardRing, { borderColor: glowColor, shadowColor: glowColor }]}>
                  <Text style={styles.rewardIcon}>{reward.icon}</Text>
                </View>
              </Animated.View>
            )}

            {showConfetti && <ConfettiLayer count={30} />}

            {canTap && <Text style={styles.tapHint}>tap to open</Text>}
          </View>

          {/* copy + CTA */}
          <Animated.View style={[styles.copy, cardStyle]}>
            {/* large animated rarity icon above the reward */}
            <Animated.Text style={[styles.bigRarity, { textShadowColor: glowColor }, rarityBigStyle]}>
              {getRarityStyle(reward.rarity).icon}
            </Animated.Text>
            <Text style={styles.amazing}>🎉  Amazing!</Text>
            <Text style={styles.youUnlocked}>You unlocked:</Text>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{reward.icon} {reward.name}</Text>
              <RarityIcon rarity={reward.rarity} size={20} />
            </View>
            <View style={styles.metaRow}>
              {!!reward.topic && <Text style={styles.meta}>From: <Text style={styles.metaB}>{reward.topic}</Text></Text>}
            </View>
            {!!levelTitle && <Text style={styles.meta}>Level: <Text style={styles.metaB}>{levelTitle}</Text></Text>}
          </Animated.View>

          {phase === 'revealed' && (
            <Animated.View style={[styles.claimWrap, claimStyle]}>
              <Pressable style={({ pressed }) => [styles.claim, pressed && { opacity: 0.92 }]} onPress={claim}>
                <Text style={styles.claimText}>🎁  Claim Reward</Text>
              </Pressable>
              <Pressable onPress={onContinue} hitSlop={8}><Text style={styles.skip}>Maybe later</Text></Pressable>
            </Animated.View>
          )}

          {showSuccess && (
            <View style={styles.success}><Text style={styles.successText}>✓  Added to My World</Text></View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  legend: { position: 'absolute', alignSelf: 'center', top: VIEWPORT_H * 0.5 - VIEWPORT_W * 0.5 },
  center: { alignItems: 'center', width: STAGE_W },
  stage: { width: STAGE_W, height: STAGE_H },
  halo: { position: 'absolute' },
  boxPress: { position: 'absolute' },
  rewardWrap: { position: 'absolute', alignItems: 'center' },
  rewardRing: {
    width: 112, height: 112, borderRadius: 56, borderWidth: 3, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)', shadowOpacity: 0.6, shadowRadius: 18, shadowOffset: { width: 0, height: 0 }, elevation: 10,
  },
  rewardIcon: { fontSize: 62 },
  tapHint: { position: 'absolute', bottom: -2, alignSelf: 'center', width: '100%', textAlign: 'center', color: 'rgba(255,255,255,0.75)', fontWeight: '800', fontSize: 12 },
  copy: { alignItems: 'center', marginTop: 6 },
  amazing: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 8 },
  youUnlocked: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '700', marginTop: 6 },
  bigRarity: { fontSize: 42, textAlign: 'center', marginBottom: 2, textShadowRadius: 18, textShadowOffset: { width: 0, height: 0 } },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 },
  name: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  metaRow: { flexDirection: 'row', marginTop: 8 },
  meta: { fontSize: 13, color: 'rgba(255,255,255,0.72)', fontWeight: '700', marginTop: 2 },
  metaB: { color: '#FFD24A', fontWeight: '900' },
  claimWrap: { alignSelf: 'stretch', alignItems: 'center', marginTop: 20 },
  claim: {
    alignSelf: 'stretch', backgroundColor: '#FF7A00', borderRadius: 18, paddingVertical: 16, alignItems: 'center',
    shadowColor: '#FF7A00', shadowOpacity: 0.55, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  claimText: { color: '#FFFFFF', fontWeight: '900', fontSize: 17 },
  skip: { color: 'rgba(255,255,255,0.6)', fontWeight: '800', fontSize: 13, marginTop: 12 },
  success: { marginTop: 18, backgroundColor: 'rgba(59,178,115,0.95)', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 11 },
  successText: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 },
});
