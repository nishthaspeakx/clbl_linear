/**
 * ExerciseJourneyOverlay — gamified, cinematic mini-journey for one level's 6
 * exercises. Opens directly when a level pin is tapped (no bottom sheet).
 *
 * Features: drifting clouds (day) / twinkling stars + moon (night), a rotating
 * sun, a Candy-Crush dotted path with 6 nodes, a day/night toggle, a completion
 * banner, and a "Start Level N+1 →" CTA that hands back to the town map.
 *
 * Exercise progress is persisted per level (closing never resets it).
 */
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { exerciseTypes, TOTAL_EXERCISES } from '../data/exercises';
import { loadLevelExercises, saveLevelExercises } from '../storage/exerciseProgressStorage';
import { buildCurvedPath } from '../utils/position';
import { playSound } from '../utils/sound';
import ExerciseNode, { ExStatus } from './ExerciseNode';
import ExerciseActivityModal from './ExerciseActivityModal';
import RewardAnimation from './RewardAnimation';

const { width: SW, height: SH } = Dimensions.get('window');
const CARD_W = SW * 0.92;
const CARD_H = Math.min(SH * 0.84, 660);
const HEADER_H = 96;
const FOOTER_H = 78;
const PAD = 16;
const JW = CARD_W - PAD * 2;
const JH = CARD_H - HEADER_H - FOOTER_H;

const NODE_FR = [
  { fx: 0.5, fy: 0.9 },
  { fx: 0.76, fy: 0.74 },
  { fx: 0.5, fy: 0.58 },
  { fx: 0.24, fy: 0.42 },
  { fx: 0.5, fy: 0.26 },
  { fx: 0.76, fy: 0.12 },
];
const NODES = NODE_FR.map((n) => ({ x: n.fx * JW, y: n.fy * JH }));
const PATH_D = buildCurvedPath(NODES);

const AG = Animated.createAnimatedComponent(G);
const AC = Animated.createAnimatedComponent(Circle);

/* ── cinematic sky elements ── */

function MovingCloud({ y, dur, s = 1, offset = 0 }: { y: number; dur: number; s?: number; offset?: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: dur, easing: Easing.linear }), -1, false);
  }, [t, dur]);
  const span = JW + 160;
  const props = useAnimatedProps(() => {
    const x = ((t.value * span + offset) % span) - 80;
    return { transform: `translate(${x} ${y})` };
  });
  return (
    <AG animatedProps={props}>
      <Ellipse cx={0} cy={0} rx={26 * s} ry={9 * s} fill="#FFFFFF" opacity={0.9} />
      <Ellipse cx={15 * s} cy={-4 * s} rx={16 * s} ry={7 * s} fill="#FFFFFF" opacity={0.9} />
      <Ellipse cx={-15 * s} cy={-2 * s} rx={14 * s} ry={6 * s} fill="#FFFFFF" opacity={0.85} />
    </AG>
  );
}

function SunRays() {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 18000, easing: Easing.linear }), -1, false);
  }, [t]);
  const cx = JW - 42;
  const cy = 46;
  const props = useAnimatedProps(() => ({ transform: `rotate(${t.value * 360} ${cx} ${cy})` }));
  return (
    <G>
      <Circle cx={cx} cy={cy} r={26} fill="#FFE9A8" opacity={0.28} />
      <AG animatedProps={props}>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <Line
              key={i}
              x1={cx + Math.cos(a) * 20}
              y1={cy + Math.sin(a) * 20}
              x2={cx + Math.cos(a) * 30}
              y2={cy + Math.sin(a) * 30}
              stroke="#FFD86B"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          );
        })}
      </AG>
      <Circle cx={cx} cy={cy} r={15} fill="#FFD86B" />
      <Circle cx={cx - 4} cy={cy - 4} r={6} fill="#FFE9A8" opacity={0.7} />
    </G>
  );
}

function Moon() {
  const cx = JW - 42;
  const cy = 46;
  return (
    <G>
      <Circle cx={cx} cy={cy} r={24} fill="#FFF7D6" opacity={0.18} />
      <Circle cx={cx} cy={cy} r={15} fill="#FFF7D6" />
      <Circle cx={cx - 5} cy={cy - 4} r={3} fill="#E9E0BE" opacity={0.7} />
      <Circle cx={cx + 4} cy={cy + 3} r={2.2} fill="#E9E0BE" opacity={0.7} />
      <Circle cx={cx + 6} cy={cy - 5} r={1.6} fill="#E9E0BE" opacity={0.6} />
    </G>
  );
}

