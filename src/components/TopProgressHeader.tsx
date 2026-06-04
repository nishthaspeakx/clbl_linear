/**
 * TopProgressHeader — compact floating header.
 *
 * Shows ONLY: topic icon, current topic name, topic progress (e.g. "1/7 levels
 * completed") + a thin topic progress bar, the star count, and the day/night
 * toggle. Kept small and light so it doesn't cover the map.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TopicZone } from '../data/topicZones';

interface Props {
  zone: TopicZone;
  completed: number;
  total: number;
  stars: number;
  night: boolean;
  onToggleNight: () => void;
}

function TopProgressHeader({ zone, completed, total, stars, night, onToggleNight }: Props) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  return (
    <View style={styles.header}>
      <View style={[styles.badge, { backgroundColor: zone.accent + '22' }]}>
        <Text style={styles.badgeText}>{zone.emoji}</Text>
      </View>
      <View style={styles.center}>
        <Text style={styles.topic} numberOfLines={1}>{zone.name}</Text>
        <Text style={styles.progress}>{completed}/{total} levels completed</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%`, backgroundColor: zone.accent }]} />
        </View>
      </View>
      <Pressable onPress={onToggleNight} style={[styles.dayNight, night && styles.dayNightOn]} hitSlop={8}>
        <Text style={styles.dayNightText}>{night ? '🌙' : '☀️'}</Text>
      </Pressable>
      <View style={styles.coinPill}>
        <Text style={styles.coinText}>⭐ {stars}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 50,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  badgeText: { fontSize: 16 },
  center: { flex: 1 },
  topic: { fontSize: 14, fontWeight: '800', color: '#2A2E33' },
  progress: { fontSize: 10.5, color: '#9AA0A6', fontWeight: '600', marginTop: 0 },
  track: { height: 4, borderRadius: 3, backgroundColor: '#EEF0F2', marginTop: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  dayNight: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#FFF6E0',
    borderWidth: 1,
    borderColor: '#FFE0BC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  dayNightOn: { backgroundColor: '#2A3360', borderColor: '#3E4A78' },
  dayNightText: { fontSize: 15 },
  coinPill: {
    backgroundColor: '#FFF1E2',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#FFE0BC',
    marginLeft: 8,
  },
  coinText: { color: '#E07B1E', fontWeight: '800', fontSize: 13 },
});

export default TopProgressHeader;
