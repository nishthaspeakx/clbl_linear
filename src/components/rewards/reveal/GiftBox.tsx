/**
 * GiftBox — a premium orange-red gift box with a golden ribbon + bow, an
 * animated lid that lifts open, an inner glow and a light beam that shoots
 * upward. Driven by a single `open` shared value (0 closed → 1 open).
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface Props {
  size: number;
  open: SharedValue<number>;
  glowColor?: string;
}

export default function GiftBox({ size, open, glowColor = '#FFD24A' }: Props) {
  const lidStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -open.value * size * 0.5 },
      { translateX: open.value * size * 0.05 },
      { rotate: `${-open.value * 16}deg` },
    ],
  }));
  const beamStyle = useAnimatedStyle(() => ({ opacity: open.value * 0.85, transform: [{ scaleY: 0.35 + open.value * 0.65 }] }));
  const innerGlowStyle = useAnimatedStyle(() => ({ opacity: open.value }));

  const beamW = size * 0.5;
  const beamH = size * 1.25;

  return (
    <View style={{ width: size, height: size }}>
      {/* light beam shooting upward (behind the box) */}
      <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: size * 0.5 - beamW / 2, top: -beamH * 0.78, width: beamW, height: beamH }, beamStyle]}>
        <Svg width={beamW} height={beamH}>
          <Defs>
            <LinearGradient id="gb_beam" x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0" stopColor={glowColor} stopOpacity="0.55" />
              <Stop offset="1" stopColor={glowColor} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path d={`M ${beamW / 2} ${beamH} L ${beamW} 0 L 0 0 Z`} fill="url(#gb_beam)" />
        </Svg>
      </Animated.View>

      {/* box base */}
      <Svg width={size} height={size} viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="gb_body" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FF6A45" />
            <Stop offset="1" stopColor="#D62F1A" />
          </LinearGradient>
          <LinearGradient id="gb_ribbon" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFE07A" />
            <Stop offset="1" stopColor="#F2A91A" />
          </LinearGradient>
          <RadialGradient id="gb_glow" cx="0.5" cy="0.5" rx="0.5" ry="0.5">
            <Stop offset="0" stopColor={glowColor} stopOpacity="0.95" />
            <Stop offset="1" stopColor={glowColor} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        {/* body */}
        <Rect x="14" y="42" width="72" height="52" rx="8" fill="url(#gb_body)" />
        {/* left highlight */}
        <Rect x="14" y="42" width="18" height="52" rx="8" fill="#FF9474" opacity="0.35" />
        {/* vertical ribbon */}
        <Rect x="44" y="42" width="12" height="52" fill="url(#gb_ribbon)" />
        <Rect x="44" y="42" width="3" height="52" fill="#FFF3C4" opacity="0.6" />
      </Svg>

      {/* inner glow at the opening (when open) */}
      <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: size * 0.14, top: size * 0.24, width: size * 0.72, height: size * 0.34 }, innerGlowStyle]}>
        <Svg width={size * 0.72} height={size * 0.34}>
          <Rect x="0" y="0" width={size * 0.72} height={size * 0.34} fill="url(#gb_glow)" />
        </Svg>
      </Animated.View>

      {/* lid + bow (lifts open) */}
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, lidStyle]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Rect x="9" y="32" width="82" height="15" rx="5" fill="url(#gb_body)" />
          <Rect x="9" y="32" width="82" height="5" rx="3" fill="#FF9474" opacity="0.4" />
          <Rect x="44" y="32" width="12" height="15" fill="url(#gb_ribbon)" />
          {/* bow */}
          <Path d="M50 31 C 39 13, 20 18, 30 29 C 36 34, 46 32, 50 31 Z" fill="url(#gb_ribbon)" />
          <Path d="M50 31 C 61 13, 80 18, 70 29 C 64 34, 54 32, 50 31 Z" fill="url(#gb_ribbon)" />
          <Path d="M50 31 L 44 44 L 50 41 L 56 44 Z" fill="#F2A91A" />
          <Circle cx="50" cy="30" r="5.5" fill="#F4B41E" />
          <Circle cx="48.6" cy="28.6" r="2" fill="#FFEFB0" />
        </Svg>
      </Animated.View>
    </View>
  );
}
