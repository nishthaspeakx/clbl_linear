/**
 * AppTabs — the app shell. A lightweight state-driven tab switcher (no extra
 * navigation dependency) that renders the active screen full-bleed with the
 * SpeakX-style BottomTabBar fixed on top of every tab.
 *
 * On web the whole shell is locked into a centered phone-sized frame (see
 * utils/viewport) so it always looks like an Android phone, never stretched
 * across a desktop browser.
 *
 * Home = the English Town map. Membership / AI Call / Progress are visual
 * prototypes recreated from the app screenshots.
 */
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import BottomTabBar, { TabKey } from '../components/BottomTabBar';
import HomeScreen from '../screens/HomeScreen';
import MembershipScreen from '../screens/MembershipScreen';
import AICallScreen from '../screens/AICallScreen';
import ProgressScreen from '../screens/ProgressScreen';
import { IS_WEB, VIEWPORT_W, VIEWPORT_H } from '../utils/viewport';
import { AvatarProvider } from '../components/avatar/AvatarContext';

// Scale the whole device up to fill the browser so the demo always looks like a
// big phone (not a small one floating in a wide desktop window).
const DEVICE_W = VIEWPORT_W + 32;
const DEVICE_H = VIEWPORT_H + 32;
const DEVICE_SCALE = (() => {
  if (!IS_WEB || typeof window === 'undefined') return 1;
  const s = Math.min((window.innerHeight * 0.96) / DEVICE_H, (window.innerWidth * 0.96) / DEVICE_W);
  return Math.max(0.7, Math.min(s, 2.2));
})();

export default function AppTabs() {
  const [tab, setTab] = useState<TabKey>('home');

  const shell = (
    <GestureHandlerRootView style={IS_WEB ? styles.frame : styles.root}>
      <View style={styles.screen}>
        {/* Keep Home mounted so map state/character position persists across tabs. */}
        <View style={[styles.fill, tab !== 'home' && styles.hidden]} pointerEvents={tab === 'home' ? 'auto' : 'none'}>
          <HomeScreen />
        </View>
        {tab === 'membership' && <MembershipScreen />}
        {tab === 'aicall' && <AICallScreen />}
        {tab === 'progress' && <ProgressScreen />}
      </View>

      <BottomTabBar active={tab} onChange={setTab} />
    </GestureHandlerRootView>
  );

  // On web, present the app inside a premium phone mockup (dark bezel +
  // dynamic island + soft shadow) centered on a backdrop.
  const tree = IS_WEB ? (
    <View style={styles.backdrop}>
      <View style={[styles.deviceBody, { transform: [{ scale: DEVICE_SCALE }] }]}>
        {shell}
        <View pointerEvents="none" style={styles.islandWrap}>
          <View style={styles.island} />
        </View>
      </View>
    </View>
  ) : shell;
  return <AvatarProvider>{tree}</AvatarProvider>;
}

const BEZEL = 14;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  backdrop: {
    flex: 1,
    backgroundColor: '#15161A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Dark phone body (bezel) around the screen.
  deviceBody: {
    padding: BEZEL,
    backgroundColor: '#0B0C10',
    borderRadius: 56,
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 44,
    shadowOffset: { width: 0, height: 22 },
    borderWidth: 2,
    borderColor: '#2A2C33',
  },
  // The actual app screen.
  frame: {
    width: VIEWPORT_W,
    height: VIEWPORT_H,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderRadius: 44,
  },
  // Dynamic-island pill overlaying the top of the screen.
  islandWrap: { position: 'absolute', top: BEZEL + 12, left: 0, right: 0, alignItems: 'center' },
  island: { width: 116, height: 32, borderRadius: 17, backgroundColor: '#08090C' },
  screen: { flex: 1 },
  fill: { ...StyleSheet.absoluteFillObject },
  hidden: { opacity: 0 },
});
