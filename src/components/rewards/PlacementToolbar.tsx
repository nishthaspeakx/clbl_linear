/**
 * PlacementToolbar — actions for the currently-selected Dream Home item:
 * Smaller · Bigger · Rotate · Reset · Save. Appears as a floating bottom bar
 * while an item is selected.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  onSmaller: () => void;
  onBigger: () => void;
  onRotate: () => void;
  onReset: () => void;
  onSave: () => void;
}

const ACTIONS = (p: Props): { key: string; icon: string; label: string; press: () => void; primary?: boolean }[] => [
  { key: 'smaller', icon: '➖', label: 'Smaller', press: p.onSmaller },
  { key: 'bigger', icon: '➕', label: 'Bigger', press: p.onBigger },
  { key: 'rotate', icon: '🔄', label: 'Rotate', press: p.onRotate },
  { key: 'reset', icon: '↺', label: 'Reset', press: p.onReset },
  { key: 'save', icon: '✓', label: 'Save', press: p.onSave, primary: true },
];

export default function PlacementToolbar(props: Props) {
  return (
    <View style={styles.bar}>
      {ACTIONS(props).map((a) => (
        <Pressable key={a.key} onPress={a.press} style={({ pressed }) => [styles.btn, a.primary && styles.btnPrimary, pressed && { opacity: 0.8 }]}>
          <Text style={[styles.icon, a.primary && styles.iconPrimary]}>{a.icon}</Text>
          <Text style={[styles.label, a.primary && styles.labelPrimary]}>{a.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1E2026', borderRadius: 18, paddingHorizontal: 8, paddingVertical: 8,
    shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  btn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6, borderRadius: 12, marginHorizontal: 2 },
  btnPrimary: { backgroundColor: '#FF7A00' },
  icon: { fontSize: 17, marginBottom: 2 },
  iconPrimary: { color: '#FFFFFF' },
  label: { fontSize: 10.5, fontWeight: '800', color: '#C7CDD3' },
  labelPrimary: { color: '#FFFFFF' },
});
