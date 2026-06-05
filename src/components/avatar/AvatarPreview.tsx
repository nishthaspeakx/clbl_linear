/**
 * AvatarPreview — a reusable avatar display with optional "generated" flourish.
 *
 * Renders the parametric persona avatar (optionally wearing equipped reward
 * items). When `generated` is set, it adds a soft glow ring + sparkle accents
 * so a custom/AI-style avatar reads as freshly created.
 *
 * This is the single place the create/setup/My World screens use to show an
 * avatar, so swapping to a real generated image later only touches this file.
 */
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AvatarSelection } from '../../storage/avatarStorage';
import { EquipKey } from '../../data/rewards';
import UserAvatar from './UserAvatar';

interface Props {
  selection: AvatarSelection;
  size?: number;
  equipped?: EquipKey[];
  /** Show the "generated"/custom glow + sparkles. */
  generated?: boolean;
  /** Diameter of the round stage behind the avatar. */
  stageSize?: number;
  /** If set, render this caricature/photo image instead of the persona figure. */
  imageUri?: string | null;
}

export default function AvatarPreview({
  selection, size = 200, equipped = [], generated = false, stageSize, imageUri,
}: Props) {
  const stage = stageSize ?? size + 28;
  return (
    <View style={[styles.wrap, { width: stage, height: stage }]}>
      <View
        style={[
          styles.stage,
          { width: stage, height: stage, borderRadius: stage / 2 },
          generated && styles.stageGenerated,
        ]}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: stage, height: stage, borderRadius: stage / 2 }} resizeMode="cover" />
        ) : (
          <View style={styles.avatar}>
            <UserAvatar
              userType={selection.userType}
              gender={selection.gender}
              age={selection.age}
              size={size}
              equipped={equipped}
              shadow={false}
            />
          </View>
        )}
      </View>
      {generated && (
        <>
          <Text style={[styles.sparkle, { top: 2, left: 8 }]}>✨</Text>
          <Text style={[styles.sparkle, { top: 12, right: 6, fontSize: 16 }]}>⭐</Text>
          <Text style={[styles.sparkle, { bottom: 24, left: 0, fontSize: 14 }]}>✨</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✨ Custom</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  stage: {
    backgroundColor: '#FFF6EC',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FFE6CF',
  },
  stageGenerated: {
    borderWidth: 3,
    borderColor: '#FF7A00',
    backgroundColor: '#FFF1DE',
    shadowColor: '#FF7A00',
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  avatar: { paddingBottom: 2 },
  sparkle: { position: 'absolute', fontSize: 20 },
  badge: {
    position: 'absolute',
    bottom: 6,
    backgroundColor: '#FF7A00',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: { color: '#FFFFFF', fontWeight: '900', fontSize: 11.5 },
});
