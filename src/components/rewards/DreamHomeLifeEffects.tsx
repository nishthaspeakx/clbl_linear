/**
 * DreamHomeLifeEffects — progressive, level-gated ambient effects that make the
 * world feel alive: slow birds (L7), an entrance sparkle (L1) and a full-house
 * golden glow celebration (L20).
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { LifeEffects } from '../../utils/dreamHomeLifeScore';

function Bird({ i, width, height }: { i: number; width: number; height: number }) {
  const t = useSharedValue(0);
  const dur = 9000 + i * 2600;
  const y = (6 + i * 5) / 100 * height;
  const flap = useSharedValue(0);
  React.useEffect(() => {
    t.value = withDelay(i * 1800, withRepeat(withTiming(1, { duration: dur, easing: Easing.linear }), -1, false));
    flap.value = withRepeat(withSequence(withTiming(1, { duration: 320 }), withTiming(0, { duration: 320 })), -1, true);
  }, [t, flap, dur, i]);
  const st = useAnimatedStyle(() => ({ transform: [{ translateX: -30 + t.value * (width + 60) }, { translateY: Math.sin(t.value * 6) * 6 }] }));
  const wing = useAnimatedStyle(() => ({ transform: [{ scaleY: 0.6 + flap.value * 0.5 }] }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: 0, top: y }, st]}>
      <Animated.View style={wing}>
        <Svg width={16} height={8} viewBox="0 0 16 8">
          <Path d="M0 5 Q4 0 8 5 Q12 0 16 5" stroke="#5A6066" strokeWidth={1.4} fill="none" strokeLinecap="round" />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

function Sparkle({ x, y, width, height, delay }: { x: number; y: number; width: number; height: number; delay: number }) {
  const t = useSharedValue(0);
  React.useEffect(() => { t.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 560 }), withTiming(0.1, { duration: 640 })), -1, true)); }, [t, delay]);
  const st = useAnimatedStyle(() => ({ opacity: 0.1 + t.value * 0.9, transform: [{ scale: 0.5 + t.value * 0.7 }] }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: (x / 100) * width, top: (y / 100) * height }, st]}>
      <Svg width={11} height={11} viewBox="0 0 10 10"><Path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" fill="#FFE89A" /></Svg>
    </Animated.View>
  );
}

function FullGlow({ width, height }: { width: number; height: number }) {
  const t = useSharedValue(0);
  React.useEffect(() => { t.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true); }, [t]);
  const st = useAnimatedStyle(() => ({ opacity: 0.2 + t.value * 0.25 }));
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, st]}>
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id="dh_fullglow" cx="0.6" cy="0.45" rx="0.55" ry="0.5">
            <Stop offset="0" stopColor="#FFE9A8" stopOpacity="0.6" />
            <Stop offset="1" stopColor="#FFD24A" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#dh_fullglow)" />
      </Svg>
    </Animated.View>
  );
}

interface Props {
  width: number;
  height: number;
  night: boolean;
  effects: LifeEffects;
}

export default function DreamHomeLifeEffects({ width, height, night, effects }: Props) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {effects.fullGlow && <FullGlow width={width} height={height} />}
      {effects.birds && !night && [0, 1, 2].map((i) => <Bird key={i} i={i} width={width} height={height} />)}
      {effects.entranceSparkle && (
        <>
          <Sparkle x={42} y={70} width={width} height={height} delay={0} />
          <Sparkle x={46} y={66} width={width} height={height} delay={300} />
          <Sparkle x={39} y={74} width={width} height={height} delay={600} />
        </>
      )}
    </View>
  );
}
