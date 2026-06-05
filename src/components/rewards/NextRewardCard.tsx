/**
 * NextRewardCard — a motivating "what's next" card on the Rewards screen.
 *
 * Always shows the NEXT locked headline reward based on the learner's current
 * level (the Lifestyle accessory unlocking at completedCount + 1). As levels are
 * completed the card advances automatically (Sunglasses → Backpack → Watch …).
 *
 *   [🎁]  🎁 Next: Sunglasses
 *         Unlock in 1 level
 *         [▓▓▓░░░░░]
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RewardItem } from '../../data/rewardCategories';

const PRIMARY = '#FF7A00';

interface Props {
  /** The next locked reward, or null if everything is unlocked. */
  reward: RewardItem | null;
  completedCount: number;
}

export default function NextRewardCard({ reward, completedCount }: Props) {
  if (!reward) {
    return (
      <View style={[styles.card, styles.cardDone]}>
        <View style={styles.iconTile}><Text style={styles.icon}>🏆</Text></View>
        <View style={styles.right}>
          <Text style={styles.name} numberOfLines={1}>All rewards unlocked!</Text>
          <Text style={styles.sub} numberOfLines={1}>You've collected every reward — amazing work.</Text>
        </View>
      </View>
    );
  }

  const total = reward.unlockLevel;
  const remaining = Math.max(0, total - completedCount);
  const pct = Math.max(0, Math.min(1, completedCount / total)) * 100;

  return (
    <View style={styles.card}>
      <View style={styles.iconTile}><Text style={styles.icon}>{reward.icon}</Text></View>
      <View style={styles.right}>
        <Text style={styles.name} numberOfLines={1}>🎁  Next: {reward.name}</Text>
        <Text style={styles.sub} numberOfLines={1}>Unlock in {remaining} level{remaining === 1 ? '' : 's'}</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: '#FFE0C2',
    shadowColor: '#FF7A00',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardDone: { borderColor: '#BFE6CC' },
  iconTile: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF1DE',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
    borderWidth: 1.5, borderColor: '#FFD8B0',
  },
  icon: { fontSize: 24 },
  right: { flex: 1 },
  name: { fontSize: 14.5, fontWeight: '900', color: '#21242B' },
  sub: { fontSize: 11.5, color: '#9AA0A6', fontWeight: '700', marginTop: 1 },
  track: { height: 6, borderRadius: 3, backgroundColor: '#F0E2D4', marginTop: 7, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3, backgroundColor: PRIMARY },
});
