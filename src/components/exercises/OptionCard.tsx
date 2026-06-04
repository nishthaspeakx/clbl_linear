/**
 * OptionCard — an answer choice. `text` variant is a rounded bar; `image`
 * variant is a square card with a big emoji + label. Visual states:
 *   idle → white card,  correct → green,  wrong → red,  dim → faded.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming,
} from 'react-native-reanimated';

export type OptionState = 'idle' | 'correct' | 'wrong' | 'dim';

interface Props {
  label: string;
  emoji?: string;
  variant?: 'text' | 'image';
  state: OptionState;
  disabled?: boolean;
  onPress: () => void;
}

const COLORS: Record<OptionState, { border: string; bg: string; text: string }> = {
  idle: { border: '#E7E8EB', bg: '#FFFFFF', text: '#2A2E33' },
  correct: { border: '#33A867', bg: '#EAF7EE', text: '#1F8B50' },
  wrong: { border: '#E5484D', bg: '#FDECEC', text: '#C0392B' },
  dim: { border: '#EEEFF1', bg: '#FAFAFB', text: '#B7BCC2' },
};

export default function OptionCard({ label, emoji, variant = 'text', state, disabled, onPress }: Props) {
  const c = COLORS[state];
  const shake = useSharedValue(0);
  React.useEffect(() => {
    if (state === 'wrong') {
      shake.value = withSequence(
        withTiming(-1, { duration: 60 }), withTiming(1, { duration: 60 }),
        withTiming(-1, { duration: 60 }), withTiming(0, { duration: 60, easing: Easing.out(Easing.ease) }),
      );
    }
  }, [state, shake]);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value * 5 }] }));

  if (variant === 'image') {
    return (
      <Animated.View style={[styles.imgWrap, aStyle]}>
        <Pressable onPress={onPress} disabled={disabled} style={[styles.imgCard, { borderColor: c.border, backgroundColor: c.bg }]}>
          <View style={styles.imgInner}><Text style={styles.emoji}>{emoji}</Text></View>
          <Text style={[styles.imgLabel, { color: c.text }]}>{label}</Text>
          {state === 'correct' && <View style={styles.badge}><Text style={styles.badgeT}>✓</Text></View>}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={aStyle}>
      <Pressable onPress={onPress} disabled={disabled} style={[styles.card, { borderColor: c.border, backgroundColor: c.bg }]}>
        <Text style={[styles.label, { color: c.text }]}>{label}</Text>
        {state === 'correct' && <View style={styles.badge}><Text style={styles.badgeT}>✓</Text></View>}
        {state === 'wrong' && <View style={[styles.badge, { backgroundColor: '#E5484D' }]}><Text style={styles.badgeT}>✕</Text></View>}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 60, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 18, paddingVertical: 16, marginVertical: 7,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  label: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  imgWrap: { flex: 1, marginHorizontal: 7 },
  imgCard: {
    borderRadius: 18, borderWidth: 2, alignItems: 'center', paddingVertical: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  imgInner: {
    width: 76, height: 76, borderRadius: 16, backgroundColor: '#F4F6F8',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  emoji: { fontSize: 40 },
  imgLabel: { fontSize: 16, fontWeight: '800' },
  badge: {
    position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#33A867', alignItems: 'center', justifyContent: 'center',
  },
  badgeT: { color: '#FFFFFF', fontWeight: '900', fontSize: 12 },
});
