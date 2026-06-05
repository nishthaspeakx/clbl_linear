/**
 * ConfettiLayer — a premium confetti burst that erupts from a centre point and
 * arcs outward + down. Mount it to fire once. Reusable.
 */
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const COLORS = ['#FF7A00', '#FFD24A', '#FF5A3C', '#FFFFFF', '#FFB877', '#E0A526', '#5BA6C9', '#E0699A'];

function Piece({ i }: { i: number }) {
  const t = useSharedValue(0);
  const angle = ((i * 47) % 360) * (Math.PI / 180);
  const dist = 70 + (i * 37) % 170;
  const tx = Math.cos(angle) * dist;
  const fall = 180 + (i * 53) % 320;
  const dur = 1100 + (i % 6) * 170;
  const rot = (i * 61) % 360;
  const color = COLORS[i % COLORS.length];
  useEffect(() => {
    t.value = withDelay((i % 8) * 26, withTiming(1, { duration: dur, easing: Easing.out(Easing.quad) }));
  }, [t, dur, i]);
  const st = useAnimatedStyle(() => {
    const lift = Math.sin(Math.min(1, t.value * 1.8) * Math.PI) * 60;
    return {
      opacity: 1 - t.value * 0.25,
      transform: [
        { translateX: tx * Math.min(1, t.value * 1.6) },
        { translateY: -lift + t.value * fall },
        { rotate: `${rot + t.value * 460}deg` },
      ],
    };
  });
  return <Animated.View style={[styles.piece, { backgroundColor: color }, st]} />;
}

export default function ConfettiLayer({ count = 28 }: { count?: number }) {
  return (
    <View pointerEvents="none" style={styles.wrap}>
      {Array.from({ length: count }).map((_, i) => <Piece key={i} i={i} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: '50%', top: '40%', width: 0, height: 0 },
  piece: { position: 'absolute', width: 9, height: 14, borderRadius: 2 },
});
