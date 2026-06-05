/**
 * DreamHomeDayNightOverlay — non-destructive lighting layers drawn ON TOP of the
 * same Dream Home image (the image is never replaced).
 *
 * Day:   a soft warm sunlight tint.
 * Night: a dark-blue scrim, a moon + twinkling stars, warm window lights, garden
 *        lamp + pathway lights — gated by the learner's level effects.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { LifeEffects } from '../../utils/dreamHomeLifeScore';

// Approximate window / lamp / path positions on the house image (percentages).
const WINDOWS = [
  { x: 58, y: 80 }, { x: 65, y: 80 }, { x: 30, y: 43 },
  { x: 58, y: 23 }, { x: 72, y: 21 }, { x: 88, y: 30 }, { x: 90, y: 48 },
];
const PATH = [{ x: 38, y: 92 }, { x: 41, y: 86 }, { x: 44, y: 80 }];
const LAMP = { x: 41, y: 86 };

function GlowDot({ x, y, w, h, color, delay, width, height }: { x: number; y: number; w: number; h: number; color: string; delay: number; width: number; height: number }) {
  const t = useSharedValue(0);
  React.useEffect(() => { t.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 1100 }), withTiming(0.55, { duration: 1300 })), -1, true)); }, [t, delay]);
  const st = useAnimatedStyle(() => ({ opacity: 0.55 + t.value * 0.45 }));
  return (
    <Animated.View pointerEvents="none" style={[{
      position: 'absolute', left: (x / 100) * width - w / 2, top: (y / 100) * height - h / 2,
      width: w, height: h, borderRadius: Math.min(w, h) / 2, backgroundColor: color,
      shadowColor: color, shadowOpacity: 0.95, shadowRadius: w * 0.9, shadowOffset: { width: 0, height: 0 },
    }, st]} />
  );
}

function Star({ x, y, width, height, delay }: { x: number; y: number; width: number; height: number; delay: number }) {
  const t = useSharedValue(0);
  React.useEffect(() => { t.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 700 }), withTiming(0.1, { duration: 800 })), -1, true)); }, [t, delay]);
  const st = useAnimatedStyle(() => ({ opacity: 0.1 + t.value * 0.9 }));
  return <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: (x / 100) * width, top: (y / 100) * height, width: 2.5, height: 2.5, borderRadius: 2, backgroundColor: '#FFFFFF' }, st]} />;
}

interface Props {
  width: number;
  height: number;
  night: boolean;
  effects: LifeEffects;
}

export default function DreamHomeDayNightOverlay({ width, height, night, effects }: Props) {
  if (!night) {
    // Day — soft warm sunlight from the top-left.
    return (
      <Svg pointerEvents="none" style={StyleSheet.absoluteFill} width={width} height={height}>
        <Defs>
          <LinearGradient id="dh_sun" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFF6D8" stopOpacity="0.22" />
            <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#dh_sun)" />
      </Svg>
    );
  }

  // Night — scrim + moon + stars + warm lights.
  const stars = Array.from({ length: 12 }).map((_, i) => ({ x: 4 + ((i * 41) % 92), y: 3 + ((i * 23) % 22), delay: (i * 130) % 1400 }));
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
        <Defs>
          <LinearGradient id="dh_night" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0E1A40" stopOpacity="0.62" />
            <Stop offset="1" stopColor="#1A2452" stopOpacity="0.42" />
          </LinearGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#dh_night)" />
        {/* moon */}
        <Circle cx={width * 0.88} cy={height * 0.12} r={Math.max(7, width * 0.022)} fill="#FFF4CF" opacity={0.92} />
      </Svg>

      {stars.map((s, i) => <Star key={i} {...s} width={width} height={height} />)}

      {effects.windowLights && WINDOWS.map((w, i) => (
        <GlowDot key={`w${i}`} x={w.x} y={w.y} w={Math.max(9, width * 0.022)} h={Math.max(7, width * 0.016)} color="#FFD27A" delay={(i * 160) % 1200} width={width} height={height} />
      ))}

      {effects.gardenLamp && (
        <>
          <GlowDot x={LAMP.x} y={LAMP.y} w={Math.max(8, width * 0.02)} h={Math.max(8, width * 0.02)} color="#FFE08A" delay={0} width={width} height={height} />
          {PATH.map((p, i) => (
            <GlowDot key={`p${i}`} x={p.x} y={p.y} w={Math.max(5, width * 0.012)} h={Math.max(5, width * 0.012)} color="#FFE9A8" delay={i * 220} width={width} height={height} />
          ))}
        </>
      )}
    </View>
  );
}
