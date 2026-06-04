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
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { VIEWPORT_H } from '../utils/viewport';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { SUBTOPICS, TOTAL_SUBTOPICS } from '../data/subtopics';
import { TOPIC_ZONES, topicZoneOf } from '../data/topicZones';
import { LAYOUT, lessonPos, WORLD_H } from '../utils/mapLayout';
import { clamp } from '../utils/position';
import { topicProgress, levelInTopic } from '../utils/progressUtils';
import AppHeader, { HEADER_HEIGHT } from '../components/AppHeader';
import ExerciseJourneyOverlay from '../components/ExerciseJourneyOverlay';
import { initSounds, playSound, setSoundEnabled } from '../utils/sound';
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
import RewardAnimation from '../components/RewardAnimation';

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
  const [soundOn, setSoundOn] = useState(true);
  /** Subtopic id whose exercise journey overlay is open (null = closed). */
  const [overlayLevelId, setOverlayLevelId] = useState<number | null>(null);

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
    initSounds();
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
      playSound('tap');
      setSelectedId(id);
      focusLesson(id);
      // Open the exercise journey directly (no bottom sheet). Locked pins can't be opened.
      const locked = !progress.completedIds.includes(id) && id !== progress.currentId;
      if (!locked) setOverlayLevelId(id);
    },
    [focusLesson, progress]
  );

  const handleComplete = useCallback(
    (id: number) => {
      if (id !== progress.currentId || townDone) return;

      playSound('levelup');
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
      playSound('walk');
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

  const toggleNight = useCallback(() => {
    playSound('toggle');
    setNight((n) => !n);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn((s) => {
      const next = !s;
      setSoundEnabled(next);
      if (next) playSound('tap'); // little confirm blip when turning on
      return next;
    });
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
    setOverlayLevelId(null);
  }, [charX, charY, focusLesson]);

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF8A3D" />
        <Text style={styles.loadingText}>Building your town…</Text>
      </View>
    );
  }

  const curTopic = topicProgress(progress.currentId, progress.completedIds);
  const completedCount = progress.completedIds.length;
  const pct = curTopic.total > 0 ? (curTopic.completed / curTopic.total) * 100 : 0;

  return (
    <View style={styles.root}>
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

      {/* SpeakX-style app header (language · translate · trophy · coin) */}
      <AppHeader trophies={completedCount} coins={completedCount * 10} />

      {/* Small floating topic-progress card */}
      <View style={[styles.topicCard, { top: HEADER_HEIGHT + 10 }]}>
        <View style={[styles.topicBadge, { backgroundColor: curTopic.zone.accent + '22' }]}>
          <Text style={styles.topicBadgeText}>{curTopic.zone.emoji}</Text>
        </View>
        <View style={styles.topicCenter}>
          <Text style={styles.topicName} numberOfLines={1}>{curTopic.zone.name}</Text>
          <Text style={styles.topicProgress}>{curTopic.completed}/{curTopic.total} levels completed</Text>
          <View style={styles.topicTrack}>
            <View style={[styles.topicFill, { width: `${pct}%`, backgroundColor: curTopic.zone.accent }]} />
          </View>
        </View>
      </View>

      {/* Floating day/night + sound toggles (kept off the header) */}
      <View style={[styles.toggleStack, { top: HEADER_HEIGHT + 10 }]}>
        <Pressable onPress={toggleSound} style={styles.toggleBtn} hitSlop={8}>
          <Text style={styles.toggleText}>{soundOn ? '🔊' : '🔇'}</Text>
        </Pressable>
        <Pressable onPress={toggleNight} style={[styles.toggleBtn, night && styles.toggleBtnNight]} hitSlop={8}>
          <Text style={styles.toggleText}>{night ? '🌙' : '☀️'}</Text>
        </Pressable>
      </View>

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

      {/* Exercise journey overlay (opens on Start Lesson) */}
      {overlayLevelId !== null && (
        <ExerciseJourneyOverlay
          levelId={overlayLevelId}
          levelNumber={levelInTopic(overlayLevelId)}
          title={SUBTOPICS[overlayLevelId - 1].title}
          location={SUBTOPICS[overlayLevelId - 1].location}
          accent={topicZoneOf(SUBTOPICS[overlayLevelId - 1].topicIndex).accent}
          canComplete={overlayLevelId === progress.currentId && !townDone}
          nextLevelNumber={overlayLevelId < TOTAL_SUBTOPICS ? levelInTopic(overlayLevelId + 1) : null}
          night={night}
          onToggleNight={toggleNight}
          onClose={() => setOverlayLevelId(null)}
          onCompleteLevel={(id) => {
            handleComplete(id);
            setOverlayLevelId(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#DCEBD6' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DCEBD6' },
  loadingText: { marginTop: 12, color: '#7C8186', fontWeight: '600' },

  // Floating topic-progress card (small, below the app header)
  topicCard: {
    position: 'absolute',
    left: 12,
    width: 220,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    zIndex: 15,
  },
  topicBadge: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  topicBadgeText: { fontSize: 17 },
  topicCenter: { flex: 1 },
  topicName: { fontSize: 14, fontWeight: '800', color: '#2A2E33' },
  topicProgress: { fontSize: 10.5, color: '#9AA0A6', fontWeight: '600' },
  topicTrack: { height: 4, borderRadius: 3, backgroundColor: '#EEF0F2', marginTop: 4, overflow: 'hidden' },
  topicFill: { height: '100%', borderRadius: 3 },

  // Floating day/night + sound toggles (right side, under header)
  toggleStack: { position: 'absolute', right: 12, alignItems: 'center', zIndex: 15 },
  toggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderWidth: 1,
    borderColor: '#ECEDEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  toggleBtnNight: { backgroundColor: '#2A3360', borderColor: '#3E4A78' },
  toggleText: { fontSize: 17 },

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
