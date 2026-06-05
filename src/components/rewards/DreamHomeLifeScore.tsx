/**
 * DreamHomeLifeScore — a small premium badge showing the home's "Life Score"
 * (how alive/complete the Dream Home is) + the items-unlocked count.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  score: number;
  unlocked: number;
  total: number;
}

export default function DreamHomeLifeScore({ score, unlocked, total }: Props) {
  return (
    <View style={styles.badge}>
      <Text style={styles.label}>🏡 Life Score</Text>
      <Text style={styles.score}>{score}%</Text>
      <Text style={styles.sub}>{unlocked}/{total} items</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'rgba(255,122,0,0.95)', borderRadius: 13, paddingHorizontal: 12, paddingVertical: 7,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  label: { color: 'rgba(255,255,255,0.92)', fontWeight: '800', fontSize: 9.5, letterSpacing: 0.2 },
  score: { color: '#FFFFFF', fontWeight: '900', fontSize: 16, marginTop: 0 },
  sub: { color: 'rgba(255,255,255,0.85)', fontWeight: '700', fontSize: 9.5 },
});
