/**
 * PerspectivePathWorld — the Fable/Mythos-style moving world.
 *
 * Same game, new motion: the avatar stays anchored near the bottom-centre and
 * the WORLD travels underneath it. A curved road recedes in perspective to a
 * soft horizon (sky, mountains, haze); lesson pins ride the road and slide
 * toward the player as the journey scrolls; roadside props give depth.
 *
 * Drop-in replacement for VerticalIsometricTownMap — accepts the SAME props
 * (pins, labels, avatar, states, handlers, data are all reused untouched).
 * `translateY` / `charX` / `charY` / `coinTrail` are accepted but unused: this
 * layer owns its own camera (`journey`) which follows `currentId` with smooth
 * easing whenever a level is completed.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { VIEWPORT_W, VIEWPORT_H } from '../utils/viewport';
import {
  ANCHOR_T, ANCHOR_Y, CENTER_X, HORIZON_Y, PIN_AHEAD,
  DecorItem, decorBetween, depthForOffset, roadBodyPath, roadCenterPath,
  roadCenterX, roadHalfWidth, sampleRoad, scaleForDepth, yForDepth,
} from '../utils/perspectivePath';
import { SUBTOPICS, TOTAL_SUBTOPICS } from '../data/subtopics';
import { topicZoneOf } from '../data/topicZones';
import { locationScenes } from '../data/locationScenes';
import { visibleLabels } from '../utils/labelPlacement';
import LessonPin, { PinStatus } from './LessonPin';
import LevelLabel from './map/LevelLabel';
import CharacterAvatar from './CharacterAvatar';
import LocationScene, { NightContext } from './LocationScene';

const JOURNEY_MIN = 1 - PIN_AHEAD;
const JOURNEY_MAX = TOTAL_SUBTOPICS - PIN_AHEAD;
const TRAVEL_MS = 1900; // leisurely travel — the longer distance should be felt

interface Props {
  statusOf: (id: number) => PinStatus;
  onPinPress: (id: number) => void;
  night: boolean;
  translateY: SharedValue<number>; // unused (classic camera) — kept for drop-in parity
  charX: SharedValue<number>;      // unused (classic walk)
  charY: SharedValue<number>;      // unused (classic walk)
  walking: SharedValue<number>;
  avatar: { userType: import('../data/avatarProfiles').UserType; gender: import('../data/avatarProfiles').Gender; age: number };
  equipped?: import('../data/rewards').EquipKey[];
  outfit?: Partial<import('./avatar/AvatarFigure').AvatarStyle>;
  currentId: number;
  completedIds: number[];
  coinTrail?: { index: number; x: number; y: number; value: number }[]; // unused
  coinsCollected?: number; // unused
}

const easeInOutCubic = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const clampJ = (v: number) => Math.max(JOURNEY_MIN, Math.min(JOURNEY_MAX, v));

/** Camera distance along the road; follows `target` with eased RAF animation.
 * `pulse` (0→1→0 across a travel) drives a subtle camera zoom for premium feel. */
function useJourney(target: number) {
  const [journey, setJourneyState] = React.useState(() => clampJ(target));
  const [pulse, setPulse] = React.useState(0);
  const [traveling, setTraveling] = React.useState(false);
  const jRef = React.useRef(journey);
  const raf = React.useRef<number | null>(null);

  const stop = React.useCallback(() => {
    if (raf.current != null) { cancelAnimationFrame(raf.current); raf.current = null; }
    setPulse(0);
    setTraveling(false);
  }, []);

  const set = React.useCallback((v: number) => {
    stop();
    jRef.current = clampJ(v);
    setJourneyState(jRef.current);
  }, [stop]);

  const animateTo = React.useCallback((to: number, dur?: number) => {
    stop();
    const from = jRef.current;
    const dest = clampJ(to);
    const d = Math.abs(dest - from);
    if (d < 0.001) return;
    const ms = dur ?? Math.max(900, Math.min(1800, 700 + d * 520));
    const t0 = Date.now();
    setTraveling(true);
    const tick = () => {
      const p = Math.min(1, (Date.now() - t0) / ms);
      jRef.current = from + (dest - from) * easeInOutCubic(p);
      setJourneyState(jRef.current);
      setPulse(Math.sin(Math.PI * p));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else { raf.current = null; setPulse(0); setTraveling(false); }
    };
    raf.current = requestAnimationFrame(tick);
  }, [stop]);

  React.useEffect(() => () => stop(), [stop]);
  return { journey, pulse, traveling, jRef, set, animateTo };
}

