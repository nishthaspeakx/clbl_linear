/**
 * StreakCelebration — full-screen "N correct answers in a row" screen with
 * radiating light rays, confetti arcs, and a cheering mascot. Purely visual;
 * the parent dismisses it on a timer.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Path, Polygon, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { VIEWPORT_W as SW, VIEWPORT_H as SH } from '../../utils/viewport';

const PRIMARY = '#FF7A00';

function Mascot() {
  return (
    <Svg width={140} height={160} viewBox="0 0 140 160">
      {/* confetti arcs */}
      <Path d="M 28 70 Q 40 40 58 44" stroke="#FFC72C" strokeWidth={7} fill="none" strokeLinecap="round" />
      <Path d="M 60 38 Q 70 22 80 38" stroke="#4FA3E3" strokeWidth={7} fill="none" strokeLinecap="round" />
      <Path d="M 84 44 Q 102 40 112 70" stroke="#F2693C" strokeWidth={7} fill="none" strokeLinecap="round" />
      {/* graduation cap */}
      <Polygon points="70,46 100,56 70,66 40,56" fill="#2E2A66" />
      <Rect x={64} y={62} width={12} height={6} fill="#3A3578" />
      <Path d="M 100 56 v 10" stroke="#2E2A66" strokeWidth={2} />
      <Circle cx={100} cy={68} r={3} fill="#FFC72C" />
      {/* body */}
      <Ellipse cx={70} cy={150} rx={34} ry={7} fill="#000" opacity={0.08} />
      <Rect x={50} y={108} width={40} height={42} rx={16} fill={PRIMARY} />
      <Rect x={58} y={122} width={24} height={20} rx={6} fill="#FFFFFF" opacity={0.18} />
      {/* head */}
      <Circle cx={70} cy={92} r={30} fill="#FF8A2B" />
      <Circle cx={70} cy={92} r={30} fill="url(#mg)" />
      <Defs>
        <RadialGradient id="mg" cx="40%" cy="32%" r="70%">
          <Stop offset="0" stopColor="#FFB36B" />
          <Stop offset="1" stopColor="#FF8A2B" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      {/* glasses */}
      <Circle cx={59} cy={90} r={11} fill="#FFFFFF" stroke="#2A2E33" strokeWidth={2.4} />
      <Circle cx={82} cy={90} r={11} fill="#FFFFFF" stroke="#2A2E33" strokeWidth={2.4} />
      <Path d="M 70 90 h 0" stroke="#2A2E33" strokeWidth={2.4} />
      <Path d="M 70 88 q 1 3 1 0" stroke="#2A2E33" strokeWidth={2.4} fill="none" />
      <Circle cx={59} cy={90} r={2.4} fill="#2A2E33" />
      <Circle cx={82} cy={90} r={2.4} fill="#2A2E33" />
      {/* cheeks + smile */}
      <Circle cx={52} cy={102} r={4} fill="#FF9FB0" opacity={0.7} />
      <Circle cx={88} cy={102} r={4} fill="#FF9FB0" opacity={0.7} />
      <Path d="M 60 104 q 10 12 20 0 q -10 4 -20 0 Z" fill="#B23A3A" />
      <Path d="M 60 104 q 10 12 20 0" fill="none" stroke="#7E2A2A" strokeWidth={1.4} />
    </Svg>
  );
}

export default function StreakCelebration({ count }: { count: number }) {
  const pop = useSharedValue(0);
  React.useEffect(() => {
    pop.value = withSpring(1, { damping: 11, stiffness: 150 });
  }, [pop]);
  const numStyle = useAnimatedStyle(() => ({ transform: [{ scale: 0.4 + pop.value * 0.6 }], opacity: pop.value }));
  const txtStyle = useAnimatedStyle(() => ({ opacity: pop.value, transform: [{ translateY: (1 - pop.value) * 12 }] }));

  const rayCx = SW / 2;
  const rayCy = SH * 0.28;

  return (
    <View style={styles.root}>
      {/* light rays */}
      <Svg style={StyleSheet.absoluteFill} width={SW} height={SH} pointerEvents="none">
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="28%" r="55%">
            <Stop offset="0" stopColor="#FFF1DD" />
            <Stop offset="1" stopColor="#FFFFFF" />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={SW} height={SH} fill="url(#glow)" />
        <G opacity={0.5}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a0 = (i / 12) * Math.PI * 2;
            const a1 = a0 + Math.PI / 12;
            const R = Math.max(SW, SH);
            return (
              <Polygon
                key={i}
                points={`${rayCx},${rayCy} ${rayCx + Math.cos(a0) * R},${rayCy + Math.sin(a0) * R} ${rayCx + Math.cos(a1) * R},${rayCy + Math.sin(a1) * R}`}
                fill={i % 2 ? '#FFE3BE' : '#FFD79C'}
                opacity={0.35}
              />
            );
          })}
        </G>
        {/* grass strip */}
        <Path d={`M 0 ${SH - 90} Q ${SW * 0.3} ${SH - 110} ${SW * 0.6} ${SH - 92} T ${SW} ${SH - 100} L ${SW} ${SH} L 0 ${SH} Z`} fill="#86C95A" />
        <Path d={`M 0 ${SH - 70} Q ${SW * 0.4} ${SH - 86} ${SW} ${SH - 76} L ${SW} ${SH} L 0 ${SH} Z`} fill="#6FB446" />
      </Svg>

      <View style={styles.center}>
        <Animated.Text style={[styles.number, numStyle]}>{count}</Animated.Text>
        <Animated.Text style={[styles.caption, txtStyle]}>correct answers{'\n'}in a row</Animated.Text>
        <View style={styles.mascot}><Mascot /></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', zIndex: 30 },
  center: { alignItems: 'center', marginTop: -SH * 0.06 },
  number: {
    fontSize: 96, fontWeight: '900', color: PRIMARY, lineHeight: 104,
    textShadowColor: '#FFE0BC', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 6,
  },
  caption: { fontSize: 26, fontWeight: '900', color: '#2A2E33', textAlign: 'center', marginTop: 4 },
  mascot: { marginTop: 26 },
});
