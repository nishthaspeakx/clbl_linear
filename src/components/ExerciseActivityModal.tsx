/**
 * ExerciseActivityModal — placeholder screen for a single exercise.
 *
 * ── FUTURE: replace the placeholder body with the real exercise UI
 *    (vocab cards, audio reader, grammar quiz, roleplay, etc.). Keep the
 *    onMarkComplete contract so the journey keeps working. ──
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ExerciseType } from '../data/exercises';

interface Props {
  exercise: ExerciseType;
  accent: string;
  onMarkComplete: () => void;
  onClose: () => void;
}

function ExerciseActivityModal({ exercise, accent, onMarkComplete, onClose }: Props) {
  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={10}>
          <Text style={styles.closeX}>✕</Text>
        </Pressable>

        <View style={[styles.iconCircle, { backgroundColor: accent + '22' }]}>
          <Text style={styles.icon}>{exercise.icon}</Text>
        </View>
        <Text style={styles.title}>{exercise.title} Exercise</Text>
        <Text style={styles.body}>
          This is a placeholder for the <Text style={{ fontWeight: '800' }}>{exercise.title}</Text> activity.
          The real exercise screen will go here.
        </Text>

        <Pressable
          style={({ pressed }) => [styles.cta, { backgroundColor: accent }, pressed && { opacity: 0.85 }]}
          onPress={onMarkComplete}
        >
          <Text style={styles.ctaText}>Mark Exercise Complete ✓</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,24,40,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
  },
  card: {
    width: '84%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 26,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: { fontSize: 13, fontWeight: '800', color: '#8A9096' },
  iconCircle: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  icon: { fontSize: 32 },
  title: { fontSize: 20, fontWeight: '800', color: '#2A2E33', marginBottom: 8 },
  body: { fontSize: 14, color: '#6B7177', textAlign: 'center', lineHeight: 21, marginBottom: 22 },
  cta: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24, alignSelf: 'stretch', alignItems: 'center' },
  ctaText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});

export default ExerciseActivityModal;
