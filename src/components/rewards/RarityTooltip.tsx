/**
 * RarityTooltip — the small floating bubble shown when a RarityIcon is hovered
 * (desktop) or long-pressed (mobile). Stacks the icon over its name, e.g.
 *
 *     👑
 *   Legendary
 *
 * Positioned absolutely above its anchor; render it inside a relatively-
 * positioned wrapper (RarityIcon does this).
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RewardRarity } from '../../data/rewardRarity';
import { getRarityStyle } from '../../utils/rarityStyles';

export default function RarityTooltip({ rarity }: { rarity?: RewardRarity }) {
  const r = getRarityStyle(rarity ?? 'common');
  return (
    <View style={[styles.tooltip, { borderColor: r.color }]} pointerEvents="none">
      <Text style={styles.icon}>{r.icon}</Text>
      <Text style={[styles.name, { color: r.color }]}>{r.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute', bottom: '100%', marginBottom: 5,
    backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1.5,
    paddingHorizontal: 9, paddingVertical: 5, minWidth: 62, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 7, shadowOffset: { width: 0, height: 2 }, elevation: 6,
    zIndex: 999,
  },
  icon: { fontSize: 15, marginBottom: 1 },
  name: { fontWeight: '900', fontSize: 11 },
});
