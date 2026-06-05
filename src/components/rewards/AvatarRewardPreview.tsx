/**
 * AvatarRewardPreview — a compact avatar strip (NOT a big empty card).
 * Shows the current avatar (persona or custom caricature), a "Looking great! ✨"
 * line, quick stats (level / equipped / coins) and an Edit Avatar button.
 */
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AvatarSelection } from '../../storage/avatarStorage';
import { EquipKey } from '../../data/rewards';
import { OutfitOverride } from '../../data/avatarOutfits';
import UserAvatar from '../avatar/UserAvatar';

const PRIMARY = '#FF7A00';

interface Props {
  selection: AvatarSelection;
  equippedKeys: EquipKey[];
  outfit?: OutfitOverride;
  customUri: string | null;
  level: number;
  equippedCount: number;
  coins: number;
  /** Avatar evolution status (e.g. "Beginner"). */
  statusTitle?: string;
  statusEmoji?: string;
  onEditAvatar: () => void;
}

export default function AvatarRewardPreview({
  selection, equippedKeys, outfit, customUri, level, equippedCount, coins, statusTitle, statusEmoji, onEditAvatar,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.avatarStage}>
        {customUri ? (
          <Image source={{ uri: customUri }} style={styles.avatarImage} resizeMode="cover" />
        ) : (
          <View style={styles.avatarInner}>
            <UserAvatar
              userType={selection.userType}
              gender={selection.gender}
              age={selection.age}
              size={96}
              equipped={equippedKeys}
              outfit={outfit}
              shadow={false}
            />
          </View>
        )}
      </View>

      <View style={styles.right}>
        {!!statusTitle && (
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{statusEmoji} Level {level} · {statusTitle}</Text>
          </View>
        )}
        <Text style={styles.greeting}>Looking great! ✨</Text>
        <View style={styles.statsRow}>
          <Stat n={level} label="Level" />
          <Stat n={equippedCount} label="Claimed" />
          <Stat n={coins} label="Coins" />
        </View>
        <Pressable onPress={onEditAvatar} style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.85 }]}>
          <Text style={styles.editText}>✏️  Edit Avatar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statNum}>{n}</Text>
      <Text style={styles.statLbl}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EEF0F2',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  avatarStage: {
    width: 78, height: 78, borderRadius: 39, backgroundColor: '#FFF6EC',
    alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden',
    borderWidth: 1.5, borderColor: '#FFE6CF', marginRight: 14,
  },
  avatarInner: { position: 'absolute', top: 8, alignItems: 'center' },
  avatarImage: { width: 78, height: 78 },
  right: { flex: 1 },
  statusPill: {
    alignSelf: 'flex-start', backgroundColor: '#FFF6E0', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3,
    borderWidth: 1, borderColor: '#F4C84F', marginBottom: 5,
  },
  statusText: { fontSize: 11, fontWeight: '900', color: '#B8860B' },
  greeting: { fontSize: 15, fontWeight: '900', color: '#21242B' },
  statsRow: { flexDirection: 'row', marginTop: 8, marginBottom: 4 },
  stat: { marginRight: 18 },
  statNum: { fontSize: 16, fontWeight: '900', color: PRIMARY },
  statLbl: { fontSize: 10.5, fontWeight: '700', color: '#9AA0A6' },
  editBtn: {
    marginTop: 8, alignSelf: 'flex-start', backgroundColor: '#21242B',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8,
  },
  editText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12.5 },
});
