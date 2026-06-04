/**
 * ExerciseHeader — SpeakX-style exercise top bar: close X, a thin orange
 * progress bar, a purple translate icon and a coin pill.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

const PRIMARY = '#FF7A00';
export const EX_TOP_INSET = 44;

interface Props {
  progress: number; // 0..1
  coins: number;
  onClose: () => void;
}

export default function ExerciseHeader({ progress, coins, onClose }: Props) {
  const w = useSharedValue(progress);
  React.useEffect(() => {
    w.value = withTiming(Math.max(0, Math.min(1, progress)), { duration: 380, easing: Easing.out(Easing.cubic) });
  }, [progress, w]);
  const fillStyle = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));

  return (
    <View style={styles.bar}>
      <Pressable onPress={onClose} hitSlop={10} style={styles.close}>
        <Text style={styles.closeX}>✕</Text>
      </Pressable>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>

      <View style={styles.translate}>
        <Text style={styles.translateText}>अ</Text>
        <Text style={styles.translateSlash}>A</Text>
      </View>

      <View style={styles.coinPill}>
        <View style={styles.coin}><Text style={styles.coinC}>C</Text></View>
        <Text style={styles.coinCount}>{coins}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingTop: EX_TOP_INSET,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  close: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  closeX: { fontSize: 20, fontWeight: '800', color: '#2A2E33' },
  track: { flex: 1, height: 8, borderRadius: 5, backgroundColor: '#EFEFF1', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5, backgroundColor: PRIMARY },
  translate: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#6C4BD8',
    alignItems: 'center', justifyContent: 'center', marginLeft: 12, flexDirection: 'row',
  },
  translateText: { color: '#FFFFFF', fontWeight: '900', fontSize: 11 },
  translateSlash: { color: '#D8CCF5', fontWeight: '900', fontSize: 9, marginLeft: 1 },
  coinPill: {
    flexDirection: 'row', alignItems: 'center', marginLeft: 10,
    backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1.5, borderColor: '#EEEFF1',
    paddingHorizontal: 8, paddingVertical: 3,
  },
  coin: {
    width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFC02E',
    borderWidth: 1.5, borderColor: '#E8A100', alignItems: 'center', justifyContent: 'center', marginRight: 4,
  },
  coinC: { color: '#FFFFFF', fontWeight: '900', fontSize: 10 },
  coinCount: { fontWeight: '900', fontSize: 14, color: '#2A2E33' },
});