// ── Soft decorative props (drawn small, scaled by depth) ────────────────────

function Prop({ d, x, y, k, night }: { d: DecorItem; x: number; y: number; k: number; night: boolean }) {
  const s = d.size * k;
  const dim = night ? 0.72 : 1;
  switch (d.kind) {
    case 'pine': {
      const g1 = night ? '#3E5A52' : ['#4E9A62', '#3F8A55', '#5BA64E'][Math.floor(d.hue * 3)];
      return (
        <>
          <Ellipse cx={x} cy={y + 2 * s} rx={13 * s} ry={4 * s} fill="#000" opacity={0.1} />
          <Rect x={x - 2.4 * s} y={y - 8 * s} width={4.8 * s} height={9 * s} rx={1.6 * s} fill={night ? '#4B4036' : '#8A6643'} />
          <Path d={`M ${x} ${y - 44 * s} L ${x + 13 * s} ${y - 18 * s} L ${x - 13 * s} ${y - 18 * s} Z`} fill={g1} opacity={dim} />
          <Path d={`M ${x} ${y - 32 * s} L ${x + 16 * s} ${y - 6 * s} L ${x - 16 * s} ${y - 6 * s} Z`} fill={g1} opacity={0.92 * dim} />
        </>
      );
    }
    case 'tree': {
      const g = night ? '#41635A' : ['#67B36A', '#57A75E', '#74BD6F'][Math.floor(d.hue * 3)];
      return (
        <>
          <Ellipse cx={x} cy={y + 2 * s} rx={14 * s} ry={4.4 * s} fill="#000" opacity={0.1} />
          <Rect x={x - 2.6 * s} y={y - 12 * s} width={5.2 * s} height={13 * s} rx={2 * s} fill={night ? '#4B4036' : '#8A6643'} />
          <Circle cx={x} cy={y - 24 * s} r={15 * s} fill={g} opacity={dim} />
          <Circle cx={x - 9 * s} cy={y - 17 * s} r={10 * s} fill={g} opacity={0.94 * dim} />
          <Circle cx={x + 9 * s} cy={y - 17 * s} r={10 * s} fill={g} opacity={0.94 * dim} />
        </>
      );
    }
    case 'bush': {
      const g = night ? '#3C5B50' : '#7CC077';
      return (
        <>
          <Ellipse cx={x} cy={y + 1.5 * s} rx={12 * s} ry={3.6 * s} fill="#000" opacity={0.08} />
          <Ellipse cx={x} cy={y - 5 * s} rx={12 * s} ry={7.5 * s} fill={g} opacity={dim} />
          <Ellipse cx={x - 7 * s} cy={y - 3 * s} rx={7 * s} ry={5 * s} fill={g} opacity={0.9 * dim} />
        </>
      );
    }
    case 'rock':
      return (
        <>
          <Ellipse cx={x} cy={y + 1.2 * s} rx={9 * s} ry={2.8 * s} fill="#000" opacity={0.08} />
          <Path d={`M ${x - 8 * s} ${y} Q ${x - 7 * s} ${y - 9 * s} ${x} ${y - 9.5 * s} Q ${x + 8 * s} ${y - 8 * s} ${x + 8 * s} ${y} Z`} fill={night ? '#5A6378' : '#B9C0BC'} />
          <Path d={`M ${x - 4 * s} ${y - 8 * s} Q ${x} ${y - 10 * s} ${x + 4 * s} ${y - 7.5 * s}`} stroke={night ? '#6B7590' : '#D5DBD6'} strokeWidth={2 * s} fill="none" />
        </>
      );
    default: { // flower
      const c = ['#E0699A', '#E0A526', '#7E6BD0', '#E0764B'][Math.floor(d.hue * 4)];
      return (
        <>
          <Rect x={x - 0.9 * s} y={y - 9 * s} width={1.8 * s} height={9 * s} fill={night ? '#3C5B50' : '#5BA64E'} />
          <Circle cx={x} cy={y - 11 * s} r={4 * s} fill={c} opacity={night ? 0.8 : 1} />
          <Circle cx={x} cy={y - 11 * s} r={1.6 * s} fill="#FFF3D6" />
        </>
      );
    }
  }
}

