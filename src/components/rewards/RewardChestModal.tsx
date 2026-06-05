/**
 * RewardChestModal — premium reward-unlock popup (Duolingo / Monopoly GO feel).
 *
 * Flow:  Level/Topic Complete → gift box DROPS into the card → bounces → shakes
 * ~0.8s → golden glow → lid OPENS → reward POPS out (scale 0→1.2→1, sway,
 * sparkle burst) → user taps Wear Now → reward FLIES to the avatar, modal fades,
 * reward applies instantly, voice "You look nice!" (or "Added to your world!").
 *
 * Fits the phone screen: card is 86% wide, capped at 82% of height, compact
 * 220×52 CTA, never full-width. Mount one per reward (key by id).
 */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
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
const CARD_W = Math.round(VIEWPORT_W * 0.86);
const MAX_H = Math.round(VIEWPORT_H * 0.82);
const SMALL = VIEWPORT_H < 760;
const REWARD = SMALL ? 112 : 130;
const BOX = SMALL ? 100 : 112;
const STAGE_H = SMALL ? 150 : 168;
const GLOW_SZ = 210;
const MESSAGES = ['Looking stylish!', 'You look nice!', 'Awesome choice!'];

interface Props {
  reward: RewardItem | null;
  headerKind?: 'level' | 'topic';
  levelNumber?: number | null;
  onApply: (item: RewardItem) => void;
  onClose: () => void;
}

