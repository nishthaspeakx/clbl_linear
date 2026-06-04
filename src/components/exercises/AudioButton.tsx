/**
 * AudioButton — the big orange "tap to listen" button. No real audio in the
 * prototype; tapping fires an expanding ripple + a pulse on the disc.
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';

const PRIMARY = '#FF7A00';
const SIZE = 76;

export default function AudioButton({ size = SIZE, onPlay }: { size?: number; onPlay?: () => void }) {
  const ring = useSharedValue(0);
  const press = useSharedValue(0);

  React.useEffect(() => {
    // gentle idle ripple so it invites a tap
    ring.value = withRepeat(withTiming(1, { duration: 1900, easing: Easing.out(Easing.ease) }), -1, false);
  }, [ring]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: (1 - ring.value) * 0.45,
    transform: [{ scale: 0.7 + ring.value * 0.7 }],
  }));
  const discStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + press.value * 0.12 }] }));

  const handle = () => {
    press.value = withSequence(
      withTiming(1, { duration: 130, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 220, easing: Easing.inOut(Easing.ease) }),
    );
    onPlay?.();
  };

  return (
    <Pressable onPress={handle} hitSlop={12} style={[styles.wrap, { width: size + 28, height: size + 28 }]}>
      <Animated.View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }, ringStyle]} />
      <Animated.View style={[styles.disc, { width: size, height: size, borderRadius: size / 2 }, discStyle]}>
        <Svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24">
          <Path d="M4 9 h4 l5 -4 v14 l-5 -4 H4 Z" fill="#FFFFFF" />
          <Path d="M16 8.5 q3 3.5 0 7" stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M18.5 6 q5 6 0 12" stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" />
        </Svg>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', backgroundColor: '#FFC894' },
  disc: {
    backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center',
    shadowColor: PRIMARY, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
});
