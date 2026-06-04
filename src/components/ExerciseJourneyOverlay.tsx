/**
 * ExerciseJourneyOverlay — the gamified mini-journey for one level's 6 exercises.
 *
 * Sits over the (faded) town map. Shows a Candy-Crush-style curved dotted path
 * with 6 exercise nodes, the level title / location / progress, an activity
 * modal placeholder per exercise, a celebration at 6/6, and a "Complete Level"
 * button that hands back to the main map.
 *
 * Progress is persisted per level (closing never resets it).
 */
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

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

// Node positions (fractions of the journey area): level 1 bottom → level 6 top.
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

interface Props {
  levelId: number; // global subtopic id
  levelNumber: number; // level number within the topic
  title: string;
  location: string;
  accent: string;
  /** True if this is the active/current level (allowed to actually complete it). */
  canComplete: boolean;
  onClose: () => void;
  onCompleteLevel: (levelId: number) => void;
}

function ExerciseJourneyOverlay({
  levelId, levelNumber, title, location, accent, canComplete, onClose, onCompleteLevel,
}: Props) {
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [currentId, setCurrentId] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [reward, setReward] = useState(0);

  const entrance = useSharedValue(0);
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

  const cardStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [{ scale: 0.92 + entrance.value * 0.08 }],
  }));
  const scrimStyle = useAnimatedStyle(() => ({ opacity: entrance.value }));

  const allDone = completedIds.length >= TOTAL_EXERCISES;

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
    setReward((r) => r + 1); // little burst (+ coin sound) each exercise
    if (nextCompleted.length >= TOTAL_EXERCISES) playSound('success');
  };

  const activeEx = activeId != null ? exerciseTypes[activeId - 1] : null;

  return (
    <View style={styles.root} pointerEvents="auto">
      <Animated.View style={[styles.scrim, scrimStyle]} />

      <Animated.View style={[styles.card, cardStyle]}>
        {/* Header */}
        <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={10}>
          <Text style={styles.closeX}>✕</Text>
        </Pressable>
        <View style={styles.header}>
          <Text style={styles.levelTitle} numberOfLines={1}>
            Level {levelNumber}: {title}
          </Text>
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
                <Stop offset="0" stopColor="#CFEAFB" />
                <Stop offset="0.55" stopColor="#E6F4E6" />
                <Stop offset="1" stopColor="#D6EEC4" />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width={JW} height={JH} rx={18} fill="url(#exSky)" />
            {/* clouds */}
            <Ellipse cx={JW * 0.28} cy={28} rx={26} ry={9} fill="#FFFFFF" opacity={0.8} />
            <Ellipse cx={JW * 0.34} cy={22} rx={16} ry={7} fill="#FFFFFF" opacity={0.8} />
            <Ellipse cx={JW * 0.8} cy={46} rx={22} ry={8} fill="#FFFFFF" opacity={0.7} />
            {/* river */}
            <Path d={`M -4 ${JH - 30} Q ${JW * 0.3} ${JH - 18} ${JW * 0.55} ${JH - 32} T ${JW + 4} ${JH - 26} L ${JW + 4} ${JH} L -4 ${JH} Z`} fill="#9FD0EC" opacity={0.55} />
            {/* trees */}
            {[[JW * 0.08, JH * 0.5], [JW * 0.92, JH * 0.32], [JW * 0.1, JH * 0.85], [JW * 0.9, JH * 0.78]].map((t, i) => (
              <React.Fragment key={i}>
                <Rect x={t[0] - 2} y={t[1] - 4} width={4} height={12} rx={1.5} fill="#9A6B43" />
                <Circle cx={t[0]} cy={t[1] - 10} r={11} fill="#7FB85A" />
                <Circle cx={t[0] - 6} cy={t[1] - 5} r={7} fill="#8FC468" />
                <Circle cx={t[0] + 6} cy={t[1] - 5} r={7} fill="#73AC50" />
              </React.Fragment>
            ))}
            {/* dotted journey path */}
            <Path d={PATH_D} stroke="#FFFFFF" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.55} />
            <Path d={PATH_D} stroke={accent} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="2 12" opacity={0.85} />
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
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {allDone ? (
            <Pressable
              style={({ pressed }) => [styles.completeBtn, { backgroundColor: accent }, pressed && { opacity: 0.85 }]}
              onPress={() => {
                if (canComplete) onCompleteLevel(levelId);
                onClose();
              }}
            >
              <Text style={styles.completeText}>{canComplete ? '🎉 Complete Level' : 'Done — Close'}</Text>
            </Pressable>
          ) : (
            <View style={[styles.completeBtn, styles.completeDisabled]}>
              <Text style={styles.completeDisabledText}>Finish all 6 exercises to complete</Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* per-exercise placeholder */}
      {activeEx && (
        <ExerciseActivityModal exercise={activeEx} accent={accent} onMarkComplete={markComplete} onClose={() => setActiveId(null)} />
      )}

      {/* burst on each exercise / final celebration */}
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
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F2F3F5',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  closeX: { fontSize: 14, fontWeight: '800', color: '#8A9096' },
  header: { height: HEADER_H, paddingHorizontal: 18, paddingTop: 16, justifyContent: 'center' },
  levelTitle: { fontSize: 18, fontWeight: '900', color: '#2A2E33', paddingRight: 34 },
  location: { fontSize: 13.5, color: '#6B7177', marginTop: 2, fontWeight: '600' },
  progressRow: { marginTop: 8 },
  track: { height: 6, borderRadius: 4, backgroundColor: '#EEF0F2', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  progressText: { marginTop: 4, fontSize: 11.5, color: '#9AA0A6', fontWeight: '700' },
  journey: { width: JW, height: JH, marginHorizontal: PAD, borderRadius: 18 },
  footer: { height: FOOTER_H, paddingHorizontal: 18, justifyContent: 'center' },
  completeBtn: { borderRadius: 16, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  completeText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  completeDisabled: { backgroundColor: '#F1F2F4', borderWidth: 1.5, borderColor: '#E4E7EA' },
  completeDisabledText: { color: '#A9AFB5', fontWeight: '700', fontSize: 13.5 },
});

export default ExerciseJourneyOverlay;
