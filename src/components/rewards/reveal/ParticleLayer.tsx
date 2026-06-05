/**
 * ParticleLayer — golden particles that float upward from a source point,
 * fading in and out, looping. Gives the gift box its "magical" aura. Reusable.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';

function Particle({ i, originX, originY, color, rise }: { i: number; originX: number; originY: number; color: string; rise: number }) {
  const t = useSharedValue(0);
  const dur = 1500 + (i * 53) % 1000;
  const drift = ((i * 37) % 80) - 40;
  const startX = originX + (((i * 29) % 70) - 35);
  const size = 4 + (i % 3) * 2;
  React.useEffect(() => {
    t.value = withDelay((i * 95) % 1300, withRepeat(withTiming(1, { duration: dur, easing: Easing.linear }), -1, false));
  }, [t, dur, i]);
  const st = useAnimatedStyle(() => ({
    opacity: Math.sin(t.value * Math.PI) * 0.9,
    transform: [{ translateX: drift * t.value }, { translateY: -t.value * rise }],
  }));
  return <Animated.View style={[{ position: 'absolute', left: startX, top: originY, width: size, height: size, borderRadius: size / 2, backgroundColor: color }, st]} />;
}

export default function ParticleLayer({ originX, originY, count = 16, color = '#FFD24A', rise = 150 }: { originX: number; originY: number; count?: number; color?: string; rise?: number }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: count }).map((_, i) => <Particle key={i} i={i} originX={originX} originY={originY} color={color} rise={rise} />)}
    </View>
  );
}
