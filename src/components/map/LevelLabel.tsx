/**
 * LevelLabel — a compact card near a pin showing the subtopic name and a
 * map-pin location chip. Styled by status: orange (current), green (completed),
 * grey (locked). No level number — just what the learner will do + where.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LocationPinLabel from './LocationPinLabel';
import { LabelStatus } from '../../utils/labelPlacement';

interface Props {
  title: string;
  location: string;
  status: LabelStatus;
  onPress: () => void;
}

const C: Record<LabelStatus, {
  bar: string; border: string; bg: string; title: string; pin: string; locText: string; locBg: string;
}> = {
  current: { bar: '#FF7A00', border: '#FF7A00', bg: '#FFFFFF', title: '#2A2E33', pin: '#FF7A00', locText: '#B06A22', locBg: '#FFF3E6' },
  completed: { bar: '#33A867', border: '#CFEBDB', bg: '#FFFFFF', title: '#2A3430', pin: '#33A867', locText: '#2E9E63', locBg: '#EAF7EE' },
  locked: { bar: '#C7CDD3', border: '#E7E8EB', bg: '#F8F9FB', title: '#9AA0A6', pin: '#AEB4BA', locText: '#A9AFB5', locBg: '#EEF0F2' },
};

export default function LevelLabel({ title, location, status, onPress }: Props) {
  const c = C[status];
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { borderColor: c.border, backgroundColor: c.bg },
        status === 'current' && styles.cardCurrent,
        status === 'locked' && { opacity: 0.94 },
      ]}
    >
      <View style={[styles.bar, { backgroundColor: c.bar }]} />
      <View style={styles.body}>
        <Text style={[styles.title, { color: c.title }]} numberOfLines={2}>{title}</Text>
        <LocationPinLabel location={location} pin={c.pin} text={c.locText} bg={c.locBg} />
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
    maxWidth: 172,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  cardCurrent: { shadowColor: '#FF7A00', shadowOpacity: 0.32, shadowRadius: 11 },
  bar: { width: 4 },
  body: { paddingVertical: 8, paddingLeft: 10, flexShrink: 1 },
  title: { fontSize: 13.5, fontWeight: '800' },
});