export default function RewardChestModal({ reward, headerKind = 'level', levelNumber, onApply, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('drop');
  const phaseRef = useRef<Phase>('drop');
  const setP = (p: Phase) => { phaseRef.current = p; setPhase(p); };
  const [confetti, setConfetti] = useState(false);
  const msg = useRef(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]).current;

  const backdrop = useSharedValue(0);
  const cardS = useSharedValue(0.84);
  const cardO = useSharedValue(0);
  const dropY = useSharedValue(-MAX_H * 0.6);
  const shake = useSharedValue(0);
  const open = useSharedValue(0);
  const boxO = useSharedValue(1);
  const glow = useSharedValue(0);
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
    // 1) box drops + bounces
    playSound('reward_box_appear');
    dropY.value = withSpring(0, { damping: 6.5, stiffness: 140, mass: 0.9 });
    glow.value = withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
    after(560, startShake);
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
    open.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) });
    playSound('reward_box_open');
    triggerHaptic('success');
    setConfetti(true);
    after(300, reveal);
  };

  const reveal = () => {
    setP('revealed');
    playSound('reward_unlocked');
    boxO.value = withTiming(0, { duration: 220 });
    pop.value = withSequence(
      withTiming(0, { duration: 1 }),
      withTiming(1.2, { duration: 320, easing: Easing.out(Easing.back(2.2)) }),
      withTiming(1, { duration: 200 }),
    );
    breathe.value = withDelay(540, withRepeat(withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.ease) }), -1, true));
    sway.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }), -1, true);
    textO.value = withDelay(220, withTiming(1, { duration: 260 }));
    speak('Great job!');
  };

  const onPrimary = () => {
    if (!reward || phaseRef.current === 'flying' || phaseRef.current !== 'revealed') return;
    setP('flying');
    onApply(reward); // applies immediately → avatar/world updates behind the modal
    const place = isPlaceable(reward);
    playSound(place ? 'item_placed' : 'claim_reward');
    triggerHaptic('medium');
    if (place) speakAddedToWorld(); else speakApplied();

    // fly the reward toward the avatar (wearables) or the Dream Home (placeables)
    const off = anchorOffset(reward);
    const targetX = place ? -VIEWPORT_W * 0.26 : off.xOffset;
    const targetY = place ? VIEWPORT_H * 0.30 : VIEWPORT_H * 0.20 + off.yOffset;
    flyX.value = withTiming(targetX, { duration: 760, easing: Easing.in(Easing.cubic) });
    flyY.value = withSpring(targetY, { damping: 16, stiffness: 90, mass: 0.9 });
    flyScale.value = withTiming(0.35, { duration: 760 });
    cardO.value = withTiming(0.4, { duration: 260 }); // modal fades to 40%
    backdrop.value = withTiming(0.0, { duration: 760 });
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
    opacity: boxO.value,
    transform: [{ translateY: dropY.value }, { translateX: shake.value * 5 }, { rotate: `${shake.value * 5}deg` }, { scale: 1 + glow.value * 0.03 }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: 0.4 + glow.value * 0.45, transform: [{ scale: 0.85 + glow.value * 0.18 }] }));
  const rewardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: flyX.value },
      { translateY: flyY.value },
      { scale: pop.value * (1 + breathe.value * 0.05) * flyScale.value },
      { rotate: `${(sway.value - 0.5) * 8}deg` },
    ],
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textO.value, transform: [{ translateY: (1 - textO.value) * 10 }] }));

  if (!reward) return null;
  const showReward = phase === 'revealed' || phase === 'flying';
  const headerText = headerKind === 'topic' ? '🏆  Topic Complete' : `✅  Level ${levelNumber ?? ''} Complete`;

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onLater}>
      <Animated.View style={[styles.overlay, backdropStyle]} />
      <View style={styles.center} pointerEvents="box-none">
        {confetti && <ConfettiLayer count={22} />}

        <Animated.View style={[styles.card, cardStyle]}>
          <View style={styles.headerChip}>
            <Text style={styles.headerText}>{headerText}</Text>
          </View>

          {/* gift box → reward stage */}
          <View style={styles.stage}>
            <Animated.View pointerEvents="none" style={[styles.glow, glowStyle]}>
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

            {showReward && <SparkleLayer width={REWARD + 50} height={REWARD + 40} color={GOLD} count={12} />}

            {/* gift box (drop / shake / open) */}
            {!showReward && (
              <Animated.View style={[{ width: BOX, height: BOX }, boxStyle]}>
                <GiftBox size={BOX} open={open} glowColor={GOLD} />
              </Animated.View>
            )}

            {/* reward popped out */}
            {showReward && (
              <Animated.View pointerEvents="none" style={rewardStyle}>
                <ObjectVisual item={reward} size={REWARD} />
              </Animated.View>
            )}
          </View>

          {/* copy + CTAs (reserve space from the start; fade in on reveal) */}
          <Animated.View style={[styles.copy, textStyle]}>
            <Text style={styles.kicker}>Reward Unlocked</Text>
            <Text style={styles.name} numberOfLines={1}>{reward.name}</Text>
            <Text style={styles.msg}>{msg}</Text>
            <Pressable onPress={onPrimary} style={({ pressed }) => [styles.primary, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  card: {
    width: CARD_W, maxHeight: MAX_H, borderRadius: 28, paddingTop: 16, paddingBottom: 18, paddingHorizontal: 20,
    backgroundColor: '#FFFDFa', alignItems: 'center', overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 30, shadowOffset: { width: 0, height: 16 }, elevation: 18,
  },
  headerChip: { backgroundColor: '#F1F4F8', borderRadius: 999, paddingHorizontal: 15, paddingVertical: 6 },
  headerText: { color: '#3A4250', fontWeight: '900', fontSize: 13, letterSpacing: 0.2 },
  stage: { width: REWARD + 50, height: STAGE_H, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  glow: { position: 'absolute', width: GLOW_SZ, height: GLOW_SZ, alignItems: 'center', justifyContent: 'center' },
  copy: { alignItems: 'center', alignSelf: 'stretch' },
  kicker: { color: GOLD, fontWeight: '900', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  name: { color: '#1B1F26', fontWeight: '900', fontSize: 24, textAlign: 'center', marginTop: 3 },
  msg: { color: '#6B7280', fontWeight: '700', fontSize: 14, marginTop: 4, marginBottom: 16 },
  primary: {
    width: 220, height: 52, borderRadius: 26, backgroundColor: '#FF7A00',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FF7A00', shadowOpacity: 0.42, shadowRadius: 14, shadowOffset: { width: 0, height: 7 }, elevation: 7,
  },
  primaryText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  later: { paddingVertical: 10, marginTop: 2 },
  laterText: { color: '#9AA0A6', fontWeight: '800', fontSize: 13.5 },
});
