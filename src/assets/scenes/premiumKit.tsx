/**
 * premiumKit — a richer, fully gradient-lit isometric toolkit for the "premium"
 * scenes (Township / Hay Day / Monopoly GO feel). Self-contained: every
 * primitive carries its own soft lighting + layered contact shadow so scenes
 * read as crafted vignettes, not flat SVG blocks.
 *
 * Authored in the same 220×170 local box as LocationScene (ground centre
 * ≈ (110, 98)) so premium scenes drop straight into the existing dispatcher.
 * Day/night comes from LocationScene's shared NightContext.
 */
import React from 'react';
import {
  Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Polygon,
  RadialGradient, Rect, Stop, Text as SvgText,
} from 'react-native-svg';
import Animated, {
  Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming,
} from 'react-native-reanimated';
import { NightContext } from '../../components/LocationScene';

const AnimatedG = Animated.createAnimatedComponent(G);

export const GX = 110;
export const GY = 98;

/* ── colour helpers ── */
export function shade(hex: string, amt = 26): string {
  const m = hex.replace('#', '');
  const n = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  return `rgb(${Math.max(0, ((n >> 16) & 255) - amt)},${Math.max(0, ((n >> 8) & 255) - amt)},${Math.max(0, (n & 255) - amt)})`;
}
export function tint(hex: string, amt = 22): string {
  const m = hex.replace('#', '');
  const n = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  return `rgb(${Math.min(255, ((n >> 16) & 255) + amt)},${Math.min(255, ((n >> 8) & 255) + amt)},${Math.min(255, (n & 255) + amt)})`;
}
function useGid(): string {
  return 'p' + React.useId().replace(/[:]/g, '');
}
function VGrad({ id, top, bottom }: { id: string; top: string; bottom: string }) {
  return (
    <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <Stop offset="0" stopColor={top} />
      <Stop offset="1" stopColor={bottom} />
    </LinearGradient>
  );
}

/** Gently rocks children (hanging signs). */
function Sway({ px, py, amp = 8, dur = 1700, children }: { px: number; py: number; amp?: number; dur?: number; children: React.ReactNode }) {
  const t = useSharedValue(0);
  React.useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: dur, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [t, dur]);
  const props = useAnimatedProps(() => ({ transform: `rotate(${(t.value - 0.5) * 2 * amp} ${px} ${py})` }));
  return <AnimatedG animatedProps={props}>{children}</AnimatedG>;
}

/* ───────────────────────── ground ───────────────────────── */

export function PGround({
  top = '#E7D8BC', side = '#CBBA97', w = 210, h = 96, paved = false, grass = false,
}: { top?: string; side?: string; w?: number; h?: number; paved?: boolean; grass?: boolean }) {
  const gid = useGid();
  const hw = w / 2, hh = h / 2, dep = 13;
  const topA = grass ? '#A7D27E' : top;
  const topB = grass ? '#7FB755' : top;
  return (
    <G>
      <Defs>
        <VGrad id={`${gid}t`} top={tint(topA, 14)} bottom={shade(topB, 14)} />
        <RadialGradient id={`${gid}l`} cx="50%" cy="40%" r="60%">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.18} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={GX} cy={GY + hh + 13} rx={hw * 1.04} ry={hh * 0.52} fill="#000" opacity={0.06} />
      <Ellipse cx={GX} cy={GY + hh + 9} rx={hw * 0.88} ry={hh * 0.42} fill="#000" opacity={0.08} />
      <Polygon points={`${GX - hw},${GY} ${GX},${GY + hh} ${GX},${GY + hh + dep} ${GX - hw},${GY + dep}`} fill={shade(side, 16)} />
      <Polygon points={`${GX + hw},${GY} ${GX},${GY + hh} ${GX},${GY + hh + dep} ${GX + hw},${GY + dep}`} fill={shade(side, 40)} />
      <Polygon points={`${GX},${GY - hh} ${GX + hw},${GY} ${GX},${GY + hh} ${GX - hw},${GY}`} fill={`url(#${gid}t)`} />
      <Polygon points={`${GX},${GY - hh} ${GX + hw},${GY} ${GX},${GY + hh} ${GX - hw},${GY}`} fill="none" stroke={tint(topA, 22)} strokeWidth={2} opacity={0.65} />
      <Polygon points={`${GX},${GY - hh} ${GX + hw},${GY} ${GX},${GY + hh} ${GX - hw},${GY}`} fill={`url(#${gid}l)`} />
      {paved && [-2, -1, 0, 1, 2].map((i) => (
        <Line key={i} x1={GX - hw * 0.7 + i * 18} y1={GY - hh * 0.5} x2={GX - hw * 0.7 + i * 18 + hh} y2={GY + hh * 0.5} stroke={shade(topA, 12)} strokeWidth={1} opacity={0.35} />
      ))}
      {grass && [[-58, 10], [40, 16], [62, 2], [-30, 22], [8, -18]].map(([dx, dy], i) => (
        <G key={i}>
          <Line x1={GX + dx} y1={GY + dy} x2={GX + dx - 2} y2={GY + dy - 5} stroke="#6FA84E" strokeWidth={1.2} />
          <Line x1={GX + dx + 2} y1={GY + dy} x2={GX + dx + 2} y2={GY + dy - 4} stroke="#5E9642" strokeWidth={1.2} />
        </G>
      ))}
    </G>
  );
}

/* ───────────────────────── building (the hero, ~40%) ───────────────────────── */

