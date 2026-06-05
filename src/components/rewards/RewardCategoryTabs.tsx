/**
 * RewardCategoryTabs — the four category cards (Wardrobe / Home / Vehicles /
 * Lifestyle). Each shows the icon, name and unlocked/total count. The selected
 * card gets an orange border + light-orange background.
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  REWARD_CATEGORIES,
  RewardCategoryKey,
  CategoryCount,
} from '../../data/rewardCategories';

const PRIMARY = '#FF7A00';

interface Props {
  selected: RewardCategoryKey;
  counts: Record<RewardCategoryKey, CategoryCount>;
  onSelect: (key: RewardCategoryKey) => void;
}

export default function RewardCategoryTabs({ selected, counts, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {REWARD_CATEGORIES.map((c) => {
        const on = selected === c.key;
        const cc = counts[c.key];
        return (
          <Pressable key={c.key} onPress={() => onSelect(c.key)} style={[styles.card, on && styles.cardOn]}>
            <Text style={styles.icon}>{c.icon}</Text>
            <Text style={[styles.name, on && styles.nameOn]} numberOfLines={1}>{c.name}</Text>
            <Text style={[styles.count, on && styles.countOn]}>{cc.unlocked}/{cc.total}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: 2, paddingVertical: 2 },
  card: {
    width: 84,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
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
});
