/**
 * RewardUnlockModal — the premium, clean reward unlock experience.
 *
 * Flow:
 *   1. "⭐ Level Complete!  +N Coins" splash for ~800ms (dark 70% overlay,
 *      map interaction disabled).
 *   2. Transitions to a centered RewardRevealCard (reward image + name + soft
 *      golden particles) with Wear Now / Later.
 *   3. Wear Now → parent claims + wears/places (avatar updates live on the map)
 *      + a toast; a brief success beat plays, then the modal closes.
 *      Later → parent just claims; close.
 *
 * Mount one instance per reward (key by reward id) so each starts fresh.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { RewardItem } from '../../data/rewardCategories';
import RewardRevealCard from './RewardRevealCard';

type Phase = 'level' | 'reveal' | 'success';

interface Props {
  reward: RewardItem | null;
  coins: number;
  onWearNow: (item: RewardItem) => void;
  onLater: (item: RewardItem) => void;
  onClose: () => void;
}

export default function RewardUnlockModal({ reward, coins, onWearNow, onLater, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('level');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const splash = useSharedValue(0);

  useEffect(() => {
    if (!reward) return;
    splash.value = withTiming(1, { duration: 240, easing: Easing.out(Easing.cubic) });
    timers.current.push(setTimeout(() => {
      splash.value = withTiming(0, { duration: 200 });
      timers.current.push(setTimeout(() => setPhase('reveal'), 200));
    }, 800));
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [reward, splash]);

  const splashStyle = useAnimatedStyle(() => ({
    opacity: splash.value,
    transform: [{ scale: 0.9 + splash.value * 0.1 }],
  }));

  if (!reward) return null;

  const handlePrimary = () => {
    onWearNow(reward);          // apply now → avatar updates behind the overlay + toast
    setPhase('success');
    timers.current.push(setTimeout(onClose, 720)); // brief success beat, then close
  };
  const handleLater = () => {
    onLater(reward);
    onClose();
  };

  return (
    <Modal visible transparent statusBarTranslucent animationType="fade" onRequestClose={handleLater}>
      <View style={styles.overlay} pointerEvents="auto">
        {phase === 'level' ? (
          <Animated.View style={[styles.splash, splashStyle]}>
            <Text style={styles.splashTitle}>⭐  Level Complete!</Text>
            <View style={styles.coinPill}><Text style={styles.coinText}>+{coins} Coins</Text></View>
          </Animated.View>
        ) : (
          <RewardRevealCard
            item={reward}
            success={phase === 'success'}
            onPrimary={handlePrimary}
            onLater={handleLater}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(8,10,14,0.7)', alignItems: 'center', justifyContent: 'center',
  },
  splash: { alignItems: 'center' },
  splashTitle: { color: '#FFFFFF', fontWeight: '900', fontSize: 26, textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 8 },
  coinPill: {
    marginTop: 14, backgroundColor: '#F5B431', borderRadius: 18, paddingHorizontal: 18, paddingVertical: 9,
    shadowColor: '#F5B431', shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 6 },
  },
  coinText: { color: '#3A2A00', fontWeight: '900', fontSize: 17 },
});