export function PBuilding({
  x, base, w, h, wall, roof, accent = '#E0764B', label, sign, hangSign,
  awning, peak = false, doorAccent,
}: {
  x: number; base: number; w: number; h: number; wall: string; roof: string;
  accent?: string; label?: string; sign?: string; hangSign?: string;
  awning?: string; peak?: boolean; doorAccent?: string;
}) {
  const night = React.useContext(NightContext);
  const gid = useGid();
  const wallC = night ? shade(wall, 64) : wall;
  const roofC = night ? shade(roof, 54) : roof;
  const d = w * 0.32, dx = d * 0.72, dy = d * 0.42;
  const topY = base - h;
  const glass = night ? '#FFE08A' : '#CFEBFB';

  // framed windows
  const cols = w > 62 ? 3 : 2;
  const winW = (w * 0.56) / cols;
  const gap = (w * 0.44) / (cols + 1);
  const wins: React.ReactElement[] = [];
  for (let c = 0; c < cols; c++) {
    const wx = x + gap * (c + 1) + winW * c;
    const wy = topY + h * 0.2;
    const wh = winW * 1.05;
    wins.push(
      <G key={c}>
        {night && <Rect x={wx - 4} y={wy - 4} width={winW + 8} height={wh + 8} rx={4} fill="#FFE08A" opacity={0.35} />}
        <Rect x={wx - 2} y={wy - 2} width={winW + 4} height={wh + 4} rx={2.5} fill={night ? '#6E5536' : '#FBF4E6'} />
        <Rect x={wx} y={wy} width={winW} height={wh} rx={1.5} fill={`url(#${gid}g)`} />
        <Polygon points={`${wx},${wy} ${wx + winW * 0.55},${wy} ${wx},${wy + wh * 0.55}`} fill="#FFFFFF" opacity={night ? 0.1 : 0.35} />
        <Line x1={wx + winW / 2} y1={wy} x2={wx + winW / 2} y2={wy + wh} stroke={night ? '#E8C265' : '#FBF4E6'} strokeWidth={1.1} />
        <Line x1={wx} y1={wy + wh / 2} x2={wx + winW} y2={wy + wh / 2} stroke={night ? '#E8C265' : '#FBF4E6'} strokeWidth={1.1} />
        <Rect x={wx - 2.5} y={wy + wh + 1} width={winW + 5} height={2} rx={1} fill={shade(wallC, 18)} />
      </G>
    );
  }

  return (
    <G>
      <Defs>
        <VGrad id={`${gid}w`} top={tint(wallC, 20)} bottom={shade(wallC, 18)} />
        <VGrad id={`${gid}r`} top={tint(roofC, 22)} bottom={shade(roofC, 12)} />
        <LinearGradient id={`${gid}g`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={night ? '#FFE3A0' : '#EAF6FF'} />
          <Stop offset="0.5" stopColor={glass} />
          <Stop offset="1" stopColor={night ? '#E7B860' : '#A9D4EE'} />
        </LinearGradient>
      </Defs>

      {/* contact shadow */}
      <Ellipse cx={x + w / 2 + dx / 2} cy={base + 4} rx={w * 0.74} ry={7} fill="#000" opacity={0.1} />
      <Ellipse cx={x + w / 2 + dx / 2} cy={base + 2.5} rx={w * 0.58} ry={4.4} fill="#000" opacity={0.08} />

      {/* right side wall */}
      <Polygon points={`${x + w},${base} ${x + w + dx},${base - dy} ${x + w + dx},${topY - dy} ${x + w},${topY}`} fill={shade(wallC, 34)} />
      {/* front wall */}
      <Rect x={x} y={topY} width={w} height={h} fill={`url(#${gid}w)`} stroke="#00000010" strokeWidth={1} />
      {/* corner pilasters */}
      <Rect x={x} y={topY} width={3} height={h} fill={tint(wallC, 16)} opacity={0.7} />
      <Rect x={x + w - 3} y={topY} width={3} height={h} fill={shade(wallC, 16)} opacity={0.7} />
      {/* base plinth */}
      <Rect x={x} y={base - 7} width={w} height={7} fill={shade(wallC, 18)} />

      {wins}

      {/* door + steps + transom */}
      {(() => {
        const dw = w * 0.24, dxx = x + w / 2 - dw / 2, dyy = base - h * 0.42;
        const dh = base - dyy;
        const dc = doorAccent ?? shade(accent, 6);
        return (
          <G>
            <Rect x={dxx - 2} y={dyy - 3} width={dw + 4} height={dh + 3} rx={2} fill={shade(wallC, 22)} />
            <Rect x={dxx} y={dyy} width={dw} height={dh} rx={2} fill={night ? shade(dc, 30) : dc} />
            <Rect x={dxx + 2} y={dyy + 2} width={dw - 4} height={dh * 0.42} rx={1} fill={glass} opacity={night ? 0.8 : 0.6} />
            <Circle cx={dxx + dw - 3} cy={dyy + dh * 0.62} r={1.3} fill="#F4D58A" />
            <Rect x={dxx - 4} y={base - 2} width={dw + 8} height={3} rx={1} fill={shade(wallC, 26)} />
            <Rect x={dxx - 2} y={base - 4.5} width={dw + 4} height={2.6} rx={1} fill={shade(wallC, 16)} />
          </G>
        );
      })()}

      {/* striped awning */}
      {awning && <PAwning x={x + w * 0.06} y={topY + h * 0.52} w={w * 0.88} color={awning} />}

      {/* roof */}
      {peak ? (
        <>
          <Polygon points={`${x - 5},${topY + 2} ${x + w / 2},${topY - w * 0.4} ${x + w + 5},${topY + 2}`} fill={`url(#${gid}r)`} />
          <Polygon points={`${x + w / 2},${topY - w * 0.4} ${x + w + 5},${topY + 2} ${x + w + 5 + dx},${topY + 2 - dy} ${x + w / 2 + dx},${topY - w * 0.4 - dy}`} fill={shade(roofC, 30)} />
          <Polygon points={`${x - 5},${topY + 2} ${x + w / 2},${topY - w * 0.4} ${x + w / 2},${topY - w * 0.32} ${x},${topY + 4}`} fill={tint(roofC, 24)} opacity={0.5} />
        </>
      ) : (
        <>
          <Polygon points={`${x},${topY} ${x + w},${topY} ${x + w + dx},${topY - dy} ${x + dx},${topY - dy}`} fill={`url(#${gid}r)`} />
          {/* cornice / ridge */}
          <Rect x={x - 2} y={topY - 7} width={w + 4} height={8} rx={2} fill={shade(roofC, 22)} />
          <Rect x={x - 2} y={topY - 7} width={w + 4} height={2.4} rx={1} fill={tint(roofC, 18)} />
        </>
      )}

      {/* sign band */}
      {sign && (
        <G>
          <Rect x={x + w * 0.1} y={topY + 3} width={w * 0.8} height={11} rx={2} fill={shade(accent, 8)} />
          <Rect x={x + w * 0.1} y={topY + 3} width={w * 0.8} height={3.4} rx={1.5} fill={tint(accent, 18)} opacity={0.8} />
          <SvgText x={x + w / 2} y={topY + 11.4} fontSize={Math.min(8, w * 0.13)} fontWeight="bold" fill="#FFFFFF" textAnchor="middle">{sign}</SvgText>
        </G>
      )}
      {label && !sign && (
        <SvgText x={x + w / 2} y={topY + h * 0.16} fontSize={Math.max(8, w * 0.13)} fontWeight="bold" fill={shade(wallC, 60)} textAnchor="middle">{label}</SvgText>
      )}

      {/* downspout */}
      <Rect x={x + w + dx - 2.4} y={topY - dy + 4} width={2} height={h + dy - 6} fill={shade(wallC, 30)} opacity={0.7} />

      {/* hanging sign */}
      {hangSign && (
        <G>
          <Line x1={x + w + dx - 2} y1={topY - dy + 8} x2={x + w + dx - 2} y2={topY - dy + 16} stroke="#7E5736" strokeWidth={1.4} />
          <Sway px={x + w + dx - 2} py={topY - dy + 8} amp={9} dur={1700}>
            <Rect x={x + w + dx - 16} y={topY - dy + 16} width={28} height={13} rx={2.5} fill={accent} stroke="#FFFFFF" strokeWidth={1} />
            <SvgText x={x + w + dx - 2} y={topY - dy + 25} fontSize={6.5} fontWeight="bold" fill="#FFFFFF" textAnchor="middle">{hangSign}</SvgText>
          </Sway>
        </G>
      )}
    </G>
  );
}

/* ───────────────────────── props ───────────────────────── */

export function PAwning({ x, y, w, color }: { x: number; y: number; w: number; color: string }) {
  const n = 6, sw = w / n;
  return (
    <G>
      <Polygon points={`${x},${y + 9} ${x + w},${y + 9} ${x + w - 3},${y + 17} ${x + 3},${y + 17}`} fill={shade(color, 18)} />
      {Array.from({ length: n }).map((_, i) => (
        <Rect key={i} x={x + i * sw} y={y} width={sw} height={9} fill={i % 2 === 0 ? color : '#FBF3E6'} />
      ))}
      {Array.from({ length: n }).map((_, i) => (
        <Path key={`s${i}`} d={`M ${x + i * sw} ${y + 9} q ${sw / 2} 6 ${sw} 0 Z`} fill={i % 2 === 0 ? color : '#FBF3E6'} />
      ))}
      <Rect x={x} y={y} width={w} height={2.4} rx={1} fill={tint(color, 22)} opacity={0.7} />
    </G>
  );
}

export function PNPC({
  x, base, skin = '#C68A5E', shirt = '#E0764B', pants = '#3C4A66', hair = '#221A14', s = 1,
  wave = false, dress = false, apron, shoes = '#3A3A3A',
}: {
  x: number; base: number; skin?: string; shirt?: string; pants?: string; hair?: string;
  s?: number; wave?: boolean; dress?: boolean; apron?: string; shoes?: string;
}) {
  const hi = tint(shirt, 26);
  return (
    <G>
      <Ellipse cx={x} cy={base + 2.6 * s} rx={7.6 * s} ry={2.6 * s} fill="#000" opacity={0.1} />
      <Ellipse cx={x} cy={base + 2 * s} rx={5 * s} ry={1.7 * s} fill="#000" opacity={0.1} />
      {dress ? (
        <>
          <Polygon points={`${x - 6.4 * s},${base} ${x + 6.4 * s},${base} ${x + 4 * s},${base - 14 * s} ${x - 4 * s},${base - 14 * s}`} fill={shirt} />
          <Polygon points={`${x - 6.4 * s},${base} ${x - 1 * s},${base} ${x - 2.4 * s},${base - 14 * s} ${x - 4 * s},${base - 14 * s}`} fill={hi} opacity={0.45} />
        </>
      ) : (
        <>
          <Rect x={x - 4 * s} y={base - 9 * s} width={3.3 * s} height={8.4 * s} rx={1.4 * s} fill={pants} />
          <Rect x={x + 0.7 * s} y={base - 9 * s} width={3.3 * s} height={8.4 * s} rx={1.4 * s} fill={shade(pants, 12)} />
          <Rect x={x - 4.6 * s} y={base - 1.4 * s} width={4.4 * s} height={2.6 * s} rx={1.3 * s} fill={shoes} />
          <Rect x={x + 0.3 * s} y={base - 1.4 * s} width={4.4 * s} height={2.6 * s} rx={1.3 * s} fill={shade(shoes, 14)} />
        </>
      )}
      <Rect x={x - 5.2 * s} y={base - 19 * s} width={10.4 * s} height={dress ? 6 * s : 11 * s} rx={4 * s} fill={shirt} />
      <Rect x={x - 5.2 * s} y={base - 19 * s} width={4.2 * s} height={dress ? 6 * s : 11 * s} rx={3.4 * s} fill={hi} opacity={0.5} />
      {apron && <Rect x={x - 3.6 * s} y={base - 14 * s} width={7.2 * s} height={dress ? 12 * s : 13 * s} rx={1.6 * s} fill={apron} opacity={0.92} />}
      <Path d={`M ${x - 2.4 * s} ${base - 19 * s} L ${x} ${base - 16.4 * s} L ${x + 2.4 * s} ${base - 19 * s} Z`} fill={shade(shirt, 18)} />
      <Rect x={x - 7.4 * s} y={base - 18 * s} width={3 * s} height={8 * s} rx={1.5 * s} fill={shade(shirt, 14)} />
      {wave ? (
        <Rect x={x + 4.6 * s} y={base - 25 * s} width={3 * s} height={9 * s} rx={1.5 * s} fill={shade(shirt, 10)} transform={`rotate(28 ${x + 6 * s} ${base - 20 * s})`} />
      ) : (
        <Rect x={x + 4.4 * s} y={base - 18 * s} width={3 * s} height={8 * s} rx={1.5 * s} fill={shade(shirt, 10)} />
      )}
      <Circle cx={x - 5.9 * s} cy={base - 10.5 * s} r={1.5 * s} fill={skin} />
      {!wave && <Circle cx={x + 5.9 * s} cy={base - 10.5 * s} r={1.5 * s} fill={skin} />}
      <Rect x={x - 1.4 * s} y={base - 20.5 * s} width={2.8 * s} height={3 * s} fill={shade(skin, 12)} />
      <Circle cx={x} cy={base - 23 * s} r={4.7 * s} fill={skin} />
      <Circle cx={x - 1.6 * s} cy={base - 24 * s} r={2.2 * s} fill={tint(skin, 16)} opacity={0.5} />
      <Circle cx={x + 4.5 * s} cy={base - 22.6 * s} r={1.2 * s} fill={shade(skin, 8)} />
      <Circle cx={x - 1.5 * s} cy={base - 23 * s} r={0.7 * s} fill="#2A2018" />
      <Circle cx={x + 1.5 * s} cy={base - 23 * s} r={0.7 * s} fill="#2A2018" />
      <Path d={`M ${x - 1.8 * s} ${base - 20.4 * s} q ${1.8 * s} ${1.4 * s} ${3.6 * s} 0`} stroke={shade(skin, 30)} strokeWidth={0.6 * s} fill="none" strokeLinecap="round" />
      <Path d={`M ${x - 4.9 * s} ${base - 23.5 * s} Q ${x} ${base - 32.5 * s} ${x + 4.9 * s} ${base - 23.5 * s} Q ${x} ${base - 26.5 * s} ${x - 4.9 * s} ${base - 23.5 * s} Z`} fill={hair} />
    </G>
  );
}

export function PUmbrella({ x, base, color = '#E0764B' }: { x: number; base: number; color?: string }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={9} ry={2.6} fill="#000" opacity={0.12} />
      <Rect x={x - 0.8} y={base - 22} width={1.6} height={22} fill="#8A6A48" />
      <Path d={`M ${x - 16} ${base - 22} Q ${x} ${base - 34} ${x + 16} ${base - 22} Z`} fill={color} />
      <Path d={`M ${x - 16} ${base - 22} Q ${x} ${base - 34} ${x + 16} ${base - 22}`} fill="none" stroke={shade(color, 16)} strokeWidth={1} />
      {[-8, 0, 8].map((dx, i) => <Line key={i} x1={x + dx} y1={base - 22} x2={x + dx * 0.6} y2={base - 28} stroke="#FBF3E6" strokeWidth={1} opacity={0.5} />)}
    </G>
  );
}

