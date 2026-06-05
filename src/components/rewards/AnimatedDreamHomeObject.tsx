/**
 * AnimatedDreamHomeObject — a placed reward that gently comes alive: flowers
 * sway, pets bob/wag, the fountain shimmers, vehicles get a windshield shine
 * (+ headlight glow at night). Animations are level-gated and kept subtle for
 * performance. Tap to inspect (when interactive).
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { RewardItem } from '../../data/rewardCategories';
import { LifeEffects } from '../../utils/dreamHomeLifeScore';
import { ObjectVisual } from './placedObjects';

const FLOWERS = ['flower_pots', 'rose_garden'];
const PETS = ['pet_dog', 'pet_cat'];
const VEHICLES = ['small_car', 'hatchback', 'sedan', 'suv', 'audi', 'bmw', 'mercedes', 'sports_car', 'auto', 'scooter', 'motorbike', 'cycle'];

type Kind = 'sway' | 'pet' | 'shimmer' | 'vehicle' | 'idle';

function kindFor(item: RewardItem, effects: LifeEffects): Kind {
  if (FLOWERS.includes(item.imageKey)) return 'sway';
  if (PETS.includes(item.imageKey)) return effects.pet ? 'pet' : 'idle';
  if (item.imageKey === 'fountain') return effects.fountain ? 'shimmer' : 'idle';
  if (VEHICLES.includes(item.imageKey)) return 'vehicle';
  return 'idle';
}

interface Props {
  item: RewardItem;
  left: number;
  top: number;
  size: number;
  zIndex: number;
  night: boolean;
  effects: LifeEffects;
  interactive?: boolean;
  onInspect?: (item: RewardItem) => void;
}

export default function AnimatedDreamHomeObject({ item, left, top, size, zIndex, night, effects, interactive, onInspect }: Props) {
  const kind = kindFor(item, effects);
  const phase = useSharedValue(0);
  const shine = useSharedValue(0);
  React.useEffect(() => {
    phase.value = withRepeat(withTiming(1, { duration: kind === 'shimmer' ? 1400 : 2400, easing: Easing.inOut(Easing.ease) }), -1, true);
    if (item.imageKey && VEHICLES.includes(item.imageKey)) {
      shine.value = withRepeat(withSequence(withTiming(1, { duration: 700 }), withTiming(0, { duration: 1900 })), -1, false);
    }
  }, [phase, shine, kind, item.imageKey]);

  const aStyle = useAnimatedStyle(() => {
    const p = phase.value - 0.5;
    if (kind === 'sway') return { transform: [{ rotate: `${p * 6}deg` }] };
    if (kind === 'pet') return { transform: [{ translateY: p * -3 }, { rotate: `${p * 4}deg` }] };
    if (kind === 'shimmer') return { transform: [{ scale: 1 + phase.value * 0.05 }] };
    return { transform: [{ translateY: p * -1.6 }] };
  });
  const shineStyle = useAnimatedStyle(() => ({ opacity: shine.value, transform: [{ scale: 0.6 + shine.value * 0.6 }] }));

  const showShine = VEHICLES.includes(item.imageKey) && effects.vehicleShine;
  const showHeadlight = VEHICLES.includes(item.imageKey) && night;

  const inner = (
    <>
      <Animated.View style={aStyle}>
        <ObjectVisual item={item} size={size} />
      </Animated.View>
      {showShine && (
        <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: size * 0.18, left: size * 0.52 }, shineStyle]}>
          <Svg width={12} height={12} viewBox="0 0 10 10"><Path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" fill="#FFFFFF" /></Svg>
        </Animated.View>
      )}
      {showHeadlight && (
        <View pointerEvents="none" style={[styles.headlight, { top: size * 0.5, left: size * 0.78 }]} />
      )}
    </>
  );

  return interactive && onInspect ? (
    <Pressable onPress={() => onInspect(item)} style={[styles.obj, { left, top, width: size, height: size, zIndex }]}>
      {inner}
    </Pressable>
  ) : (
    <View pointerEvents="none" style={[styles.obj, { left, top, width: size, height: size, zIndex }]}>
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  obj: { position: 'absolute', alignItems: 'center', justifyContent: 'flex-end' },
  headlight: {
    position: 'absolute', width: 7, height: 5, borderRadius: 3, backgroundColor: '#FFE08A',
    shadowColor: '#FFD24A', shadowOpacity: 0.95, shadowRadius: 7, shadowOffset: { width: 0, height: 0 },
  },
});
