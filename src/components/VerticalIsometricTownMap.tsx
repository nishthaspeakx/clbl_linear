/**
 * VerticalIsometricTownMap — the long vertical isometric journey (lessons 1–20).
 *
 * One continuous winding road climbs from lesson 1 (bottom) to lesson 20 (top).
 * Each lesson has a rich, bespoke isometric SCENE (LocationScene) placed in the
 * left / right / centre gutter beside its pin. Topics tint the ground and carry
 * a small roadside signboard. Character walks only on the road.
 *
 * Layers (back → front): ground bands → road → scenes → coins → topic signs →
 * lesson pins → character.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';

import { LAYOUT, WORLD_W, WORLD_H } from '../utils/mapLayout';
import { clamp } from '../utils/position';
import LocationScene, {
  Coin, WorldTree, Bush, Flower, Hedge, WorldLamp, Pond, FlowerBed, WorldBench, Car,
  Skyline, Stars, NightContext, MiniShop, Scooter, Cycle, Monument, Fountain,
} from './LocationScene';
import AmbientMotion from './AmbientMotion';
import LessonPin, { PinStatus } from './LessonPin';
import CharacterAvatar from './CharacterAvatar';
import LevelLabel from './map/LevelLabel';
import CoinTrail from './map/CoinTrail';
import { visibleLabels } from '../utils/labelPlacement';
import { SUBTOPICS, TOTAL_SUBTOPICS } from '../data/subtopics';
import { samplePath } from '../utils/pathInterpolation';
import { VIEWPORT_W, VIEWPORT_H } from '../utils/viewport';

const MIN_Y = Math.min(0, VIEWPORT_H - WORLD_H);

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  statusOf: (id: number) => PinStatus;
  onPinPress: (id: number) => void;
  night: boolean;
  translateY: SharedValue<number>;
  charX: SharedValue<number>;
  charY: SharedValue<number>;
  walking: SharedValue<number>;
  avatar: { userType: import('../data/avatarProfiles').UserType; gender: import('../data/avatarProfiles').Gender; age: number };
  currentId: number;
  completedIds: number[];
  /** Coins laid along the road during a level-completion walk. */
  coinTrail?: { index: number; x: number; y: number; value: number }[];
  /** How many of those coins have been collected so far. */
  coinsCollected?: number;
}

// Draw nearer scenes (larger oy) on top of farther ones.
const SCENES = [...LAYOUT.scenes].sort((a, b) => a.oy - b.oy);

