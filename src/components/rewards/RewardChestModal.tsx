/**
 * RewardChestModal — premium reward-unlock popup that ALWAYS fits the phone.
 *
 * Sizing is driven by useWindowDimensions (capped to the design frame) so the
 * card never exceeds the screen on small / medium / large phones:
 *   width  = min(screenW, 440) * 0.86
 *   height = min(screenH, 956) * 0.72  (cap)
 *
 * Flow: gift box drops → shakes ~0.8s → lid opens with a golden glow → the
 * reward RISES OUT of the open box (the box stays visible) → sparkles → user
 * taps Wear Now → reward flies to the avatar + applies instantly.
 *
 * Voice (demo): only for the FIRST level — "Great job, let's move to level 2."
 * on reveal and "You look nice!" after Wear Now. Silent on every other level.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming,
} from 'react-native-reanimated';
import { RewardItem } from '../../data/rewardCategories';
import { VIEWPORT_W, VIEWPORT_H } from '../../utils/viewport';
import { playSound } from '../../services/soundService';
import { triggerHaptic } from '../../services/hapticService';
import { speak, speakApplied, speakAddedToWorld } from '../../services/voiceService';
import { primaryActionLabel, isPlaceable } from '../../services/RewardClaimFlow';
import { anchorOffset } from '../../utils/avatarAnchorPoints';
import { ObjectVisual } from './placedObjects';
import GiftBox from './reveal/GiftBox';
import ConfettiLayer from './reveal/ConfettiLayer';
import SparkleLayer from './reveal/SparkleLayer';

type Phase = 'drop' | 'shake' | 'open' | 'revealed' | 'flying';

const GOLD = '#F5B431';
const MESSAGES = ['Looking stylish!', 'You look nice!', 'Awesome choice!'];

interface Props {
  reward: RewardItem | null;
  headerKind?: 'level' | 'topic';
  levelNumber?: number | null;
  /** True only for the very first level (global id 1) — gates demo voice. */
  isFirstLevel?: boolean;
  onApply: (item: RewardItem) => void;
  onClose: () => void;
}

