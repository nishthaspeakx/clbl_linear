/**
 * LocationPinLabel — the "📍 Location name" row used inside a level label.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LocationPinLabel({ location, color, compact }: { location: string; color: string; compact?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.pin, compact && { fontSize: 9 }]}>📍</Text>
      <Text style={[styles.loc, { color }, compact && { fontSize: 10 }]} numberOfLines={1}>{location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  pin: { fontSize: 10, marginRight: 3 },
  loc: { fontSize: 11, fontWeight: '700', flexShrink: 1 },
});
