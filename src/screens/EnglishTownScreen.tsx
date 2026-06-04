/**
 * EnglishTownScreen — the single screen of the vertical isometric town journey.
 *
 * Owns progress (AsyncStorage), the vertical camera (translateY) and the
 * character position. The current lesson is always auto-centred; completing a
 * lesson walks the character up the road to the next pin. A small celebration
 * plays when a TOPIC is finished, and "English Champion" after lesson 60.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { SUBTOPICS, TOTAL_SUBTOPICS } from '../data/subtopics';
import { TOPIC_ZONES, topicZoneOf } from '../data/topicZones';
import { LAYOUT, lessonPos, WORLD_H } from '../utils/mapLayout';
import { clamp } from '../utils/position';
import { topicProgress, levelInTopic } from '../utils/progressUtils';
import TopProgressHeader from '../components/TopProgressHeader';
import {
  loadProgress,
  saveProgress,
  resetProgress,
  isTownCompleted,
  Progress,
  DEFAULT_PROGRESS,
} from '../storage/progressStorage';
import VerticalIsometricTownMap from '../components/VerticalIsometricTownMap';
import { PinStatus } from '../components/LessonPin';
import LessonBottomCard from '../components/LessonBottomCard';
import RewardAnimation from '../components/RewardAnimation';

const { height: VIEWPORT_H } = Dimensions.get('window');
const MIN_Y = Math.min(0, VIEWPORT_H - WORLD_H);
const CENTER_BIAS = VIEWPORT_H * 0.44;

/** Is `id` the last lesson of its topic? (topic changes at id+1) */
function isTopicEnd(id: number): boolean {
  if (id >= TOTAL_SUBTOPICS) return false;
  return SUBTOPICS[id - 1].topicIndex !== SUBTOPICS[id].topicIndex;
}

