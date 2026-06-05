/**
 * DreamHomeCanvas — the shared "living" Dream Home renderer: the house image +
 * day/night lighting overlay + level-gated life effects + animated placed
 * rewards + the avatar near the porch. Used by the preview card (read-only) and
 * can power a fullscreen view (interactive = tap-to-inspect).
 *
 * Owns the image asset + aspect ratio so every Dream Home view stays in sync.
 */
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { AvatarSelection } from '../../storage/avatarStorage';
import { EquipKey } from '../../data/rewards';
import { OutfitOverride } from '../../data/avatarOutfits';
import { RewardItem } from '../../data/rewardCategories';
import { activeEffects } from '../../utils/dreamHomeLifeScore';
import UserAvatar from '../avatar/UserAvatar';
import AnimatedDreamHomeObject from './AnimatedDreamHomeObject';
import DreamHomeDayNightOverlay from './DreamHomeDayNightOverlay';
import DreamHomeLifeEffects from './DreamHomeLifeEffects';

export const DREAM_HOME = require('../../assets/dream-home/dream_home_base.jpeg');
export const IMG_ASPECT = 2816 / 1536;

export interface PreviewEntry {
  item: RewardItem;
  xPercent: number;
  yPercent: number;
  scale: number;
  isNew?: boolean;
}

interface Props {
  width: number;
  placed: PreviewEntry[];
  completedCount: number;
  night: boolean;
  selection: AvatarSelection;
  equippedKeys: EquipKey[];
  outfit?: OutfitOverride;
  customUri: string | null;
  interactive?: boolean;
  onInspect?: (item: RewardItem) => void;
}

export default function DreamHomeCanvas({ width, placed, completedCount, night, selection, equippedKeys, outfit, customUri, interactive, onInspect }: Props) {
  const height = Math.round(width / IMG_ASPECT);
  const objBase = width * 0.102;
  const avatarSize = width * 0.107;
  const effects = activeEffects(completedCount);

  return (
    <View style={{ width, height }}>
      <Image source={DREAM_HOME} style={{ width, height }} resizeMode="cover" />

      {/* day / night lighting */}
      <DreamHomeDayNightOverlay width={width} height={height} night={night} effects={effects} />

      {/* placed rewards (animated, level-gated life) */}
      {placed.map((e) => {
        const x = (e.xPercent / 100) * width;
        const y = (e.yPercent / 100) * height;
        const size = Math.round(objBase * e.scale);
        return (
          <AnimatedDreamHomeObject
            key={e.item.id}
            item={e.item}
            left={x - size / 2}
            top={y - size}
            size={size}
            zIndex={Math.round(e.yPercent)}
            night={night}
            effects={effects}
            interactive={interactive}
            onInspect={onInspect}
          />
        );
      })}

      {/* avatar near the porch */}
      <View pointerEvents="none" style={[styles.avatarWrap, { left: (44 / 100) * width - avatarSize / 2, top: (78 / 100) * height - avatarSize, width: avatarSize }]}>
        {customUri ? (
          <Image source={{ uri: customUri }} style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2, borderWidth: 2, borderColor: '#FFFFFF' }} resizeMode="cover" />
        ) : (
          <UserAvatar userType={selection.userType} gender={selection.gender} age={selection.age} size={avatarSize} equipped={equippedKeys} outfit={outfit} shadow />
        )}
      </View>

      {/* ambient life: birds, entrance sparkle, full-house glow */}
      <DreamHomeLifeEffects width={width} height={height} night={night} effects={effects} />
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrap: { position: 'absolute', alignItems: 'center', zIndex: 78 },
});
