/**
 * DreamHomeItemDrawer — bottom drawer of unlocked rewards not yet on the canvas.
 * Tapping an item adds it to the Dream Home (the editor then selects it so the
 * user can drag it into place). Slides up over the editor.
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RewardItem } from '../../data/rewardCategories';
import { ObjectVisual } from './placedObjects';

interface Props {
  items: RewardItem[];
  onAdd: (item: RewardItem) => void;
  onClose: () => void;
}

export default function DreamHomeItemDrawer({ items, onAdd, onClose }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.handle} />
      <View style={styles.head}>
        <Text style={styles.title}>＋ Add Item</Text>
        <Pressable onPress={onClose} hitSlop={10}><Text style={styles.close}>✕</Text></Pressable>
      </View>
      {items.length === 0 ? (
        <Text style={styles.empty}>Everything unlocked is already in your home 🎉</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
          {items.map((it) => (
            <Pressable key={it.id} onPress={() => onAdd(it)} style={({ pressed }) => [styles.cell, pressed && { opacity: 0.8 }]}>
              <View style={styles.cellImg}><ObjectVisual item={it} size={42} /></View>
              <Text style={styles.cellName} numberOfLines={1}>{it.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '52%',
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 22, borderTopRightRadius: 22,
    paddingHorizontal: 14, paddingBottom: 24, paddingTop: 8,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: -6 }, elevation: 16,
  },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: '#D8DCE0', marginBottom: 8 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  title: { fontSize: 16, fontWeight: '900', color: '#21242B' },
  close: { fontSize: 16, fontWeight: '900', color: '#9AA0A6' },
  empty: { textAlign: 'center', color: '#9AA0A6', fontWeight: '700', fontSize: 13, paddingVertical: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cell: {
    width: '23%', alignItems: 'center', marginBottom: 12,
  },
  cellImg: {
    width: '100%', height: 58, borderRadius: 12, backgroundColor: '#F6F7F9',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  cellName: { fontSize: 10, fontWeight: '700', color: '#41454B', marginTop: 4, textAlign: 'center' },
});
