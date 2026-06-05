/**
 * SparkleLayer — twinkling 4-point stars scattered around an area. Subtle,
 * premium (not childish). Loops continuously while mounted. Reusable.
 */
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

function Star({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10">
      <Path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" fill={color} />
    </Svg>
  );
}

function Sparkle({ x, y, size, color, delay }: { x: number; y: number; size: number; color: string; delay: number }) {
  const t = useSharedValue(0);
  React.useEffect(() => {
    t.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 620 }), withTiming(0.15, { duration: 720 })), -1, true));
  }, [t, delay]);
  const st = useAnimatedStyle(() => ({ opacity: 0.15 + t.value * 0.85, transform: [{ scale: 0.45 + t.value * 0.75 }, { rotate: `${t.value * 35}deg` }] }));
  return <Animated.View style={[{ position: 'absolute', left: x, top: y }, st]}><Star size={size} color={color} /></Animated.View>;
}

export default function SparkleLayer({ width, height, color = '#FFD24A', count = 14 }: { width: number; height: number; color?: string; count?: number }) {
  const sparkles = useMemo(
    () => Array.from({ length: count }).map((_, i) => ({
      x: width * (0.06 + 0.88 * (((i * 37) % 100) / 100)),
      y: height * (0.06 + 0.88 * (((i * 53 + 17) % 100) / 100)),
      size: 8 + (i % 4) * 5,
      color: i % 3 === 0 ? '#FFFFFF' : color,
      delay: (i * 130) % 1500,
    })),
    [width, height, color, count]
  );
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {sparkles.map((s, i) => <Sparkle key={i} {...s} />)}
    </View>
  );
}
