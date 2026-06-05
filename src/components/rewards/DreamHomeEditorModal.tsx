/**
 * DreamHomeEditorModal — full-screen "Edit Mode" for the Dream Home.
 *
 * Shows the full house image (full aspect, not cropped) with every placed reward
 * as a draggable object. The learner drags items anywhere, removes them, resets
 * the layout, or saves. Positions are percentages of the image (handled by the
 * parent via onMove). Wardrobe/Lifestyle wearables are NOT here — they dress the
 * avatar, who stands on the porch for context.
 */
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IS_WEB, VIEWPORT_W, VIEWPORT_H, WEB_SCALE } from '../../utils/viewport';
import { AvatarSelection } from '../../storage/avatarStorage';
import { EquipKey } from '../../data/rewards';
import { OutfitOverride } from '../../data/avatarOutfits';
import { RewardItem } from '../../data/rewardCategories';
import { activeEffects, lifeScore } from '../../utils/dreamHomeLifeScore';
import UserAvatar from '../avatar/UserAvatar';
import DraggableRewardObject from './DraggableRewardObject';
import DreamHomeDayNightOverlay from './DreamHomeDayNightOverlay';
import DreamHomeLifeEffects from './DreamHomeLifeEffects';

const DREAM_HOME = require('../../assets/dream-home/dream_home_base.jpeg');
const IMG_ASPECT = 2816 / 1536;
const EIMG_W = VIEWPORT_W;                  // full-bleed width
const EIMG_H = Math.round(EIMG_W / IMG_ASPECT);
const OBJ_BASE = 64;

const PRIMARY = '#FF7A00';

export interface PlacedEntry {
  item: RewardItem;
  xPercent: number;
  yPercent: number;
  scale: number;
}

interface Props {
  items: PlacedEntry[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, xPercent: number, yPercent: number) => void;
  onRemove: (id: string) => void;
  onReset: () => void;
  onClose: () => void;
  selection: AvatarSelection;
  equippedKeys: EquipKey[];
  outfit?: OutfitOverride;
  customUri: string | null;
  completedCount: number;
  unlockedItems: number;
  totalItems: number;
}

