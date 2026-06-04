/**
 * AICallScreen — visual prototype of the SpeakX "AI Call" tab.
 * A blue/purple hero ("TALK ABOUT ANYTHING / Available 24x7 / TALK NOW") and a
 * horizontal "Talk to Family & Friends" scenario list. Static/mock only.
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const PRIMARY = '#FF7A00';
const TOP = 44;

interface Scenario {
  emoji: string;
  bg: string;
  title: string;
  mins: string;
  level: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
}

const SCENARIOS: Scenario[] = [
  {
    emoji: '🤝',
    bg: '#E8F0FF',
    title: 'Make new friends',
    mins: '7 Mins',
    level: 'Easy',
    badge: 'Most Viewed',
    badgeBg: '#FFF1E2',
    badgeColor: '#E07B1E',
  },
  {
    emoji: '🍽️',
    bg: '#FDEBF1',
    title: 'Plan a family dinner',
    mins: '5 Mins',
    level: 'Medium',
    badge: 'Trending Now',
    badgeBg: '#EAF7EE',
    badgeColor: '#2E9E63',
  },
];

function HeroBg() {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        <LinearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#5B6CF0" />
          <Stop offset="1" stopColor="#8A4FE0" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" rx="24" fill="url(#hero)" />
    </Svg>
  );
}

export default function AICallScreen() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>AI Call</Text>
        <Text style={styles.h1sub}>Practice real conversations, anytime.</Text>

        {/* Hero */}
        <View style={styles.hero}>
          <HeroBg />
          <View style={styles.heroInner}>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>TALK ABOUT{'\n'}ANYTHING</Text>
              <View style={styles.availRow}>
                <View style={styles.dot} />
                <Text style={styles.availText}>Available 24x7 · Anytime, Anywhere</Text>
              </View>
              <View style={styles.talkBtn}>
                <Text style={styles.talkText}>📞 TALK NOW</Text>
              </View>
            </View>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 46 }}>👩🏻</Text>
            </View>
          </View>
        </View>

        {/* Scenarios */}
        <Text style={styles.sectionTitle}>Talk to Family & Friends</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scenRow}
        >
          {SCENARIOS.map((s) => (
            <View key={s.title} style={styles.scenCard}>
              <View style={[styles.scenImg, { backgroundColor: s.bg }]}>
                <Text style={{ fontSize: 40 }}>{s.emoji}</Text>
                <View style={[styles.scenBadge, { backgroundColor: s.badgeBg }]}>
                  <Text style={[styles.scenBadgeText, { color: s.badgeColor }]}>{s.badge}</Text>
                </View>
              </View>
              <Text style={styles.scenTitle}>{s.title}</Text>
              <View style={styles.scenMetaRow}>
                <Text style={styles.scenMeta}>⏱ {s.mins}</Text>
                <Text style={styles.scenDivider}>·</Text>
                <Text style={styles.scenMeta}>📊 {s.level}</Text>
              </View>
              <View style={styles.scenStart}>
                <Text style={styles.scenStartText}>Start →</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F6F7F9' },
  content: { paddingTop: TOP + 12, paddingBottom: 110 },
  h1: { fontSize: 24, fontWeight: '900', color: '#2A2E33', paddingHorizontal: 16 },
  h1sub: { fontSize: 13, color: '#9AA0A6', marginTop: 2, marginBottom: 16, paddingHorizontal: 16 },
  hero: {
    marginHorizontal: 16,
    height: 188,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#5B6CF0',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  heroInner: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 },
  heroText: { flex: 1 },
  heroTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', lineHeight: 26 },
  availRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ADE80', marginRight: 6 },
  availText: { fontSize: 11.5, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  talkBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 22,
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  talkText: { color: '#FFFFFF', fontWeight: '900', fontSize: 14 },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#2A2E33', marginTop: 26, marginBottom: 14, paddingHorizontal: 16 },
  scenRow: { paddingHorizontal: 16, paddingRight: 6 },
  scenCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginRight: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  scenImg: {
    height: 110,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  scenBadge: { position: 'absolute', top: 8, left: 8, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  scenBadgeText: { fontSize: 10, fontWeight: '800' },
  scenTitle: { fontSize: 15, fontWeight: '800', color: '#2A2E33' },
  scenMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  scenMeta: { fontSize: 11.5, color: '#9AA0A6', fontWeight: '600' },
  scenDivider: { marginHorizontal: 6, color: '#C7CDD3' },
  scenStart: {
    marginTop: 12,
    backgroundColor: '#FFF1E2',
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  scenStartText: { color: PRIMARY, fontWeight: '800', fontSize: 13 },
});
