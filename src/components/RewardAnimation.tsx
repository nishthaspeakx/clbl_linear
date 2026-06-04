/**
 * RewardAnimation — a celebratory coin + star burst played after a lesson is
 * completed. Rendered as a full-screen overlay (fixed to the viewport, not the
 * map) so it is always visible regardless of pan / zoom.
 *
 * Drive it by bumping the `trigger` prop (e.g. a counter that increases by 1
 * every completion). Each new value replays the burst.
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { playSound } from '../utils/sound';
import { VIEWPORT_W as SCREEN_W, VIEWPORT_H as SCREEN_H } from '../utils/viewport';

interface Props {
  /** Increment this number to (re)play the animation. 0 = nothing yet. */
  trigger: number;
  /** Optional callback when the burst finishes. */
  onDone?: () => void;
}

// Pre-computed particle directions (deterministic — no Math.random at runtime).
const PARTICLES = Array.from({ length: 10 }).map((_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  return {
    dx: Math.cos(angle) * 120,
    dy: Math.sin(angle) * 120 - 40,
    isStar: i % 2 === 0,
    delay: (i % 5) * 40,
  };
});

function Particle({
  dx,
  dy,
  isStar,
  delay,
  play,
}: {
  dx: number;
  dy: number;
  isStar: boolean;
  delay: number;
  play: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (play === 0) return;
    progress.value = 0;
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) })
    );
  }, [play, delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateX: dx * progress.value },
      { translateY: dy * progress.value },
      { scale: 0.4 + progress.value * 1.1 },
      { rotate: `${progress.value * 360}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.particle, style]}>
      <Svg width={32} height={32} viewBox="0 0 32 32">
        {isStar ? (
          <Path
            d="M16 2 l4 9 l10 1 l-7.5 6.5 l2.3 9.8 l-8.8 -5.2 l-8.8 5.2 l2.3 -9.8 l-7.5 -6.5 l10 -1 Z"
            fill="#FFC53D"
            stroke="#E8A317"
            strokeWidth={1}
          />
        ) : (
          <>
            <Circle cx={16} cy={16} r={13} fill="#FFD24C" stroke="#E8A317" strokeWidth={2} />
            <SvgText x={16} y={22} fontSize={15} fontWeight="bold" fill="#B8860B" textAnchor="middle">
              ₹
            </SvgText>
          </>
        )}
      </Svg>
    </Animated.View>
  );
}

function RewardAnimation({ trigger, onDone }: Props) {
  const [visible, setVisible] = useState(false);
  const labelScale = useSharedValue(0);

  useEffect(() => {
    if (trigger === 0) return;
    playSound('coin');
    setVisible(true);
    labelScale.value = 0;
    labelScale.value = withSequence(
      withTiming(1.15, { duration: 280, easing: Easing.back(2) }),
      withTiming(1, { duration: 120 }),
      withDelay(
        450,
        withTiming(0, { duration: 250 }, (finished) => {
          if (finished) {
            runOnJS(setVisible)(false);
            if (onDone) runOnJS(onDone)();
          }
        })
      )
    );
  }, [trigger, labelScale, onDone]);

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelScale.value,
    transform: [{ scale: labelScale.value }],
  }));

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={styles.overlay}>
      <View style={styles.center}>
        {PARTICLES.map((p, i) => (
          <Particle key={i} {...p} play={trigger} />
        ))}
        <Animated.View style={[styles.label, labelStyle]}>
          <Animated.Text style={styles.labelText}>+10 ⭐</Animated.Text>
          <Animated.Text style={styles.labelSub}>Lesson Complete!</Animated.Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  center: {
    position: 'absolute',
    left: SCREEN_W / 2,
    top: SCREEN_H * 0.42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
  },
  label: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#FF8A3D',
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  labelText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F08A24',
  },
  labelSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7177',
    marginTop: 2,
  },
});

export default RewardAnimation;