export function PCafeTable({ x, base }: { x: number; base: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={10} ry={3} fill="#000" opacity={0.12} />
      <Rect x={x - 1.4} y={base - 11} width={2.8} height={11} fill="#9A764C" />
      <Ellipse cx={x} cy={base - 12} rx={11} ry={4} fill="#FBF3E6" stroke="#D9C7A6" strokeWidth={1} />
      <Ellipse cx={x} cy={base - 13} rx={9} ry={3} fill="#FFFFFF" />
      {/* coffee cup + saucer */}
      <Ellipse cx={x - 3} cy={base - 13.5} rx={2.6} ry={1.1} fill="#E7DDC9" />
      <Rect x={x - 4.4} y={base - 16} width={3} height={3} rx={0.6} fill="#FFFFFF" stroke="#C2B59A" strokeWidth={0.5} />
      <Path d={`M ${x - 2.6} ${base - 15} q 1.4 0 1.4 1.4`} stroke="#C2B59A" strokeWidth={0.6} fill="none" />
      <Rect x={x + 2} y={base - 16} width={2.4} height={3} rx={0.6} fill="#F4D58A" />
    </G>
  );
}

export function PChairOutdoor({ x, base, color = '#5BA6C9' }: { x: number; base: number; color?: string }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={6} ry={2} fill="#000" opacity={0.1} />
      <Rect x={x - 4} y={base - 6} width={8} height={2.4} rx={1} fill={color} />
      <Rect x={x - 4} y={base - 12} width={8} height={6} rx={1.5} fill={tint(color, 12)} />
      <Rect x={x - 3.4} y={base - 4} width={1.6} height={4} fill={shade(color, 18)} />
      <Rect x={x + 1.8} y={base - 4} width={1.6} height={4} fill={shade(color, 18)} />
    </G>
  );
}