/** Static sky band: gradient, sun/moon, clouds, mountain ranges, horizon haze. */
const SkyBand = React.memo(function SkyBand({ night }: { night: boolean }) {
  const W = VIEWPORT_W;
  const H = HORIZON_Y;
  return (
    <Svg width={W} height={H + 70} style={{ position: 'absolute', top: 0, left: 0 }} pointerEvents="none">
      <Defs>
        <LinearGradient id="ppw_sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={night ? '#141C3D' : '#9ED4F0'} />
          <Stop offset="1" stopColor={night ? '#2A3565' : '#DDF1FA'} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={W} height={H} fill="url(#ppw_sky)" />

      {night ? (
        <>
          {[[40, 38], [96, 84], [170, 30], [238, 96], [305, 52], [368, 110], [410, 40], [140, 130], [275, 140], [60, 150]].map(([sx, sy], i) => (
            <Circle key={i} cx={sx} cy={sy * 0.9} r={i % 3 === 0 ? 1.8 : 1.1} fill="#FFF7D6" opacity={0.85} />
          ))}
          <Circle cx={W * 0.78} cy={64} r={24} fill="#FFF7D6" opacity={0.16} />
          <Circle cx={W * 0.78} cy={64} r={15} fill="#FFF7D6" />
          <Circle cx={W * 0.83} cy={60} r={13} fill="#2A3565" />
        </>
      ) : (
        <>
          <Circle cx={W * 0.8} cy={62} r={30} fill="#FFE9A8" opacity={0.45} />
          <Circle cx={W * 0.8} cy={62} r={19} fill="#FFD96B" />
          <Ellipse cx={W * 0.24} cy={64} rx={42} ry={14} fill="#FFFFFF" opacity={0.85} />
          <Ellipse cx={W * 0.31} cy={54} rx={26} ry={11} fill="#FFFFFF" opacity={0.85} />
          <Ellipse cx={W * 0.62} cy={108} rx={34} ry={11} fill="#FFFFFF" opacity={0.7} />
        </>
      )}

      {/* far mountain range */}
      <Path
        d={`M 0 ${H} L 0 ${H - 64} L 56 ${H - 96} L 110 ${H - 58} L 168 ${H - 104} L 224 ${H - 56} L 286 ${H - 92} L 348 ${H - 50} L 402 ${H - 84} L ${W} ${H - 52} L ${W} ${H} Z`}
        fill={night ? '#26315A' : '#AFCBE8'}
      />
      {!night && (
        <>
          <Path d={`M 150 ${H - 88} L 168 ${H - 104} L 186 ${H - 86} L 168 ${H - 80} Z`} fill="#E9F3FB" />
          <Path d={`M 40 ${H - 84} L 56 ${H - 96} L 72 ${H - 80} L 56 ${H - 76} Z`} fill="#E9F3FB" />
        </>
      )}
      {/* near soft hills */}
      <Path
        d={`M 0 ${H} L 0 ${H - 30} Q 70 ${H - 58} 150 ${H - 30} Q 230 ${H - 6} 306 ${H - 34} Q 378 ${H - 58} ${W} ${H - 26} L ${W} ${H} Z`}
        fill={night ? '#2E3A60' : '#BFE3B4'}
      />
      {/* tiny pines on the hill line */}
      {!night && [36, 120, 208, 296, 388].map((px, i) => (
        <Path key={i} d={`M ${px} ${H - 30} l 6 14 h -12 Z`} fill="#7FB877" opacity={0.9} />
      ))}
      {/* horizon haze blending ground into the distance */}
      <Defs>
        <LinearGradient id="ppw_haze" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={night ? '#2A3565' : '#FFFFFF'} stopOpacity={night ? 0.55 : 0.85} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={H} width={W} height={64} fill="url(#ppw_haze)" />
    </Svg>
  );
});

