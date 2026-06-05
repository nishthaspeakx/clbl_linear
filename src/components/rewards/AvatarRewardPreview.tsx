/**
 * AvatarRewardPreview — the personal identity section at the top of My World.
 * Compact & premium: a full-body avatar (not a cropped face) on a soft stage
 * with a pencil overlay to edit, a golden status badge, a greeting and quick
 * stats. No big "Edit Avatar" button — editing lives on the pencil icon.
 */
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AvatarSelection } from '../../storage/avatarStorage';
import { EquipKey } from '../../data/rewards';
import { OutfitOverride } from '../../data/avatarOutfits';
import { playSound } from '../../services/soundService';
import { triggerHaptic } from '../../services/hapticService';
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
  /** Avatar evolution status (e.g. "Confident Speaker"). */
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
              size={118}
              equipped={equippedKeys}
              outfit={outfit}
              shadow={false}
            />
          </View>
        )}
        <EditPencil onPress={onEditAvatar} />
      </View>

      <View style={styles.right}>
        {!!statusTitle && (
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{statusEmoji || '🗣️'} Level {level} · {statusTitle}</Text>
          </View>
        )}
        <Text style={styles.greeting}>Looking great! ✨</Text>
        <View style={styles.statsRow}>
          <Stat n={level} label="Level" />
          <Stat n={equippedCount} label="Claimed" />
          <Stat n={coins} label="Coins" />
        </View>
      </View>
    </View>
  );
}

/** Small pencil button on the avatar image; tooltip on hover / long-press. */
function EditPencil({ onPress }: { onPress: () => void }) {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.pencilWrap}>
      {show && (
        <View style={styles.tooltip} pointerEvents="none">
          <Text style={styles.tooltipText}>Edit Avatar</Text>
        </View>
      )}
      <Pressable
        onPress={() => { playSound('button_tap'); triggerHaptic('light'); onPress(); }}
        onHoverIn={() => setShow(true)}
        onHoverOut={() => setShow(false)}
        onLongPress={() => setShow(true)}
        onPressOut={() => setShow(false)}
        delayLongPress={180}
        hitSlop={8}
        accessibilityLabel="Edit Avatar"
        style={({ pressed }) => [styles.pencil, pressed && { opacity: 0.85 }]}
      >
        <Text style={styles.pencilIcon}>✏️</Text>
      </Pressable>
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

const STAGE_W = 104;
const STAGE_H = 124;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
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
    width: STAGE_W, height: STAGE_H, borderRadius: 18, backgroundColor: '#FFF6EC',
    alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden',
    borderWidth: 1.5, borderColor: '#FFE6CF', marginRight: 14,
  },
  avatarInner: { position: 'absolute', bottom: 2, alignItems: 'center' },
  avatarImage: { width: STAGE_W, height: STAGE_H },
  pencilWrap: { position: 'absolute', right: 5, bottom: 5, alignItems: 'flex-end' },
  pencil: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#FFE0C2',
    shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  pencilIcon: { fontSize: 13 },
  tooltip: {
    position: 'absolute', bottom: 32, right: 0, backgroundColor: '#21242B',
    borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4, minWidth: 78, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 6,
  },
  tooltipText: { color: '#FFFFFF', fontWeight: '800', fontSize: 11 },
  right: { flex: 1 },
  statusPill: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF8E5', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: '#E9C766', marginBottom: 7,
    shadowColor: '#E9C766', shadowOpacity: 0.35, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  statusText: { fontSize: 11.5, fontWeight: '900', color: '#B8860B' },
  greeting: { fontSize: 16, fontWeight: '900', color: '#21242B' },
  statsRow: { flexDirection: 'row', marginTop: 10 },
  stat: { marginRight: 18 },
  statNum: { fontSize: 17, fontWeight: '900', color: PRIMARY },
  statLbl: { fontSize: 10.5, fontWeight: '700', color: '#9AA0A6' },
});
