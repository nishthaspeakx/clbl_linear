/**
 * DreamHomeEditorScreen — the full-screen Dream Home decoration mode.
 *
 * Features:
 *  • Pinch-to-zoom (1×–3×) + pan when zoomed, with safe boundaries; double-tap
 *    or the reset control returns to 1×. Floating ＋ / － / ⟲ zoom controls.
 *  • Tap an item to select (orange glow); drag to reposition (zoom-aware) — on
 *    release the position saves exactly where dropped. Items can go ANYWHERE on
 *    the canvas; the only guard is a boundary clamp (0–100%) so nothing leaves
 *    the image. No zone restrictions, no error toasts.
 *  • Placement toolbar (Smaller · Bigger · Rotate · Reset · Save) for the
 *    selected item; ＋ Add Item drawer for unlocked items not yet placed.
 *  • All positions persist as image percentages (+ scale + rotation).
 */
import React, { useRef, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { IS_WEB, VIEWPORT_W, VIEWPORT_H, WEB_SCALE } from '../utils/viewport';
import { AvatarSelection } from '../storage/avatarStorage';
import { EquipKey } from '../data/rewards';
import { OutfitOverride } from '../data/avatarOutfits';
import { RewardItem } from '../data/rewardCategories';
import { placementFor } from '../data/dreamHomePlacements';
import { clamp } from '../utils/dreamHomeCoordinateUtils';
import { clampToCanvas } from '../utils/dreamHomeZoneValidation';
import { playSound } from '../services/soundService';
import { triggerHaptic } from '../services/hapticService';
import UserAvatar from '../components/avatar/UserAvatar';
import { DREAM_HOME, IMG_ASPECT } from '../components/rewards/DreamHomeCanvas';
import DraggablePlacedReward from '../components/rewards/DraggablePlacedReward';
import PlacementToolbar from '../components/rewards/PlacementToolbar';
import DreamHomeItemDrawer from '../components/rewards/DreamHomeItemDrawer';

const BASE_W = VIEWPORT_W;
const BASE_H = Math.round(BASE_W / IMG_ASPECT);
const OBJ_BASE = BASE_W * 0.102;
const AVA = BASE_W * 0.107;
const MIN_Z = 1;
const MAX_Z = 3;

export interface EditorEntry {
  item: RewardItem;
  xPercent: number;
  yPercent: number;
  scale: number;
  rotation: number;
}

interface Props {
  placed: EditorEntry[];
  available: RewardItem[];
  selection: AvatarSelection;
  equippedKeys: EquipKey[];
  outfit?: OutfitOverride;
  customUri: string | null;
  onUpdate: (id: string, partial: { xPercent?: number; yPercent?: number; scale?: number; rotation?: number }) => void;
  onAdd: (item: RewardItem) => void;
  onRemove: (id: string) => void;
  onReset: () => void;
  onClose: () => void;
  initialSelectedId?: string | null;
}

export default function DreamHomeEditorScreen({
  placed, available, selection, equippedKeys, outfit, customUri,
  onUpdate, onAdd, onRemove, onReset, onClose, initialSelectedId = null,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const zoomTarget = useRef(1);

  // canvas zoom/pan
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const sel = placed.find((e) => e.item.id === selectedId) ?? null;

  const deselect = () => setSelectedId(null);
  const syncTarget = (v: number) => { zoomTarget.current = v; };

  const handleDrop = (id: string, nx: number, ny: number) => {
    // Free placement — any item can go anywhere on the canvas. The only guard is
    // the boundary clamp (0–100%) applied in the draggable before this runs, so
    // an item can never end up fully outside the Dream Home image.
    onUpdate(id, clampToCanvas(nx, ny));
    playSound('item_placed');
    triggerHaptic('light');
  };

  // ── zoom controls ──────────────────────────────────────────────────────
  const setZoom = (target: number) => {
    const t = clamp(target, MIN_Z, MAX_Z);
    zoomTarget.current = t;
    scale.value = withTiming(t, { duration: 180 });
    if (t <= 1) { tx.value = withTiming(0); ty.value = withTiming(0); }
  };
  const zoomIn = () => { playSound('button_tap'); setZoom(zoomTarget.current + 0.5); };
  const zoomOut = () => { playSound('button_tap'); setZoom(zoomTarget.current - 0.5); };
  const resetView = () => { playSound('button_tap'); setZoom(1); };

  // ── gestures ───────────────────────────────────────────────────────────
  const pinch = Gesture.Pinch()
    .onBegin(() => { 'worklet'; startScale.value = scale.value; })
    .onUpdate((e) => { 'worklet'; scale.value = Math.min(MAX_Z, Math.max(MIN_Z, startScale.value * e.scale)); })
    .onEnd(() => {
      'worklet';
      const mx = (BASE_W * scale.value - BASE_W) / 2;
      const my = (BASE_H * scale.value - BASE_H) / 2;
      tx.value = Math.min(mx, Math.max(-mx, tx.value));
      ty.value = Math.min(my, Math.max(-my, ty.value));
      runOnJS(syncTarget)(scale.value);
    });

  const pan = Gesture.Pan()
    .onChange((e) => {
      'worklet';
      if (scale.value <= 1) return;
      const mx = (BASE_W * scale.value - BASE_W) / 2;
      const my = (BASE_H * scale.value - BASE_H) / 2;
      tx.value = Math.min(mx, Math.max(-mx, tx.value + e.changeX));
      ty.value = Math.min(my, Math.max(-my, ty.value + e.changeY));
    });

  const doubleTap = Gesture.Tap().numberOfTaps(2).maxDelay(220).onEnd(() => {
    'worklet';
    scale.value = withTiming(1, { duration: 200 });
    tx.value = withTiming(0);
    ty.value = withTiming(0);
    runOnJS(syncTarget)(1);
  });
  const tapDeselect = Gesture.Tap().maxDuration(250).onEnd(() => { 'worklet'; runOnJS(deselect)(); });
  const canvasGesture = Gesture.Race(Gesture.Exclusive(doubleTap, tapDeselect), Gesture.Simultaneous(pinch, pan));

  const worldStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  // ── toolbar actions (logic unchanged — operate on the selected item) ─────
  const smaller = () => sel && onUpdate(sel.item.id, { scale: clamp(sel.scale - 0.12, 0.3, 2) });
  const bigger = () => sel && onUpdate(sel.item.id, { scale: clamp(sel.scale + 0.12, 0.3, 2) });
  const rotate = () => sel && onUpdate(sel.item.id, { rotation: (sel.rotation + 15) % 360 });
  const resetItem = () => {
    if (!sel) return;
    const d = placementFor(sel.item.imageKey);
    onUpdate(sel.item.id, { xPercent: d?.xPercent ?? 50, yPercent: d?.yPercent ?? 50, scale: d?.scale ?? 0.8, rotation: 0 });
  };
  const saveItem = () => { playSound('button_tap'); setSelectedId(null); };

  const handleAdd = (it: RewardItem) => { onAdd(it); setSelectedId(it.id); setDrawerOpen(false); };

  return (
    <Modal visible transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.backdrop}>
        <View style={styles.frame}>
          {/* top bar */}
          <View style={styles.topBar}>
            <Pressable onPress={onClose} hitSlop={10} style={styles.topSide}><Text style={styles.back}>←</Text></Pressable>
            <Text style={styles.topTitle}>🏡  Decorate Home</Text>
            <Pressable onPress={() => { playSound('button_tap'); onClose(); }} hitSlop={10} style={[styles.topSide, styles.topRight]}>
              <Text style={styles.saveTop}>Save</Text>
            </Pressable>
          </View>

          {/* canvas */}
          <View style={styles.canvasArea}>
            <View style={[styles.viewport, { width: BASE_W, height: BASE_H }]}>
              <GestureDetector gesture={canvasGesture}>
                <Animated.View style={[{ width: BASE_W, height: BASE_H }, worldStyle]}>
                  <Image source={DREAM_HOME} style={{ width: BASE_W, height: BASE_H }} resizeMode="cover" />

                  {placed.map((e) => (
                    <DraggablePlacedReward
                      key={e.item.id}
                      item={e.item}
                      xPercent={e.xPercent}
                      yPercent={e.yPercent}
                      size={Math.round(OBJ_BASE * e.scale)}
                      rotation={e.rotation}
                      baseW={BASE_W}
                      baseH={BASE_H}
                      canvasScale={scale}
                      selected={selectedId === e.item.id}
                      onSelect={setSelectedId}
                      onDrop={handleDrop}
                      onRemove={onRemove}
                    />
                  ))}

                  {/* avatar (context only) */}
                  <View pointerEvents="none" style={[styles.avatarWrap, { left: 0.44 * BASE_W - AVA / 2, top: 0.78 * BASE_H - AVA, width: AVA }]}>
                    {customUri ? (
                      <Image source={{ uri: customUri }} style={{ width: AVA, height: AVA, borderRadius: AVA / 2, borderWidth: 2, borderColor: '#FFFFFF' }} resizeMode="cover" />
                    ) : (
                      <UserAvatar userType={selection.userType} gender={selection.gender} age={selection.age} size={AVA} equipped={equippedKeys} outfit={outfit} shadow />
                    )}
                  </View>
                </Animated.View>
              </GestureDetector>
            </View>

            {/* floating zoom controls */}
            <View style={styles.zoomCol}>
              <Pressable onPress={zoomIn} style={styles.zoomBtn} hitSlop={6}><Text style={styles.zoomTxt}>＋</Text></Pressable>
              <Pressable onPress={zoomOut} style={styles.zoomBtn} hitSlop={6}><Text style={styles.zoomTxt}>－</Text></Pressable>
              <Pressable onPress={resetView} style={styles.zoomBtn} hitSlop={6}><Text style={styles.zoomReset}>⟲</Text></Pressable>
            </View>
          </View>

          {/* bottom: toolbar (selected) OR add-item + hint */}
          <View style={styles.bottom}>
            {sel ? (
              <PlacementToolbar onSmaller={smaller} onBigger={bigger} onRotate={rotate} onReset={resetItem} onSave={saveItem} />
            ) : (
              <>
                <View style={styles.bottomRow}>
                  <Pressable onPress={onReset} style={({ pressed }) => [styles.resetAll, pressed && { opacity: 0.85 }]}>
                    <Text style={styles.resetAllTxt}>↺ Reset all</Text>
                  </Pressable>
                  <Pressable onPress={() => { playSound('button_tap'); setDrawerOpen(true); }} style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.9 }]}>
                    <Text style={styles.addTxt}>＋  Add Item</Text>
                  </Pressable>
                </View>
                <Text style={styles.hint}>Pinch to zoom  •  Drag items to decorate</Text>
              </>
            )}
          </View>

          {/* add-item drawer */}
          {drawerOpen && <DreamHomeItemDrawer items={available} onAdd={handleAdd} onClose={() => setDrawerOpen(false)} />}
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: IS_WEB ? '#0B0C10' : '#15161A',
    alignItems: IS_WEB ? 'center' : 'stretch', justifyContent: IS_WEB ? 'center' : 'flex-start',
  },
  frame: IS_WEB
    ? { width: VIEWPORT_W, height: VIEWPORT_H, backgroundColor: '#16181D', overflow: 'hidden', borderRadius: 44, transform: [{ scale: WEB_SCALE }] }
    : { flex: 1, backgroundColor: '#16181D' },
  topBar: {
    paddingTop: 50, paddingHorizontal: 14, paddingBottom: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  topSide: { width: 64, justifyContent: 'center' },
  topRight: { alignItems: 'flex-end' },
  back: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  topTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  saveTop: { color: '#FF9A40', fontSize: 15, fontWeight: '900' },
  canvasArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  viewport: {
    borderRadius: 18, overflow: 'hidden', backgroundColor: '#DCE8D8',
    borderWidth: 1.5, borderColor: '#2A2C33',
  },
  avatarWrap: { position: 'absolute', alignItems: 'center', zIndex: 78 },
  zoomCol: { position: 'absolute', right: 14, top: '50%', marginTop: -78, alignItems: 'center' },
  zoomBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 5,
  },
  zoomTxt: { fontSize: 22, fontWeight: '900', color: '#21242B', lineHeight: 24 },
  zoomReset: { fontSize: 20, fontWeight: '900', color: '#FF7A00' },
  bottom: { paddingHorizontal: 16, paddingBottom: 26, paddingTop: 6 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resetAll: {
    paddingHorizontal: 16, paddingVertical: 13, borderRadius: 14,
    backgroundColor: '#2A2C33', borderWidth: 1.5, borderColor: '#3A3D45',
  },
  resetAllTxt: { color: '#C7CDD3', fontWeight: '800', fontSize: 14 },
  addBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14, backgroundColor: '#FF7A00',
    shadowColor: '#FF7A00', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
  },
  addTxt: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 },
  hint: { color: '#9AA0A6', fontWeight: '700', fontSize: 12, textAlign: 'center', marginTop: 10 },
});