export function PPlanter({ x, base, color = '#E0699A' }: { x: number; base: number; color?: string }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={7} ry={2} fill="#000" opacity={0.1} />
      <Path d={`M ${x - 6} ${base - 6} L ${x + 6} ${base - 6} L ${x + 4.6} ${base} L ${x - 4.6} ${base} Z`} fill="#C77B4E" />
      <Rect x={x - 6.4} y={base - 8} width={12.8} height={2.6} rx={1} fill="#E0985F" />
      <Circle cx={x - 3} cy={base - 10} r={3} fill="#6FA84E" />
      <Circle cx={x + 2} cy={base - 11} r={3.4} fill="#82BC5E" />
      <Circle cx={x} cy={base - 13} r={2.6} fill="#9AD07A" />
      <Circle cx={x - 3} cy={base - 12} r={1.2} fill={color} />
      <Circle cx={x + 3} cy={base - 12} r={1.2} fill="#FFD24C" />
    </G>
  );
}

export function PMenuBoard({ x, base }: { x: number; base: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={7} ry={2} fill="#000" opacity={0.12} />
      <Polygon points={`${x - 6},${base} ${x - 3},${base - 18} ${x + 3},${base - 18} ${x + 6},${base}`} fill="#7E5736" />
      <Rect x={x - 5} y={base - 18} width={10} height={13} rx={1} fill="#3A3530" />
      <Line x1={x - 3} y1={base - 14} x2={x + 3} y2={base - 14} stroke="#F4D58A" strokeWidth={0.8} />
      <Line x1={x - 3} y1={base - 11} x2={x + 2} y2={base - 11} stroke="#FBF3E6" strokeWidth={0.7} />
      <Line x1={x - 3} y1={base - 8} x2={x + 3} y2={base - 8} stroke="#FBF3E6" strokeWidth={0.7} />
    </G>
  );
}

export function PGiftBox({ x, base, color = '#E0699A', ribbon = '#FFD24C', s = 1 }: { x: number; base: number; color?: string; ribbon?: string; s?: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={8 * s} ry={2.4 * s} fill="#000" opacity={0.12} />
      <Rect x={x - 7 * s} y={base - 12 * s} width={14 * s} height={12 * s} rx={1.5} fill={color} />
      <Rect x={x - 7 * s} y={base - 12 * s} width={14 * s} height={4 * s} rx={1.5} fill={tint(color, 16)} />
      <Rect x={x - 8 * s} y={base - 14 * s} width={16 * s} height={3.4 * s} rx={1} fill={tint(color, 10)} />
      <Rect x={x - 1.4 * s} y={base - 14 * s} width={2.8 * s} height={14 * s} fill={ribbon} />
      <Path d={`M ${x} ${base - 14 * s} q -5 -5 -1 -6 q 2 1 1 6 q 5 -5 1 -6 q -2 1 -1 6`} fill={ribbon} />
    </G>
  );
}

export function PBalloon({ x, base, color = '#E0764B', h = 26 }: { x: number; base: number; color?: string; h?: number }) {
  const ty = base - h;
  return (
    <G>
      <Line x1={x} y1={base} x2={x} y2={ty + 9} stroke="#B7AE9E" strokeWidth={0.7} />
      <Circle cx={x} cy={ty} r={6} fill={color} />
      <Circle cx={x - 2} cy={ty - 2} r={1.8} fill="#FFFFFF" opacity={0.45} />
      <Polygon points={`${x - 1.4},${ty + 5.6} ${x + 1.4},${ty + 5.6} ${x},${ty + 8}`} fill={shade(color, 14)} />
    </G>
  );
}