export default function EnglishTownScreen() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [selectedId, setSelectedId] = useState(1);
  const [rewardTrigger, setRewardTrigger] = useState(0);
  const [townDone, setTownDone] = useState(false);
  const [celebrateTopic, setCelebrateTopic] = useState<number | null>(null);
  const [night, setNight] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const translateY = useSharedValue(0);
  const charX = useSharedValue(0);
  const charY = useSharedValue(0);
  const walking = useSharedValue(0);

  const focusLesson = useCallback(
    (id: number, animated = true) => {
      const l = lessonPos(id);
      const ty = clamp(CENTER_BIAS - l.y, MIN_Y, 0);
      translateY.value = animated ? withTiming(ty, { duration: 750 }) : ty;
    },
    [translateY]
  );

  useEffect(() => {
    (async () => {
      const p = await loadProgress();
      setProgress(p);
      setSelectedId(p.currentId);
      setTownDone(isTownCompleted(p));
      const start = lessonPos(p.currentId);
      charX.value = start.x;
      charY.value = start.y;
      focusLesson(p.currentId, false);
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusOf = useCallback(
    (id: number): PinStatus => {
      if (progress.completedIds.includes(id)) return 'completed';
      if (id === progress.currentId && !townDone) return 'current';
      return 'locked';
    },
    [progress, townDone]
  );

  const handlePinPress = useCallback(
    (id: number) => {
      setSelectedId(id);
      focusLesson(id);
      setSheetOpen(true); // sheet opens only on a pin tap
    },
    [focusLesson]
  );

  const handleComplete = useCallback(
    (id: number) => {
      if (id !== progress.currentId || townDone) return;

      setRewardTrigger((t) => t + 1);

      const isLast = id === TOTAL_SUBTOPICS;
      const nextId = isLast ? id : id + 1;
      const next: Progress = {
        currentId: nextId,
        completedIds: [...progress.completedIds, id],
      };
      setProgress(next);
      saveProgress(next);

      if (isLast) {
        setTownDone(true);
        return;
      }

      setSelectedId(nextId);

      const target = lessonPos(nextId);
      walking.value = 1;
      charX.value = withTiming(target.x, { duration: 1100 });
      charY.value = withTiming(target.y, { duration: 1100 }, (finished) => {
        'worklet';
        if (finished) walking.value = 0;
      });

      focusLesson(nextId);

      if (isTopicEnd(id)) {
        setCelebrateTopic(SUBTOPICS[id - 1].topicIndex);
      }
    },
    [progress, townDone, focusLesson, charX, charY, walking]
  );

  /** ── FUTURE: open the actual lesson screen here. ── */
  const handleStartLesson = useCallback((id: number) => {
    console.log('[EnglishTownScreen] start/review lesson', id);
  }, []);

  const handleReset = useCallback(async () => {
    await resetProgress();
    const start = lessonPos(1);
    charX.value = start.x;
    charY.value = start.y;
    focusLesson(1);
    setProgress(DEFAULT_PROGRESS);
    setSelectedId(1);
    setTownDone(false);
    setCelebrateTopic(null);
    setSheetOpen(false); // start fresh with no bottom sheet — opens only on tap
  }, [charX, charY, focusLesson]);

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF8A3D" />
        <Text style={styles.loadingText}>Building your town…</Text>
      </View>
    );
  }

  const selected = SUBTOPICS[selectedId - 1];
  const selectedZone = topicZoneOf(selected.topicIndex);
  const curTopic = topicProgress(progress.currentId, progress.completedIds);
  const completedCount = progress.completedIds.length;

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />

      <VerticalIsometricTownMap
        statusOf={statusOf}
        onPinPress={handlePinPress}
        night={night}
        translateY={translateY}
        charX={charX}
        charY={charY}
        walking={walking}
      />

      {/* Compact top header — current topic + topic progress only */}
      <TopProgressHeader
        zone={curTopic.zone}
        completed={curTopic.completed}
        total={curTopic.total}
        stars={completedCount * 10}
        night={night}
        onToggleNight={() => setNight((n) => !n)}
      />

      {/* Bottom lesson sheet — opens only on a pin tap, dismissible */}
      {sheetOpen && (
        <LessonBottomCard
          subtopic={selected}
          status={statusOf(selected.id)}
          level={levelInTopic(selected.id)}
          topicAccent={selectedZone.accent}
          onComplete={handleComplete}
          onStartLesson={handleStartLesson}
          onClose={() => setSheetOpen(false)}
        />
      )}

      <RewardAnimation trigger={rewardTrigger} />

      {/* Topic completion celebration */}
      {celebrateTopic !== null && (
        <View style={styles.celebration}>
          <View style={styles.celebrationCard}>
            <Text style={styles.celebrationEmoji}>{TOPIC_ZONES[celebrateTopic - 1].emoji}🎉</Text>
            <Text style={styles.celebrationTitle}>Topic Complete!</Text>
            <Text style={styles.celebrationSub}>
              You finished <Text style={{ fontWeight: '800' }}>{TOPIC_ZONES[celebrateTopic - 1].name}</Text> and
              earned <Text style={{ fontWeight: '800' }}>+50 ⭐</Text>.
              {celebrateTopic < TOPIC_ZONES.length ? `\n\nNext up: ${TOPIC_ZONES[celebrateTopic].name}.` : ''}
            </Text>
            <Pressable
              style={[styles.celebrationBtn, { backgroundColor: TOPIC_ZONES[celebrateTopic - 1].accent }]}
              onPress={() => setCelebrateTopic(null)}
            >
              <Text style={styles.celebrationBtnText}>Continue ↑</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* English Champion */}
      {townDone && (
        <View style={styles.celebration}>
          <View style={styles.celebrationCard}>
            <Text style={styles.celebrationEmoji}>🏆👑🏆</Text>
            <Text style={styles.celebrationTitle}>English Champion!</Text>
            <Text style={styles.celebrationSub}>
              You climbed all {TOTAL_SUBTOPICS} lessons across {TOPIC_ZONES.length} topics. Incredible!
            </Text>
            <Pressable style={[styles.celebrationBtn, { backgroundColor: '#FF8A3D' }]} onPress={handleReset}>
              <Text style={styles.celebrationBtnText}>Play Again</Text>
            </Pressable>
          </View>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#DCEBD6' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DCEBD6' },
  loadingText: { marginTop: 12, color: '#7C8186', fontWeight: '600' },
  header: {
    position: 'absolute',
    top: 52,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerBadge: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  headerBadgeText: { fontSize: 20 },
  headerTopic: { fontSize: 17, fontWeight: '800', color: '#2A2E33' },
  headerCount: { fontSize: 14, fontWeight: '700', color: '#9AA0A6' },
  dayNight: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF6E0',
    borderWidth: 1.5,
    borderColor: '#FFE0BC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  dayNightOn: { backgroundColor: '#2A3360', borderColor: '#3E4A78' },
  dayNightText: { fontSize: 18 },
  coinPill: {
    backgroundColor: '#FFF1E2',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#FFE0BC',
  },
  coinText: { color: '#E07B1E', fontWeight: '800', fontSize: 15 },
  progressTrack: { height: 6, borderRadius: 4, backgroundColor: '#EFF1F3', marginTop: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  celebration: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  celebrationCard: { width: '82%', backgroundColor: '#FFFFFF', borderRadius: 26, padding: 28, alignItems: 'center' },
  celebrationEmoji: { fontSize: 40, marginBottom: 8 },
  celebrationTitle: { fontSize: 26, fontWeight: '900', color: '#2A2E33', textAlign: 'center' },
  celebrationSub: { fontSize: 15, color: '#6B7177', textAlign: 'center', marginTop: 10, lineHeight: 22 },
  celebrationBtn: { marginTop: 22, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 14 },
  celebrationBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
});
