/**
 * LevelLabel — a compact card near a pin telling the learner the level number,
 * the subtopic, and the location. Styled by status: orange (current),
 * green/✓ (completed), grey/🔒 (locked). `compact` shrinks completed history.
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

const C: Record<LabelStatus, { bar: string; num: string; title: string; loc: string; border: string; bg: string; icon: string }> = {
  current: { bar: '#FF7A00', num: '#E0741B', title: '#2A2E33', loc: '#8A6A48', border: '#FF7A00', bg: '#FFFFFF', icon: '' },
  completed: { bar: '#33A867', num: '#2E9E63', title: '#5A6066', loc: '#9AA0A6', border: '#CFEBDB', bg: '#FFFFFF', icon: '✓' },
  locked: { bar: '#C7CDD3', num: '#9AA0A6', title: '#A9AFB5', loc: '#BcC2C8', border: '#E7E8EB', bg: '#F7F8FA', icon: '🔒' },
};

export default function LevelLabel({ id, title, location, status, compact, onPress }: Props) {
  const c = C[status];
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { borderColor: c.border, backgroundColor: c.bg, maxWidth: compact ? 150 : 168 },
        status === 'current' && styles.cardCurrent,
      ]}
    >
      <View style={[styles.bar, { backgroundColor: c.bar }]} />
      <View style={styles.body}>
        <View style={styles.head}>
          {c.icon ? <Text style={[styles.icon, { color: c.num }]}>{c.icon}</Text> : null}
          <Text style={[styles.level, { color: c.num }, compact && { fontSize: 11 }]}>Level {id}</Text>
        </View>
        <Text style={[styles.title, { color: c.title }, compact && { fontSize: 11.5 }]} numberOfLines={compact ? 1 : 2}>
          {title}
        </Text>
        {!compact && <LocationPinLabel location={location} color={c.loc} />}
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
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  cardCurrent: {
    shadowColor: '#FF7A00',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  bar: { width: 4 },
  body: { paddingVertical: 7, paddingLeft: 9, flexShrink: 1 },
  head: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 11, fontWeight: '900', marginRight: 4 },
  level: { fontSize: 12, fontWeight: '900', letterSpacing: 0.2 },
  title: { fontSize: 13, fontWeight: '800', marginTop: 1 },
});
