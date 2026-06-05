/**
 * NextRewardCard — a motivating "what's next" card on the Rewards screen.
 *
 * Always shows the NEXT locked headline reward based on the learner's current
 * level (the Lifestyle accessory unlocking at completedCount + 1). As levels are
 * completed the card advances automatically (Sunglasses → Backpack → Watch …).
 *
 *   🎁 Next Reward
 *   😎 Sunglasses
 *   Unlock in 1 more level
 *   [▓▓▓░░░░░] 0/1 completed
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RewardItem } from '../../data/rewardCategories';
import { getRarityStyle } from '../../utils/rarityStyles';
import RarityIcon from './RarityIcon';

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
          <Text style={styles.kicker}>🎁  NEXT REWARD</Text>
          <Text style={styles.name}>All rewards unlocked!</Text>
          <Text style={styles.sub}>You've collected every reward — amazing work.</Text>
        </View>
      </View>
    );
  }

  const total = reward.unlockLevel;
  const remaining = Math.max(0, total - completedCount);
  const pct = Math.max(0, Math.min(1, completedCount / total)) * 100;

  const rstyle = getRarityStyle(reward.rarity);

  return (
    <View style={styles.card}>
      <View style={styles.iconTileWrap}>
        <View style={styles.iconTile}><Text style={styles.icon}>{reward.icon}</Text></View>
        <View style={[styles.rarityCorner, { borderColor: rstyle.borderColor }]}>
          <RarityIcon rarity={reward.rarity} size={12} />
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.kicker}>🎁  NEXT REWARD</Text>
        <Text style={styles.name}>{reward.name}</Text>
        {!!reward.topic && <Text style={styles.topic}>🗺️ from {reward.topic}</Text>}
        <Text style={styles.sub}>Unlock in {remaining} more level{remaining === 1 ? '' : 's'}</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.progress}>{completedCount}/{total} completed</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: '#FFE0C2',
    shadowColor: '#FF7A00',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  cardDone: { borderColor: '#BFE6CC' },
  iconTile: {
    width: 64, height: 64, borderRadius: 16, backgroundColor: '#FFF1DE',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#FFD8B0',
  },
  icon: { fontSize: 36 },
  right: { flex: 1 },
  kicker: { fontSize: 10.5, fontWeight: '900', color: PRIMARY, letterSpacing: 0.5 },
  iconTileWrap: { position: 'relative', marginRight: 14 },
  rarityCorner: {
    position: 'absolute', top: -5, left: -5, borderRadius: 9, borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.96)', paddingHorizontal: 3, paddingVertical: 1,
  },
  name: { fontSize: 17, fontWeight: '900', color: '#21242B', marginTop: 2 },
  topic: { fontSize: 11, fontWeight: '800', color: '#2E9E63', marginTop: 1 },
  sub: { fontSize: 12.5, color: '#9AA0A6', fontWeight: '700', marginTop: 2 },
  track: { height: 7, borderRadius: 4, backgroundColor: '#F0E2D4', marginTop: 9, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: PRIMARY },
  progress: { fontSize: 11, color: '#9AA0A6', fontWeight: '700', marginTop: 5 },
});