function VerticalIsometricTownMap({ statusOf, onPinPress, night, translateY, charX, charY, walking, avatar, currentId, completedIds, coinTrail, coinsCollected = 0 }: Props) {
  const press = onPinPress;
  const savedY = useSharedValue(translateY.value);
  const pan = Gesture.Pan()
    .onStart(() => {
      savedY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = clamp(savedY.value + e.translationY, MIN_Y, 0);
    });

  const worldStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  const shift = useSharedValue(0);
  React.useEffect(() => {
    shift.value = withRepeat(withTiming(-30, { duration: 1000, easing: Easing.linear }), -1, false);
  }, [shift]);
  const dotsProps = useAnimatedProps(() => ({ strokeDashoffset: shift.value }));

  return (
    <NightContext.Provider value={night}>
    <GestureDetector gesture={pan}>
      <View style={[styles.viewport, night && { backgroundColor: '#1F2540' }]}>
        <Animated.View style={[styles.world, worldStyle]}>
          <Svg width={WORLD_W} height={WORLD_H} style={StyleSheet.absoluteFill} pointerEvents="none">
            <Defs>
              {LAYOUT.zones.map((z) => (
                <LinearGradient key={`zg${z.topicIndex}`} id={`zone${z.topicIndex}`} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={night ? '#3A4268' : z.groundTop} />
                  <Stop offset="1" stopColor={night ? '#2A3052' : z.groundBottom} />
                </LinearGradient>
              ))}
            </Defs>

            {/* Ground bands */}
            {LAYOUT.zones.map((z) => (
              <Path key={`zr${z.topicIndex}`} d={`M0 ${z.top} H ${WORLD_W} V ${z.bottom} H 0 Z`} fill={`url(#zone${z.topicIndex})`} />
            ))}

            {/* Night stars */}
            {night && <Stars width={WORLD_W} height={WORLD_H} />}

            {/* Per-topic distant skyline backdrops */}
            {LAYOUT.zones.map((z) => (
              <Skyline key={`sky${z.topicIndex}`} yBase={z.top + 120} width={WORLD_W} accent={z.accent} night={night} />
            ))}

            {/* Road — pavement border → kerb → asphalt → markings */}
            <Path d={LAYOUT.roadPath} stroke={night ? '#3D4360' : '#D8D2C2'} strokeWidth={86} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d={LAYOUT.roadPath} stroke={night ? '#4A506E' : '#ECE6D6'} strokeWidth={74} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d={LAYOUT.roadPath} stroke={night ? '#5A607A' : '#9FA6AD'} strokeWidth={62} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d={LAYOUT.roadPath} stroke={night ? '#737A96' : '#C9CFD5'} strokeWidth={52} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d={LAYOUT.roadPath} stroke="#FFFFFF" strokeWidth={4} fill="none" strokeDasharray="18 22" opacity={night ? 0.55 : 0.85} />
            <AnimatedPath d={LAYOUT.roadPath} stroke="#FFD24C" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray="2 26" animatedProps={dotsProps} />

            {/* Zebra crossings near each pin */}
            {LAYOUT.lessons.map((l) => (
              <React.Fragment key={`zx${l.id}`}>
                {[-21, -10.5, 0, 10.5, 21].map((dx, j) => (
                  <Path key={j} d={`M ${l.px + dx} ${l.py + 30} h 6`} stroke="#FFFFFF" strokeWidth={7} opacity={night ? 0.5 : 0.8} strokeLinecap="butt" transform={`rotate(0 ${l.px} ${l.py})`} />
                ))}
              </React.Fragment>
            ))}

            {/* Clouds (day) */}
            {!night && (
              <>
                <Ellipse cx={WORLD_W * 0.22} cy={70} rx={46} ry={16} fill="#FFFFFF" opacity={0.7} />
                <Ellipse cx={WORLD_W * 0.3} cy={60} rx={30} ry={13} fill="#FFFFFF" opacity={0.7} />
                <Ellipse cx={WORLD_W * 0.78} cy={120} rx={40} ry={15} fill="#FFFFFF" opacity={0.6} />
              </>
            )}
            {/* Moon (night) */}
            {night && (
              <>
                <Circle cx={WORLD_W * 0.8} cy={90} r={26} fill="#FFF7D6" opacity={0.2} />
                <Circle cx={WORLD_W * 0.8} cy={90} r={16} fill="#FFF7D6" />
                <Circle cx={WORLD_W * 0.85} cy={86} r={14} fill="#2A3052" />
              </>
            )}

            {/* Ambient greenery / props so the whole town is filled and varied */}
            {LAYOUT.decor.map((d, i) => {
              switch (d.kind) {
                case 'bush': return <Bush key={`d${i}`} x={d.x} y={d.y} s={d.s} />;
                case 'flower': return <Flower key={`d${i}`} x={d.x} y={d.y} s={d.s} color={d.color} />;
                case 'lamp': return <WorldLamp key={`d${i}`} x={d.x} y={d.y} s={d.s} />;
                case 'hedge': return <Hedge key={`d${i}`} x={d.x} y={d.y} w={d.w} s={d.s} />;
                case 'pond': return <Pond key={`d${i}`} x={d.x} y={d.y} s={d.s} />;
                case 'flowerbed': return <FlowerBed key={`d${i}`} x={d.x} y={d.y} s={d.s} />;
                case 'bench': return <WorldBench key={`d${i}`} x={d.x} y={d.y} s={d.s} />;
                case 'car': return <Car key={`d${i}`} x={d.x} y={d.y} s={d.s} color={d.color} />;
                case 'scooter': return <Scooter key={`d${i}`} x={d.x} y={d.y} s={d.s} color={d.color} />;
                case 'cycle': return <Cycle key={`d${i}`} x={d.x} y={d.y} s={d.s} color={d.color} />;
                case 'monument': return <Monument key={`d${i}`} x={d.x} y={d.y} s={d.s} />;
                case 'fountain': return <Fountain key={`d${i}`} x={d.x} y={d.y} s={d.s} />;
                case 'shop':
                  return d.shop ? (
                    <MiniShop key={`d${i}`} x={d.x} y={d.y} s={d.s} label={d.shop.label} wall={d.shop.wall} roof={d.shop.roof} person={d.shop.person} />
                  ) : null;
                default: return <WorldTree key={`d${i}`} x={d.x} y={d.y} s={d.s} />;
              }
            })}

            {/* Rich per-location scenes */}
            {SCENES.map((sc) => (
              <LocationScene key={`sc${sc.id}`} scene={sc} />
            ))}

            {/* Coins along the road */}
            {LAYOUT.coins.map((c, i) => (
              <Coin key={`c${i}`} x={c.x} y={c.y} star={c.star} />
            ))}

          </Svg>

          {/* Animated layer: cars, pedestrians, bird flock */}
          <Svg width={WORLD_W} height={WORLD_H} style={StyleSheet.absoluteFill} pointerEvents="none">
            <AmbientMotion motion={LAYOUT.motion} />
            {/* Day-warm / night-cool wash over everything */}
            <Defs>
              <LinearGradient id="wash" x1="0" y1="0" x2="0.5" y2="1">
                {night
                  ? [
                      <Stop key="0" offset="0" stopColor="#1A2348" stopOpacity={0.42} />,
                      <Stop key="1" offset="0.5" stopColor="#2A3360" stopOpacity={0.26} />,
                      <Stop key="2" offset="1" stopColor="#0E1430" stopOpacity={0.4} />,
                    ]
                  : [
                      <Stop key="0" offset="0" stopColor="#FFE7B8" stopOpacity={0.2} />,
                      <Stop key="1" offset="0.45" stopColor="#FFF4DE" stopOpacity={0.04} />,
                      <Stop key="2" offset="1" stopColor="#FFB877" stopOpacity={0.1} />,
                    ]}
              </LinearGradient>
            </Defs>
            <Path d={`M0 0 H ${WORLD_W} V ${WORLD_H} H 0 Z`} fill="url(#wash)" />
          </Svg>

          {/* Light direction chevrons on the CURRENT → NEXT segment (kept subtle
              so the road stays as light as before — no heavy/dark overlay). */}
          {currentId < TOTAL_SUBTOPICS && (
            <Svg width={WORLD_W} height={WORLD_H} style={StyleSheet.absoluteFill} pointerEvents="none">
              {(() => {
                const { pts } = samplePath(currentId, currentId + 1, 16);
                return [0.36, 0.58, 0.8].map((tt, k) => {
                  const i = Math.min(pts.length - 2, Math.floor(tt * (pts.length - 1)));
                  const p = pts[i];
                  const ang = (Math.atan2(pts[i + 1].y - p.y, pts[i + 1].x - p.x) * 180) / Math.PI + 90;
                  return (
                    <Path key={k} d="M -5 3 L 0 -3 L 5 3" fill="none" stroke="#FF9A3D" strokeWidth={2.2}
                      strokeLinecap="round" strokeLinejoin="round" opacity={0.45}
                      transform={`translate(${p.x} ${p.y}) rotate(${ang})`} />
                  );
                });
              })()}
            </Svg>
          )}

          {/* Collectible coin trail (during a level-completion walk) */}
          {coinTrail && coinTrail.length > 0 && (
            <CoinTrail coins={coinTrail} collected={coinsCollected} />
          )}

          {/* Lesson pins (on the road) */}
          {LAYOUT.lessons.map((l) => (
            <LessonPin key={l.id} id={l.id} cx={l.px} cy={l.py} status={statusOf(l.id)} onPress={press} />
          ))}

          {/* Subtopic + location labels — only current, previous & next */}
          {visibleLabels(currentId, completedIds).map((L) => {
            const l = LAYOUT.lessons[L.id - 1];
            const sub = SUBTOPICS[L.id - 1];
            const compact = L.variant === 'compact';
            const cardH = compact ? 40 : 50;
            const gap = 22;
            const vOff = L.status === 'current' ? -32 : -6;
            const innerX = L.side === 'right' ? l.px + gap : l.px - gap;
            const innerY = l.py + vOff;
            const top = innerY - cardH / 2;
            const conn = L.status === 'current' ? '#FF7A00' : L.status === 'completed' ? '#33A867' : '#C7CDD3';
            const dx = innerX - l.px;
            const dy = innerY - l.py;
            const len = Math.hypot(dx, dy);
            const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
            const cmx = (l.px + innerX) / 2;
            const cmy = (l.py + innerY) / 2;
            const wrap = L.side === 'right'
              ? { position: 'absolute' as const, left: l.px + gap, top }
              : { position: 'absolute' as const, right: WORLD_W - (l.px - gap), top };
            return (
              <React.Fragment key={`lbl${L.id}`}>
                <View pointerEvents="none" style={{ position: 'absolute', left: cmx - len / 2, top: cmy - 1, width: len, height: 2, backgroundColor: conn, opacity: 0.5, borderRadius: 1, transform: [{ rotate: `${ang}deg` }] }} />
                <View style={wrap}>
                  <LevelLabel id={L.id} title={sub.title} location={sub.location} status={L.status} compact={compact} onPress={() => press(L.id)} />
                </View>
              </React.Fragment>
            );
          })}

          {/* Character */}
          <CharacterAvatar x={charX} y={charY} walking={walking} userType={avatar.userType} gender={avatar.gender} age={avatar.age} />
        </Animated.View>
      </View>
    </GestureDetector>
    </NightContext.Provider>
  );
}

const styles = StyleSheet.create({
  viewport: { width: VIEWPORT_W, height: VIEWPORT_H, overflow: 'hidden', backgroundColor: '#DCEBD6' },
  world: { width: WORLD_W, height: WORLD_H },
});

export default VerticalIsometricTownMap;