export function PCrate({ x, base, color = '#C99A5B', s = 1 }: { x: number; base: number; color?: string; s?: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={9 * s} ry={2.4 * s} fill="#000" opacity={0.12} />
      <Rect x={x - 8 * s} y={base - 9 * s} width={16 * s} height={9 * s} rx={1} fill={color} />
      <Rect x={x - 8 * s} y={base - 9 * s} width={16 * s} height={9 * s} rx={1} fill="none" stroke={shade(color, 20)} strokeWidth={1} />
      <Line x1={x - 8 * s} y1={base - 6 * s} x2={x + 8 * s} y2={base - 6 * s} stroke={shade(color, 16)} strokeWidth={0.8} />
      <Line x1={x - 3 * s} y1={base - 9 * s} x2={x - 3 * s} y2={base} stroke={shade(color, 16)} strokeWidth={0.8} />
      <Line x1={x + 3 * s} y1={base - 9 * s} x2={x + 3 * s} y2={base} stroke={shade(color, 16)} strokeWidth={0.8} />
    </G>
  );
}

export function PProduce({ x, base, color = '#E0764B' }: { x: number; base: number; color?: string }) {
  return (
    <G>
      {[[-3, 0], [3, 0], [0, -2.4], [-1.5, -1], [1.5, -1]].map(([dx, dy], i) => (
        <Circle key={i} cx={x + dx} cy={base + dy - 2} r={2.2} fill={i % 2 ? shade(color, 10) : color} />
      ))}
    </G>
  );
}

/** Window-glow string lights for restaurants / cafes. */
export function PStringLights({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const n = 6;
  return (
    <G>
      <Path d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.max(y1, y2) + 8} ${x2} ${y2}`} stroke="#7E6A4A" strokeWidth={0.8} fill="none" />
      {Array.from({ length: n }).map((_, i) => {
        const t = (i + 1) / (n + 1);
        const cx = x1 + (x2 - x1) * t;
        const cy = y1 + (y2 - y1) * t + Math.sin(Math.PI * t) * 8;
        const col = ['#FFD24C', '#FF9FC0', '#9FD0EC'][i % 3];
        return <Circle key={i} cx={cx} cy={cy} r={1.5} fill={col} />;
      })}
    </G>
  );
}

export function PMailbox({ x, base, color = '#5BA6C9' }: { x: number; base: number; color?: string }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={5} ry={1.8} fill="#000" opacity={0.12} />
      <Rect x={x - 1.2} y={base - 14} width={2.4} height={14} fill="#8A6A48" />
      <Rect x={x - 5} y={base - 22} width={10} height={8} rx={3} fill={color} />
      <Rect x={x - 5} y={base - 22} width={10} height={3} rx={2} fill={tint(color, 16)} />
      <Rect x={x + 4} y={base - 21} width={2} height={5} rx={1} fill="#E0764B" />
      <Line x1={x - 3} y1={base - 18} x2={x + 2} y2={base - 18} stroke="#FFFFFF" strokeWidth={0.7} />
    </G>
  );
}

/** Seated diner / family member on a chair. */
export function PSeated({
  x, base, skin = '#C68A5E', shirt = '#E0764B', hair = '#221A14', s = 1, dress = false, chair = '#A9764C',
}: { x: number; base: number; skin?: string; shirt?: string; hair?: string; s?: number; dress?: boolean; chair?: string }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 2} rx={8 * s} ry={2.4 * s} fill="#000" opacity={0.12} />
      <Rect x={x - 7 * s} y={base - 17 * s} width={2.6 * s} height={15 * s} rx={1} fill={chair} />
      <Rect x={x - 7 * s} y={base - 4 * s} width={14 * s} height={3 * s} rx={1} fill={shade(chair, 14)} />
      {!dress && (
        <>
          <Rect x={x - 5 * s} y={base - 9 * s} width={10 * s} height={3.2 * s} rx={1.5} fill={shade(shirt, 30)} />
          <Rect x={x - 4 * s} y={base - 7 * s} width={3 * s} height={7 * s} rx={1.3} fill={shade(shirt, 36)} />
          <Rect x={x + 1 * s} y={base - 7 * s} width={3 * s} height={7 * s} rx={1.3} fill={shade(shirt, 30)} />
        </>
      )}
      {dress && <Polygon points={`${x - 6 * s},${base - 2 * s} ${x + 6 * s},${base - 2 * s} ${x + 4 * s},${base - 12 * s} ${x - 4 * s},${base - 12 * s}`} fill={shirt} />}
      <Rect x={x - 5 * s} y={base - 22 * s} width={10 * s} height={dress ? 9 * s : 12 * s} rx={4 * s} fill={shirt} />
      <Rect x={x - 5 * s} y={base - 22 * s} width={3.6 * s} height={dress ? 9 * s : 12 * s} rx={3 * s} fill={tint(shirt, 24)} opacity={0.5} />
      <Rect x={x + 4 * s} y={base - 20 * s} width={3 * s} height={8 * s} rx={1.5 * s} fill={shade(shirt, 12)} transform={`rotate(18 ${x + 5 * s} ${base - 16 * s})`} />
      <Circle cx={x} cy={base - 26 * s} r={4.6 * s} fill={skin} />
      <Circle cx={x - 1.5 * s} cy={base - 27 * s} r={2 * s} fill={tint(skin, 16)} opacity={0.5} />
      <Circle cx={x - 1.5 * s} cy={base - 26 * s} r={0.7 * s} fill="#2A2018" />
      <Circle cx={x + 1.5 * s} cy={base - 26 * s} r={0.7 * s} fill="#2A2018" />
      <Path d={`M ${x - 4.7 * s} ${base - 26.5 * s} Q ${x} ${base - 35 * s} ${x + 4.7 * s} ${base - 26.5 * s} Q ${x} ${base - 29 * s} ${x - 4.7 * s} ${base - 26.5 * s} Z`} fill={hair} />
    </G>
  );
}

/* ───────────── interior cutaway frame + furniture ───────────── */

/** An isometric cutaway room: gradient back + side wall, perspective floor,
 *  skirting, and an optional daylight/night window. Anchored at GX,GY. */
export function PRoom({
  wall = '#EAD9BE', floor = '#D6B488', accent = '#C98F5E', window = true,
}: { wall?: string; floor?: string; accent?: string; window?: boolean }) {
  const night = React.useContext(NightContext);
  const gid = useGid();
  const wallC = night ? shade(wall, 50) : wall;
  const floorC = night ? shade(floor, 44) : floor;
  const bTop = GY - 60, bBot = GY - 6;          // back wall
  const fFront = GY + 32;                        // floor front edge
  const bl = GX - 80, br = GX + 80;              // back wall x
  const fl = GX - 94, fr = GX + 94;              // floor front x
  return (
    <G>
      <Defs>
        <VGrad id={`${gid}bw`} top={tint(wallC, 16)} bottom={shade(wallC, 14)} />
        <VGrad id={`${gid}fl`} top={tint(floorC, 12)} bottom={shade(floorC, 16)} />
        <LinearGradient id={`${gid}gw`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={night ? '#2A3358' : '#BFE3F6'} />
          <Stop offset="1" stopColor={night ? '#141C3A' : '#8FC6E6'} />
        </LinearGradient>
      </Defs>
      {/* floor */}
      <Polygon points={`${bl},${bBot} ${br},${bBot} ${fr},${fFront} ${fl},${fFront}`} fill={`url(#${gid}fl)`} />
      {[0.3, 0.55, 0.8].map((t, i) => (
        <Line key={i} x1={bl + (fl - bl) * t} y1={bBot + (fFront - bBot) * t} x2={br + (fr - br) * t} y2={bBot + (fFront - bBot) * t} stroke={shade(floorC, 12)} strokeWidth={0.7} opacity={0.4} />
      ))}
      {/* left return wall */}
      <Polygon points={`${bl},${bTop} ${bl},${bBot} ${fl},${fFront} ${fl},${fFront - 54}`} fill={shade(wallC, 26)} />
      {/* back wall */}
      <Polygon points={`${bl},${bTop} ${br},${bTop} ${br},${bBot} ${bl},${bBot}`} fill={`url(#${gid}bw)`} />
      {/* skirting */}
      <Rect x={bl} y={bBot - 4} width={br - bl} height={4} fill={shade(wallC, 22)} />
      <Polygon points={`${bl},${bBot} ${fl},${fFront} ${fl},${fFront - 4} ${bl},${bBot - 4}`} fill={shade(wallC, 30)} />
      {/* window */}
      {window && (
        <G>
          <Rect x={GX + 28} y={bTop + 10} width={34} height={26} rx={2} fill={night ? '#26305A' : '#7FB6DD'} stroke="#FBF4E6" strokeWidth={2.4} />
          <Rect x={GX + 30} y={bTop + 12} width={30} height={22} fill={`url(#${gid}gw)`} />
          <Line x1={GX + 45} y1={bTop + 12} x2={GX + 45} y2={bTop + 34} stroke="#FBF4E6" strokeWidth={1.6} />
          <Line x1={GX + 30} y1={bTop + 23} x2={GX + 60} y2={bTop + 23} stroke="#FBF4E6" strokeWidth={1.6} />
          {night && <Circle cx={GX + 54} cy={bTop + 18} r={3} fill="#FFF7D6" />}
          {!night && <Polygon points={`${GX + 30},${bTop + 12} ${GX + 40},${bTop + 12} ${GX + 30},${bTop + 22}`} fill="#FFFFFF" opacity={0.3} />}
        </G>
      )}
    </G>
  );
}

export function PRug({ x, base, color = '#C0567B', w = 90 }: { x: number; base: number; color?: string; w?: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={base} rx={w / 2} ry={w / 5} fill={shade(color, 16)} />
      <Ellipse cx={x} cy={base} rx={w / 2 - 4} ry={w / 5 - 3} fill={color} />
      <Ellipse cx={x} cy={base} rx={w / 2 - 10} ry={w / 5 - 7} fill="none" stroke={tint(color, 24)} strokeWidth={1.4} />
    </G>
  );
}

export function PSofa({ x, base, color = '#5E80B0' }: { x: number; base: number; color?: string }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 2} rx={26} ry={4} fill="#000" opacity={0.12} />
      <Rect x={x - 24} y={base - 20} width={48} height={12} rx={4} fill={shade(color, 14)} />
      <Rect x={x - 24} y={base - 12} width={48} height={12} rx={4} fill={color} />
      <Rect x={x - 24} y={base - 16} width={8} height={16} rx={4} fill={tint(color, 8)} />
      <Rect x={x + 16} y={base - 16} width={8} height={16} rx={4} fill={shade(color, 10)} />
      <Rect x={x - 15} y={base - 19} width={13} height={9} rx={3} fill={tint(color, 14)} />
      <Rect x={x + 2} y={base - 19} width={13} height={9} rx={3} fill={tint(color, 14)} />
      <Rect x={x - 12} y={base - 20} width={7} height={7} rx={2} fill="#E0A85A" transform={`rotate(-12 ${x - 9} ${base - 17})`} />
      <Rect x={x + 6} y={base - 20} width={7} height={7} rx={2} fill="#D06A93" transform={`rotate(10 ${x + 9} ${base - 17})`} />
    </G>
  );
}