export default function RewardChestModal({
  reward, headerKind = 'level', levelNumber, isFirstLevel = false, onApply, onClose,
}: Props) {
  const win = useWindowDimensions();
  const SW = Math.min(win.width || VIEWPORT_W, VIEWPORT_W);
  const SH = Math.min(win.height || VIEWPORT_H, VIEWPORT_H);
  const CARD_W = Math.round(SW * 0.86);
  const MAX_H = Math.round(SH * 0.72);
  const small = SH < 720;
  const BOX = small ? 92 : 104;
  const REWARD = small ? 96 : 112;
  const STAGE_H = 150;
  const GLOW_SZ = REWARD + 96;
  const CTA_W = Math.min(220, CARD_W - 40);

  const [phase, setPhase] = useState<Phase>('drop');
  const phaseRef = useRef<Phase>('drop');
  const setP = (p: Phase) => { phaseRef.current = p; setPhase(p); };
  const [confetti, setConfetti] = useState(false);

  const backdrop = useSharedValue(0);
  const cardS = useSharedValue(0.86);
  const cardO = useSharedValue(0);
  const dropY = useSharedValue(-STAGE_H - 60);
  const shake = useSharedValue(0);
  const open = useSharedValue(0);
  const glow = useSharedValue(0);
  const rise = useSharedValue(0);
  const pop = useSharedValue(0);
  const breathe = useSharedValue(0);
  const sway = useSharedValue(0);
  const textO = useSharedValue(0);
  const flyX = useSharedValue(0);
  const flyY = useSharedValue(0);
  const flyScale = useSharedValue(1);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const after = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };

  useEffect(() => {
    if (!reward) return;
    backdrop.value = withTiming(1, { duration: 220 });
    cardS.value = withSpring(1, { damping: 14, stiffness: 150, mass: 0.9 });
    cardO.value = withTiming(1, { duration: 220 });
    playSound('reward_box_appear');
    dropY.value = withSpring(0, { damping: 6.5, stiffness: 150, mass: 0.9 });
    glow.value = withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
    after(580, startShake);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reward]);

  const startShake = () => {
    if (phaseRef.current !== 'drop') return;
    setP('shake');
    playSound('reward_box_shake');
    triggerHaptic('light');
    shake.value = withRepeat(withSequence(
      withTiming(1, { duration: 60 }), withTiming(-1, { duration: 60 }),
      withTiming(1, { duration: 60 }), withTiming(0, { duration: 60 }),
    ), -1, false);
    after(820, openBox); // ~0.8s shake
  };

  const openBox = () => {
    if (phaseRef.current !== 'shake') return;
    setP('open');
    shake.value = withTiming(0, { duration: 70 });
    open.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }); // lid lifts
    playSound('reward_box_open');
    triggerHaptic('success');
    setConfetti(true);
    after(240, reveal);
  };

  const reveal = () => {
    setP('revealed');
    playSound('reward_unlocked');
    // reward RISES out of the open box
    rise.value = withTiming(1, { duration: 460, easing: Easing.out(Easing.cubic) });
    pop.value = withSequence(
      withTiming(0, { duration: 1 }),
      withTiming(1.2, { duration: 340, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 200 }),
    );
    breathe.value = withDelay(560, withRepeat(withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.ease) }), -1, true));
    sway.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }), -1, true);
    textO.value = withDelay(260, withTiming(1, { duration: 260 }));
    if (isFirstLevel) speak("Great job, let's move to level 2.");
  };

  const onPrimary = () => {
    if (!reward || phaseRef.current !== 'revealed') return;
    setP('flying');
    onApply(reward);
    const place = isPlaceable(reward);
    playSound(place ? 'item_placed' : 'claim_reward');
    triggerHaptic('medium');
    if (isFirstLevel) { if (place) speakAddedToWorld(); else speakApplied(); }
    const off = anchorOffset(reward);
    const targetX = place ? -SW * 0.26 : off.xOffset;
    const targetY = place ? SH * 0.30 : SH * 0.20 + off.yOffset;
    flyX.value = withTiming(targetX, { duration: 760, easing: Easing.in(Easing.cubic) });
    flyY.value = withSpring(targetY, { damping: 16, stiffness: 90, mass: 0.9 });
    flyScale.value = withTiming(0.35, { duration: 760 });
    cardO.value = withTiming(0.4, { duration: 260 });
    backdrop.value = withTiming(0, { duration: 760 });
    after(820, onClose);
  };

  const onLater = () => {
    if (phaseRef.current === 'flying') return;
    setP('flying');
    cardO.value = withTiming(0, { duration: 180 });
    backdrop.value = withTiming(0, { duration: 200 });
    after(210, onClose);
  };

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const cardStyle = useAnimatedStyle(() => ({ opacity: cardO.value, transform: [{ scale: cardS.value }] }));
  const boxStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dropY.value }, { translateX: shake.value * 5 }, { rotate: `${shake.value * 5}deg` }, { scale: 1 + glow.value * 0.03 }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: (0.35 + glow.value * 0.4) * (0.4 + open.value * 0.6), transform: [{ scale: 0.8 + glow.value * 0.16 + open.value * 0.12 }] }));
  const rewardStyle = useAnimatedStyle(() => ({
    opacity: rise.value,
    transform: [
      { translateX: flyX.value },
      { translateY: flyY.value + (1 - rise.value) * 38 },
      { scale: pop.value * (1 + breathe.value * 0.05) * flyScale.value },
      { rotate: `${(sway.value - 0.5) * 8}deg` },
    ],
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textO.value, transform: [{ translateY: (1 - textO.value) * 10 }] }));

  if (!reward) return null;
  const showReward = phase === 'revealed' || phase === 'flying';
  const headerText = headerKind === 'topic' ? '🏆  Topic Complete' : `✅  Level ${levelNumber ?? ''} Complete`;
  const msg = isFirstLevel ? 'Awesome choice!' : MESSAGES[(reward.unlockLevel ?? 0) % MESSAGES.length];

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onLater}>
      <Animated.View style={[styles.overlay, backdropStyle]} />
      <View style={styles.center} pointerEvents="box-none">
        {confetti && <ConfettiLayer count={20} />}

        <Animated.View style={[styles.card, { width: CARD_W, maxHeight: MAX_H }, cardStyle]}>
          <View style={styles.headerChip}>
            <Text style={styles.headerText}>{headerText}</Text>
          </View>

          {/* gift box → reward rises out */}
          <View style={[styles.stage, { height: STAGE_H }]}>
            <Animated.View pointerEvents="none" style={[styles.glow, { width: GLOW_SZ, height: GLOW_SZ, marginLeft: -GLOW_SZ / 2, marginTop: -GLOW_SZ / 2 }, glowStyle]}>
              <Svg width={GLOW_SZ} height={GLOW_SZ}>
                <Defs>
                  <RadialGradient id="rc_glow" cx="0.5" cy="0.5" rx="0.5" ry="0.5">
                    <Stop offset="0" stopColor={GOLD} stopOpacity="0.6" />
                    <Stop offset="0.6" stopColor={GOLD} stopOpacity="0.16" />
                    <Stop offset="1" stopColor={GOLD} stopOpacity="0" />
                  </RadialGradient>
                </Defs>
                <Rect width={GLOW_SZ} height={GLOW_SZ} fill="url(#rc_glow)" />
              </Svg>
            </Animated.View>

            {showReward && (
              <View pointerEvents="none" style={styles.sparkleWrap}>
                <SparkleLayer width={REWARD + 50} height={REWARD + 40} color={GOLD} count={12} />
              </View>
            )}

            {/* gift box stays at the bottom of the stage */}
            <Animated.View style={[styles.boxWrap, { width: BOX, height: BOX, marginLeft: -BOX / 2 }, boxStyle]}>
              <GiftBox size={BOX} open={open} glowColor={GOLD} />
            </Animated.View>

            {/* reward emerging above the box */}
            {showReward && (
              <Animated.View pointerEvents="none" style={[styles.rewardWrap, { width: REWARD, height: REWARD, marginLeft: -REWARD / 2, bottom: BOX * 0.55 }, rewardStyle]}>
                <ObjectVisual item={reward} size={REWARD} />
              </Animated.View>
            )}
          </View>

          {/* copy + CTAs */}
          <Animated.View style={[styles.copy, textStyle]}>
            <Text style={styles.kicker}>Reward Unlocked</Text>
            <Text style={styles.name} numberOfLines={1}>{reward.name}</Text>
            <Text style={styles.msg}>{msg}</Text>
            <Pressable onPress={onPrimary} style={({ pressed }) => [styles.primary, { width: CTA_W }, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}>
              <Text style={styles.primaryText} numberOfLines={1}>{primaryActionLabel(reward)}</Text>
            </Pressable>
            <Pressable onPress={onLater} hitSlop={10} style={styles.later}>
              <Text style={styles.laterText}>Maybe Later</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,10,14,0.55)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 20 },
  card: {
    borderRadius: 28, paddingTop: 16, paddingBottom: 18, paddingHorizontal: 18,
    backgroundColor: '#FFFDFA', alignItems: 'center', overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 28, shadowOffset: { width: 0, height: 14 }, elevation: 18,
  },
  headerChip: { backgroundColor: '#F1F4F8', borderRadius: 999, paddingHorizontal: 15, paddingVertical: 6 },
  headerText: { color: '#3A4250', fontWeight: '900', fontSize: 13, letterSpacing: 0.2 },
  stage: { alignSelf: 'stretch', marginTop: 6, justifyContent: 'flex-end', alignItems: 'center' },
  glow: { position: 'absolute', left: '50%', top: '46%' },
  sparkleWrap: { position: 'absolute', top: 6, left: 0, right: 0, alignItems: 'center' },
  boxWrap: { position: 'absolute', left: '50%', bottom: 6 },
  rewardWrap: { position: 'absolute', left: '50%', alignItems: 'center', justifyContent: 'center' },
  copy: { alignItems: 'center', alignSelf: 'stretch' },
  kicker: { color: GOLD, fontWeight: '900', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  name: { color: '#1B1F26', fontWeight: '900', fontSize: 23, textAlign: 'center', marginTop: 3 },
  msg: { color: '#6B7280', fontWeight: '700', fontSize: 14, marginTop: 4, marginBottom: 16 },
  primary: {
    height: 52, borderRadius: 26, backgroundColor: '#FF7A00', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FF7A00', shadowOpacity: 0.42, shadowRadius: 14, shadowOffset: { width: 0, height: 7 }, elevation: 7,
  },
  primaryText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  later: { paddingVertical: 10, marginTop: 2 },
  laterText: { color: '#9AA0A6', fontWeight: '800', fontSize: 13.5 },
});
