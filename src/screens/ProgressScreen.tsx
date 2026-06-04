/**
 * ProgressScreen — visual prototype of the SpeakX "Progress" tab.
 * Dark hero with avatar + level badge + name, then a white "Sentences Learnt"
 * card with a dotted progress curve toward the next goal. Static/mock only.
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Defs, LinearGradient, Path, Polygon, Rect, Stop } from 'react-native-svg';

const PRIMARY = '#FF7A00';
const TOP = 44;

function SentenceChart() {
  // solid green progress to "now" (42), then dotted toward goal (60 / flag).
  const solid = 'M 14 96 C 70 92 96 70 150 64 S 210 52 232 46';
  const dotted = 'M 232 46 C 270 40 290 30 318 22';
  return (
    <Svg width="100%" height={120} viewBox="0 0 340 120">
      <Path d={solid} fill="none" stroke="#3BB273" strokeWidth={4} strokeLinecap="round" />
      <Path d={dotted} fill="none" stroke="#C7CDD3" strokeWidth={4} strokeLinecap="round" strokeDasharray="2 8" />
      {/* current point */}
      <Circle cx={232} cy={46} r={7} fill="#3BB273" stroke="#FFFFFF" strokeWidth={3} />
      {/* goal flag */}
      <Path d="M 318 22 V 6" stroke="#9AA0A6" strokeWidth={2.5} strokeLinecap="round" />
      <Polygon points="318,6 332,11 318,16" fill="#FF5A5F" />
    </Svg>
  );
}

export default function ProgressScreen() {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Dark hero */}
      <View style={styles.hero}>
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Defs>
            <LinearGradient id="ph" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#3A2E2A" />
              <Stop offset="1" stopColor="#1E1A18" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#ph)" />
        </Svg>
        <View style={styles.gear}>
          <Text style={{ fontSize: 18 }}>⚙️</Text>
        </View>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 44 }}>👧🏻</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level 1</Text>
          </View>
        </View>
        <Text style={styles.name}>Jia</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sentences Learnt</Text>
          <Text style={styles.cardSub}>Finish exercises to learn more sentences.</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>42</Text>
              <Text style={styles.statLabel}>Sentences</Text>
            </View>
            <View style={styles.goalBox}>
              <Text style={styles.goalNum}>60</Text>
              <Text style={styles.goalLabel}>Next Goal</Text>
            </View>
          </View>

          <SentenceChart />

          <View style={styles.tip}>
            <Text style={styles.tipText}>✨ Wow! You are among the top 50% English speakers.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F6F7F9' },
  hero: {
    height: 240,
    paddingTop: TOP + 8,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  gear: { position: 'absolute', top: TOP + 6, right: 18 },
  avatarWrap: { marginTop: 18, alignItems: 'center' },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#F0E6DA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#1E1A18',
  },
  levelText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  name: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginTop: 22 },
  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 110 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#2A2E33' },
  cardSub: { fontSize: 12.5, color: '#9AA0A6', marginTop: 3, marginBottom: 14 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  statBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#EAF7EE',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  statNum: { fontSize: 24, fontWeight: '900', color: '#2E9E63', marginRight: 6 },
  statLabel: { fontSize: 12, fontWeight: '700', color: '#2E9E63' },
  goalBox: { alignItems: 'flex-end' },
  goalNum: { fontSize: 20, fontWeight: '900', color: '#C7CDD3' },
  goalLabel: { fontSize: 11, fontWeight: '700', color: '#9AA0A6' },
  tip: {
    marginTop: 14,
    backgroundColor: '#FFF8E8',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FBE7B8',
  },
  tipText: { fontSize: 13, color: '#9A7B1E', fontWeight: '700', textAlign: 'center' },
});
