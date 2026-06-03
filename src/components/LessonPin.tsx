/**
 * MapPin — a premium "game level node" (think Candy Crush / Duolingo path).
 *
 * Visual states:
 *   locked    -> frosted grey disc with a lock icon (flat, muted)
 *   current   -> glowing orange node, expanding pulse rings, twinkling star
 *   completed -> green node with a white check + a small gold star badge
 *
 * Each node is a layered 3D disc (drop shadow → rim → radial-gradient face →
 * content) so it reads as a tactile button, not a flat map marker.
 */
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Path,
  RadialGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

export type PinStatus = 'locked' | 'current' | 'completed';

// Virtual-px wrapper big enough to hold the glow + pulse rings.
const WRAP = 120;
const CENTER = WRAP / 2;
const R_NORMAL = 25;
const R_CURRENT = 31;

interface Props {
  id: number;
  cx: number;
  cy: number;
  status: PinStatus;
  onPress: (id: number) => void;
  /** True when the lesson's location is only an approximate placement. */
  approximate?: boolean;
  /** Optional text shown beneath the pin in debug mode (location + coords). */
  debugLabel?: string;
}

/** Radial-gradient face colours (top highlight → bottom) per status. */
const FACE_STOPS: Record<PinStatus, [string, string]> = {
  current: ['#FFC27A', '#FB8B2E'],
  completed: ['#67D29A', '#33A867'],
  locked: ['#F2F4F6', '#D2D7DC'],
};

