/**
 * DreamHomePreview — the Dream Home showcase on the Rewards page.
 *
 * Shows the FULL house image (full aspect ratio, not cropped/zoomed) in a
 * rounded card, with the learner's placed rewards laid on top as natural
 * isometric objects (read-only here). Tapping the card opens the full-screen
 * editor where items can be dragged and arranged.
 *
 * The placed items + their positions are supplied by the parent (the effective
 * Dream Home layout = defaults + the user's saved overrides).
 */
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AvatarSelection } from '../../storage/avatarStorage';
import { EquipKey } from '../../data/rewards';
import { OutfitOverride } from '../../data/avatarOutfits';
import { RewardItem } from '../../data/rewardCategories';
import { VIEWPORT_W } from '../../utils/viewport';
import UserAvatar from '../avatar/UserAvatar';
import PlacedRewardObject from './PlacedRewardObject';

const DREAM_HOME = require('../../assets/dream-home/dream_home_base.jpeg');
const IMG_ASPECT = 2816 / 1536;
const CARD_W = VIEWPORT_W - 28;
const IMG_H = Math.round(CARD_W / IMG_ASPECT);   // full house, full aspect (no crop)
const OBJ_BASE = 42;

export interface PreviewEntry {
  item: RewardItem;
  xPercent: number;
  yPercent: number;
  scale: number;
  isNew?: boolean;
}

interface Props {
  placed: PreviewEntry[];
  selection: AvatarSelection;
  equippedKeys: EquipKey[];
  outfit?: OutfitOverride;
  customUri: string | null;
  onOpenEditor: () => void;
}

export default function DreamHomePreview({ placed, selection, equippedKeys, outfit, customUri, onOpenEditor }: Props) {
  return (
    <View>
      <Text style={styles.title}>🏡  My Dream Home</Text>
      <Text style={styles.subtitle}>Unlock rewards and watch your world grow</Text>

      <Pressable style={styles.card} onPress={onOpenEditor}>
        <Image source={DREAM_HOME} style={{ width: CARD_W, height: IMG_H }} resizeMode="cover" />

        {/* placed objects (read-only; taps fall through to open the editor) */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {placed.map((e) => {
            const x = (e.xPercent / 100) * CARD_W;
            const y = (e.yPercent / 100) * IMG_H;
            const size = Math.round(OBJ_BASE * e.scale);
            return (
              <PlacedRewardObject
                key={e.item.id}
                item={e.item}
                left={x - size / 2}
                top={y - size}
                size={size}
                zIndex={Math.round(e.yPercent)}
                isNew={e.isNew}
                onPress={() => {}}
              />
            );
          })}

          {/* avatar near the porch */}
          <View style={[styles.avatarWrap, { left: (44 / 100) * CARD_W - 18, top: (78 / 100) * IMG_H - 44 }]}>
            {customUri ? (
              <Image source={{ uri: customUri }} style={styles.avatarImg} resizeMode="cover" />
            ) : (
              <UserAvatar userType={selection.userType} gender={selection.gender} age={selection.age} size={44} equipped={equippedKeys} outfit={outfit} shadow />
            )}
          </View>
        </View>

        <View style={styles.countChip}>
          <Text style={styles.countChipText}>✨ {placed.length} in your world</Text>
        </View>
        <View style={styles.editHint} pointerEvents="none">
          <Text style={styles.editHintText}>✏️ tap to edit</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '900', color: '#21242B', marginTop: 4 },
  subtitle: { fontSize: 12.5, color: '#9AA0A6', fontWeight: '600', marginTop: 2, marginBottom: 10 },
  card: {
    width: CARD_W,
    height: IMG_H,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#DCE8D8',
    borderWidth: 1.5,
    borderColor: '#E4E7EA',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  avatarWrap: { position: 'absolute', alignItems: 'center', width: 36 },
  avatarImg: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#FFFFFF' },
  countChip: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: 'rgba(255,122,0,0.92)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5,
  },
  countChipText: { color: '#FFFFFF', fontWeight: '800', fontSize: 11.5 },
  editHint: {
    position: 'absolute', bottom: 10, right: 10,
    backgroundColor: 'rgba(30,32,38,0.6)', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 4,
  },
  editHintText: { color: '#FFFFFF', fontWeight: '700', fontSize: 10 },
});
