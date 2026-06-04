/**
 * CoinTrail — the row of collectible coins laid along the road between the
 * current level and the next. Coins with index < `collected` have already been
 * picked up (a FlyingCoin carries them to the counter) so we simply stop
 * rendering them; the rest gently bob to invite the walk.
 */
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse } from 'react-native-svg';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export interface TrailCoinWorld {
  index: number;
  x: number;
  y: number;
  value: number;
}

function Coin({ x, y, phase }: { x: number; y: number; phase: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [t]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: (t.value - 0.5) * 4 }, { scale: 0.94 + t.value * 0.12 }],
  }));
  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { left: x - 13, top: y - 13 }, style]}>
      <Svg width={26} height={26} viewBox="0 0 26 26">
        <Ellipse cx={13} cy={23} rx={7} ry={2} fill="#000" opacity={0.12} />
        <Circle cx={13} cy={12} r={9} fill="#FFD24C" stroke="#E8A317" strokeWidth={2} />
        <Circle cx={13} cy={12} r={4.6} fill="#FFE9A8" />
      </Svg>
    </Animated.View>
  );
}

export default function CoinTrail({ coins, collected }: { coins: TrailCoinWorld[]; collected: number }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {coins.filter((c) => c.index >= collected).map((c) => (
        <Coin key={c.index} x={c.x} y={c.y} phase={c.index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', width: 26, height: 26 },
});
