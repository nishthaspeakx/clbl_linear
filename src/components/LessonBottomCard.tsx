/**
 * LessonBottomCard — the lesson sheet pinned to the bottom.
 *
 * Opens only when a pin is tapped (the parent mounts it). It slides up on
 * mount, can be dismissed by **swiping down** or tapping the **✕**, and shows
 * the lesson's number, name, location, topic and the primary action.
 */
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Subtopic } from '../data/subtopics';
import { PinStatus } from './LessonPin';

interface Props {
  subtopic: Subtopic;
  status: PinStatus;
  /** 1-based level number within the topic. */
  level: number;
  topicAccent?: string;
  onComplete: (id: number) => void;
  onStartLesson?: (id: number) => void;
  onClose: () => void;
}

const STATUS_META: Record<PinStatus, { label: string; color: string; bg: string }> = {
  locked: { label: 'Locked', color: '#7C8186', bg: '#EEF0F2' },
  current: { label: 'Current', color: '#E07B1E', bg: '#FFF1E2' },
  completed: { label: 'Completed', color: '#2E9E63', bg: '#E6F6EE' },
};

function LessonBottomCard({
  subtopic, status, level, topicAccent = '#FF8A3D', onComplete, onStartLesson, onClose,
}: Props) {
  const meta = STATUS_META[status];
  const ty = useSharedValue(420);

  useEffect(() => {
    ty.value = withSpring(0, { damping: 18, stiffness: 160 });
  }, [ty]);

  const dismiss = () => {
    ty.value = withTiming(460, { duration: 220 }, (f) => {
      'worklet';
      if (f) runOnJS(onClose)();
    });
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      ty.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > 110 || e.velocityY > 800) {
        ty.value = withTiming(460, { duration: 200 }, (f) => {
          'worklet';
          if (f) runOnJS(onClose)();
        });
      } else {
        ty.value = withSpring(0, { damping: 18, stiffness: 160 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      <GestureDetector gesture={pan}>
        <View style={styles.grabZone}>
          <View style={styles.grabBar} />
        </View>
      </GestureDetector>

      <Pressable style={styles.closeBtn} onPress={dismiss} hitSlop={10}>
        <Text style={styles.closeX}>✕</Text>
      </Pressable>

      <View style={styles.headerRow}>
        <View style={[styles.numberBadge, { backgroundColor: topicAccent }]}>
          <Text style={styles.numberText}>{level}</Text>
        </View>
        <Text style={styles.counter}>Level {level}</Text>
        <View style={[styles.statusChip, { backgroundColor: meta.bg }]}>
          <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>{subtopic.title}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.location}>📍 {subtopic.location}</Text>
      </View>

      {status === 'locked' && (
        <View style={[styles.actionBtn, styles.lockedBtn]}>
          <Text style={styles.lockedText}>🔒 Complete previous subtopics first.</Text>
        </View>
      )}

      {status === 'current' && (
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, styles.secondaryBtn, pressed && styles.pressed]}
            onPress={() => onStartLesson?.(subtopic.id)}
          >
            <Text style={styles.secondaryText}>▶ Start Lesson</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, styles.primaryBtn, { backgroundColor: topicAccent }, pressed && styles.pressed]}
            onPress={() => onComplete(subtopic.id)}
          >
            <Text style={styles.primaryText}>Complete Subtopic ✓</Text>
          </Pressable>
        </View>
      )}

      {status === 'completed' && (
        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.completedBtn, pressed && styles.pressed]}
          onPress={() => onStartLesson?.(subtopic.id)}
        >
          <Text style={styles.completedText}>✓ Completed — Review Lesson</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
  grabZone: { alignItems: 'center', paddingVertical: 8 },
  grabBar: { width: 44, height: 5, borderRadius: 3, backgroundColor: '#D8DCE0' },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F3F5',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  closeX: { fontSize: 13, fontWeight: '800', color: '#8A9096' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 2 },
  numberBadge: {
    width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  numberText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  counter: { flex: 1, color: '#9AA0A6', fontSize: 13, fontWeight: '600' },
  statusChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginRight: 30 },
  statusText: { fontSize: 12, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '800', color: '#2A2E33', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 },
  location: { fontSize: 14, color: '#6B7177' },
  districtChip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, borderWidth: 1 },
  districtText: { fontSize: 11.5, fontWeight: '800' },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  primaryBtn: {
    flex: 1.4, shadowColor: '#FF8A3D', shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  primaryText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  secondaryBtn: { flex: 1, backgroundColor: '#FFF1E2', borderWidth: 1.5, borderColor: '#FFD3A8' },
  secondaryText: { color: '#E07B1E', fontWeight: '700', fontSize: 14 },
  completedBtn: { backgroundColor: '#E6F6EE', borderWidth: 1.5, borderColor: '#A6E0C2' },
  completedText: { color: '#2E9E63', fontWeight: '700', fontSize: 15 },
  lockedBtn: { backgroundColor: '#F2F3F5' },
  lockedText: { color: '#9AA0A6', fontWeight: '600', fontSize: 14 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});

export default LessonBottomCard;