function LessonPin({ id, cx, cy, status, onPress, approximate, debugLabel }: Props) {
  const isCurrent = status === 'current';
  const R = isCurrent ? R_CURRENT : R_NORMAL;

  // ── Animations (only the current node animates) ──────────────────────────
  const pulse1 = useSharedValue(0);
  const pulse2 = useSharedValue(0);
  const sparkle = useSharedValue(0);

  useEffect(() => {
    if (!isCurrent) return;
    const loop = (sv: typeof pulse1, delay: number) => {
      sv.value = withDelay(
        delay,
        withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.ease) }), -1, false)
      );
    };
    loop(pulse1, 0);
    loop(pulse2, 900);
    sparkle.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [isCurrent, pulse1, pulse2, sparkle]);

  const ring1Style = useAnimatedStyle(() => ({
    opacity: (1 - pulse1.value) * 0.65,
    transform: [{ scale: 0.55 + pulse1.value * 1.5 }],
  }));
  const ring2Style = useAnimatedStyle(() => ({
    opacity: (1 - pulse2.value) * 0.65,
    transform: [{ scale: 0.55 + pulse2.value * 1.5 }],
  }));
  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + sparkle.value * 0.6,
    transform: [{ scale: 0.7 + sparkle.value * 0.5 }, { rotate: `${sparkle.value * 90}deg` }],
  }));

  const gid = `pin-face-${id}`;
  const [faceTop, faceBottom] = FACE_STOPS[status];

  return (
    <Pressable
      onPress={() => onPress(id)}
      style={[styles.wrapper, { left: cx - CENTER, top: cy - CENTER }]}
      hitSlop={8}
    >
      {/* Pulse rings (current only) */}
      {isCurrent && (
        <>
          <Animated.View pointerEvents="none" style={[styles.ring, ring1Style]} />
          <Animated.View pointerEvents="none" style={[styles.ring, ring2Style]} />
        </>
      )}

      <Svg width={WRAP} height={WRAP} viewBox={`0 0 ${WRAP} ${WRAP}`}>
        <Defs>
          <RadialGradient id={gid} cx="50%" cy="35%" r="75%">
            <Stop offset="0" stopColor={faceTop} />
            <Stop offset="1" stopColor={faceBottom} />
          </RadialGradient>
        </Defs>

        {/* Drop shadow */}
        <Ellipse cx={CENTER} cy={CENTER + R + 5} rx={R * 0.82} ry={R * 0.28} fill="#000" opacity={0.18} />

        {/* Soft outer glow for current (stacked for a strong "tap me" halo) */}
        {isCurrent && (
          <>
            <Circle cx={CENTER} cy={CENTER} r={R + 30} fill="#FFC074" opacity={0.16} />
            <Circle cx={CENTER} cy={CENTER} r={R + 20} fill="#FFB45A" opacity={0.24} />
            <Circle cx={CENTER} cy={CENTER} r={R + 11} fill="#FFA94D" opacity={0.34} />
          </>
        )}

        {/* Rim */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={R + 3}
          fill={
            status === 'current' ? '#E0741B' : status === 'completed' ? '#268050' : '#BFC5CB'
          }
          opacity={status === 'locked' ? 0.9 : 1}
        />
        {/* Face */}
        <Circle cx={CENTER} cy={CENTER} r={R} fill={`url(#${gid})`} opacity={status === 'locked' ? 0.96 : 1} />
        {/* Top gloss highlight */}
        <Ellipse cx={CENTER} cy={CENTER - R * 0.42} rx={R * 0.55} ry={R * 0.28} fill="#FFFFFF" opacity={0.28} />

        {/* Content */}
        {status === 'completed' ? (
          <Path
            d={`M ${CENTER - 12} ${CENTER} l 7 8 l 14 -16`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={5.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : status === 'locked' ? (
          // Lock icon
          <>
            <Path
              d={`M ${CENTER - 7} ${CENTER - 2} v -5 a 7 7 0 0 1 14 0 v 5`}
              fill="none"
              stroke="#8A9097"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Path
              d={`M ${CENTER - 10} ${CENTER - 2} h 20 a 3 3 0 0 1 3 3 v 11 a 3 3 0 0 1 -3 3 h -20 a 3 3 0 0 1 -3 -3 v -11 a 3 3 0 0 1 3 -3 z`}
              fill="#9AA0A6"
            />
          </>
        ) : (
          // Current → number
          <SvgText
            x={CENTER}
            y={CENTER + 7}
            fontSize={22}
            fontWeight="bold"
            fill="#FFFFFF"
            textAnchor="middle"
          >
            {id}
          </SvgText>
        )}

        {/* Gold star badge for completed */}
        {status === 'completed' && (
          <Path
            d={starPath(CENTER + R * 0.7, CENTER - R * 0.7, 9)}
            fill="#FFC53D"
            stroke="#E8A317"
            strokeWidth={1}
          />
        )}
      </Svg>

      {/* Twinkling sparkle for current */}
      {isCurrent && (
        <Animated.View pointerEvents="none" style={[styles.sparkle, sparkleStyle]}>
          <Svg width={26} height={26} viewBox="0 0 26 26">
            <Path d={starPath(13, 13, 12)} fill="#FFF1C2" stroke="#FFD45A" strokeWidth={1} />
          </Svg>
        </Animated.View>
      )}

      {/* Yellow warning badge for approximate placements */}
      {approximate && (
        <View pointerEvents="none" style={styles.warnBadge}>
          <Text style={styles.warnText}>!</Text>
        </View>
      )}

      {/* Debug label (location + coordinates) */}
      {debugLabel ? (
        <View pointerEvents="none" style={styles.debugLabel}>
          <Text style={styles.debugText}>{debugLabel}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

/** Build a 5-point star centred at (cx,cy) with outer radius r. */
function starPath(cx: number, cy: number, r: number): string {
  'worklet';
  const spikes = 5;
  const inner = r * 0.45;
  let d = '';
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? r : inner;
    const angle = (Math.PI / spikes) * i - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d + 'Z';
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: WRAP,
    height: WRAP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: '#FF9A3D',
  },
  sparkle: {
    position: 'absolute',
    top: CENTER - R_CURRENT - 16,
    right: CENTER - R_CURRENT - 10,
  },
  warnBadge: {
    position: 'absolute',
    top: CENTER - R_NORMAL - 6,
    left: CENTER - R_NORMAL - 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFC107',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warnText: { color: '#6B4E00', fontWeight: '900', fontSize: 12, lineHeight: 14 },
  debugLabel: {
    position: 'absolute',
    top: CENTER + R_NORMAL + 6,
    width: 150,
    alignItems: 'center',
  },
  debugText: {
    fontSize: 10,
    color: '#1A1A1A',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: 'hidden',
    textAlign: 'center',
  },
});

export default React.memo(LessonPin);
