/**
 * ExerciseCompleteScreen — confetti finish screen for a completed exercise.
 * "Vocabulary Complete!" + coins earned + a "Continue to Reading" CTA.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { VIEWPORT_W as SW, VIEWPORT_H as SH } from '../../utils/viewport';

const PRIMARY = '#FF7A00';
const COLORS = ['#FF7A00', '#4FA3E3', '#33A867', '#E0699A', '#FFC72C', '#7E6BD0'];

// deterministic confetti scatter (no Math.random at module/runtime)
const CONFETTI = Array.from({ length: 46 }).map((_, i) => ({
  x: ((i * 53) % 100) / 100 * SW,
  y: ((i * 89) % 100) / 100 * (SH * 0.82),
  r: (i * 37) % 360,
  c: COLORS[i % COLORS.length],
  sq: i % 3 === 0,
}));

interface Props {
  coins: number;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onContinue: () => void;
}

export default function ExerciseCompleteScreen({
  coins, title = 'Vocabulary Complete!', subtitle = 'Great job! You completed 6 sentences.',
  ctaLabel = 'Continue to Reading', onContinue,
}: Props) {
  const pop = useSharedValue(0);
  React.useEffect(() => {
    pop.value = withSpring(1, { damping: 12, stiffness: 140 });
  }, [pop]);
  const emojiStyle = useAnimatedStyle(() => ({ transform: [{ scale: 0.5 + pop.value * 0.5 }] }));
  const textStyle = useAnimatedStyle(() => ({ opacity: pop.value, transform: [{ translateY: (1 - pop.value) * 14 }] }));

  return (
    <View style={styles.root}>
      <Svg style={StyleSheet.absoluteFill} width={SW} height={SH} pointerEvents="none">
        {CONFETTI.map((p, i) => p.sq ? (
          <Rect key={i} x={p.x} y={p.y} width={9} height={9} rx={2} fill={p.c} transform={`rotate(${p.r} ${p.x + 4} ${p.y + 4})`} opacity={0.95} />
        ) : (
          <Circle key={i} cx={p.x} cy={p.y} r={4.5} fill={p.c} opacity={0.95} />
        ))}
      </Svg>

      <View style={styles.center}>
        <Animated.Text style={[styles.emoji, emojiStyle]}>🥳</Animated.Text>
        <Animated.View style={textStyle}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.coinRow}>
            <View style={styles.coin}><Text style={styles.coinC}>C</Text></View>
            <Text style={styles.coinText}>+{coins} coins earned</Text>
          </View>
        </Animated.View>
      </View>

      <Pressable style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]} onPress={onContinue}>
        <Text style={styles.ctaText}>{ctaLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', zIndex: 30 },
  center: { alignItems: 'center', paddingHorizontal: 30 },
  emoji: { fontSize: 88, marginBottom: 14 },
  title: { fontSize: 26, fontWeight: '900', color: '#2A2E33', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#8A9097', textAlign: 'center', marginTop: 8, fontWeight: '600' },
  coinRow: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 18,
    backgroundColor: '#FFF6E8', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1.5, borderColor: '#FBE4B8',
  },
  coin: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFC02E', borderWidth: 1.5, borderColor: '#E8A100', alignItems: 'center', justifyContent: 'center', marginRight: 7 },
  coinC: { color: '#FFFFFF', fontWeight: '900', fontSize: 11 },
  coinText: { fontWeight: '900', fontSize: 15, color: '#C8821A' },
  cta: {
    position: 'absolute', left: 20, right: 20, bottom: 40,
    backgroundColor: PRIMARY, borderRadius: 18, paddingVertical: 17, alignItems: 'center',
    shadowColor: PRIMARY, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  ctaText: { color: '#FFFFFF', fontWeight: '900', fontSize: 17 },
});
