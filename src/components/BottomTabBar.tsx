/**
 * BottomTabBar — SpeakX-style bottom navigation (Home · Membership · AI Call ·
 * Progress). Selected tab is orange with a soft glow; others are grey. AI Call
 * is always a filled orange phone button (CTA style), matching the app.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';

export type TabKey = 'home' | 'membership' | 'aicall' | 'progress';

const PRIMARY = '#FF7A00';
const GREY = '#9AA0A6';

function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24">
      <Path d="M4 11.5 L12 4 L20 11.5" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 10.5 V20 H18 V10.5" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Rect x={10} y={14} width={4} height={6} rx={1} fill="none" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function MedalIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24">
      <Path d="M9 3 L11 9 M15 3 L13 9" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={12} cy={14} r={6} fill="none" stroke={color} strokeWidth={2} />
      <Polygon points="12,11 13,13.4 15.6,13.6 13.6,15.3 14.2,17.8 12,16.4 9.8,17.8 10.4,15.3 8.4,13.6 11,13.4" fill={color} />
    </Svg>
  );
}

function CallIconFilled() {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40">
      <Circle cx={20} cy={20} r={20} fill={PRIMARY} />
      <Path
        d="M14 13 c0 0 1 -1 2 -1 c1 0 2 3 2 4 c0 1 -1 1.5 -1.5 2 c0.6 1.6 2.4 3.4 4 4 c0.5 -0.5 1 -1.5 2 -1.5 c1 0 4 1 4 2 c0 1 -1 2 -1 2 c-1 1 -3 1 -6 -1 c-3 -2 -5.5 -5 -5.5 -8 z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

function BarsIcon({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24">
      <Rect x={4} y={13} width={4} height={7} rx={1} fill={color} />
      <Rect x={10} y={9} width={4} height={11} rx={1} fill={color} />
      <Rect x={16} y={5} width={4} height={15} rx={1} fill={color} />
    </Svg>
  );
}

interface Props {
  active: TabKey;
  onChange: (t: TabKey) => void;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'membership', label: 'Membership' },
  { key: 'aicall', label: 'AI Call' },
  { key: 'progress', label: 'Progress' },
];

function BottomTabBar({ active, onChange }: Props) {
  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const on = active === t.key;
        const color = on ? PRIMARY : GREY;
        return (
          <Pressable key={t.key} style={styles.item} onPress={() => onChange(t.key)} hitSlop={6}>
            {on && t.key !== 'aicall' && <View style={styles.glow} />}
            <View style={styles.iconWrap}>
              {t.key === 'home' && <HomeIcon color={color} />}
              {t.key === 'membership' && <MedalIcon color={color} />}
              {t.key === 'aicall' && <CallIconFilled />}
              {t.key === 'progress' && <BarsIcon color={color} />}
            </View>
            <Text style={[styles.label, { color }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F1F3',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 2 },
  iconWrap: { height: 30, alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute',
    top: 0,
    width: 46,
    height: 30,
    borderRadius: 16,
    backgroundColor: 'rgba(255,122,0,0.12)',
  },
  label: { fontSize: 11.5, fontWeight: '700', marginTop: 3 },
});

export default BottomTabBar;
