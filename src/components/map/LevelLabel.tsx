/**
 * LevelLabel — a compact card near a pin showing the level number, the subtopic
 * name and a map-pin location row. Styled by status:
 *   current   → white, opacity 1, bold, orange border + glow
 *   completed → green ✓, collapsed (compact: number + title only)
 *   locked    → smaller, lighter, grey
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LocationPinLabel from './LocationPinLabel';
import { LabelStatus } from '../../utils/labelPlacement';

interface Props {
  id: number;
  title: string;
  location: string;
  status: LabelStatus;
  compact?: boolean;
  onPress: () => void;
}

const C: Record<LabelStatus, {
  bar: string; border: string; bg: string; num: string; title: string; pin: string; locText: string; locBg: string; icon: string;
}> = {
  current: { bar: '#FF7A00', border: '#FF7A00', bg: '#FFFFFF', num: '#E0741B', title: '#21242B', pin: '#FF7A00', locText: '#B06A22', locBg: '#FFF3E6', icon: '' },
  completed: { bar: '#33A867', border: '#CFEBDB', bg: '#FFFFFF', num: '#2E9E63', title: '#46504A', pin: '#33A867', locText: '#2E9E63', locBg: '#EAF7EE', icon: '✓' },
  locked: { bar: '#C7CDD3', border: '#E7E8EB', bg: '#F8F9FB', num: '#9AA0A6', title: '#A2A8AE', pin: '#AEB4BA', locText: '#A9AFB5', locBg: '#EEF0F2', icon: '🔒' },
};

export default function LevelLabel({ id, title, location, status, compact, onPress }: Props) {
  const c = C[status];
  const small = compact || status === 'locked';
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { borderColor: c.border, backgroundColor: c.bg, maxWidth: small ? 150 : 176 },
        status === 'current' && styles.cardCurrent,
        status === 'locked' && { opacity: 0.96 },
      ]}
    >
      <View style={[styles.bar, { backgroundColor: c.bar }]} />
      <View style={styles.body}>
        <View style={styles.head}>
          {c.icon ? <Text style={[styles.icon, { color: c.num }]}>{c.icon}</Text> : null}
          <Text style={[styles.level, { color: c.num }, small && { fontSize: 10.5 }]}>Level {id}</Text>
        </View>
        <Text style={[styles.title, { color: c.title }, small && { fontSize: 11.5 }]} numberOfLines={compact ? 1 : 2}>
          {title}
        </Text>
        {!compact && <LocationPinLabel location={location} pin={c.pin} text={c.locText} bg={c.locBg} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 13,
    borderWidth: 1.5,
    paddingRight: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  cardCurrent: {
    borderWidth: 2,
    shadowColor: '#FF7A00',
    shadowOpacity: 0.38,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  bar: { width: 4 },
  body: { paddingVertical: 7, paddingLeft: 9, flexShrink: 1 },
  head: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 11, fontWeight: '900', marginRight: 4 },
  level: { fontSize: 12, fontWeight: '900', letterSpacing: 0.2 },
  title: { fontSize: 13.5, fontWeight: '800', marginTop: 1 },
});
