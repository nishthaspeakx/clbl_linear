/**
 * FlyingCoin — a single coin that pops at `start` (screen coords) and arcs up to
 * the coin counter `target`, then fires `onArrive` so the counter can increment.
 * Rendered in a screen-space overlay (not the panning world).
 */
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming,
} from 'react-native-reanimated';

interface Props {
  startX: number; startY: number;
  targetX: number; targetY: number;
  value: number;
  delay?: number;
  onArrive: () => void;
}

export default function FlyingCoin({ startX, startY, targetX, targetY, value, delay = 0, onArrive }: Props) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withTiming(1, { duration: 720, easing: Easing.bezier(0.22, 0.7, 0.25, 1) }, (fin) => {
      'worklet';
      if (fin) runOnJS(onArrive)();
    }));
  }, [p, delay, onArrive]);

  // gentle upward arc via a control point above the midpoint
  const ctrlX = (startX + targetX) / 2;
  const ctrlY = Math.min(startY, targetY) - 44;

  const coinStyle = useAnimatedStyle(() => {
    const t = p.value;
    const mt = 1 - t;
    const x = mt * mt * startX + 2 * mt * t * ctrlX + t * t * targetX;
    const y = mt * mt * startY + 2 * mt * t * ctrlY + t * t * targetY;
    // smooth pop-in, gentle shrink toward the counter, fade only at the very end
    const scale = 0.55 + Math.sin(Math.min(t, 0.5) * Math.PI) * 0.5 - Math.max(0, t - 0.7) * 0.5;
    return {
      transform: [{ translateX: x - 12 }, { translateY: y - 12 }, { scale }],
      opacity: t > 0.9 ? (1 - t) / 0.1 : 1,
    };
  });
  const tagStyle = useAnimatedStyle(() => ({
    opacity: p.value < 0.3 ? 1 - p.value / 0.3 : 0,
    transform: [{ translateX: startX - 6 }, { translateY: startY - 28 - p.value * 18 }],
  }));

  return (
    <>
      <Animated.View pointerEvents="none" style={[styles.coin, coinStyle]}>
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={11} fill="#FFC02E" stroke="#E8A100" strokeWidth={2} />
          <Circle cx={12} cy={12} r={6} fill="#FFE08A" />
        </Svg>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.tag, tagStyle]}>
        <Text style={styles.tagText}>+{value}</Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  coin: { position: 'absolute', left: 0, top: 0, width: 24, height: 24, zIndex: 70 },
  tag: { position: 'absolute', left: 0, top: 0, zIndex: 70 },
  tagText: { color: '#E0741B', fontWeight: '900', fontSize: 14, textShadowColor: '#FFF', textShadowRadius: 3 },
});