export default function DreamHomeEditorModal({
  items, selectedId, onSelect, onMove, onRemove, onReset, onClose, selection, equippedKeys, outfit, customUri,
  completedCount, unlockedItems, totalItems,
}: Props) {
  const [night, setNight] = useState(false);
  const effects = activeEffects(completedCount);
  const score = lifeScore(unlockedItems, totalItems);
  return (
    <Modal visible transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.backdrop}>
        <View style={styles.frame}>
          {/* header */}
          <View style={styles.header}>
            <View style={{ width: 78 }}>
              <Text style={styles.editTag}>Edit Mode</Text>
              <Text style={styles.lifeScore}>🏡 Life {score}%</Text>
            </View>
            <Text style={styles.title}>🏡  My Dream Home</Text>
            <View style={styles.headerRight}>
              <Pressable onPress={() => setNight((n) => !n)} hitSlop={8} style={styles.nightToggle}><Text style={styles.toggleText}>{night ? '🌙' : '☀️'}</Text></Pressable>
              <Pressable onPress={onClose} hitSlop={10} style={styles.close}><Text style={styles.closeX}>✕</Text></Pressable>
            </View>
          </View>

          {/* canvas */}
          <View style={styles.canvasArea}>
            <View style={[styles.canvas, { width: EIMG_W, height: EIMG_H }]}>
              {/* tap empty area to deselect */}
              <Pressable style={StyleSheet.absoluteFill} onPress={() => onSelect(null)} />
              <Image source={DREAM_HOME} style={{ width: EIMG_W, height: EIMG_H }} resizeMode="cover" />

              {/* day / night lighting (below the draggable objects) */}
              <DreamHomeDayNightOverlay width={EIMG_W} height={EIMG_H} night={night} effects={effects} />

              {items.map((e) => (
                <DraggableRewardObject
                  key={e.item.id}
                  item={e.item}
                  xPercent={e.xPercent}
                  yPercent={e.yPercent}
                  size={Math.round(OBJ_BASE * e.scale)}
                  imgW={EIMG_W}
                  imgH={EIMG_H}
                  selected={selectedId === e.item.id}
                  onSelect={onSelect}
                  onMove={onMove}
                  onRemove={onRemove}
                />
              ))}

              {/* avatar (context only, not draggable) */}
              <View pointerEvents="none" style={[styles.avatarWrap, { left: (44 / 100) * EIMG_W - 22, top: (78 / 100) * EIMG_H - 54 }]}>
                {customUri ? (
                  <Image source={{ uri: customUri }} style={styles.avatarImg} resizeMode="cover" />
                ) : (
                  <UserAvatar userType={selection.userType} gender={selection.gender} age={selection.age} size={54} equipped={equippedKeys} outfit={outfit} shadow />
                )}
              </View>

              {/* ambient life: birds, entrance sparkle, full-house glow */}
              <DreamHomeLifeEffects width={EIMG_W} height={EIMG_H} night={night} effects={effects} />
            </View>

            <Text style={styles.hint}>✋  Drag items to place them in your world</Text>
            {selectedId && <Text style={styles.subHint}>Tap ✕ on an item to remove it</Text>}
          </View>

          {/* footer */}
          <View style={styles.footer}>
            <Pressable onPress={onReset} style={({ pressed }) => [styles.resetBtn, pressed && { opacity: 0.85 }]}>
              <Text style={styles.resetText}>↺  Reset</Text>
            </Pressable>
            <Pressable onPress={onClose} style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.9 }]}>
              <Text style={styles.saveText}>✓  Save</Text>
            </Pressable>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: IS_WEB ? '#0B0C10' : '#15161A',
    alignItems: IS_WEB ? 'center' : 'stretch',
    justifyContent: IS_WEB ? 'center' : 'flex-start',
  },
  frame: IS_WEB
    ? { width: VIEWPORT_W, height: VIEWPORT_H, backgroundColor: '#1B1D22', overflow: 'hidden', borderRadius: 44, transform: [{ scale: WEB_SCALE }] }
    : { flex: 1, backgroundColor: '#1B1D22' },
  header: {
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  editTag: { color: PRIMARY, fontWeight: '900', fontSize: 11 },
  lifeScore: { color: '#FFD24A', fontWeight: '900', fontSize: 11, marginTop: 2 },
  title: { fontSize: 17, fontWeight: '900', color: '#FFFFFF' },
  headerRight: { width: 78, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  nightToggle: { width: 34, height: 34, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  toggleText: { fontSize: 16 },
  close: { alignItems: 'flex-end' },
  closeX: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  canvasArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  canvas: {
    borderRadius: 20, overflow: 'hidden', backgroundColor: '#DCE8D8',
    borderWidth: 1.5, borderColor: '#2A2C33',
    shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 10 },
  },
  avatarWrap: { position: 'absolute', alignItems: 'center', width: 44, zIndex: 78 },
  avatarImg: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#FFFFFF' },
  hint: { color: '#C7CDD3', fontWeight: '700', fontSize: 13, marginTop: 22 },
  subHint: { color: '#9AA0A6', fontWeight: '600', fontSize: 11.5, marginTop: 6 },
  footer: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 28, paddingTop: 8, gap: 12 },
  resetBtn: {
    flex: 1, marginRight: 6, borderRadius: 16, paddingVertical: 15, alignItems: 'center',
    backgroundColor: '#2A2C33', borderWidth: 1.5, borderColor: '#3A3D45',
  },
  resetText: { color: '#C7CDD3', fontWeight: '800', fontSize: 15 },
  saveBtn: {
    flex: 1.4, marginLeft: 6, borderRadius: 16, paddingVertical: 15, alignItems: 'center', backgroundColor: PRIMARY,
    shadowColor: PRIMARY, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
  },
  saveText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
});
