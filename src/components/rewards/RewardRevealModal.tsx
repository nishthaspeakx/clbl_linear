/**
 * RewardRevealModal — the post-level-completion reward reveal.
 *
 * Sequence: chest appears → shakes → lid opens (flash) → reward pops out with
 * confetti → "🎉 Reward Unlocked" + name + Claim Reward / Continue Journey.
 *
 *  • Claim Reward → onClaim (adds the reward to claimedRewardIds)
 *  • Continue Journey → onContinue (closes)
 *
 * Used after completing any level (see EnglishTownScreen).
 */
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
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
import { rarityStyle } from '../../data/rewardRarity';
import { VIEWPORT_H } from '../../utils/viewport';

interface Props {
  reward: RewardItem | null;
  levelId: number;
  levelTitle: string;
  onClaim: () => void;
  onContinue: () => void;
}

const CONFETTI_COLORS = ['#FF7A00', '#3BB273', '#5BA6C9', '#E0699A', '#E0A526', '#7E6BD0'];

export default function RewardRevealModal({ reward, levelId, levelTitle, onClaim, onContinue }: Props) {
  const chest = useSharedValue(0);   // chest appear scale
  const shake = useSharedValue(0);   // -1..1 wobble
  const lid = useSharedValue(0);     // 0 closed → 1 open
  const glow = useSharedValue(0);    // open flash
  const pop = useSharedValue(0);     // reward pop
  const textV = useSharedValue(0);   // text/buttons fade
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!reward) return;
    setRevealed(false);
    chest.value = 0; shake.value = 0; lid.value = 0; glow.value = 0; pop.value = 0; textV.value = 0;

    chest.value = withSpring(1, { damping: 11, stiffness: 150 });
    // shake
    shake.value = withDelay(380, withRepeat(
      withSequence(withTiming(1, { duration: 70 }), withTiming(-1, { duration: 70 })),
      4, true,
    ));
    // open lid + flash
    lid.value = withDelay(1050, withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }));
    glow.value = withDelay(1050, withSequence(withTiming(1, { duration: 200 }), withTiming(0.45, { duration: 700 })));
    // pop reward
    pop.value = withDelay(1320, withSpring(1, { damping: 9, stiffness: 150 }));
    textV.value = withDelay(1480, withTiming(1, { duration: 320 }));
    const t = setTimeout(() => setRevealed(true), 1380);
    return () => clearTimeout(t);
  }, [reward]); // eslint-disable-line react-hooks/exhaustive-deps

  const chestStyle = useAnimatedStyle(() => ({
    transform: [{ scale: chest.value }, { rotate: `${shake.value * 5}deg` }],
  }));
  const lidStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 700 },
      { translateY: -lid.value * 30 },
      { rotateX: `${-lid.value * 22}deg` },
      { rotate: `${-lid.value * 10}deg` },
    ],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value, transform: [{ scale: 0.7 + glow.value * 0.6 }] }));
  const rewardStyle = useAnimatedStyle(() => ({
    opacity: pop.value,
    transform: [{ translateY: 30 - pop.value * 58 }, { scale: 0.3 + pop.value * 0.7 }],
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textV.value, transform: [{ translateY: (1 - textV.value) * 12 }] }));

  if (!reward) return null;
  const rar = rarityStyle(reward.rarity);

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={onContinue}>
      <View style={styles.backdrop}>
        {revealed && <Confetti />}
        <View style={styles.card}>
          <Text style={styles.completeKicker}>✅  LEVEL {levelId} COMPLETE</Text>

          {/* chest + reward stage */}
          <View style={styles.stage}>
            <Animated.View style={[styles.glow, { backgroundColor: rar.color }, glowStyle]} />

            {/* reward pops out from the chest */}
            <Animated.View style={[styles.rewardWrap, rewardStyle]}>
              <View style={[styles.rewardRing, { borderColor: rar.color, backgroundColor: rar.tint }]}>
                <Text style={styles.rewardIcon}>{reward.icon}</Text>
              </View>
            </Animated.View>

            {/* chest */}
            <Animated.View style={[styles.chest, chestStyle]}>
              <Animated.View style={[styles.lid, lidStyle]}>
                <View style={styles.lidBand} />
                <View style={styles.lidStud} />
              </Animated.View>
              <View style={styles.base}>
                <View style={styles.baseBand} />
                <View style={styles.lock} />
              </View>
            </Animated.View>
          </View>

          {/* text + buttons (after reveal) */}
          <Animated.View style={[styles.info, textStyle]}>
            <Text style={styles.kicker}>🎉  REWARD UNLOCKED</Text>
            <Text style={styles.name}>{reward.name}</Text>
            <View style={styles.metaRow}>
              <View style={[styles.rarityBadge, { backgroundColor: rar.tint, borderColor: rar.color }]}>
                <Text style={[styles.rarityText, { color: rar.color }]}>{rar.sparkle ? '✨ ' : ''}{rar.label}</Text>
              </View>
              {!!reward.topic && (
                <View style={styles.topicBadge}><Text style={styles.topicText}>🗺️ {reward.topic}</Text></View>
              )}
            </View>
            {!!levelTitle && <Text style={styles.levelTitle}>from “{levelTitle}”</Text>}

            {revealed && (
              <>
                <Pressable style={({ pressed }) => [styles.primary, pressed && { opacity: 0.9 }]} onPress={onClaim}>
                  <Text style={styles.primaryText}>🎁  Claim Reward</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.secondary, pressed && { opacity: 0.85 }]} onPress={onContinue}>
                  <Text style={styles.secondaryText}>➡  Continue Journey</Text>
                </Pressable>
              </>
            )}
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 22 }, (_, i) => ({
    i, left: (i * 53) % 100, color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: (i % 6) * 80, dur: 1300 + (i % 5) * 170, rot: (i * 47) % 360,
  }));
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{pieces.map((p) => <Piece key={p.i} {...p} />)}</View>;
}
function Piece({ left, color, delay, dur, rot }: { left: number; color: string; delay: number; dur: number; rot: number }) {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withDelay(delay, withTiming(1, { duration: dur, easing: Easing.linear })); }, [t, delay, dur]);
  const st = useAnimatedStyle(() => ({
    opacity: 1 - t.value * 0.25,
    transform: [{ translateY: t.value * VIEWPORT_H * 0.6 }, { rotate: `${rot + t.value * 400}deg` }],
  }));
  return <Animated.View style={[{ position: 'absolute', top: '20%', left: `${left}%`, width: 8, height: 13, backgroundColor: color, borderRadius: 2 }, st]} />;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(12,14,20,0.62)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: { width: '100%', maxWidth: 330, backgroundColor: '#FFFFFF', borderRadius: 28, padding: 22, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 30, shadowOffset: { width: 0, height: 16 }, elevation: 16 },
  completeKicker: { fontSize: 12, fontWeight: '900', color: '#3BB273', letterSpacing: 0.5 },
  stage: { width: 200, height: 184, alignItems: 'center', justifyContent: 'flex-end', marginTop: 18 },
  glow: { position: 'absolute', top: 18, width: 150, height: 150, borderRadius: 75, opacity: 0 },
  rewardWrap: { position: 'absolute', top: 6, alignItems: 'center', justifyContent: 'center' },
  rewardRing: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
  rewardIcon: { fontSize: 54 },
  chest: { width: 132, height: 96, alignItems: 'center', justifyContent: 'flex-end' },
  lid: { position: 'absolute', top: 6, width: 132, height: 44, backgroundColor: '#A8743F', borderTopLeftRadius: 16, borderTopRightRadius: 16,
    borderWidth: 3, borderColor: '#6E4A28' },
  lidBand: { position: 'absolute', bottom: -3, left: 0, right: 0, height: 8, backgroundColor: '#E0A526' },
  lidStud: { position: 'absolute', top: 8, alignSelf: 'center', width: 12, height: 12, borderRadius: 3, backgroundColor: '#E0A526' },
  base: { width: 132, height: 56, backgroundColor: '#8A5E36', borderRadius: 10, borderWidth: 3, borderColor: '#6E4A28', overflow: 'hidden' },
  baseBand: { position: 'absolute', top: 10, left: 0, right: 0, height: 9, backgroundColor: '#E0A526' },
  lock: { position: 'absolute', top: 16, alignSelf: 'center', width: 20, height: 22, borderRadius: 4, backgroundColor: '#F4C84F', borderWidth: 2, borderColor: '#B8860B' },
  info: { alignItems: 'center', marginTop: 12, alignSelf: 'stretch' },
  kicker: { fontSize: 12.5, fontWeight: '900', color: '#FF7A00', letterSpacing: 0.6 },
  name: { fontSize: 24, fontWeight: '900', color: '#21242B', marginTop: 6, textAlign: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
  rarityBadge: { borderRadius: 9, paddingHorizontal: 9, paddingVertical: 3, borderWidth: 1, marginHorizontal: 3 },
  rarityText: { fontSize: 10.5, fontWeight: '900' },
  topicBadge: { backgroundColor: '#EAF7EE', borderRadius: 9, paddingHorizontal: 9, paddingVertical: 3, borderWidth: 1, borderColor: '#BFE6CC', marginHorizontal: 3 },
  topicText: { fontSize: 10.5, fontWeight: '800', color: '#1F8B50' },
  levelTitle: { fontSize: 12.5, color: '#9AA0A6', fontWeight: '700', marginTop: 8, textAlign: 'center' },
  primary: { alignSelf: 'stretch', marginTop: 18, backgroundColor: '#FF7A00', borderRadius: 16, paddingVertical: 15, alignItems: 'center',
    shadowColor: '#FF7A00', shadowOpacity: 0.32, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5 },
  primaryText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  secondary: { alignSelf: 'stretch', marginTop: 10, paddingVertical: 12, alignItems: 'center' },
  secondaryText: { color: '#6B7177', fontWeight: '800', fontSize: 14.5 },
});
