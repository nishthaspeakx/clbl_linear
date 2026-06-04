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

  // On web, center the phone frame on a dark backdrop.
  if (IS_WEB) {
    return <View style={styles.backdrop}>{shell}</View>;
  }
  return shell;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  backdrop: {
    flex: 1,
    backgroundColor: '#1A1B1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: VIEWPORT_W,
    height: VIEWPORT_H,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    // Subtle device shell on wide screens.
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
  },
  screen: { flex: 1 },
  fill: { ...StyleSheet.absoluteFillObject },
  hidden: { opacity: 0 },
});
