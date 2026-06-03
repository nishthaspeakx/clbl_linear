/**
 * AmbientMotion — the animated layer of the town: a drifting bird flock, two
 * pacing pedestrians, and two cars driving along short side-streets (their
 * entry/exit masked by hedges). Rendered inside the world's own <Svg> overlay
 * so it pans with the journey.
 */
import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { G, Rect } from 'react-native-svg';
import { Car, WalkPerson, Bird, Hedge } from './LocationScene';

const AG = Animated.createAnimatedComponent(G);

interface Motion {
  birds: { x: number; y: number; s: number }[];
  cars: { x: number; y: number; span: number; color: string }[];
  walkers: { x: number; y: number; span: number; shirt: string }[];
}

export default function AmbientMotion({ motion }: { motion: Motion }) {
  const { cars, walkers, birds } = motion;

  const car0 = useSharedValue(0);
  const car1 = useSharedValue(0);
  const walk0 = useSharedValue(0);
  const walk1 = useSharedValue(0);
  const drift = useSharedValue(0);
  const bob = useSharedValue(0);

  useEffect(() => {
    car0.value = withRepeat(withTiming(1, { duration: 6500, easing: Easing.linear }), -1, false);
    car1.value = withRepeat(withTiming(1, { duration: 7500, easing: Easing.linear }), -1, false);
    walk0.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.ease) }), -1, true);
    walk1.value = withRepeat(withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
    drift.value = withRepeat(withTiming(1, { duration: 5200, easing: Easing.inOut(Easing.ease) }), -1, true);
    bob.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [car0, car1, walk0, walk1, drift, bob]);

  const car0p = useAnimatedProps(() => ({ transform: `translate(${-cars[0].span / 2 + cars[0].span * car0.value} 0)` }));
  const car1p = useAnimatedProps(() => ({ transform: `translate(${cars[1].span / 2 - cars[1].span * car1.value} 0)` }));
  const walk0p = useAnimatedProps(() => ({ transform: `translate(${(walk0.value - 0.5) * 2 * walkers[0].span} 0)` }));
  const walk1p = useAnimatedProps(() => ({ transform: `translate(${(walk1.value - 0.5) * 2 * walkers[1].span} 0)` }));
  const flockp = useAnimatedProps(() => ({ transform: `translate(${(drift.value - 0.5) * 36} ${(bob.value - 0.5) * 7})` }));

  return (
    <>
      {/* side streets */}
      {cars.map((c, i) => (
        <Rect key={`s${i}`} x={c.x - c.span / 2 - 30} y={c.y - 8} width={c.span + 60} height={16} rx={4} fill="#AEB4BB" opacity={0.7} />
      ))}
      {cars.map((c, i) => (
        <Rect key={`sl${i}`} x={c.x - c.span / 2 - 26} y={c.y - 1} width={c.span + 52} height={2} fill="#FFFFFF" opacity={0.6} />
      ))}
      <AG animatedProps={car0p}>
        <Car x={cars[0].x} y={cars[0].y} color={cars[0].color} />
      </AG>
      <AG animatedProps={car1p}>
        <Car x={cars[1].x} y={cars[1].y} color={cars[1].color} />
      </AG>
      {/* hedges masking the car loop ends */}
      {cars.map((c, i) => (
        <G key={`h${i}`}>
          <Hedge x={c.x - c.span / 2 - 36} y={c.y + 7} w={28} />
          <Hedge x={c.x + c.span / 2 + 8} y={c.y + 7} w={28} />
        </G>
      ))}
      <AG animatedProps={walk0p}>
        <WalkPerson x={walkers[0].x} y={walkers[0].y} shirt={walkers[0].shirt} />
      </AG>
      <AG animatedProps={walk1p}>
        <WalkPerson x={walkers[1].x} y={walkers[1].y} shirt={walkers[1].shirt} />
      </AG>
      <AG animatedProps={flockp}>
        {birds.map((b, i) => (
          <Bird key={`b${i}`} x={b.x} y={b.y} s={b.s} />
        ))}
      </AG>
    </>
  );
}
