/**
 * ExerciseNode — one circular exercise node on the level mini-journey.
 *   completed → green disc with a check
 *   current   → accent disc with glowing pulse + a "Start" tag + the icon
 *   locked    → frosted grey disc with a lock
 */
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export type ExStatus = 'completed' | 'current' | 'locked';

const SIZE = 56;

interface Props {
  x: number; // centre x in the journey area
  y: number; // centre y in the journey area
  icon: string;
  label: string;
  status: ExStatus;
  accent: string;
  onPress?: () => void;
}

function ExerciseNode({ x, y, icon, label, status, accent, onPress }: Props) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (status === 'current') {
      pulse.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }), -1, true);
    } else {
      pulse.value = 0;
    }
  }, [status, pulse]);

  const glow = useAnimatedStyle(() => ({
    opacity: 0.25 + pulse.value * 0.4,
    transform: [{ scale: 1 + pulse.value * 0.35 }],
  }));

  // completed = green, current = orange (per spec), locked = grey.
  const CURRENT = '#FF8A3D';
  const face =
    status === 'completed' ? '#3BB273' : status === 'current' ? CURRENT : '#E3E7EB';
  const rim =
    status === 'completed' ? '#2E9E63' : status === 'current' ? '#E0741B' : '#C7CDD3';

  return (
    <Pressable
      onPress={status === 'current' ? onPress : undefined}
      style={[styles.wrap, { left: x - SIZE / 2, top: y - SIZE / 2 }]}
      hitSlop={8}
    >
      {status === 'current' && (
        <Animated.View pointerEvents="none" style={[styles.glow, { backgroundColor: '#FFB161' }, glow]} />
      )}
      <View style={[styles.shadow]} />
      <View style={[styles.node, { backgroundColor: face, borderColor: rim }]}>
        {status === 'completed' ? (
          <Text style={styles.check}>✓</Text>
        ) : status === 'locked' ? (
          <Text style={styles.lock}>🔒</Text>
        ) : (
          <Text style={styles.icon}>{icon}</Text>
        )}
      </View>
      <Text style={[styles.label, status === 'locked' && { color: '#A9AFB5' }]}>{label}</Text>
      {status === 'current' && (
        <View style={[styles.startTag, { backgroundColor: '#33A867' }]}>
          <Text style={styles.startText}>Start</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', width: SIZE, height: SIZE + 26, alignItems: 'center', justifyContent: 'flex-start' },
  glow: { position: 'absolute', top: -4, width: SIZE + 8, height: SIZE + 8, borderRadius: (SIZE + 8) / 2 },
  shadow: { position: 'absolute', top: SIZE - 8, width: SIZE * 0.7, height: 8, borderRadius: 8, backgroundColor: '#000', opacity: 0.14 },
  node: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 22 },
  check: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  lock: { fontSize: 18, opacity: 0.7 },
  label: { marginTop: 4, fontSize: 11, fontWeight: '800', color: '#5A6068' },
  startTag: { position: 'absolute', top: -14, paddingHorizontal: 9, paddingVertical: 2, borderRadius: 10 },
  startText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
});

export default ExerciseNode;
