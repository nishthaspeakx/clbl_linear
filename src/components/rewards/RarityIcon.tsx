/**
 * RarityIcon — shows ONLY the rarity icon (⚪ 🔷 🌟 👑). The rarity name is never
 * shown permanently; it appears in a small tooltip on hover (web) or long-press
 * (mobile). Locked rewards pass `muted` to grey the icon down.
 */
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RewardRarity } from '../../data/rewardRarity';
import { getRarityStyle } from '../../utils/rarityStyles';
import RarityTooltip from './RarityTooltip';

interface Props {
  rarity?: RewardRarity;
  size?: number;
  muted?: boolean;
}

export default function RarityIcon({ rarity, size = 14, muted }: Props) {
  const r = getRarityStyle(rarity ?? 'common');
  const [show, setShow] = useState(false);

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityLabel={`${r.name} rarity`}
        onHoverIn={() => setShow(true)}
        onHoverOut={() => setShow(false)}
        onLongPress={() => setShow(true)}
        onPressOut={() => setShow(false)}
        delayLongPress={180}
        hitSlop={6}
      >
        <Text style={[{ fontSize: size }, muted && styles.muted]}>{r.icon}</Text>
      </Pressable>

      {show && <RarityTooltip rarity={rarity ?? 'common'} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  muted: { opacity: 0.4 },
});