export function PTV({ x, base }: { x: number; base: number }) {
  const night = React.useContext(NightContext);
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={18} ry={3} fill="#000" opacity={0.12} />
      <Rect x={x - 16} y={base - 6} width={32} height={6} rx={1.5} fill="#9A764C" />
      <Rect x={x - 14} y={base - 8} width={28} height={3} rx={1} fill="#B5824F" />
      <Rect x={x - 14} y={base - 25} width={28} height={18} rx={1.5} fill="#2A2A2E" />
      <Rect x={x - 12} y={base - 23} width={24} height={14} rx={1} fill={night ? '#3A6EA5' : '#7FB6DD'} />
      <Polygon points={`${x - 12},${base - 23} ${x - 2},${base - 23} ${x - 12},${base - 14}`} fill="#FFFFFF" opacity={0.25} />
      <Rect x={x - 6} y={base - 9} width={3} height={4} rx={1} fill="#E0764B" />
      <Rect x={x + 3} y={base - 9} width={3} height={4} rx={1} fill="#5BA6C9" />
    </G>
  );
}

export function PBookshelf({ x, base }: { x: number; base: number }) {
  const cols = ['#C0567B', '#E0A85A', '#5BA6C9', '#7FB04F', '#7E6BD0', '#E0764B'];
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={15} ry={3} fill="#000" opacity={0.12} />
      <Rect x={x - 13} y={base - 40} width={26} height={40} rx={1.5} fill="#9A6B43" />
      <Rect x={x - 11} y={base - 38} width={22} height={38} fill="#B5824F" />
      {[0, 1, 2].map((r) => (
        <G key={r}>
          <Rect x={x - 11} y={base - 12 - r * 12} width={22} height={2} fill="#8A5E3C" />
          {[0, 1, 2, 3].map((c) => (
            <Rect key={c} x={x - 9 + c * 5} y={base - 22 - r * 12} width={3.4} height={9} rx={0.5} fill={cols[(r * 4 + c) % cols.length]} />
          ))}
        </G>
      ))}
    </G>
  );
}

