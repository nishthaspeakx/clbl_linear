/**
 * AppHeader — SpeakX-style top bar shown on the Home (map) tab.
 * Left: language pill (हिं ▼). Right group: A/अ translate card, 🏆 trophy pill,
 * coin pill. White bar with a soft shadow, sits above the town map.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const HEADER_TOP_INSET = 44; // status-bar space
export const HEADER_HEIGHT = HEADER_TOP_INSET + 56;

interface Props {
  trophies: number;
  coins: number;
}

function AppHeader({ trophies, coins }: Props) {
  return (
    <View style={styles.bar}>
      <Pressable style={styles.langPill} hitSlop={6}>
        <Text style={styles.langText}>हिं</Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <View style={styles.rightGroup}>
        <Pressable style={styles.translateCard} hitSlop={6}>
          <Text style={styles.translateA}>A</Text>
          <Text style={styles.translateSlash}>/</Text>
          <Text style={styles.translateHi}>अ</Text>
        </Pressable>

        <View style={styles.pill}>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.pillText}>{trophies}</Text>
        </View>

        <View style={styles.pill}>
          <View style={styles.coin}>
            <Text style={styles.coinC}>C</Text>
          </View>
          <Text style={styles.pillText}>{coins}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    paddingTop: HEADER_TOP_INSET,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    zIndex: 20,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#ECEDEF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  langText: { fontSize: 15, fontWeight: '800', color: '#2A2E33' },
  chevron: { fontSize: 12, color: '#9AA0A6', marginLeft: 6 },
  rightGroup: { flexDirection: 'row', alignItems: 'center' },
  translateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEFF',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 7,
    marginRight: 8,
  },
  translateA: { fontSize: 14, fontWeight: '900', color: '#7C3AED' },
  translateSlash: { fontSize: 13, color: '#B9A4E8', marginHorizontal: 1 },
  translateHi: { fontSize: 14, fontWeight: '900', color: '#7C3AED' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#ECEDEF',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 8,
  },
  trophy: { fontSize: 14, marginRight: 4 },
  pillText: { fontSize: 14, fontWeight: '800', color: '#2A2E33' },
  coin: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFB020',
    borderWidth: 1.5,
    borderColor: '#E69100',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  coinC: { fontSize: 11, fontWeight: '900', color: '#FFFFFF' },
});

export default AppHeader;
