/**
 * RewardUnlockPopup — celebratory "Reward Unlocked" modal shown after a level
 * is completed (FIX 2). Confetti + slide-up reward card + popping icon.
 *
 * Shows the level's headline reward (a cool wearable) and lets the learner
 * Equip it now (applies to the avatar immediately) or continue the journey.
 */
import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { RewardItem } from '../../data/rewardCategories';
import { VIEWPORT_H } from '../../utils/viewport';

interface Props {
  reward: RewardItem | null;
  levelId: number;
  levelTitle: string;
  onEquip: () => void;
  onContinue: () => void;
}

const CONFETTI_COLORS = ['#FF7A00', '#3BB273', '#5BA6C9', '#E0699A', '#E0A526', '#7E6BD0'];

export default function RewardUnlockPopup({ reward, levelId, levelTitle, onEquip, onContinue }: Props) {
  const pop = useSharedValue(0);
  const slide = useSharedValue(0);

  useEffect(() => {
    if (reward) {
      pop.value = 0;
      slide.value = 0;
      slide.value = withSpring(1, { damping: 13, stiffness: 130 });
      pop.value = withDelay(140, withSpring(1, { damping: 9, stiffness: 150 }));
    }
  }, [reward, pop, slide]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: slide.value,
    transform: [{ translateY: (1 - slide.value) * 48 }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.4 + pop.value * 0.6 }, { rotate: `${(1 - pop.value) * -14}deg` }],
  }));

  if (!reward) return null;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={onContinue}>
      <View style={styles.backdrop}>
        <Confetti />
        <Animated.View style={[styles.card, cardStyle]}>
          <Text style={styles.kicker}>🎉  REWARD UNLOCKED</Text>

          <View style={styles.iconArea}>
            <View style={styles.ring} />
            <Animated.Text style={[styles.icon, iconStyle]}>{reward.icon}</Animated.Text>
          </View>

          <Text style={styles.name}>{reward.name}</Text>
          <Text style={styles.earned}>You earned this reward for completing:</Text>
          <Text style={styles.level}>Level {levelId}</Text>
          {!!levelTitle && <Text style={styles.levelTitle}>{levelTitle}</Text>}

          {reward.isEquippable ? (
            <>
              <Pressable style={({ pressed }) => [styles.primary, pressed && { opacity: 0.9 }]} onPress={onEquip}>
                <Text style={styles.primaryText}>👓  Equip Now</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.secondary, pressed && { opacity: 0.85 }]} onPress={onContinue}>
                <Text style={styles.secondaryText}>➡  Continue Journey</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={({ pressed }) => [styles.primary, pressed && { opacity: 0.9 }]} onPress={onContinue}>
              <Text style={styles.primaryText}>➡  Continue Journey</Text>
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    i,
    left: (i * 53) % 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: (i % 6) * 90,
    dur: 1300 + (i % 5) * 180,
    rot: (i * 47) % 360,
  }));
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p) => <ConfettiPiece key={p.i} {...p} />)}
    </View>
  );
}

function ConfettiPiece({ left, color, delay, dur, rot }: { left: number; color: string; delay: number; dur: number; rot: number }) {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withDelay(delay, withTiming(1, { duration: dur, easing: Easing.linear })); }, [t, delay, dur]);
  const st = useAnimatedStyle(() => ({
    opacity: 1 - t.value * 0.25,
    transform: [{ translateY: t.value * VIEWPORT_H * 0.62 }, { rotate: `${rot + t.value * 400}deg` }],
  }));
  return <Animated.View style={[{ position: 'absolute', top: '14%', left: `${left}%`, width: 8, height: 13, backgroundColor: color, borderRadius: 2 }, st]} />;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(12,14,20,0.6)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: {
    width: '100%', maxWidth: 320, backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 30, shadowOffset: { width: 0, height: 16 }, elevation: 16,
  },
  kicker: { fontSize: 12.5, fontWeight: '900', color: '#FF7A00', letterSpacing: 0.6 },
  iconArea: { width: 150, height: 150, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  ring: { position: 'absolute', width: 132, height: 132, borderRadius: 66, backgroundColor: '#FFF1DE', borderWidth: 3, borderColor: '#FFC78F' },
  icon: { fontSize: 78 },
  name: { fontSize: 23, fontWeight: '900', color: '#21242B', marginTop: 12, textAlign: 'center' },
  earned: { fontSize: 12.5, color: '#9AA0A6', fontWeight: '600', marginTop: 12, textAlign: 'center' },
  level: { fontSize: 17, fontWeight: '900', color: '#FF7A00', marginTop: 4 },
  levelTitle: { fontSize: 13.5, color: '#6B7177', fontWeight: '700', marginTop: 1, textAlign: 'center' },
  primary: {
    alignSelf: 'stretch', marginTop: 20, backgroundColor: '#FF7A00', borderRadius: 16, paddingVertical: 15, alignItems: 'center',
    shadowColor: '#FF7A00', shadowOpacity: 0.32, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5,
  },
  primaryText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  secondary: { alignSelf: 'stretch', marginTop: 10, paddingVertical: 13, alignItems: 'center' },
  secondaryText: { color: '#6B7177', fontWeight: '800', fontSize: 14.5 },
});