export function PFloorLamp({ x, base }: { x: number; base: number }) {
  const night = React.useContext(NightContext);
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={5} ry={1.6} fill="#000" opacity={0.12} />
      <Rect x={x - 0.8} y={base - 30} width={1.6} height={30} fill="#7E7064" />
      {night && <Circle cx={x} cy={base - 32} r={11} fill="#FFE9A8" opacity={0.3} />}
      <Polygon points={`${x - 6},${base - 30} ${x + 6},${base - 30} ${x + 4},${base - 38} ${x - 4},${base - 38}`} fill={night ? '#FFE9A8' : '#E8D6A8'} />
    </G>
  );
}

export function PWallFrame({ x, y, color = '#7FB04F' }: { x: number; y: number; color?: string }) {
  return (
    <G>
      <Rect x={x - 6} y={y - 6} width={12} height={12} rx={1} fill="#FBF4E6" stroke="#9A764C" strokeWidth={1.4} />
      <Rect x={x - 4} y={y - 4} width={8} height={8} fill={color} opacity={0.8} />
      <Circle cx={x + 1} cy={y - 1} r={1.4} fill="#FFD24C" />
    </G>
  );
}

export function PCounter({ x, base, w = 70 }: { x: number; base: number; w?: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={w / 2} ry={3} fill="#000" opacity={0.12} />
      <Rect x={x - w / 2} y={base - 16} width={w} height={16} rx={1.5} fill="#E7DAC2" />
      {[-1, 0, 1].map((i) => <Rect key={i} x={x - w / 2 + 4 + (i + 1) * (w / 3.2)} y={base - 14} width={w / 5} height={12} rx={1} fill="#D8C6A6" stroke="#C2B093" strokeWidth={0.6} />)}
      <Rect x={x - w / 2} y={base - 19} width={w} height={3.4} rx={1} fill="#B5824F" />
      <Rect x={x - w / 2} y={base - 19} width={w} height={1.4} rx={1} fill="#CDA06A" />
      {/* sink */}
      <Rect x={x + w / 2 - 18} y={base - 18} width={12} height={6} rx={1.5} fill="#AEC2CC" />
      <Circle cx={x + w / 2 - 12} cy={base - 19} r={1.2} fill="#8EA0AA" />
    </G>
  );
}

export function PUpperCabinets({ x, y, w = 60 }: { x: number; y: number; w?: number }) {
  return (
    <G>
      <Rect x={x - w / 2} y={y} width={w} height={12} rx={1.5} fill="#D8C6A6" />
      {[0, 1, 2].map((i) => <Rect key={i} x={x - w / 2 + 2 + i * (w / 3)} y={y + 1.5} width={w / 3 - 3} height={9} rx={1} fill="#E7DAC2" stroke="#C2B093" strokeWidth={0.5} />)}
    </G>
  );
}

export function PFridge({ x, base }: { x: number; base: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={11} ry={3} fill="#000" opacity={0.12} />
      <Rect x={x - 10} y={base - 40} width={20} height={40} rx={2.5} fill="#EDEFF2" stroke="#D2D7DC" strokeWidth={1} />
      <Rect x={x - 10} y={base - 40} width={6} height={40} rx={2.5} fill="#F7F8FA" />
      <Line x1={x - 10} y1={base - 22} x2={x + 10} y2={base - 22} stroke="#D2D7DC" strokeWidth={1} />
      <Rect x={x + 5} y={base - 36} width={2} height={10} rx={1} fill="#AEB4BA" />
      <Rect x={x + 5} y={base - 18} width={2} height={8} rx={1} fill="#AEB4BA" />
      <Rect x={x - 6} y={base - 37} width={5} height={4} rx={1} fill="#E0764B" />
    </G>
  );
}

export function PStove({ x, base }: { x: number; base: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={12} ry={3} fill="#000" opacity={0.12} />
      <Rect x={x - 11} y={base - 18} width={22} height={18} rx={2} fill="#C7CDD3" />
      <Rect x={x - 9} y={base - 13} width={18} height={11} rx={1.5} fill="#5B5550" />
      <Rect x={x - 7} y={base - 11} width={14} height={7} rx={1} fill={'#9AA0A6'} opacity={0.5} />
      <Rect x={x - 11} y={base - 21} width={22} height={4} rx={1.5} fill="#AEB4BA" />
      <Circle cx={x - 5} cy={base - 19} r={1.6} fill="#5B5550" />
      <Circle cx={x + 5} cy={base - 19} r={1.6} fill="#5B5550" />
      {/* pot */}
      <Rect x={x - 4} y={base - 26} width={8} height={6} rx={1.5} fill="#5BA6C9" />
      <Rect x={x - 5} y={base - 27} width={10} height={2} rx={1} fill="#7FB6DD" />
    </G>
  );
}

export function PBed({ x, base, color = '#7E6BD0' }: { x: number; base: number; color?: string }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 2} rx={32} ry={4} fill="#000" opacity={0.12} />
      <Rect x={x - 30} y={base - 22} width={10} height={22} rx={2} fill="#9A6B43" />
      <Rect x={x - 30} y={base - 22} width={10} height={4} rx={2} fill="#B5824F" />
      <Rect x={x - 30} y={base - 12} width={58} height={12} rx={2} fill="#E7DAC2" />
      <Rect x={x - 28} y={base - 17} width={56} height={8} rx={3} fill={color} />
      <Rect x={x - 28} y={base - 17} width={56} height={3} rx={2} fill={tint(color, 16)} />
      <Rect x={x - 26} y={base - 20} width={13} height={7} rx={2.5} fill="#FBF4E6" />
      <Rect x={x - 24} y={base - 19} width={9} height={4} rx={2} fill="#FFFFFF" />
    </G>
  );
}

export function PSuitcase({ x, base, color = '#E0764B' }: { x: number; base: number; color?: string }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={9} ry={2.4} fill="#000" opacity={0.12} />
      <Rect x={x - 8} y={base - 12} width={16} height={12} rx={2} fill={color} />
      <Rect x={x - 8} y={base - 12} width={16} height={4} rx={2} fill={tint(color, 12)} />
      <Rect x={x - 3} y={base - 15} width={6} height={3} rx={1.5} fill={shade(color, 16)} />
      <Line x1={x - 8} y1={base - 6} x2={x + 8} y2={base - 6} stroke={shade(color, 18)} strokeWidth={1} />
      <Rect x={x - 6} y={base - 10} width={2} height={8} fill="#FBF4E6" opacity={0.6} />
    </G>
  );
}