function PerspectivePathWorld({
  statusOf, onPinPress, night, walking, avatar, equipped = [], outfit, currentId, completedIds,
}: Props) {
  const targetJourney = clampJ(currentId - PIN_AHEAD);
  const { journey, pulse, traveling, jRef, set, animateTo } = useJourney(targetJourney);

  // The world drives the walk: the avatar strides for the FULL travel (which
  // may outlast the screen's classic walk timer), then settles to idle.
  const travelWalk = useSharedValue(0);
  React.useEffect(() => { travelWalk.value = traveling ? 1 : 0; }, [traveling, travelWalk]);

  // Follow level progress with a smooth travel (the world moves, not the avatar).
  const lastTarget = React.useRef(targetJourney);
  React.useEffect(() => {
    if (Math.abs(targetJourney - lastTarget.current) < 0.001) return;
    const big = Math.abs(targetJourney - jRef.current) > 3; // reset / long jump
    lastTarget.current = targetJourney;
    animateTo(targetJourney, big ? 1500 : TRAVEL_MS);
  }, [targetJourney, animateTo, jRef]);

  // Peek gesture: drag to look back/ahead, rubber-band home on release.
  const panBase = React.useRef(0);
  const pan = React.useMemo(() => Gesture.Pan()
    .runOnJS(true)
    .onStart(() => { panBase.current = jRef.current; })
    .onUpdate((e) => { set(panBase.current + -e.translationY / 230); })
    .onEnd(() => { animateTo(clampJ(currentId - PIN_AHEAD)); }),
  [set, animateTo, currentId, jRef]);

  // ── Per-frame world geometry (plain numbers; React state drives the frame) ──
  const samples = sampleRoad(journey);
  const zone = topicZoneOf(SUBTOPICS[Math.max(1, Math.min(TOTAL_SUBTOPICS, Math.round(journey + PIN_AHEAD))) - 1].topicIndex);

  const decor = decorBetween(journey - 2, journey + 9)
    .map((d) => {
      const t = depthForOffset(d.s - journey);
      if (t < -0.02 || t > 0.92) return null;
      const x = roadCenterX(d.s, t) + d.side * (roadHalfWidth(t) + d.margin * (1 - t) + 14);
      if (x < -20 || x > VIEWPORT_W + 20) return null;
      return { d, t, x, y: yForDepth(t), k: scaleForDepth(t) };
    })
    .filter(Boolean) as { d: DecorItem; t: number; x: number; y: number; k: number }[];
  decor.sort((a, b) => b.t - a.t); // far → near

  // ONE destination at a time: only the current pin + the next locked pin are
  // ever rendered. Everything further stays undiscovered; just-completed pins
  // fade as they slip behind the player.
  const pins = SUBTOPICS.map((s) => {
    if (s.id > currentId + 1) return null; // current + next only
    const u = s.id - journey;
    const t = depthForOffset(u);
    if (t < -0.02 || t > 0.945) return null;
    const fade = u >= -0.25 ? 1 : Math.max(0, 1 - (-u - 0.25) / 0.5); // recede-fade behind
    if (fade <= 0.02) return null;
    return { id: s.id, u, t, x: roadCenterX(s.id, t), y: yForDepth(t), k: scaleForDepth(t), fade };
  }).filter(Boolean) as { id: number; u: number; t: number; x: number; y: number; k: number; fade: number }[];
  pins.sort((a, b) => b.t - a.t); // far first → near pins draw (and press) on top

  // Destination PLACES: each level's existing LocationScene artwork rides the
  // road beside its pin — appearing in the distance, growing as you approach,
  // and sliding behind once passed ("the road takes you into the place").
  const sceneItems = locationScenes
    .filter((sc) => sc.id <= currentId + 1)
    .map((sc) => {
      const u = sc.id - journey;
      if (u < -1.2 || u > 1.5) return null; // the place you're at + the one ahead
      const t = depthForOffset(u);
      if (t < -0.05) return null;
      const k = 0.84 * Math.pow(scaleForDepth(t), 1.25);
      const W = 220 * k;
      const H = 170 * k;
      const xPin = roadCenterX(sc.id, t);
      const y = yForDepth(t);
      let cx: number;
      if (sc.side === 'center') cx = xPin; // town square / gate straddle the road
      else if (sc.side === 'left') cx = xPin - (roadHalfWidth(t) + W / 2 + 6 * (1 - t));
      else cx = xPin + (roadHalfWidth(t) + W / 2 + 6 * (1 - t));
      const oy = sc.side === 'center' ? y - H - 30 * k : y - H + 16 * k;
      // discovered, not permanent: silhouette far away → grows + sharpens on
      // approach → full beside the player → slips away behind
      let op = 1;
      if (u > 0.45) op = Math.max(0.18, Math.min(1, (1.5 - u) / 1.05));
      if (u < -0.4) op = Math.max(0, 1 - (-u - 0.4) / 0.8);
      return { sc, t, ox: cx - W / 2, oy, k, op };
    })
    .filter(Boolean) as { sc: (typeof locationScenes)[number]; t: number; ox: number; oy: number; k: number; op: number }[];
  sceneItems.sort((a, b) => b.t - a.t);

  // Labels: only the current node and the single upcoming destination.
  const labels = visibleLabels(currentId, completedIds)
    .map((L) => {
      const p = pins.find((q) => q.id === L.id);
      if (!p || p.t < 0 || p.u < -0.25 || p.u > 1.5) return null;
      return { L, p };
    })
    .filter(Boolean) as { L: ReturnType<typeof visibleLabels>[number]; p: { id: number; u: number; t: number; x: number; y: number; k: number; fade: number } }[];

  // Avatar anchored: x follows the road's bend at the anchor depth.
  const avatarX = roadCenterX(journey, ANCHOR_T);
  const zeroX = useSharedValue(0);
  const zeroY = useSharedValue(0);

  const groundTop = night ? '#3A4268' : zone.groundTop;
  const groundBottom = night ? '#2A3052' : zone.groundBottom;

  return (
    <NightContext.Provider value={night}>
    <GestureDetector gesture={pan}>
      <View style={[styles.viewport, { backgroundColor: night ? '#1F2540' : '#DCEBD6' }]}>
       {/* Camera: subtle zoom-in pulse mid-travel for a premium dolly feel */}
       <View style={[StyleSheet.absoluteFill, { transform: [{ scale: 1 + pulse * 0.045 }] }]}>
        {/* Ground */}
        <Svg width={VIEWPORT_W} height={VIEWPORT_H} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <LinearGradient id="ppw_ground" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={groundTop} />
              <Stop offset="1" stopColor={groundBottom} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={HORIZON_Y - 2} width={VIEWPORT_W} height={VIEWPORT_H - HORIZON_Y + 2} fill="url(#ppw_ground)" />

          {/* Road (border → body → dashes) */}
          <Path d={roadBodyPath(samples.map((p) => ({ ...p, half: p.half + 3 + 5 * (1 - p.t) })))} fill={night ? '#3D4360' : '#E2D8BE'} />
          <Path d={roadBodyPath(samples)} fill={night ? '#4A506E' : '#F4EDDA'} />
          <Path
            d={roadCenterPath(samples)}
            stroke={night ? 'rgba(255,255,255,0.5)' : '#FFFFFF'}
            strokeWidth={4.5}
            strokeDasharray="14 18"
            fill="none"
            strokeLinecap="round"
          />

          {/* Roadside props */}
          {decor.map((it) => (
            <Prop key={it.d.key} d={it.d} x={it.x} y={it.y} k={it.k} night={night} />
          ))}
        </Svg>

        {/* Destination places — the level's existing scene artwork, reused
            untouched, anchored beside (or straddling) the road at its pin */}
        <Svg width={VIEWPORT_W} height={VIEWPORT_H} style={StyleSheet.absoluteFill} pointerEvents="none">
          {sceneItems.map((it) => (
            <G key={`scene${it.sc.id}`} opacity={it.op}>
              <LocationScene scene={{ id: it.sc.id, sceneType: it.sc.sceneType, side: it.sc.side, ox: it.ox, oy: it.oy, s: it.k }} />
            </G>
          ))}
        </Svg>

        {/* Sky band drawn over the ground top edge (mountains + haze) */}
        <SkyBand night={night} />

        {/* Lesson pins (far → near), scaled by depth */}
        {pins.map((p) => (
          <View
            key={`pin${p.id}`}
            style={{ position: 'absolute', left: p.x - 60, top: p.y - 60, width: 120, height: 120, opacity: p.fade, transform: [{ scale: p.k }] }}
            pointerEvents={p.fade < 0.55 ? 'none' : 'auto'}
          >
            <LessonPin id={p.id} cx={60} cy={60} status={statusOf(p.id)} onPress={onPinPress} />
          </View>
        ))}

        {/* Level labels (current / prev / next) attached to their pins */}
        {labels.map(({ L, p }) => {
          const sub = SUBTOPICS[L.id - 1];
          const compact = L.variant === 'compact';
          const k = Math.max(0.78, Math.min(1.04, 0.72 + (1 - p.t) * 0.5));
          const gap = (26 + 24 * (1 - p.t)) * k;
          const cardH = (compact ? 40 : 50) * k;
          const vOff = L.status === 'current' ? -30 * k : -4;
          const top = p.y + vOff - cardH / 2;
          const conn = L.status === 'current' ? '#FF7A00' : L.status === 'completed' ? '#33A867' : '#C7CDD3';
          const onRight = L.side === 'right' ? p.x < VIEWPORT_W - 170 : p.x < 120;
          const wrap = onRight
            ? { position: 'absolute' as const, left: p.x + gap, top }
            : { position: 'absolute' as const, right: VIEWPORT_W - (p.x - gap), top };
          return (
            <React.Fragment key={`lbl${L.id}`}>
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: onRight ? p.x : p.x - gap,
                  top: p.y + vOff - 1,
                  width: gap,
                  height: 2,
                  backgroundColor: conn,
                  opacity: 0.5,
                  borderRadius: 1,
                }}
              />
              <View style={[wrap, { transform: [{ scale: k }] }]}>
                <LevelLabel id={L.id} title={sub.title} location={sub.location} status={L.status} compact={compact} onPress={() => onPinPress(L.id)} />
              </View>
            </React.Fragment>
          );
        })}

        {/* Anchored avatar — the world moves, the traveller stays */}
        <View pointerEvents="none" style={{ position: 'absolute', left: avatarX, top: ANCHOR_Y }}>
          <CharacterAvatar
            x={zeroX}
            y={zeroY}
            walking={travelWalk}
            userType={avatar.userType}
            gender={avatar.gender}
            age={avatar.age}
            equipped={equipped}
            outfit={outfit}
          />
        </View>
       </View>
      </View>
    </GestureDetector>
    </NightContext.Provider>
  );
}

const styles = StyleSheet.create({
  viewport: { width: VIEWPORT_W, height: VIEWPORT_H, overflow: 'hidden' },
});

export default PerspectivePathWorld;
