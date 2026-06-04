/**
 * ProgressionReward — a brief (~1.2s) celebratory burst shown after the
 * character reaches the next level: a star burst around the centre plus a
 * "Level Complete! / +N Coins" card. Non-blocking (pointerEvents none) and
 * auto-dismisses; re-fires whenever `nonce` changes.
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing, runOnJS, SharedValue, useAnimatedProps, useAnimatedStyle, useSharedValue, withSequence, withTiming,
} from 'react-native-reanimated';
import { VIEWPORT_W as SW, VIEWPORT_H as SH } from '../../utils/viewport';

const COLORS = ['#FFC02E', '#FF7A00', '#4FA3E3', '#33A867', '#E0699A'];
const STARS = Array.from({ length: 10 }).map((_, i) => ({
  a: (i / 10) * Math.PI * 2,
  c: COLORS[i % COLORS.length],
  r: 60 + (i % 3) * 14,
}));

function star(cx: number, cy: number, r: number): string {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    d += `${i === 0 ? 'M' : 'L'} ${(cx + Math.cos(a) * rad).toFixed(1)} ${(cy + Math.sin(a) * rad).toFixed(1)} `;
  }
  return d + 'Z';
}

function Burst({ nonce }: { nonce: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = 0;
    p.value = withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) });
  }, [nonce, p]);
  return (
    <Svg width={SW} height={SH} style={StyleSheet.absoluteFill} pointerEvents="none">
      {STARS.map((s, i) => (
        <AStar key={i} p={p} a={s.a} c={s.c} r={s.r} />
      ))}
    </Svg>
  );
}
const APath = Animated.createAnimatedComponent(Path);
function AStar({ p, a, c, r }: { p: SharedValue<number>; a: number; c: string; r: number }) {
  const cx = SW / 2;
  const cy = SH * 0.46;
  const animatedProps = useAnimatedProps(() => {
    const t = p.value;
    const dist = t * r;
    const x = cx + Math.cos(a) * dist;
    const y = cy + Math.sin(a) * dist;
    return { d: star(x, y, 5 + (1 - t) * 5), opacity: 1 - t } as any;
  });
  return <APath animatedProps={animatedProps} fill={c} />;
}

export default function ProgressionReward({ nonce, coins }: { nonce: number; coins: number }) {
  const [show, setShow] = useState(false);
  const card = useSharedValue(0);

  useEffect(() => {
    if (nonce <= 0) return;
    setShow(true);
    card.value = 0;
    card.value = withSequence(
      withTiming(1, { duration: 220, easing: Easing.out(Easing.back(1.6)) }),
      withTiming(1, { duration: 700 }),
      withTiming(0, { duration: 240, easing: Easing.in(Easing.cubic) }, (fin) => {
        'worklet';
        if (fin) runOnJS(setShow)(false);
      }),
    );
  }, [nonce, card]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: card.value,
    transform: [{ scale: 0.7 + card.value * 0.3 }, { translateY: (1 - card.value) * 10 }],
  }));

  if (!show) return null;
  return (
    <View pointerEvents="none" style={styles.root}>
      <Burst nonce={nonce} />
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.title}>Level Complete!</Text>
        <View style={styles.coinRow}>
          <View style={styles.coin}><Text style={styles.coinC}>C</Text></View>
          <Text style={styles.coinText}>+{coins} Coins</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', zIndex: 65 },
  card: {
    alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 20,
    paddingHorizontal: 26, paddingVertical: 16, marginTop: -SH * 0.04,
    shadowColor: '#FF7A00', shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 10,
  },
  title: { fontSize: 20, fontWeight: '900', color: '#FF7A00' },
  coinRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  coin: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFC02E', borderWidth: 1.5, borderColor: '#E8A100', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  coinC: { color: '#FFFFFF', fontWeight: '900', fontSize: 12 },
  coinText: { fontSize: 17, fontWeight: '900', color: '#C8821A' },
});