const STAR_POS = Array.from({ length: 18 }).map((_, i) => ({
  x: ((i * 71) % 100) / 100 * JW,
  y: ((i * 37) % 100) / 100 * (JH * 0.6),
  r: i % 4 === 0 ? 1.6 : 1,
}));
function TwinkleStars() {
  const tw = useSharedValue(0);
  useEffect(() => {
    tw.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [tw]);
  const pA = useAnimatedProps(() => ({ opacity: 0.35 + tw.value * 0.55 }));
  const pB = useAnimatedProps(() => ({ opacity: 0.9 - tw.value * 0.5 }));
  return (
    <G>
      {STAR_POS.map((s, i) => (
        <AC key={i} cx={s.x} cy={s.y} r={s.r} fill="#FFFFFF" animatedProps={i % 2 ? pA : pB} />
      ))}
    </G>
  );
}

interface Props {
  levelId: number;
  levelNumber: number;
  title: string;
  location: string;
  accent: string;
  canComplete: boolean;
  /** Level number (within topic) of the NEXT level, or null if last. */
  nextLevelNumber: number | null;
  night: boolean;
  onToggleNight: () => void;
  onClose: () => void;
  onCompleteLevel: (levelId: number) => void;
}

function ExerciseJourneyOverlay({
  levelId, levelNumber, title, location, accent, canComplete, nextLevelNumber,
  night, onToggleNight, onClose, onCompleteLevel,
}: Props) {
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [currentId, setCurrentId] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [reward, setReward] = useState(0);

  const entrance = useSharedValue(0);
  const banner = useSharedValue(0);
  useEffect(() => {
    entrance.value = withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) });
    (async () => {
      const p = await loadLevelExercises(levelId);
      setCompletedIds(p.completedExerciseIds);
      setCurrentId(p.currentExerciseId);
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  const allDone = completedIds.length >= TOTAL_EXERCISES;
  useEffect(() => {
    banner.value = allDone ? withSpring(1, { damping: 12, stiffness: 140 }) : 0;
  }, [allDone, banner]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [{ scale: 0.92 + entrance.value * 0.08 }],
  }));
  const scrimStyle = useAnimatedStyle(() => ({ opacity: entrance.value }));
  const bannerStyle = useAnimatedStyle(() => ({
    opacity: banner.value,
    transform: [{ scale: 0.6 + banner.value * 0.4 }],
  }));

  const statusOf = (exId: number): ExStatus => {
    if (completedIds.includes(exId)) return 'completed';
    if (exId === currentId && !allDone) return 'current';
    return 'locked';
  };

  const markComplete = async () => {
    if (activeId == null) return;
    const id = activeId;
    if (completedIds.includes(id)) {
      setActiveId(null);
      return;
    }
    const nextCompleted = [...completedIds, id];
    const nextCur = id < TOTAL_EXERCISES ? id + 1 : id;
    setCompletedIds(nextCompleted);
    setCurrentId(nextCur);
    setActiveId(null);
    await saveLevelExercises(levelId, { completedExerciseIds: nextCompleted, currentExerciseId: nextCur });
    setReward((r) => r + 1);
    if (nextCompleted.length >= TOTAL_EXERCISES) playSound('success');
  };

  const activeEx = activeId != null ? exerciseTypes[activeId - 1] : null;

  // Footer CTA label/action
  let ctaLabel = '';
  if (allDone) {
    if (!canComplete) ctaLabel = 'Back to Town';
    else if (nextLevelNumber != null) ctaLabel = `Start Level ${nextLevelNumber}  →`;
    else ctaLabel = '🏆 Finish';
  }
  const onCta = () => {
    if (canComplete) onCompleteLevel(levelId);
    onClose();
  };

  const sky = night
    ? ['#26315C', '#2E3A64', '#33406B']
    : ['#CFEAFB', '#E6F4E6', '#D6EEC4'];

  return (
    <View style={styles.root} pointerEvents="auto">
      <Animated.View style={[styles.scrim, scrimStyle]} />

      <Animated.View style={[styles.card, cardStyle]}>
        {/* Header */}
        <View style={styles.headerBtns}>
          <Pressable style={styles.smallBtn} onPress={onToggleNight} hitSlop={8}>
            <Text style={styles.smallBtnText}>{night ? '🌙' : '☀️'}</Text>
          </Pressable>
          <Pressable style={styles.smallBtn} onPress={onClose} hitSlop={10}>
            <Text style={styles.closeX}>✕</Text>
          </Pressable>
        </View>
        <View style={styles.header}>
          <Text style={styles.levelTitle} numberOfLines={1}>Level {levelNumber}: {title}</Text>
          <Text style={styles.location}>📍 {location}</Text>
          <View style={styles.progressRow}>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${(completedIds.length / TOTAL_EXERCISES) * 100}%`, backgroundColor: accent }]} />
            </View>
            <Text style={styles.progressText}>{completedIds.length}/{TOTAL_EXERCISES} exercises completed</Text>
          </View>
        </View>

        {/* Journey area */}
        <View style={styles.journey}>
          <Svg width={JW} height={JH} style={StyleSheet.absoluteFill} pointerEvents="none">
            <Defs>
              <LinearGradient id="exSky" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={sky[0]} />
                <Stop offset="0.55" stopColor={sky[1]} />
                <Stop offset="1" stopColor={sky[2]} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width={JW} height={JH} rx={18} fill="url(#exSky)" />

            {night ? <Moon /> : <SunRays />}
            {night && <TwinkleStars />}
            {!night && <MovingCloud y={34} dur={26000} s={1} offset={0} />}
            {!night && <MovingCloud y={60} dur={34000} s={0.75} offset={JW * 0.6} />}

            {/* river */}
            <Path
              d={`M -4 ${JH - 30} Q ${JW * 0.3} ${JH - 18} ${JW * 0.55} ${JH - 32} T ${JW + 4} ${JH - 26} L ${JW + 4} ${JH} L -4 ${JH} Z`}
              fill={night ? '#33477A' : '#9FD0EC'}
              opacity={night ? 0.6 : 0.55}
            />
            {/* trees */}
            {[[JW * 0.08, JH * 0.5], [JW * 0.92, JH * 0.32], [JW * 0.1, JH * 0.85], [JW * 0.9, JH * 0.78]].map((t, i) => (
              <React.Fragment key={i}>
                <Rect x={t[0] - 2} y={t[1] - 4} width={4} height={12} rx={1.5} fill="#9A6B43" />
                <Circle cx={t[0]} cy={t[1] - 10} r={11} fill={night ? '#3E6B45' : '#7FB85A'} />
                <Circle cx={t[0] - 6} cy={t[1] - 5} r={7} fill={night ? '#4A7A52' : '#8FC468'} />
                <Circle cx={t[0] + 6} cy={t[1] - 5} r={7} fill={night ? '#345E3C' : '#73AC50'} />
              </React.Fragment>
            ))}
            {/* dotted journey path */}
            <Path d={PATH_D} stroke="#FFFFFF" strokeWidth={9} fill="none" strokeLinecap="round" opacity={night ? 0.35 : 0.55} />
            <Path d={PATH_D} stroke={accent} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="2 12" opacity={0.9} />
          </Svg>

          {/* exercise nodes */}
          {loaded &&
            exerciseTypes.map((ex, i) => (
              <ExerciseNode
                key={ex.id}
                x={NODES[i].x}
                y={NODES[i].y}
                icon={ex.icon}
                label={ex.title}
                status={statusOf(ex.id)}
                accent={accent}
                onPress={() => {
                  playSound('tap');
                  setActiveId(ex.id);
                }}
              />
            ))}

          {/* completion banner */}
          {allDone && (
            <Animated.View pointerEvents="none" style={[styles.banner, bannerStyle]}>
              <Text style={styles.bannerEmoji}>🎉</Text>
              <Text style={styles.bannerText}>Level {levelNumber} Completed!</Text>
            </Animated.View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {allDone ? (
            <Pressable
              style={({ pressed }) => [styles.cta, { backgroundColor: '#33A867' }, pressed && { opacity: 0.85 }]}
              onPress={onCta}
            >
              <Text style={styles.ctaText}>{ctaLabel}</Text>
            </Pressable>
          ) : (
            <View style={[styles.cta, styles.ctaDisabled]}>
              <Text style={styles.ctaDisabledText}>Finish all 6 lessons to complete Level {levelNumber}</Text>
            </View>
          )}
        </View>
      </Animated.View>

      {activeEx && (
        <ExerciseActivityModal exercise={activeEx} accent={accent} onMarkComplete={markComplete} onClose={() => setActiveId(null)} />
      )}
      <RewardAnimation trigger={reward} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', zIndex: 40 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(18,22,38,0.55)' },
  card: {
    width: CARD_W,
    height: CARD_H,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 20,
  },
  headerBtns: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', zIndex: 5 },
  smallBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#F2F3F5',
    alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  smallBtnText: { fontSize: 14 },
  closeX: { fontSize: 14, fontWeight: '800', color: '#8A9096' },
  header: { height: HEADER_H, paddingHorizontal: 18, paddingTop: 16, justifyContent: 'center' },
  levelTitle: { fontSize: 18, fontWeight: '900', color: '#2A2E33', paddingRight: 70 },
  location: { fontSize: 13.5, color: '#6B7177', marginTop: 2, fontWeight: '600' },
  progressRow: { marginTop: 8 },
  track: { height: 6, borderRadius: 4, backgroundColor: '#EEF0F2', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  progressText: { marginTop: 4, fontSize: 11.5, color: '#9AA0A6', fontWeight: '700' },
  journey: { width: JW, height: JH, marginHorizontal: PAD, borderRadius: 18 },
  banner: {
    position: 'absolute',
    alignSelf: 'center',
    top: JH * 0.4,
    left: JW * 0.1,
    width: JW * 0.8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  bannerEmoji: { fontSize: 28 },
  bannerText: { fontSize: 17, fontWeight: '900', color: '#2E9E63', marginTop: 2 },
  footer: { height: FOOTER_H, paddingHorizontal: 18, justifyContent: 'center' },
  cta: { borderRadius: 16, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  ctaDisabled: { backgroundColor: '#F1F2F4', borderWidth: 1.5, borderColor: '#E4E7EA' },
  ctaDisabledText: { color: '#A9AFB5', fontWeight: '700', fontSize: 13.5 },
});

export default ExerciseJourneyOverlay;
