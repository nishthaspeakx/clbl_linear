/**
 * CharacterAvatar — a small animated male avatar (Indian, ~25, casual clothes)
 * that walks between pins. Position is driven by Reanimated shared values owned
 * by the parent screen, so the walk stays on the UI thread and is smooth. While
 * `walking` is 1 the avatar bobs up and down and its shadow squashes.
 */
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// Drawn in a 56×84 viewBox but rendered a touch smaller so the avatar sits on
// the level node without covering the scene people behind it.
const AVATAR_W = 51;
const AVATAR_H = 76;

interface Props {
  x: SharedValue<number>;
  y: SharedValue<number>;
  walking: SharedValue<number>;
}

function CharacterAvatar({ x, y, walking }: Props) {
  // Idle bounce runs slowly all the time; the walk uses a faster, larger bob.
  const idle = useSharedValue(0);
  const bob = useSharedValue(0);
  useEffect(() => {
    idle.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    bob.value = withRepeat(
      withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [idle, bob]);

  const containerStyle = useAnimatedStyle(() => {
    const idleOffset = (idle.value - 0.5) * 4; // ±2px gentle idle bounce
    const walkOffset = (bob.value - 0.5) * 12; // ±6px while walking
    const offset = walking.value * walkOffset + (1 - walking.value) * idleOffset;
    return {
      transform: [
        { translateX: x.value - AVATAR_W / 2 },
        { translateY: y.value - AVATAR_H + offset },
      ],
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const squash = 1 - walking.value * (bob.value * 0.25) - (1 - walking.value) * idle.value * 0.08;
    return { transform: [{ scaleX: squash }], opacity: 0.26 };
  });

  return (
    <Animated.View pointerEvents="none" style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.shadow, shadowStyle]} />
      <Svg width={AVATAR_W} height={AVATAR_H} viewBox="0 0 56 84">
        {/* Legs — blue jeans */}
        <Rect x={20} y={52} width={7} height={22} rx={3} fill="#2F4A73" />
        <Rect x={29} y={52} width={7} height={22} rx={3} fill="#3A578A" />
        {/* Shoes */}
        <Rect x={18} y={72} width={11} height={6} rx={3} fill="#3A3A3A" />
        <Rect x={28} y={72} width={11} height={6} rx={3} fill="#222222" />
        {/* Torso — warm casual jacket */}
        <Path d="M16 34 Q28 28 40 34 L42 56 Q28 60 14 56 Z" fill="#C2703D" />
        {/* Inner tee */}
        <Path d="M24 33 L32 33 L31 50 L25 50 Z" fill="#F2EAD8" />
        {/* Arms */}
        <Rect x={12} y={35} width={6} height={20} rx={3} fill="#B5602F" />
        <Rect x={38} y={35} width={6} height={20} rx={3} fill="#B5602F" />
        {/* Hands — skin tone */}
        <Circle cx={15} cy={56} r={3.4} fill="#A9744B" />
        <Circle cx={41} cy={56} r={3.4} fill="#A9744B" />
        {/* Neck */}
        <Rect x={25} y={26} width={6} height={8} fill="#A9744B" />
        {/* Head — Indian skin tone */}
        <Circle cx={28} cy={18} r={12} fill="#B67C52" />
        {/* Hair — dark, short, friendly */}
        <Path d="M16 16 Q18 5 28 5 Q38 5 40 16 Q36 11 28 11 Q20 11 16 16 Z" fill="#221A14" />
        {/* Eyes */}
        <Circle cx={23.5} cy={18} r={1.6} fill="#2A2018" />
        <Circle cx={32.5} cy={18} r={1.6} fill="#2A2018" />
        {/* Smile */}
        <Path d="M23 23 Q28 27 33 23" fill="none" stroke="#5A3A22" strokeWidth={1.6} strokeLinecap="round" />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: AVATAR_W,
    height: AVATAR_H,
    alignItems: 'center',
  },
  shadow: {
    position: 'absolute',
    bottom: 2,
    width: AVATAR_W * 0.6,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#000',
  },
});

export default CharacterAvatar;
