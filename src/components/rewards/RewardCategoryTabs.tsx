/**
 * RewardCategoryTabs — the five category cards (Wardrobe / Home / Vehicles /
 * Lifestyle / Garden), horizontally scrollable. Each shows the icon, name,
 * claimed/total collection progress and a small progress bar. The selected card
 * gets an orange border + light-orange background.
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { REWARD_CATEGORIES, RewardCategoryKey } from '../../data/rewardCategories';

const PRIMARY = '#FF7A00';

export interface CategoryProgress {
  claimed: number;
  total: number;
}

interface Props {
  selected: RewardCategoryKey;
  counts: Record<RewardCategoryKey, CategoryProgress>;
  onSelect: (key: RewardCategoryKey) => void;
}

export default function RewardCategoryTabs({ selected, counts, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {REWARD_CATEGORIES.map((c) => {
        const on = selected === c.key;
        const cc = counts[c.key];
        const pct = cc.total > 0 ? (cc.claimed / cc.total) * 100 : 0;
        return (
          <Pressable key={c.key} onPress={() => onSelect(c.key)} style={[styles.card, on && styles.cardOn]}>
            <Text style={styles.icon}>{c.icon}</Text>
            <Text style={[styles.name, on && styles.nameOn]} numberOfLines={1}>{c.name}</Text>
            <Text style={[styles.count, on && styles.countOn]}>{cc.claimed}/{cc.total}</Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${pct}%` }]} />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: 2, paddingVertical: 2 },
  card: {
    width: 88,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EEF0F2',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardOn: { borderColor: PRIMARY, backgroundColor: '#FFF1E2' },
  icon: { fontSize: 22 },
  name: { fontSize: 11.5, fontWeight: '800', color: '#6B7177', marginTop: 5 },
  nameOn: { color: PRIMARY },
  count: { fontSize: 11, fontWeight: '800', color: '#A4AAB0', marginTop: 3 },
  countOn: { color: PRIMARY },
  track: { width: '100%', height: 5, borderRadius: 3, backgroundColor: '#EEF0F2', marginTop: 6, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3, backgroundColor: PRIMARY },
});
