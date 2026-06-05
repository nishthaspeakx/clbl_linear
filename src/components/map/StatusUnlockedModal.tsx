/**
 * StatusUnlockedModal — celebratory badge popup shown when the learner crosses
 * an avatar evolution milestone (e.g. "Confident Speaker").
 */
import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Milestone } from '../../data/avatarMilestones';

interface Props {
  milestone: Milestone | null;
  onClose: () => void;
}

export default function StatusUnlockedModal({ milestone, onClose }: Props) {
  const pop = useSharedValue(0);
  const ring = useSharedValue(0);

  useEffect(() => {
    if (milestone) {
      pop.value = 0; ring.value = 0;
      pop.value = withSpring(1, { damping: 9, stiffness: 150 });
      ring.value = withDelay(120, withSequence(withTiming(1, { duration: 380 }), withTiming(0.6, { duration: 700 })));
    }
  }, [milestone, pop, ring]);

  const badgeStyle = useAnimatedStyle(() => ({ transform: [{ scale: 0.4 + pop.value * 0.6 }, { rotate: `${(1 - pop.value) * -16}deg` }] }));
  const ringStyle = useAnimatedStyle(() => ({ opacity: 0.3 + ring.value * 0.5, transform: [{ scale: 0.9 + ring.value * 0.35 }] }));

  if (!milestone) return null;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.kicker}>🌟  NEW STATUS UNLOCKED</Text>

          <View style={styles.badgeArea}>
            <Animated.View style={[styles.ring, ringStyle]} />
            <Animated.Text style={[styles.badge, badgeStyle]}>{milestone.emoji}</Animated.Text>
          </View>

          <Text style={styles.title}>{milestone.title}</Text>
          <Text style={styles.sub}>You reached Level {milestone.level}. Keep going!</Text>

          <Pressable style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]} onPress={onClose}>
            <Text style={styles.ctaText}>Awesome!  🎉</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(12,14,20,0.6)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: { width: '100%', maxWidth: 310, backgroundColor: '#FFFFFF', borderRadius: 26, padding: 24, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 28, shadowOffset: { width: 0, height: 16 }, elevation: 16 },
  kicker: { fontSize: 12.5, fontWeight: '900', color: '#E0A526', letterSpacing: 0.6 },
  badgeArea: { width: 130, height: 130, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  ring: { position: 'absolute', width: 116, height: 116, borderRadius: 58, backgroundColor: '#FFF6E0', borderWidth: 3, borderColor: '#F4C84F' },
  badge: { fontSize: 64 },
  title: { fontSize: 24, fontWeight: '900', color: '#21242B', marginTop: 12, textAlign: 'center' },
  sub: { fontSize: 13, color: '#9AA0A6', fontWeight: '600', marginTop: 8, textAlign: 'center' },
  cta: { alignSelf: 'stretch', marginTop: 22, backgroundColor: '#FF7A00', borderRadius: 16, paddingVertical: 15, alignItems: 'center',
    shadowColor: '#FF7A00', shadowOpacity: 0.32, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5 },
  ctaText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
});