export function PWallMap({ x, y }: { x: number; y: number }) {
  return (
    <G>
      <Rect x={x - 16} y={y - 12} width={32} height={24} rx={1.5} fill="#FBF4E6" stroke="#9A764C" strokeWidth={1.6} />
      <Rect x={x - 14} y={y - 10} width={28} height={20} fill="#CDE6D6" />
      <Path d={`M ${x - 12} ${y + 4} Q ${x - 4} ${y - 6} ${x + 2} ${y} T ${x + 12} ${y - 6}`} stroke="#5BA6C9" strokeWidth={1} fill="none" />
      <Path d="" />
      <Circle cx={x + 6} cy={y - 4} r={1.6} fill="#E0764B" />
      <Path d={`M ${x + 6} ${y - 5.6} l 0 -3`} stroke="#C0432F" strokeWidth={1} />
    </G>
  );
}

export function PDiningSet({ x, base }: { x: number; base: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 2} rx={30} ry={5} fill="#000" opacity={0.12} />
      <Rect x={x - 2} y={base - 12} width={4} height={12} fill="#8A5E3C" />
      <Ellipse cx={x} cy={base - 13} rx={28} ry={9} fill="#B5824F" />
      <Ellipse cx={x} cy={base - 14} rx={26} ry={8} fill="#CDA06A" />
      <Ellipse cx={x} cy={base - 15} rx={20} ry={5.5} fill="#E7DAC2" opacity={0.5} />
      {/* bowls + plates */}
      <Ellipse cx={x - 11} cy={base - 15} rx={4.4} ry={2} fill="#FFFFFF" stroke="#D8C7A8" strokeWidth={0.7} />
      <Ellipse cx={x - 11} cy={base - 15.5} rx={2.4} ry={1} fill="#E0764B" />
      <Ellipse cx={x + 11} cy={base - 15} rx={4.4} ry={2} fill="#FFFFFF" stroke="#D8C7A8" strokeWidth={0.7} />
      <Ellipse cx={x + 11} cy={base - 15.5} rx={2.4} ry={1} fill="#7FB04F" />
      <Ellipse cx={x} cy={base - 17} rx={5} ry={2.2} fill="#FFE6A0" stroke="#E0C277" strokeWidth={0.7} />
      <Rect x={x - 1} y={base - 22} width={2} height={5} rx={1} fill="#9FD0EC" />
    </G>
  );
}

export function PBalconyView({ accent = '#9CC0E0' }: { accent?: string }) {
  const night = React.useContext(NightContext);
  const sky = night ? '#26305A' : '#BFE3F6';
  const b = night ? shade(accent, 40) : accent;
  return (
    <G>
      <Rect x={GX - 92} y={GY - 60} width={184} height={50} fill={sky} />
      {[[-70, 30], [-40, 44], [-8, 24], [24, 40], [56, 28], [80, 38]].map(([dx, h], i) => (
        <Rect key={i} x={GX + dx} y={GY - 14 - h} width={20} height={h} rx={1} fill={i % 2 ? shade(b, 14) : b} opacity={0.9} />
      ))}
      {night && [[-62, -36], [-32, -50], [30, -46], [62, -34]].map(([dx, dy], i) => (
        <Rect key={`w${i}`} x={GX + dx + 4} y={GY + dy} width={3} height={3} fill="#FFE08A" />
      ))}
      {!night && <Circle cx={GX + 60} cy={GY - 48} r={9} fill="#FFE49A" opacity={0.7} />}
    </G>
  );
}

export function PRailing({ x, base, w = 150 }: { x: number; base: number; w?: number }) {
  const n = Math.round(w / 12);
  return (
    <G>
      <Rect x={x - w / 2} y={base - 22} width={w} height={4} rx={2} fill="#C99A5B" />
      <Rect x={x - w / 2} y={base - 4} width={w} height={4} rx={1} fill="#A9764C" />
      {Array.from({ length: n }).map((_, i) => (
        <Rect key={i} x={x - w / 2 + 4 + i * (w / n)} y={base - 20} width={2.4} height={18} fill="#D8B98C" />
      ))}
      <Rect x={x - w / 2} y={base - 23} width={w} height={2} rx={1} fill="#E0C49A" />
    </G>
  );
}

export function PShoeRack({ x, base }: { x: number; base: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={13} ry={2.6} fill="#000" opacity={0.12} />
      <Rect x={x - 12} y={base - 12} width={24} height={12} rx={1.5} fill="#B5824F" />
      <Rect x={x - 12} y={base - 7} width={24} height={2} fill="#9A6B43" />
      {[[-8, '#E0764B'], [-3, '#5BA6C9'], [3, '#7FB04F'], [7, '#E0699A']].map(([dx, c], i) => (
        <Ellipse key={i} cx={x + (dx as number)} cy={base - (i % 2 ? 9 : 4)} rx={2.4} ry={1.2} fill={c as string} />
      ))}
    </G>
  );
}

export function PMat({ x, base, color = '#C0567B' }: { x: number; base: number; color?: string }) {
  return (
    <G>
      <Ellipse cx={x} cy={base} rx={18} ry={6} fill={shade(color, 14)} />
      <Ellipse cx={x} cy={base} rx={15} ry={4.6} fill={color} />
      <SvgText x={x} y={base + 2} fontSize={4.4} fontWeight="bold" fill="#FBF4E6" textAnchor="middle">WELCOME</SvgText>
    </G>
  );
}

export function PHostDesk({ x, base }: { x: number; base: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={15} ry={3} fill="#000" opacity={0.12} />
      <Rect x={x - 13} y={base - 22} width={26} height={22} rx={2} fill="#9B6B4B" />
      <Rect x={x - 13} y={base - 22} width={26} height={4} rx={2} fill="#B98456" />
      <Rect x={x - 11} y={base - 18} width={22} height={14} rx={1} fill="none" stroke={shade('#9B6B4B', 16)} strokeWidth={0.8} />
      {/* open reservation book */}
      <Rect x={x - 6} y={base - 26} width={12} height={5} rx={1} fill="#FBF4E6" stroke="#C2B093" strokeWidth={0.6} />
      <Line x1={x} y1={base - 26} x2={x} y2={base - 21} stroke="#C2B093" strokeWidth={0.6} />
    </G>
  );
}

/** Pendant lights over restaurant tables. */
export function PPendant({ x, top, base }: { x: number; top: number; base: number }) {
  const night = React.useContext(NightContext);
  return (
    <G>
      <Line x1={x} y1={top} x2={x} y2={base - 4} stroke="#7E6A4A" strokeWidth={0.8} />
      {night && <Circle cx={x} cy={base} r={8} fill="#FFE9A8" opacity={0.3} />}
      <Path d={`M ${x - 5} ${base} q 5 -6 10 0 Z`} fill={night ? '#FFE9A8' : '#D9A24E'} />
      <Circle cx={x} cy={base} r={1.4} fill="#FFF3C4" />
    </G>
  );
}
