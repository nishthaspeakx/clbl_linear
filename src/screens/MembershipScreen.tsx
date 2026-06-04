/**
 * MembershipScreen — visual prototype of the SpeakX "Membership" tab.
 * SPEAKX PREMIUM header, a Proficiency Progress chart, and Subscription
 * Details (Trial Plan). Static/mock data only — no backend.
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';

const PRIMARY = '#FF7A00';
const TOP = 44;

const LEVELS = ['Beginner', 'Rising Voice', 'Good Talker', 'Star Speaker'];

function ProficiencyChart() {
  // 4 milestones along a rising curve; learner is at the 1st (Beginner).
  const pts = [
    { x: 46, y: 150 },
    { x: 142, y: 116 },
    { x: 238, y: 78 },
    { x: 318, y: 40 },
  ];
  const d = `M ${pts[0].x} ${pts[0].y} C 100 150 110 120 ${pts[1].x} ${pts[1].y} S 200 80 ${pts[2].x} ${pts[2].y} S 300 50 ${pts[3].x} ${pts[3].y}`;
  return (
    <View>
      <Svg width="100%" height={190} viewBox="0 0 360 190">
        <Path d={d} fill="none" stroke={PRIMARY} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 9" />
        {pts.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === 0 ? 9 : 6}
            fill={i === 0 ? PRIMARY : '#FFFFFF'}
            stroke={PRIMARY}
            strokeWidth={3}
          />
        ))}
        {/* gold star on the final milestone */}
        <Polygon
          points="318,24 322,34 333,34 324,41 327,52 318,45 309,52 312,41 303,34 314,34"
          fill="#FFC107"
          stroke="#E0A800"
          strokeWidth={1}
        />
      </Svg>
      <View style={styles.chartLabels}>
        {LEVELS.map((l, i) => (
          <Text key={l} style={[styles.chartLabel, i === 0 && styles.chartLabelActive]} numberOfLines={2}>
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default function MembershipScreen() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top row */}
        <View style={styles.topRow}>
          <View>
            <View style={styles.premiumRow}>
              <Text style={styles.speakx}>SPEAKX </Text>
              <Text style={styles.crown}>👑</Text>
              <Text style={styles.premium}>PREMIUM</Text>
            </View>
            <Text style={styles.activeTill}>Membership active till 10 Jun 2026</Text>
          </View>
          <View style={styles.chatPill}>
            <Text style={styles.chatText}>💬 Chat with us</Text>
          </View>
        </View>

        {/* Proficiency Progress */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Proficiency Progress</Text>
          <Text style={styles.cardSub}>Your speaking level grows as you practice every day.</Text>
          <ProficiencyChart />
        </View>

        {/* Subscription Details */}
        <Text style={styles.sectionTitle}>Subscription Details</Text>
        <View style={styles.subCard}>
          <View style={styles.subIcon}>
            <Text style={{ fontSize: 22 }}>🎟️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.subPlan}>Trial Plan</Text>
            <Text style={styles.subMeta}>₹2 · billed monthly</Text>
          </View>
          <View style={styles.daysPill}>
            <Text style={styles.daysText}>6 days left</Text>
          </View>
        </View>

        <View style={styles.upgradeBtn}>
          <Text style={styles.upgradeText}>Upgrade Plan</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F6F7F9' },
  content: { paddingTop: TOP + 12, paddingHorizontal: 16, paddingBottom: 110 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 },
  premiumRow: { flexDirection: 'row', alignItems: 'center' },
  speakx: { fontSize: 19, fontWeight: '900', color: '#2A2E33', letterSpacing: 0.5 },
  crown: { fontSize: 16, marginRight: 3 },
  premium: { fontSize: 19, fontWeight: '900', color: PRIMARY, letterSpacing: 0.5 },
  activeTill: { fontSize: 12, color: '#8A9097', marginTop: 4, fontWeight: '600' },
  chatPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ECEDEF',
  },
  chatText: { fontSize: 12, fontWeight: '700', color: '#FF7A00' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#2A2E33' },
  cardSub: { fontSize: 12.5, color: '#9AA0A6', marginTop: 4, marginBottom: 6 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  chartLabel: { flex: 1, fontSize: 10.5, color: '#9AA0A6', fontWeight: '700', textAlign: 'center' },
  chartLabelActive: { color: PRIMARY },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#2A2E33', marginTop: 24, marginBottom: 12 },
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  subIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFF1E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subPlan: { fontSize: 15, fontWeight: '800', color: '#2A2E33' },
  subMeta: { fontSize: 12, color: '#9AA0A6', marginTop: 2 },
  daysPill: { backgroundColor: '#E9F8EF', borderRadius: 14, paddingHorizontal: 11, paddingVertical: 6 },
  daysText: { fontSize: 11.5, fontWeight: '800', color: '#2E9E63' },
  upgradeBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 22,
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  upgradeText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
