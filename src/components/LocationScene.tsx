/**
 * LocationScene.tsx — rich, code-drawn isometric vignettes (one per lesson).
 *
 * Authored in a 220×170 local box (ground centre ≈ (110, 98)). A generous iso
 * toolkit (Platform, Person, Build, Tree, Flower, Hedge, Lamp, Bench, Table,
 * Umbrella, Room, Sign, …) makes each of the 20 scenes detailed and distinct.
 *
 * Dispatcher: <LocationScene scene={layoutScene} /> wraps the right vignette in
 * a translate+scale <G>.
 */
import React from 'react';
import {
  Circle,
  Ellipse,
  G,
  Line,
  Path,
  Polygon,
  Rect,
  Text as SvgText,
} from 'react-native-svg';
import { LayoutScene } from '../utils/mapLayout';

const GX = 110;
const GY = 98;

/** Day/night flag shared to every primitive (windows light up, walls dusk). */
export const NightContext = React.createContext(false);

/* ───────────────────────── colour helpers ───────────────────────── */

function shade(hex: string, amt = 26): string {
  const m = hex.replace('#', '');
  const n = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  const r = Math.max(0, ((n >> 16) & 255) - amt);
  const g = Math.max(0, ((n >> 8) & 255) - amt);
  const b = Math.max(0, (n & 255) - amt);
  return `rgb(${r},${g},${b})`;
}
function tint(hex: string, amt = 22): string {
  const m = hex.replace('#', '');
  const n = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  const r = Math.min(255, ((n >> 16) & 255) + amt);
  const g = Math.min(255, ((n >> 8) & 255) + amt);
  const b = Math.min(255, (n & 255) + amt);
  return `rgb(${r},${g},${b})`;
}

/* ───────────────────────── reward token ───────────────────────── */

export function Coin({ x, y, star = false }: { x: number; y: number; star?: boolean }) {
  if (star) {
    return <Path d={starPath(x, y, 12)} fill="#FFC53D" stroke="#E8A317" strokeWidth={1.5} />;
  }
  return (
    <G>
      <Ellipse cx={x} cy={y + 12} rx={9} ry={3} fill="#000" opacity={0.12} />
      <Circle cx={x} cy={y} r={11} fill="#FFD24C" stroke="#E8A317" strokeWidth={2} />
      <Circle cx={x} cy={y} r={6} fill="#FFE08A" />
    </G>
  );
}
function starPath(cx: number, cy: number, r: number): string {
  const inner = r * 0.45;
  let d = '';
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    d += `${i === 0 ? 'M' : 'L'} ${(cx + Math.cos(a) * rad).toFixed(1)} ${(cy + Math.sin(a) * rad).toFixed(1)} `;
  }
  return d + 'Z';
}

/* ───────────────────────── ground ───────────────────────── */

function Platform({
  top, side, w = 208, h = 94, flowers = false, paved = false,
}: { top: string; side: string; w?: number; h?: number; flowers?: boolean; paved?: boolean }) {
  const hw = w / 2;
  const hh = h / 2;
  const dep = 12;
  const dots = flowers
    ? [
        [GX - 60, GY + 8, '#E0699A'], [GX - 30, GY + 20, '#FFD24C'], [GX + 40, GY + 16, '#7E6BD0'],
        [GX + 66, GY + 4, '#E0764B'], [GX + 10, GY - 22, '#FF9FC0'], [GX - 78, GY - 6, '#FFD24C'],
      ]
    : [];
  return (
    <G>
      <Ellipse cx={GX} cy={GY + hh + 10} rx={hw * 0.98} ry={hh * 0.46} fill="#000" opacity={0.1} />
      {/* depth sides */}
      <Polygon points={`${GX - hw},${GY} ${GX},${GY + hh} ${GX},${GY + hh + dep} ${GX - hw},${GY + dep}`} fill={shade(side, 18)} />
      <Polygon points={`${GX + hw},${GY} ${GX},${GY + hh} ${GX},${GY + hh + dep} ${GX + hw},${GY + dep}`} fill={shade(side, 40)} />
      {/* top */}
      <Polygon points={`${GX},${GY - hh} ${GX + hw},${GY} ${GX},${GY + hh} ${GX - hw},${GY}`} fill={top} />
      {/* rim highlight */}
      <Polygon points={`${GX},${GY - hh} ${GX + hw},${GY} ${GX},${GY + hh} ${GX - hw},${GY}`} fill="none" stroke={tint(top, 18)} strokeWidth={2} opacity={0.7} />
      {/* warm light pool */}
      <Ellipse cx={GX} cy={GY - 2} rx={hw * 0.5} ry={hh * 0.4} fill="#FFFFFF" opacity={0.08} />
      {paved &&
        [-1, 0, 1].map((i) => (
          <Line key={i} x1={GX + i * 34 - hh} y1={GY + i * 0 - hh / 2} x2={GX + i * 34 + hh} y2={GY + hh / 2} stroke={shade(top, 12)} strokeWidth={1} opacity={0.4} />
        ))}
      {dots.map((d, i) => (
        <Circle key={i} cx={d[0] as number} cy={d[1] as number} r={2.3} fill={d[2] as string} />
      ))}
      {flowers &&
        [GX - 50, GX + 24, GX + 58].map((fx, i) => (
          <G key={`t${i}`}>
            <Line x1={fx} y1={GY + 6} x2={fx} y2={GY} stroke="#6FA84E" strokeWidth={1.4} />
            <Line x1={fx + 3} y1={GY + 6} x2={fx + 3} y2={GY + 1} stroke="#6FA84E" strokeWidth={1.4} />
          </G>
        ))}
    </G>
  );
}

/* ───────────────────────── people ───────────────────────── */

function Person({
  x, base, skin = '#C68A5E', shirt = '#E0764B', pants = '#3C4A66', hair = '#2A2018', s = 1, wave = false, dress = false,
}: { x: number; base: number; skin?: string; shirt?: string; pants?: string; hair?: string; s?: number; wave?: boolean; dress?: boolean }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 2} rx={7 * s} ry={2.4 * s} fill="#000" opacity={0.13} />
      {dress ? (
        <Polygon points={`${x - 6 * s},${base} ${x + 6 * s},${base} ${x + 4 * s},${base - 14 * s} ${x - 4 * s},${base - 14 * s}`} fill={shirt} />
      ) : (
        <>
          <Rect x={x - 4 * s} y={base - 9 * s} width={3.3 * s} height={9 * s} rx={1.4 * s} fill={pants} />
          <Rect x={x + 0.7 * s} y={base - 9 * s} width={3.3 * s} height={9 * s} rx={1.4 * s} fill={pants} />
        </>
      )}
      <Rect x={x - 5.2 * s} y={base - 19 * s} width={10.4 * s} height={dress ? 6 * s : 11 * s} rx={4 * s} fill={shirt} />
      <Rect x={x - 7.4 * s} y={base - 18 * s} width={3 * s} height={8 * s} rx={1.5 * s} fill={shade(shirt, 12)} />
      {wave ? (
        <Rect x={x + 4.6 * s} y={base - 25 * s} width={3 * s} height={9 * s} rx={1.5 * s} fill={shade(shirt, 12)} transform={`rotate(28 ${x + 6 * s} ${base - 20 * s})`} />
      ) : (
        <Rect x={x + 4.4 * s} y={base - 18 * s} width={3 * s} height={8 * s} rx={1.5 * s} fill={shade(shirt, 12)} />
      )}
      <Circle cx={x} cy={base - 23 * s} r={4.6 * s} fill={skin} />
      <Circle cx={x - 1.4 * s} cy={base - 23 * s} r={0.7 * s} fill="#2A2018" />
      <Circle cx={x + 1.4 * s} cy={base - 23 * s} r={0.7 * s} fill="#2A2018" />
      <Path d={`M ${x - 4.7 * s} ${base - 23.5 * s} Q ${x} ${base - 32 * s} ${x + 4.7 * s} ${base - 23.5 * s} Q ${x} ${base - 26 * s} ${x - 4.7 * s} ${base - 23.5 * s} Z`} fill={hair} />
    </G>
  );
}

/** A person SEATED on a chair (for restaurant / dining scenes). */
function SeatedPerson({
  x, base, skin = '#C68A5E', shirt = '#E0764B', pants = '#3C4A66', hair = '#2A2018', s = 1, dress = false, chair = '#A9764C',
}: { x: number; base: number; skin?: string; shirt?: string; pants?: string; hair?: string; s?: number; dress?: boolean; chair?: string }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 2} rx={8 * s} ry={2.4 * s} fill="#000" opacity={0.12} />
      {/* chair back + seat */}
      <Rect x={x - 7 * s} y={base - 16 * s} width={2.6 * s} height={14 * s} rx={1} fill={chair} />
      <Rect x={x - 7 * s} y={base - 4 * s} width={14 * s} height={3 * s} rx={1} fill={shade(chair, 14)} />
      {/* legs: thigh + shin */}
      {!dress && (
        <>
          <Rect x={x - 5 * s} y={base - 9 * s} width={10 * s} height={3.2 * s} rx={1.5} fill={pants} />
          <Rect x={x - 4 * s} y={base - 7 * s} width={3 * s} height={7 * s} rx={1.3} fill={shade(pants, 10)} />
          <Rect x={x + 1 * s} y={base - 7 * s} width={3 * s} height={7 * s} rx={1.3} fill={pants} />
        </>
      )}
      {dress && <Polygon points={`${x - 6 * s},${base - 2 * s} ${x + 6 * s},${base - 2 * s} ${x + 4 * s},${base - 12 * s} ${x - 4 * s},${base - 12 * s}`} fill={shirt} />}
      {/* torso */}
      <Rect x={x - 5 * s} y={base - 22 * s} width={10 * s} height={dress ? 9 * s : 12 * s} rx={4 * s} fill={shirt} />
      <Rect x={x + 4 * s} y={base - 20 * s} width={3 * s} height={8 * s} rx={1.5 * s} fill={shade(shirt, 12)} transform={`rotate(18 ${x + 5 * s} ${base - 16 * s})`} />
      {/* head */}
      <Circle cx={x} cy={base - 26 * s} r={4.6 * s} fill={skin} />
      <Circle cx={x - 1.4 * s} cy={base - 26 * s} r={0.7 * s} fill="#2A2018" />
      <Circle cx={x + 1.4 * s} cy={base - 26 * s} r={0.7 * s} fill="#2A2018" />
      <Path d={`M ${x - 4.7 * s} ${base - 26.5 * s} Q ${x} ${base - 35 * s} ${x + 4.7 * s} ${base - 26.5 * s} Q ${x} ${base - 29 * s} ${x - 4.7 * s} ${base - 26.5 * s} Z`} fill={hair} />
    </G>
  );
}

/** Walking person at absolute world coords (for animated pedestrians). */
export function WalkPerson({ x, y, s = 1, shirt = '#5BA6C9' }: { x: number; y: number; s?: number; shirt?: string }) {
  return <Person x={x} base={y} s={s} shirt={shirt} />;
}

/* ───────────────────────── buildings & props ───────────────────────── */

function Build({
  x, base, w, h, wall, roof, label, awning, peak, glow, chimney, steps, hangSign,
}: {
  x: number; base: number; w: number; h: number; wall: string; roof: string;
  label?: string; awning?: boolean; peak?: boolean; glow?: boolean; chimney?: boolean; steps?: boolean; hangSign?: string;
}) {
  const night = React.useContext(NightContext);
  const wallC = night ? shade(wall, 70) : wall;
  const roofC = night ? shade(roof, 60) : roof;
  const d = w * 0.34;
  const dx = d * 0.7;
  const dy = d * 0.4;
  const topY = base - h;
  const win = night ? '#FFE08A' : glow ? '#FFE6A0' : '#BFE0F2';
  const cols = w > 64 ? 3 : 2;
  const rows = h > 56 ? 2 : 1;
  const winW = (w * 0.58) / cols;
  const gap = (w * 0.42) / (cols + 1);
  const wins = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = x + gap * (c + 1) + winW * c;
      const wy = topY + h * 0.16 + r * (winW + h * 0.08);
      wins.push(
        <G key={`${r}-${c}`}>
          {night && <Rect x={wx - 3} y={wy - 3} width={winW + 6} height={winW * 0.92 + 6} rx={4} fill="#FFE08A" opacity={0.4} />}
          <Rect x={wx} y={wy} width={winW} height={winW * 0.92} rx={2} fill={win} stroke={night ? '#FFF3C4' : '#FFFFFF'} strokeWidth={1.3} />
          <Line x1={wx + winW / 2} y1={wy} x2={wx + winW / 2} y2={wy + winW * 0.92} stroke={night ? '#E8C265' : '#FFFFFF'} strokeWidth={0.8} opacity={0.7} />
        </G>
      );
    }
  }
  return (
    <G>
      <Ellipse cx={x + w / 2 + dx / 2} cy={base + 3} rx={w * 0.68} ry={6} fill="#000" opacity={0.13} />
      {chimney && <Rect x={x + w * 0.7} y={topY - w * 0.34} width={w * 0.12} height={w * 0.22} fill={shade(roofC, 30)} />}
      <Polygon points={`${x + w},${base} ${x + w + dx},${base - dy} ${x + w + dx},${topY - dy} ${x + w},${topY}`} fill={shade(wallC)} />
      <Rect x={x} y={topY} width={w} height={h} fill={wallC} stroke="#00000010" strokeWidth={1} />
      {/* base trim */}
      <Rect x={x} y={base - 6} width={w} height={6} fill={shade(wallC, 14)} />
      {wins}
      {steps && (
        <>
          <Rect x={x + w / 2 - w * 0.16} y={base - 2} width={w * 0.32} height={3} rx={1} fill={shade(wallC, 20)} />
          <Rect x={x + w / 2 - w * 0.12} y={base - 5} width={w * 0.24} height={3} rx={1} fill={shade(wallC, 12)} />
        </>
      )}
      <Rect x={x + w / 2 - w * 0.11} y={base - h * 0.34} width={w * 0.22} height={h * 0.34} rx={2} fill={night ? '#6E5536' : '#9A744B'} />
      <Circle cx={x + w / 2 + w * 0.06} cy={base - h * 0.17} r={1.3} fill="#E8C77A" />
      {awning && <Awning x={x} y={topY + h * 0.46} w={w} color={roofC} />}
      {peak ? (
        <>
          <Polygon points={`${x - 5},${topY + 2} ${x + w / 2},${topY - w * 0.42} ${x + w + 5},${topY + 2}`} fill={roofC} />
          <Polygon points={`${x + w / 2},${topY - w * 0.42} ${x + w + 5},${topY + 2} ${x + w + 5 + dx},${topY + 2 - dy} ${x + w / 2 + dx},${topY - w * 0.42 - dy}`} fill={shade(roofC)} />
          <Polygon points={`${x - 5},${topY + 2} ${x + w / 2},${topY - w * 0.42} ${x + w / 2},${topY - w * 0.34} ${x},${topY + 4}`} fill={tint(roofC, 14)} opacity={0.5} />
        </>
      ) : (
        <>
          <Polygon points={`${x},${topY} ${x + w},${topY} ${x + w + dx},${topY - dy} ${x + dx},${topY - dy}`} fill={roofC} />
          <Rect x={x - 2} y={topY - 7} width={w + 4} height={8} rx={2} fill={shade(roofC)} />
        </>
      )}
      {label ? (
        <SvgText x={x + w / 2} y={topY + (peak ? h * 0.2 : h * 0.16)} fontSize={Math.max(8, w * 0.14)} fontWeight="bold" fill="#5B4A32" textAnchor="middle">{label}</SvgText>
      ) : null}
      {hangSign ? (
        <G>
          <Line x1={x + w + dx - 2} y1={topY - dy + 6} x2={x + w + dx - 2} y2={topY - dy + 14} stroke="#7E5736" strokeWidth={1.4} />
          <Rect x={x + w + dx - 14} y={topY - dy + 14} width={24} height={11} rx={2} fill="#9B6B4B" stroke="#FFF" strokeWidth={1} />
          <SvgText x={x + w + dx - 2} y={topY - dy + 22} fontSize={6.5} fontWeight="bold" fill="#FFF" textAnchor="middle">{hangSign}</SvgText>
        </G>
      ) : null}
    </G>
  );
}

function Awning({ x, y, w, color }: { x: number; y: number; w: number; color: string }) {
  const n = 5;
  const sw = w / n;
  return (
    <G>
      <Polygon points={`${x},${y + 8} ${x + w},${y + 8} ${x + w - 3},${y + 15} ${x + 3},${y + 15}`} fill={shade(color)} />
      {Array.from({ length: n }).map((_, i) => (
        <Rect key={i} x={x + i * sw} y={y} width={sw} height={8} fill={i % 2 === 0 ? color : '#FFF7EE'} />
      ))}
      {Array.from({ length: n }).map((_, i) => (
        <Path key={`s${i}`} d={`M ${x + i * sw} ${y + 15} q ${sw / 2} 5 ${sw} 0`} fill={i % 2 === 0 ? color : '#FFF7EE'} />
      ))}
    </G>
  );
}

function Tree({ x, base, s = 1 }: { x: number; base: number; s?: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 2} rx={14 * s} ry={4 * s} fill="#000" opacity={0.1} />
      <Rect x={x - 2.6 * s} y={base - 9 * s} width={5.2 * s} height={12 * s} rx={2} fill="#9A6B43" />
      <Circle cx={x} cy={base - 20 * s} r={13 * s} fill="#6FA84E" />
      <Circle cx={x - 8 * s} cy={base - 13 * s} r={8.5 * s} fill="#82BC5E" />
      <Circle cx={x + 8 * s} cy={base - 13 * s} r={8.5 * s} fill="#5E9642" />
      <Circle cx={x - 3 * s} cy={base - 25 * s} r={7 * s} fill="#9AD07A" opacity={0.85} />
      <Circle cx={x + 4 * s} cy={base - 22 * s} r={5 * s} fill="#B6E294" opacity={0.6} />
    </G>
  );
}

export function WorldTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <Tree x={x} base={y} s={s} />;
}

export function Bush({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={y + 4 * s} rx={13 * s} ry={4 * s} fill="#000" opacity={0.08} />
      <Circle cx={x} cy={y} r={9 * s} fill="#7CB257" />
      <Circle cx={x - 7 * s} cy={y + 2 * s} r={6 * s} fill="#8EC56A" />
      <Circle cx={x + 7 * s} cy={y + 2 * s} r={6 * s} fill="#69A047" />
      <Circle cx={x + 2 * s} cy={y - 3 * s} r={3 * s} fill="#A9D98A" opacity={0.7} />
    </G>
  );
}

export function Flower({ x, y, color = '#E0699A', s = 1 }: { x: number; y: number; color?: string; s?: number }) {
  return (
    <G>
      <Line x1={x} y1={y} x2={x} y2={y - 7 * s} stroke="#6FA84E" strokeWidth={1.4} />
      {[0, 72, 144, 216, 288].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return <Circle key={i} cx={x + Math.cos(r) * 2.6 * s} cy={y - 7 * s + Math.sin(r) * 2.6 * s} r={2 * s} fill={color} />;
      })}
      <Circle cx={x} cy={y - 7 * s} r={1.6 * s} fill="#FFD24C" />
    </G>
  );
}

export function Hedge({ x, y, w = 40, s = 1 }: { x: number; y: number; w?: number; s?: number }) {
  return (
    <G>
      <Ellipse cx={x + w / 2} cy={y + 4 * s} rx={w * 0.6} ry={4 * s} fill="#000" opacity={0.08} />
      <Rect x={x} y={y - 9 * s} width={w} height={11 * s} rx={5 * s} fill="#6FA84E" />
      <Rect x={x} y={y - 11 * s} width={w} height={6 * s} rx={3 * s} fill="#82BC5E" />
      {Array.from({ length: Math.max(2, Math.round(w / 14)) }).map((_, i) => (
        <Circle key={i} cx={x + 8 + i * 14} cy={y - 9 * s} r={5 * s} fill="#79B254" />
      ))}
    </G>
  );
}

function Lamp({ x, base, s = 1 }: { x: number; base: number; s?: number }) {
  const night = React.useContext(NightContext);
  return (
    <G>
      <Ellipse cx={x} cy={base + 2} rx={5 * s} ry={2 * s} fill="#000" opacity={0.12} />
      <Rect x={x - 1.5 * s} y={base - 32 * s} width={3 * s} height={32 * s} rx={1} fill={night ? '#3E4452' : '#6E7681'} />
      {night && <Circle cx={x} cy={base - 35 * s} r={14 * s} fill="#FFE49A" opacity={0.22} />}
      {night && <Circle cx={x} cy={base - 35 * s} r={9 * s} fill="#FFE49A" opacity={0.3} />}
      {/* downward light cone at night */}
      {night && <Polygon points={`${x - 3 * s},${base - 34 * s} ${x + 3 * s},${base - 34 * s} ${x + 11 * s},${base} ${x - 11 * s},${base}`} fill="#FFE9A8" opacity={0.12} />}
      <Circle cx={x} cy={base - 35 * s} r={6 * s} fill="#FFE49A" opacity={night ? 0.6 : 0.4} />
      <Circle cx={x} cy={base - 35 * s} r={3.6 * s} fill={night ? '#FFF3C4' : '#FFE9A8'} stroke="#E0B85A" strokeWidth={1} />
    </G>
  );
}
export function WorldLamp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <Lamp x={x} base={y} s={s} />;
}

/** Small V-shaped bird for the sky. */
export function Bird({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <Path d={`M ${x - 6 * s} ${y} Q ${x - 3 * s} ${y - 4 * s} ${x} ${y} Q ${x + 3 * s} ${y - 4 * s} ${x + 6 * s} ${y}`} stroke="#7E8794" strokeWidth={1.4 * s} fill="none" strokeLinecap="round" />
  );
}

/** Small decorative pond with a lily pad. */
export function Pond({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={y} rx={24 * s} ry={11 * s} fill="#AFC8D2" />
      <Ellipse cx={x} cy={y - 1.5 * s} rx={20 * s} ry={9 * s} fill="#9FD0EC" />
      <Ellipse cx={x - 4 * s} cy={y - 2 * s} rx={9 * s} ry={4 * s} fill="#BFE6F5" opacity={0.7} />
      <Ellipse cx={x + 8 * s} cy={y + 1 * s} rx={5 * s} ry={2.4 * s} fill="#7CB257" />
      <Circle cx={x + 8 * s} cy={y + 0.5 * s} r={1.4 * s} fill="#E0699A" />
    </G>
  );
}

/** A small raised flower bed. */
export function FlowerBed({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const cols = ['#E0699A', '#FFD24C', '#7E6BD0', '#FF9FC0'];
  return (
    <G>
      <Ellipse cx={x} cy={y + 2 * s} rx={20 * s} ry={6 * s} fill="#8A5E3C" />
      <Ellipse cx={x} cy={y} rx={20 * s} ry={6 * s} fill="#A9764C" />
      {[-12, -4, 4, 12].map((dx, i) => (
        <Flower key={i} x={x + dx * s} y={y - 2 * s} color={cols[i % cols.length]} s={0.85 * s} />
      ))}
    </G>
  );
}

/** Bench at absolute world coords. */
export function WorldBench({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <Bench x={x} base={y} s={s} />;
}

/** A small parked car. */
export function Car({ x, y, s = 1, color = '#E0764B' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <G>
      <Ellipse cx={x} cy={y + 4 * s} rx={20 * s} ry={4 * s} fill="#000" opacity={0.12} />
      <Rect x={x - 18 * s} y={y - 8 * s} width={36 * s} height={11 * s} rx={5 * s} fill={color} />
      <Rect x={x - 10 * s} y={y - 15 * s} width={20 * s} height={9 * s} rx={4 * s} fill={tint(color, 16)} />
      <Rect x={x - 7 * s} y={y - 13 * s} width={14 * s} height={6 * s} rx={2 * s} fill="#BFE0F2" />
      <Glass x={x - 7 * s} y={y - 13 * s} w={14 * s} h={6 * s} />
      <Circle cx={x - 11 * s} cy={y + 3 * s} r={4.4 * s} fill="#3F3B37" />
      <Circle cx={x - 11 * s} cy={y + 3 * s} r={1.8 * s} fill="#7E7873" />
      <Circle cx={x + 11 * s} cy={y + 3 * s} r={4.4 * s} fill="#3F3B37" />
      <Circle cx={x + 11 * s} cy={y + 3 * s} r={1.8 * s} fill="#7E7873" />
      <Circle cx={x + 17 * s} cy={y - 4 * s} r={1.4 * s} fill="#FFE9A8" />
    </G>
  );
}

function Bench({ x, base, s = 1 }: { x: number; base: number; s?: number }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={14 * s} ry={3 * s} fill="#000" opacity={0.1} />
      <Rect x={x - 12 * s} y={base - 6 * s} width={24 * s} height={3.4 * s} rx={1.5} fill="#A9764C" />
      <Rect x={x - 12 * s} y={base - 12 * s} width={24 * s} height={3 * s} rx={1.5} fill="#B98456" />
      <Rect x={x - 11 * s} y={base - 5 * s} width={2.4 * s} height={5 * s} fill="#7E5736" />
      <Rect x={x + 8.5 * s} y={base - 5 * s} width={2.4 * s} height={5 * s} fill="#7E5736" />
    </G>
  );
}

function Umbrella({ x, base, color = '#E0764B', s = 1 }: { x: number; base: number; color?: string; s?: number }) {
  return (
    <G>
      <Rect x={x - 1 * s} y={base - 30 * s} width={2 * s} height={30 * s} fill="#9A764C" />
      <Path d={`M ${x - 18 * s} ${base - 28 * s} Q ${x} ${base - 40 * s} ${x + 18 * s} ${base - 28 * s} Z`} fill={color} />
      <Path d={`M ${x - 18 * s} ${base - 28 * s} Q ${x - 9 * s} ${base - 31 * s} ${x} ${base - 28 * s}`} fill={shade(color)} />
      <Path d={`M ${x} ${base - 28 * s} Q ${x + 9 * s} ${base - 31 * s} ${x + 18 * s} ${base - 28 * s}`} fill={tint(color, 14)} />
    </G>
  );
}

function RoundTable({ x, base, s = 1, cups = true }: { x: number; base: number; s?: number; cups?: boolean }) {
  return (
    <G>
      <Ellipse cx={x} cy={base + 1} rx={13 * s} ry={4 * s} fill="#000" opacity={0.1} />
      <Rect x={x - 1.4 * s} y={base - 2} width={2.8 * s} height={9 * s} fill="#C7B393" />
      <Ellipse cx={x} cy={base - 2 * s} rx={12 * s} ry={5 * s} fill="#F4EAD6" stroke="#D8C7A8" strokeWidth={1.4} />
      {cups && <Circle cx={x - 4 * s} cy={base - 3 * s} r={2.2 * s} fill="#FFFFFF" stroke="#C99A6B" strokeWidth={1} />}
      {cups && <Circle cx={x + 4 * s} cy={base - 3 * s} r={2.2 * s} fill="#FFFFFF" stroke="#C99A6B" strokeWidth={1} />}
      {cups && <Circle cx={x} cy={base - 4 * s} r={1.6 * s} fill="#C0533B" />}
    </G>
  );
}

function Chair({ x, base, s = 1 }: { x: number; base: number; s?: number }) {
  return (
    <G>
      <Rect x={x - 3 * s} y={base - 3 * s} width={6 * s} height={3 * s} rx={1} fill="#B98456" />
      <Rect x={x - 3 * s} y={base - 11 * s} width={2 * s} height={9 * s} rx={1} fill="#A9764C" />
    </G>
  );
}

function Plant({ x, base, s = 1 }: { x: number; base: number; s?: number }) {
  return (
    <G>
      <Rect x={x - 3.4 * s} y={base - 6 * s} width={6.8 * s} height={6 * s} rx={1.5} fill="#C98A5A" />
      <Rect x={x - 3.4 * s} y={base - 6 * s} width={6.8 * s} height={2 * s} fill={shade('#C98A5A', 16)} />
      <Circle cx={x} cy={base - 10 * s} r={5 * s} fill="#7CB257" />
      <Circle cx={x - 3 * s} cy={base - 8 * s} r={3 * s} fill="#8EC56A" />
      <Circle cx={x + 3 * s} cy={base - 8 * s} r={3 * s} fill="#69A047" />
    </G>
  );
}

function Sign({ x, base, text, color = '#9A764C', s = 1 }: { x: number; base: number; text: string; color?: string; s?: number }) {
  const w = Math.max(34, text.length * 6.4) * s;
  return (
    <G>
      <Rect x={x - 1.5 * s} y={base - 18 * s} width={3 * s} height={18 * s} fill="#8A6A45" />
      <Rect x={x - w / 2} y={base - 31 * s} width={w} height={13 * s} rx={3} fill={color} stroke="#FFFFFF" strokeWidth={1} />
      <SvgText x={x} y={base - 22 * s} fontSize={7.5 * s} fontWeight="bold" fill="#FFFFFF" textAnchor="middle">{text}</SvgText>
    </G>
  );
}

/** Diagonal glass reflection streaks for windows / doors. */
function Glass({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <G>
      <Polygon points={`${x + w * 0.18},${y} ${x + w * 0.4},${y} ${x},${y + h * 0.55} ${x},${y + h * 0.3}`} fill="#FFFFFF" opacity={0.35} />
      <Polygon points={`${x + w * 0.6},${y} ${x + w * 0.78},${y} ${x + w * 0.22},${y + h} ${x + w * 0.05},${y + h}`} fill="#FFFFFF" opacity={0.22} />
    </G>
  );
}

/** Cutaway room with floor, back + side walls, skirting, ceiling beam, picture
 *  frame and a curtained window — reads as a proper 3D interior. */
function Room({ floor, wall, w = 152, h = 84, window: showWin = true, rug, art = true }: { floor: string; wall: string; w?: number; h?: number; window?: boolean; rug?: string; art?: boolean }) {
  const night = React.useContext(NightContext);
  const floorC = night ? shade(floor, 44) : floor;
  const wallC = night ? shade(wall, 50) : wall;
  const x = GX - w / 2;
  const baseY = GY + 12;
  const topY = baseY - h;
  const dx = 24;
  const dy = 13;
  return (
    <G>
      <Ellipse cx={GX + 6} cy={baseY + 8} rx={w * 0.64} ry={12} fill="#000" opacity={0.1} />
      {/* floor + sheen */}
      <Polygon points={`${x},${baseY} ${x + w},${baseY} ${x + w + dx},${baseY - dy} ${x + dx},${baseY - dy}`} fill={floorC} />
      <Polygon points={`${x + dx * 0.4},${baseY - dy * 0.4} ${x + w * 0.5},${baseY - dy * 0.4} ${x + w * 0.62},${baseY - dy} ${x + dx},${baseY - dy}`} fill={night ? '#FFE49A' : '#FFFFFF'} opacity={night ? 0.1 : 0.06} />
      {/* floor boards */}
      {[0.3, 0.55, 0.8].map((f, i) => (
        <Line key={i} x1={x + w * f} y1={baseY} x2={x + dx + w * f} y2={baseY - dy} stroke={shade(floorC, 10)} strokeWidth={0.8} opacity={0.5} />
      ))}
      {/* back wall (with light gradient strips) */}
      <Polygon points={`${x + dx},${baseY - dy} ${x + w + dx},${baseY - dy} ${x + w + dx},${topY - dy} ${x + dx},${topY - dy}`} fill={wallC} />
      <Polygon points={`${x + dx},${topY - dy} ${x + w + dx},${topY - dy} ${x + w + dx},${topY - dy + h * 0.3} ${x + dx},${topY - dy + h * 0.3}`} fill={night ? '#FFE49A' : tint(wallC, 10)} opacity={night ? 0.12 : 0.6} />
      {/* side wall */}
      <Polygon points={`${x},${baseY} ${x + dx},${baseY - dy} ${x + dx},${topY - dy} ${x},${topY}`} fill={shade(wallC, 16)} />
      {/* ceiling beam */}
      <Polygon points={`${x + dx},${topY - dy} ${x + w + dx},${topY - dy} ${x + w + dx},${topY - dy + 3} ${x + dx},${topY - dy + 3}`} fill={shade(wallC, 30)} opacity={0.7} />
      {/* skirting */}
      <Polygon points={`${x + dx},${baseY - dy} ${x + w + dx},${baseY - dy} ${x + w + dx},${baseY - dy - 4} ${x + dx},${baseY - dy - 4}`} fill={shade(wallC, 26)} />
      {rug && (
        <G>
          <Ellipse cx={GX + 6} cy={baseY - 6} rx={w * 0.34} ry={11} fill={rug} opacity={0.85} />
          <Ellipse cx={GX + 6} cy={baseY - 6} rx={w * 0.26} ry={8} fill="none" stroke="#FFFFFF" strokeWidth={1} opacity={0.4} />
        </G>
      )}
      {/* framed picture on back wall */}
      {art && (
        <G>
          <Rect x={x + dx + 14} y={topY - dy + 12} width={18} height={14} rx={1.5} fill="#FFF7EE" stroke="#B98E5A" strokeWidth={1.6} />
          <Polygon points={`${x + dx + 16},${topY - dy + 23} ${x + dx + 22},${topY - dy + 17} ${x + dx + 30},${topY - dy + 23}`} fill="#8FC468" />
          <Circle cx={x + dx + 27} cy={topY - dy + 16} r={1.6} fill="#FFD24C" />
        </G>
      )}
      {showWin && (
        <G>
          {night && <Rect x={x + w + dx - 38} y={topY - dy + 10} width={32} height={28} rx={4} fill="#FFE08A" opacity={0.35} />}
          <Rect x={x + w + dx - 34} y={topY - dy + 14} width={24} height={20} rx={2} fill={night ? '#FFE08A' : '#BFE0F2'} stroke={night ? '#FFF3C4' : '#FFFFFF'} strokeWidth={1.6} />
          <Line x1={x + w + dx - 22} y1={topY - dy + 14} x2={x + w + dx - 22} y2={topY - dy + 34} stroke={night ? '#E8C265' : '#FFFFFF'} strokeWidth={1} />
          {!night && <Glass x={x + w + dx - 34} y={topY - dy + 14} w={24} h={20} />}
          <Polygon points={`${x + w + dx - 37},${topY - dy + 12} ${x + w + dx - 29},${topY - dy + 12} ${x + w + dx - 29},${topY - dy + 36} ${x + w + dx - 37},${topY - dy + 36}`} fill="#E0764B" opacity={0.55} />
          <Rect x={x + w + dx - 38} y={topY - dy + 11} width={30} height={3} rx={1} fill="#C99A6B" />
        </G>
      )}
    </G>
  );
}

/** Distant skyline backdrop for a topic zone (silhouette buildings). */
export function Skyline({ yBase, width, accent, night }: { yBase: number; width: number; accent: string; night: boolean }) {
  const n = Math.max(7, Math.round(width / 54));
  const step = width / n;
  const col = night ? '#2B3252' : tint(accent, 64);
  const op = night ? 0.92 : 0.42;
  const items: React.ReactElement[] = [];
  // soft haze behind
  items.push(<Rect key="haze" x={0} y={yBase - 96} width={width} height={104} fill={col} opacity={night ? 0.28 : 0.16} />);
  for (let i = 0; i < n; i++) {
    const bx = i * step;
    const h = 30 + ((i * 53) % 5) * 13;
    const bw = step * 0.82;
    items.push(<Rect key={`b${i}`} x={bx} y={yBase - h} width={bw} height={h} rx={2} fill={col} opacity={op} />);
    if (i % 3 === 0) items.push(<Polygon key={`r${i}`} points={`${bx - 2},${yBase - h} ${bx + bw / 2},${yBase - h - 11} ${bx + bw + 2},${yBase - h}`} fill={col} opacity={op} />);
    if (i % 4 === 1) items.push(<Rect key={`a${i}`} x={bx + bw / 2 - 1} y={yBase - h - 16} width={2} height={9} fill={col} opacity={op} />);
    if (night) {
      for (let wy = yBase - h + 7; wy < yBase - 7; wy += 9) {
        for (let wx = bx + 4; wx < bx + bw - 3; wx += 8) {
          if ((i + Math.round(wx) + Math.round(wy)) % 3 === 0) {
            items.push(<Rect key={`w${i}-${wx}-${wy}`} x={wx} y={wy} width={3} height={4} fill="#FFE08A" opacity={0.85} />);
          }
        }
      }
    }
  }
  return <G>{items}</G>;
}

/** A small secondary shop for the opposite side of the road (town fill). */
export function MiniShop({
  x, y, s = 1, label, wall, roof, person = '#5BA6C9',
}: { x: number; y: number; s?: number; label: string; wall: string; roof: string; person?: string }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <Build x={-32} base={0} w={64} h={50} wall={wall} roof={roof} label={label} awning glow />
      <Plant x={-40} base={6} s={0.8} />
      <Person x={6} base={9} s={0.9} shirt={person} />
      <Bush x={42} y={8} s={0.7} />
    </G>
  );
}

/** Sparse night stars across the world. */
export function Stars({ width, height }: { width: number; height: number }) {
  const items: React.ReactElement[] = [];
  for (let i = 0; i < 90; i++) {
    const x = ((i * 97) % 1000) / 1000 * width;
    const y = ((i * 421) % 1000) / 1000 * height;
    const r = i % 4 === 0 ? 1.5 : 0.9;
    items.push(<Circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={i % 3 === 0 ? 0.85 : 0.5} />);
  }
  return <G>{items}</G>;
}

/* ───────────────────────── 20 scenes ───────────────────────── */

const T_STONE = '#E9DFC8';
const T_GRASS = '#BBDD9C';
const T_PAVE = '#E3DAC8';
const T_WOOD = '#E9CFA6';

function TownSquareScene() {
  return (
    <G>
      <Platform top={T_STONE} side="#CBBE9E" paved />
      <Hedge x={GX - 96} y={GY + 6} w={30} />
      <Hedge x={GX + 66} y={GY + 6} w={30} />
      {/* fountain */}
      <Ellipse cx={GX} cy={GY - 2} rx={26} ry={12} fill="#AFC8D2" />
      <Ellipse cx={GX} cy={GY - 4} rx={22} ry={10} fill="#BFE6F5" />
      <Ellipse cx={GX} cy={GY - 5} rx={12} ry={5.5} fill="#9FD0EC" />
      <Rect x={GX - 2.4} y={GY - 24} width={4.8} height={16} rx={2} fill="#CBD8DE" />
      <Circle cx={GX} cy={GY - 26} r={5} fill="#CFEFFB" />
      <Path d={`M ${GX - 6} ${GY - 22} Q ${GX} ${GY - 30} ${GX + 6} ${GY - 22}`} stroke="#CFEFFB" strokeWidth={2} fill="none" />
      <Lamp x={GX - 74} base={GY - 2} />
      <Lamp x={GX + 74} base={GY - 2} />
      <Bench x={GX - 54} base={GY + 16} />
      <Bench x={GX + 54} base={GY + 16} />
      <Person x={GX - 30} base={GY + 22} shirt="#5BA6C9" wave />
      <Person x={GX + 30} base={GY + 22} shirt="#E0764B" dress />
      <Person x={GX + 44} base={GY + 24} s={0.85} shirt="#7FB04F" />
      <Tree x={GX - 90} base={GY + 2} s={0.85} />
      <Tree x={GX + 92} base={GY + 4} s={0.85} />
      <Flower x={GX - 16} y={GY + 24} color="#FF9FC0" />
      <Flower x={GX + 12} y={GY + 26} color="#FFD24C" />
    </G>
  );
}

function ParkScene() {
  return (
    <G>
      <Platform top={T_GRASS} side="#9ECB78" flowers />
      <Path d={`M ${GX - 84} ${GY + 22} Q ${GX} ${GY + 2} ${GX + 84} ${GY + 22}`} stroke="#D8C9A0" strokeWidth={11} fill="none" strokeLinecap="round" />
      <Path d={`M ${GX - 84} ${GY + 22} Q ${GX} ${GY + 2} ${GX + 84} ${GY + 22}`} stroke="#E6DABA" strokeWidth={5} fill="none" strokeLinecap="round" />
      <Tree x={GX - 62} base={GY - 2} s={1.05} />
      <Tree x={GX + 72} base={GY + 2} s={1.15} />
      <Bush x={GX + 40} y={GY + 8} s={0.9} />
      <Bench x={GX - 18} base={GY + 12} s={1.1} />
      <Person x={GX - 20} base={GY + 8} shirt="#7E6BD0" />
      <Person x={GX + 18} base={GY + 16} shirt="#E0A526" />
      <Lamp x={GX - 84} base={GY + 6} s={0.85} />
      <Flower x={GX - 40} y={GY + 22} color="#E0699A" />
      <Flower x={GX + 4} y={GY + 24} color="#FFD24C" />
      <Flower x={GX + 52} y={GY + 22} color="#7E6BD0" />
    </G>
  );
}

function CafeCornerScene() {
  return (
    <G>
      <Platform top={T_PAVE} side="#CCC0A6" paved />
      <Build x={GX + 14} base={GY - 2} w={70} h={60} wall="#F3DDB6" roof="#C0533B" label="CAFÉ" awning glow hangSign="OPEN" />
      <Umbrella x={GX - 34} base={GY + 4} color="#C0533B" />
      <RoundTable x={GX - 34} base={GY + 10} />
      <Chair x={GX - 50} base={GY + 13} />
      <Chair x={GX - 18} base={GY + 13} />
      <Person x={GX - 50} base={GY + 17} shirt="#5BA6C9" />
      <Person x={GX - 18} base={GY + 17} shirt="#E0699A" dress />
      <Plant x={GX + 84} base={GY + 12} />
      <Bush x={GX - 78} y={GY + 14} s={0.85} />
    </G>
  );
}

function GiftShopScene() {
  return (
    <G>
      <Platform top={T_PAVE} side="#CCC0A6" paved />
      <Build x={GX - 6} base={GY - 2} w={72} h={60} wall="#FAD9E2" roof="#E0699A" label="GIFTS" awning glow hangSign="GIFTS" />
      {/* balloons */}
      <Line x1={GX + 58} y1={GY - 40} x2={GX + 58} y2={GY - 18} stroke="#C99A6B" strokeWidth={1} />
      <Circle cx={GX + 54} cy={GY - 44} r={5} fill="#E0699A" />
      <Circle cx={GX + 62} cy={GY - 42} r={5} fill="#5BA6C9" />
      <Circle cx={GX + 58} cy={GY - 50} r={5} fill="#FFD24C" />
      {/* gift boxes */}
      <Rect x={GX - 64} y={GY - 4} width={16} height={14} rx={2} fill="#E0764B" />
      <Rect x={GX - 64} y={GY + 2} width={16} height={2.4} fill="#FFE08A" />
      <Path d={`M ${GX - 56} ${GY - 4} l -3 -4 l 6 0 z`} fill="#FFE08A" />
      <Rect x={GX - 46} y={GY} width={12} height={10} rx={2} fill="#5BA6C9" />
      <Rect x={GX - 46} y={GY + 4} width={12} height={2} fill="#FFFFFF" />
      <Person x={GX - 22} base={GY + 16} shirt="#7FB04F" wave />
      <Person x={GX - 40} base={GY + 18} s={0.85} shirt="#E0A526" dress />
      <Plant x={GX + 80} base={GY + 12} />
    </G>
  );
}

function HomeRoutineScene() {
  return (
    <G>
      <Room floor={T_WOOD} wall="#F4E3CE" rug="#C77FB0" />
      <Rect x={GX - 64} y={GY - 14} width={36} height={14} rx={3} fill="#9CC4D8" />
      <Rect x={GX - 64} y={GY - 19} width={13} height={7} rx={2} fill="#FFFFFF" />
      <Rect x={GX - 30} y={GY - 22} width={5} height={22} rx={2} fill="#C0673D" />
      {/* clock */}
      <Circle cx={GX + 30} cy={GY - 48} r={9} fill="#FFFFFF" stroke="#C9B393" strokeWidth={2} />
      <Line x1={GX + 30} y1={GY - 48} x2={GX + 30} y2={GY - 54} stroke="#5B4A32" strokeWidth={1.4} />
      <Line x1={GX + 30} y1={GY - 48} x2={GX + 35} y2={GY - 48} stroke="#5B4A32" strokeWidth={1.4} />
      {/* breakfast table */}
      <Rect x={GX + 8} y={GY - 6} width={30} height={5} rx={2} fill="#C99A6B" />
      <Rect x={GX + 14} y={GY - 1} width={2.4} height={6} fill="#B0875A" />
      <Rect x={GX + 30} y={GY - 1} width={2.4} height={6} fill="#B0875A" />
      <Circle cx={GX + 16} cy={GY - 8} r={3} fill="#FFFFFF" />
      <Circle cx={GX + 28} cy={GY - 9} r={2.4} fill="#E0A526" />
      {/* calendar */}
      <Rect x={GX - 16} y={GY - 52} width={14} height={14} rx={2} fill="#FFFFFF" stroke="#C9B393" strokeWidth={1.4} />
      <Rect x={GX - 16} y={GY - 52} width={14} height={4} fill="#E0764B" />
      {/* slippers + corner plant */}
      <Ellipse cx={GX - 44} cy={GY + 4} rx={4} ry={1.8} fill="#7E6BD0" />
      <Ellipse cx={GX - 38} cy={GY + 5} rx={4} ry={1.8} fill="#7E6BD0" />
      <Plant x={GX + 50} base={GY + 4} s={0.85} />
      <Person x={GX - 2} base={GY + 6} shirt="#5BA6C9" />
    </G>
  );
}

function BusStopScene() {
  return (
    <G>
      <Platform top={T_PAVE} side="#CCC0A6" />
      <Rect x={GX - 96} y={GY + 12} width={192} height={16} fill="#AEB4BB" opacity={0.85} />
      <Line x1={GX - 84} y1={GY + 20} x2={GX + 84} y2={GY + 20} stroke="#FFFFFF" strokeWidth={2.4} strokeDasharray="9 9" />
      {/* parked bus */}
      <G>
        <Ellipse cx={GX - 54} cy={GY + 24} rx={34} ry={4} fill="#000" opacity={0.12} />
        <Rect x={GX - 86} y={GY - 4} width={64} height={26} rx={5} fill="#F0B43C" stroke="#D89A24" strokeWidth={1.4} />
        <Rect x={GX - 86} y={GY + 8} width={64} height={5} fill="#E0A526" />
        <Rect x={GX - 82} y={GY - 1} width={50} height={9} rx={2} fill="#BFE0F2" />
        {[0, 1, 2, 3].map((i) => (
          <Rect key={i} x={GX - 80 + i * 12} y={GY} width={9} height={7} rx={1} fill="#BFE0F2" stroke="#FFFFFF" strokeWidth={0.8} />
        ))}
        <Glass x={GX - 82} y={GY - 1} w={50} h={9} />
        <Rect x={GX - 25} y={GY - 2} width={4} height={20} rx={1} fill="#D89A24" />
        <Circle cx={GX - 24} cy={GY + 6} r={2} fill="#FFE9A8" />
        <Circle cx={GX - 74} cy={GY + 22} r={5} fill="#3F3B37" />
        <Circle cx={GX - 74} cy={GY + 22} r={2} fill="#7E7873" />
        <Circle cx={GX - 38} cy={GY + 22} r={5} fill="#3F3B37" />
        <Circle cx={GX - 38} cy={GY + 22} r={2} fill="#7E7873" />
        <Rect x={GX - 84} y={GY - 8} width={24} height={5} rx={2} fill="#5C6BC0" />
        <SvgText x={GX - 72} y={GY - 4} fontSize={4.6} fontWeight="bold" fill="#FFFFFF" textAnchor="middle">CITY 7</SvgText>
      </G>
      <Rect x={GX - 6} y={GY - 32} width={62} height={5} rx={2} fill="#5C6BC0" />
      <Rect x={GX - 4} y={GY - 28} width={3} height={28} fill="#9AA6C7" />
      <Rect x={GX + 50} y={GY - 28} width={3} height={28} fill="#9AA6C7" />
      <Rect x={GX + 2} y={GY - 26} width={48} height={18} rx={2} fill="#CFE0F0" opacity={0.6} />
      <Rect x={GX} y={GY - 8} width={50} height={6} rx={2} fill="#B7C3DC" />
      <Sign x={GX - 30} base={GY - 2} text="BUS" color="#5C6BC0" />
      <Person x={GX + 8} base={GY + 6} shirt="#E0764B" />
      <Person x={GX + 22} base={GY + 8} shirt="#7FB04F" wave />
      <Person x={GX + 36} base={GY + 10} s={0.85} shirt="#E0A526" dress />
      <Bush x={GX - 80} y={GY + 16} s={0.85} />
      <Lamp x={GX + 78} base={GY - 4} />
    </G>
  );
}

function TownGateScene() {
  return (
    <G>
      <Platform top={T_STONE} side="#CBBE9E" w={210} paved />
      <Rect x={GX - 66} y={GY - 72} width={20} height={72} rx={3} fill="#CDA877" />
      <Rect x={GX - 66} y={GY - 72} width={6} height={72} fill={tint('#CDA877', 16)} />
      <Rect x={GX + 46} y={GY - 72} width={20} height={72} rx={3} fill="#CDA877" />
      <Rect x={GX - 72} y={GY - 88} width={144} height={22} rx={6} fill="#B98E5A" />
      <Polygon points={`${GX - 72},${GY - 88} ${GX + 72},${GY - 88} ${GX + 60},${GY - 98} ${GX - 60},${GY - 98}`} fill="#A77E4C" />
      <SvgText x={GX} y={GY - 73} fontSize={11} fontWeight="bold" fill="#FFF7EE" textAnchor="middle">ENGLISH TOWN</SvgText>
      <Lamp x={GX - 80} base={GY} />
      <Lamp x={GX + 80} base={GY} />
      <Hedge x={GX - 104} y={GY + 8} w={26} />
      <Hedge x={GX + 78} y={GY + 8} w={26} />
      <Person x={GX} base={GY + 18} shirt="#5BA6C9" wave />
      <Flower x={GX - 30} y={GY + 16} color="#E0699A" />
      <Flower x={GX + 30} y={GY + 16} color="#FFD24C" />
    </G>
  );
}

function LivingRoomScene() {
  return (
    <G>
      <Room floor={T_WOOD} wall="#EFE0CB" rug="#5BA6C9" />
      {/* TV unit */}
      <Rect x={GX + 2} y={GY + 2} width={30} height={18} rx={3} fill="#4F4945" />
      <Rect x={GX + 6} y={GY - 4} width={22} height={12} rx={2} fill="#9FD0EC" />
      <Glass x={GX + 6} y={GY - 4} w={22} h={12} />
      <Rect x={GX + 5} y={GY + 20} width={4} height={5} fill="#3F3B37" />
      <Rect x={GX + 26} y={GY + 20} width={4} height={5} fill="#3F3B37" />
      {/* bookshelf */}
      <Rect x={GX + 40} y={GY - 26} width={16} height={30} rx={2} fill="#A9764C" />
      {[0, 1, 2].map((i) => (
        <Rect key={i} x={GX + 41} y={GY - 22 + i * 9} width={14} height={2} fill="#7E5736" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Rect key={i} x={GX + 42 + i * 3.4} y={GY - 21} width={2.6} height={6} fill={['#E0699A', '#5BA6C9', '#7FB04F', '#E0A526'][i]} />
      ))}
      {/* sofa with cushion */}
      <Rect x={GX - 68} y={GY - 10} width={42} height={12} rx={3} fill="#E0764B" />
      <Rect x={GX - 68} y={GY - 19} width={42} height={10} rx={3} fill="#E88A63" />
      <Rect x={GX - 70} y={GY - 18} width={6} height={18} rx={3} fill="#D86A41" />
      <Rect x={GX - 30} y={GY - 18} width={6} height={18} rx={3} fill="#D86A41" />
      <Rect x={GX - 60} y={GY - 16} width={9} height={8} rx={2} fill="#FFD24C" transform={`rotate(-12 ${GX - 56} ${GY - 12})`} />
      {/* coffee table + cup + floor lamp + plant */}
      <Rect x={GX - 44} y={GY + 4} width={22} height={4} rx={2} fill="#C99A6B" />
      <Rect x={GX - 38} y={GY + 8} width={2.4} height={5} fill="#B0875A" />
      <Rect x={GX - 26} y={GY + 8} width={2.4} height={5} fill="#B0875A" />
      <Circle cx={GX - 33} cy={GY + 2} r={2} fill="#FFFFFF" stroke="#C99A6B" strokeWidth={0.8} />
      <Rect x={GX - 74} y={GY - 26} width={2.4} height={26} fill="#9A764C" />
      <Path d={`M ${GX - 79} ${GY - 26} q 5 -8 10 0 z`} fill="#FFE49A" />
      <Plant x={GX - 8} base={GY + 6} s={0.85} />
      <Person x={GX - 56} base={GY - 2} shirt="#7E6BD0" />
      <Person x={GX - 4} base={GY + 10} shirt="#5BA6C9" wave />
    </G>
  );
}

function KitchenScene() {
  return (
    <G>
      <Room floor={T_WOOD} wall="#E6EFDC" art={false} />
      {/* upper cabinets */}
      <Rect x={GX - 66} y={GY - 50} width={50} height={12} rx={2} fill="#D8E0CC" stroke="#C2CCB4" strokeWidth={1} />
      <Line x1={GX - 41} y1={GY - 50} x2={GX - 41} y2={GY - 38} stroke="#C2CCB4" strokeWidth={1} />
      {/* counter + lower cabinets */}
      <Rect x={GX - 66} y={GY - 12} width={56} height={12} rx={2} fill="#C9B393" />
      <Rect x={GX - 66} y={GY - 16} width={56} height={4} fill="#E0D2B0" />
      <Line x1={GX - 48} y1={GY - 12} x2={GX - 48} y2={GY} stroke="#B0875A" strokeWidth={1} />
      <Line x1={GX - 30} y1={GY - 12} x2={GX - 30} y2={GY} stroke="#B0875A" strokeWidth={1} />
      {/* stove + pot + steam */}
      <Rect x={GX - 64} y={GY - 18} width={14} height={4} rx={1} fill="#5B5550" />
      <Ellipse cx={GX - 57} cy={GY - 18} rx={6} ry={2.6} fill="#7E7873" />
      <Path d={`M ${GX - 59} ${GY - 22} q 2 -6 4 0`} stroke="#CFE0F0" strokeWidth={1.2} fill="none" opacity={0.6} />
      {/* hanging utensils */}
      <Line x1={GX - 38} y1={GY - 24} x2={GX - 38} y2={GY - 30} stroke="#9AA6C7" strokeWidth={1.6} />
      <Line x1={GX - 33} y1={GY - 24} x2={GX - 33} y2={GY - 30} stroke="#9AA6C7" strokeWidth={1.6} />
      {/* fridge */}
      <Rect x={GX + 22} y={GY - 44} width={22} height={44} rx={3} fill="#EEF3F6" stroke="#C7D2D8" strokeWidth={1.4} />
      <Line x1={GX + 22} y1={GY - 22} x2={GX + 44} y2={GY - 22} stroke="#C7D2D8" strokeWidth={1.4} />
      <Rect x={GX + 40} y={GY - 40} width={2} height={6} fill="#9AA6C7" />
      <Rect x={GX + 40} y={GY - 18} width={2} height={5} fill="#9AA6C7" />
      <Circle cx={GX + 30} cy={GY - 36} r={1.4} fill="#E0699A" />
      {/* window */}
      <Rect x={GX - 18} y={GY - 48} width={16} height={14} rx={1.5} fill="#BFE0F2" stroke="#FFFFFF" strokeWidth={1.4} />
      <Glass x={GX - 18} y={GY - 48} w={16} h={14} />
      <Person x={GX - 40} base={GY + 2} shirt="#E0699A" dress />
      <Person x={GX + 6} base={GY + 8} shirt="#5BA6C9" wave />
    </G>
  );
}

function BedroomTripScene() {
  return (
    <G>
      <Room floor={T_WOOD} wall="#EAE2F3" rug="#7E6BD0" />
      <Rect x={GX - 68} y={GY - 12} width={50} height={14} rx={3} fill="#9CC4D8" />
      <Rect x={GX - 62} y={GY - 18} width={15} height={7} rx={2} fill="#FFFFFF" />
      <Rect x={GX - 42} y={GY - 17} width={24} height={15} rx={1} fill="#F2E8C9" stroke="#C9B393" strokeWidth={1} />
      <Line x1={GX - 38} y1={GY - 12} x2={GX - 22} y2={GY - 6} stroke="#E0764B" strokeWidth={1.2} />
      <Circle cx={GX - 26} cy={GY - 9} r={1.6} fill="#C0533B" />
      {/* suitcase */}
      <Rect x={GX + 30} y={GY - 6} width={22} height={15} rx={2} fill="#C0673D" />
      <Rect x={GX + 30} y={GY + 0} width={22} height={2.6} fill="#8A4E2C" />
      <Rect x={GX + 39} y={GY - 10} width={4} height={4} rx={1} fill="#8A4E2C" />
      {/* wardrobe */}
      <Rect x={GX + 40} y={GY - 44} width={20} height={44} rx={2} fill="#B98456" stroke="#9A6B43" strokeWidth={1} />
      <Line x1={GX + 50} y1={GY - 44} x2={GX + 50} y2={GY} stroke="#9A6B43" strokeWidth={1} />
      <Circle cx={GX + 48} cy={GY - 22} r={1.2} fill="#5B4A32" />
      <Circle cx={GX + 52} cy={GY - 22} r={1.2} fill="#5B4A32" />
      {/* bedside lamp */}
      <Rect x={GX - 70} y={GY - 16} width={8} height={6} rx={1} fill="#C99A6B" />
      <Path d={`M ${GX - 69} ${GY - 16} l 6 0 l -1.5 -5 l -3 0 z`} fill="#FFE49A" />
      <Person x={GX + 2} base={GY + 8} shirt="#7E6BD0" />
      <Person x={GX + 16} base={GY + 10} s={0.85} shirt="#E0A526" />
    </G>
  );
}

function DoorwaySorryScene() {
  return (
    <G>
      <Platform top={T_PAVE} side="#CCC0A6" />
      <Build x={GX - 30} base={GY - 2} w={72} h={52} wall="#F3E0C8" roof="#C0673D" peak chimney />
      <Rect x={GX - 6} y={GY - 28} width={18} height={28} rx={2} fill="#7E5736" />
      <Rect x={GX - 6} y={GY - 28} width={6} height={28} fill="#9A6B43" />
      <Circle cx={GX + 8} cy={GY - 14} r={1.3} fill="#E8C77A" />
      {/* doormat + shoes + pot */}
      <Ellipse cx={GX + 3} cy={GY + 1} rx={12} ry={3} fill="#C0533B" opacity={0.6} />
      <Ellipse cx={GX - 16} cy={GY + 2} rx={4} ry={2} fill="#5B5550" />
      <Ellipse cx={GX - 9} cy={GY + 4} rx={4} ry={2} fill="#7E6BD0" />
      <Plant x={GX + 24} base={GY + 2} />
      <Person x={GX + 32} base={GY + 10} shirt="#5BA6C9" />
      <Person x={GX + 48} base={GY + 12} shirt="#E0699A" dress />
      <SvgText x={GX + 40} y={GY - 16} fontSize={11} fill="#E0699A">♥</SvgText>
    </G>
  );
}

function DiningTableScene() {
  return (
    <G>
      <Room floor={T_WOOD} wall="#F4E3CE" rug="#E0A526" />
      <Rect x={GX - 1.6} y={GY - 62} width={3.2} height={22} fill="#9A764C" />
      <Path d={`M ${GX - 8} ${GY - 40} l 16 0 l -3 6 l -10 0 z`} fill="#FFE49A" stroke="#E0B85A" strokeWidth={1} />
      <Ellipse cx={GX} cy={GY - 2} rx={44} ry={14} fill="#D8C2A0" stroke="#C2A87E" strokeWidth={1.6} />
      <Ellipse cx={GX} cy={GY - 4} rx={40} ry={11} fill="#E6D4B4" />
      {[-24, 0, 24].map((dx, i) => (
        <Circle key={i} cx={GX + dx} cy={GY - 4} r={4} fill="#FFFFFF" stroke="#D8C7A8" strokeWidth={0.8} />
      ))}
      <Circle cx={GX - 12} cy={GY - 7} r={3} fill="#E0764B" />
      <Circle cx={GX + 12} cy={GY - 7} r={3} fill="#7FB04F" />
      <Rect x={GX - 2} y={GY - 12} width={4} height={5} fill="#9FD0EC" />
      {/* sideboard with vase */}
      <Rect x={GX - 72} y={GY - 18} width={18} height={12} rx={2} fill="#B98456" />
      <Path d={`M ${GX - 65} ${GY - 18} q -2 -7 4 -7 q 6 0 4 7 z`} fill="#7FB04F" />
      {/* seated family */}
      <SeatedPerson x={GX - 40} base={GY + 8} shirt="#7E6BD0" />
      <SeatedPerson x={GX} base={GY + 14} shirt="#5BA6C9" />
      <SeatedPerson x={GX + 40} base={GY + 8} shirt="#E0A526" dress />
    </G>
  );
}

function NeighbourhoodParkScene() {
  return (
    <G>
      <Platform top={T_GRASS} side="#9ECB78" w={208} flowers />
      <Path d={`M ${GX - 86} ${GY + 20} Q ${GX} ${GY - 2} ${GX + 86} ${GY + 20}`} stroke="#D8C9A0" strokeWidth={9} fill="none" strokeLinecap="round" />
      {/* swing */}
      <Rect x={GX - 72} y={GY - 32} width={3} height={32} fill="#9A764C" />
      <Rect x={GX - 44} y={GY - 32} width={3} height={32} fill="#9A764C" />
      <Rect x={GX - 73} y={GY - 34} width={32} height={3} rx={1.5} fill="#A9764C" />
      <Line x1={GX - 60} y1={GY - 31} x2={GX - 60} y2={GY - 12} stroke="#7E6B5A" strokeWidth={1.2} />
      <Line x1={GX - 53} y1={GY - 31} x2={GX - 53} y2={GY - 12} stroke="#7E6B5A" strokeWidth={1.2} />
      <Rect x={GX - 62} y={GY - 12} width={8} height={2.6} fill="#5C6BC0" />
      <Tree x={GX + 70} base={GY} s={1.15} />
      <Bush x={GX - 84} y={GY + 12} s={0.9} />
      {/* picnic */}
      <Rect x={GX - 6} y={GY + 6} width={30} height={15} rx={2} fill="#E0699A" opacity={0.8} />
      <Path d={`M ${GX - 6} ${GY + 6} l 30 0 m -22 0 l 0 15 m 8 -15 l 0 15 m 8 -15 l 0 15`} stroke="#FFFFFF" strokeWidth={0.8} opacity={0.5} />
      <Rect x={GX + 4} y={GY + 3} width={9} height={7} rx={2} fill="#C0673D" />
      <Person x={GX + 30} base={GY + 14} shirt="#7FB04F" />
      <Person x={GX + 44} base={GY + 16} s={0.8} shirt="#E0A526" dress />
      <Flower x={GX - 30} y={GY + 18} color="#FFD24C" />
      <Flower x={GX + 60} y={GY + 18} color="#E0699A" />
    </G>
  );
}

function BalconyScene() {
  return (
    <G>
      <Platform top="#E2D6C0" side="#C7B89A" />
      <Rect x={GX - 72} y={GY - 58} width={144} height={58} rx={3} fill="#F0E2CC" />
      <Rect x={GX - 72} y={GY - 58} width={144} height={6} fill={shade('#F0E2CC', 14)} />
      <Rect x={GX - 30} y={GY - 50} width={26} height={28} rx={2} fill="#BFD9EC" stroke="#FFF" strokeWidth={1.6} />
      <Line x1={GX - 17} y1={GY - 50} x2={GX - 17} y2={GY - 22} stroke="#FFFFFF" strokeWidth={1} />
      <Polygon points={`${GX - 32},${GY - 52} ${GX - 24},${GY - 52} ${GX - 24},${GY - 20} ${GX - 32},${GY - 20}`} fill="#E0764B" opacity={0.45} />
      {/* railing */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Rect key={i} x={GX - 64 + i * 14} y={GY - 4} width={3} height={18} fill="#B7A98C" />
      ))}
      <Rect x={GX - 66} y={GY - 6} width={134} height={4} rx={2} fill="#A9764C" />
      <Plant x={GX - 58} base={GY - 4} s={1.1} />
      <Plant x={GX + 58} base={GY - 4} s={1.1} />
      <Flower x={GX + 40} y={GY - 6} color="#E0699A" />
      <Person x={GX - 12} base={GY + 8} shirt="#E0A526" dress />
      <Person x={GX + 20} base={GY + 8} shirt="#5BA6C9" wave />
    </G>
  );
}

function RestaurantHostScene() {
  return (
    <G>
      <Platform top="#E9D9C0" side="#CDBE9A" paved />
      <Build x={GX + 14} base={GY - 2} w={66} h={62} wall="#EFE2C9" roof="#9B6B4B" glow hangSign="DINE" />
      <Rect x={GX - 72} y={GY + 4} width={66} height={16} rx={2} fill="#C0533B" opacity={0.85} />
      <Rect x={GX - 72} y={GY + 4} width={66} height={3} fill={tint('#C0533B', 18)} opacity={0.6} />
      {/* podium */}
      <Rect x={GX - 46} y={GY - 16} width={22} height={16} rx={2} fill="#8A5E3C" />
      <Rect x={GX - 46} y={GY - 20} width={22} height={4} fill="#A9764C" />
      <Rect x={GX - 42} y={GY - 18} width={14} height={3} fill="#FFFFFF" />
      <Sign x={GX - 66} base={GY - 4} text="RESERVE" color="#9B6B4B" />
      <Person x={GX - 35} base={GY + 4} shirt="#3C4A66" />
      <Plant x={GX + 84} base={GY + 12} s={1.1} />
      <Lamp x={GX - 84} base={GY + 2} s={0.85} />
    </G>
  );
}

function RestaurantEntranceScene() {
  return (
    <G>
      <Platform top="#E9D9C0" side="#CDBE9A" paved />
      <Build x={GX - 34} base={GY - 2} w={80} h={64} wall="#EBDDC2" roof="#9B6B4B" label="BISTRO" glow steps />
      {/* string lights */}
      <Path d={`M ${GX - 36} ${GY - 56} Q ${GX} ${GY - 50} ${GX + 46} ${GY - 56}`} stroke="#C9A36B" strokeWidth={1} fill="none" />
      {[-28, -10, 8, 26].map((dx, i) => (
        <Circle key={i} cx={GX + dx} cy={GY - 52 + (i % 2)} r={1.6} fill="#FFE08A" />
      ))}
      <Rect x={GX - 4} y={GY - 32} width={22} height={32} rx={2} fill="#BFD9EC" stroke="#FFFFFF" strokeWidth={1.6} />
      <Line x1={GX + 7} y1={GY - 32} x2={GX + 7} y2={GY} stroke="#FFFFFF" strokeWidth={1} />
      <Glass x={GX - 4} y={GY - 32} w={22} h={32} />
      <Ellipse cx={GX + 6} cy={GY + 2} rx={14} ry={3} fill="#C0533B" opacity={0.6} />
      <Lamp x={GX - 30} base={GY} s={0.85} />
      <Person x={GX + 32} base={GY + 10} shirt="#3C4A66" />
      <Person x={GX + 48} base={GY + 12} shirt="#5BA6C9" wave />
      <Plant x={GX + 70} base={GY + 12} />
    </G>
  );
}

function RestaurantMenuScene() {
  return (
    <G>
      <Room floor="#E9D9C0" wall="#F2E6D2" rug="#C0533B" />
      <Ellipse cx={GX} cy={GY - 2} rx={42} ry={14} fill="#D8C2A0" stroke="#C2A87E" strokeWidth={1.6} />
      <Ellipse cx={GX} cy={GY - 4} rx={38} ry={11} fill="#E6D4B4" />
      <Polygon points={`${GX - 15},${GY - 11} ${GX},${GY - 15} ${GX},${GY - 4} ${GX - 15},${GY}`} fill="#FFFFFF" stroke="#C99A6B" strokeWidth={1} />
      <Polygon points={`${GX},${GY - 15} ${GX + 15},${GY - 11} ${GX + 15},${GY} ${GX},${GY - 4}`} fill="#F4ECD8" stroke="#C99A6B" strokeWidth={1} />
      <Line x1={GX - 10} y1={GY - 9} x2={GX - 4} y2={GY - 7} stroke="#C0533B" strokeWidth={0.8} />
      <Circle cx={GX - 24} cy={GY - 6} r={3} fill="#BFD9EC" />
      <Circle cx={GX + 24} cy={GY - 6} r={3} fill="#BFD9EC" />
      <Rect x={GX - 2} y={GY - 13} width={4} height={5} fill="#9FD0EC" />
      {/* seated guests + waiter handing the menu */}
      <SeatedPerson x={GX - 30} base={GY + 8} shirt="#7E6BD0" />
      <SeatedPerson x={GX + 30} base={GY + 8} shirt="#E0699A" dress />
      <Person x={GX + 54} base={GY + 8} shirt="#3C4A66" />
      <Rect x={GX + 46} y={GY - 8} width={8} height={6} rx={1} fill="#FFF7EE" stroke="#C9B393" strokeWidth={1} transform={`rotate(-12 ${GX + 50} ${GY - 5})`} />
    </G>
  );
}

function RestaurantOrderingScene() {
  return (
    <G>
      <Room floor="#E9D9C0" wall="#F2E6D2" rug="#7FB04F" />
      <Ellipse cx={GX} cy={GY - 2} rx={42} ry={14} fill="#D8C2A0" stroke="#C2A87E" strokeWidth={1.6} />
      <Ellipse cx={GX} cy={GY - 4} rx={38} ry={11} fill="#E6D4B4" />
      <Circle cx={GX - 8} cy={GY - 6} r={3.6} fill="#FFFFFF" stroke="#D8C7A8" strokeWidth={0.8} />
      <Circle cx={GX - 8} cy={GY - 7} r={2} fill="#E0A526" />
      <Circle cx={GX + 10} cy={GY - 6} r={3} fill="#E0764B" />
      <Rect x={GX + 18} y={GY - 12} width={4} height={7} rx={1} fill="#9FD0EC" />
      <Rect x={GX - 22} y={GY - 12} width={4} height={7} rx={1} fill="#9FD0EC" />
      {/* two seated diners ordering + waiter with notepad */}
      <SeatedPerson x={GX - 30} base={GY + 8} shirt="#5BA6C9" />
      <SeatedPerson x={GX + 30} base={GY + 8} shirt="#E0A526" dress />
      <Person x={GX + 56} base={GY + 8} shirt="#3C4A66" />
      <Rect x={GX + 50} y={GY - 8} width={6} height={7} rx={1} fill="#FFFFFF" stroke="#C9B393" strokeWidth={1} />
      <Line x1={GX + 51} y1={GY - 6} x2={GX + 55} y2={GY - 6} stroke="#C2A87E" strokeWidth={0.6} />
      <Line x1={GX + 51} y1={GY - 4} x2={GX + 55} y2={GY - 4} stroke="#C2A87E" strokeWidth={0.6} />
    </G>
  );
}

function RestaurantBillingScene() {
  return (
    <G>
      <Room floor="#E9D9C0" wall="#F2E6D2" />
      <Rect x={GX - 42} y={GY - 16} width={84} height={16} rx={2} fill="#9B6B4B" />
      <Rect x={GX - 42} y={GY - 20} width={84} height={5} fill="#B98456" />
      <Rect x={GX - 42} y={GY - 4} width={84} height={4} fill={shade('#9B6B4B', 16)} />
      <Rect x={GX - 24} y={GY - 25} width={15} height={10} rx={1.5} fill="#5B5550" />
      <Rect x={GX - 22} y={GY - 23} width={11} height={6} rx={1} fill="#FFFFFF" />
      <Rect x={GX + 10} y={GY - 27} width={10} height={13} rx={2} fill="#3C4A66" />
      <Rect x={GX + 11.5} y={GY - 25} width={7} height={4} fill="#9FD0EC" />
      <Circle cx={GX + 26} cy={GY - 22} r={2} fill="#FFD24C" />
      <Person x={GX} base={GY - 18} shirt="#E0699A" dress />
      <Person x={GX + 36} base={GY + 6} shirt="#5BA6C9" />
    </G>
  );
}

function RestaurantExitScene() {
  return (
    <G>
      <Platform top="#E9D9C0" side="#CDBE9A" paved />
      <Build x={GX - 42} base={GY - 2} w={72} h={58} wall="#EBDDC2" roof="#9B6B4B" glow steps />
      <Rect x={GX - 14} y={GY - 30} width={22} height={30} rx={2} fill="#BFD9EC" stroke="#FFFFFF" strokeWidth={1.6} />
      <Glass x={GX - 14} y={GY - 30} w={22} h={30} />
      <SvgText x={GX - 3} y={GY - 36} fontSize={7} fontWeight="bold" fill="#5B4A32" textAnchor="middle">THANK YOU</SvgText>
      {/* feedback stand */}
      <Rect x={GX + 28} y={GY - 20} width={20} height={20} rx={2} fill="#FFFFFF" stroke="#C9B393" strokeWidth={1.4} />
      <SvgText x={GX + 38} y={GY - 7} fontSize={9} fill="#FFC53D" textAnchor="middle">★★★</SvgText>
      <Rect x={GX + 36} y={GY - 30} width={2} height={10} fill="#9A764C" />
      <Person x={GX + 8} base={GY + 10} shirt="#3C4A66" />
      <Person x={GX + 56} base={GY + 12} shirt="#5BA6C9" wave />
      <Plant x={GX - 4} base={GY + 2} s={0.85} />
    </G>
  );
}

/* ── Named exports (mirrored as files in ./scenes for reuse) ── */
export {
  TownSquareScene, ParkScene, CafeCornerScene, GiftShopScene, HomeRoutineScene,
  BusStopScene, TownGateScene, LivingRoomScene, KitchenScene, BedroomTripScene,
  DoorwaySorryScene, DiningTableScene, NeighbourhoodParkScene, BalconyScene,
  RestaurantHostScene, RestaurantEntranceScene, RestaurantMenuScene,
  RestaurantOrderingScene, RestaurantBillingScene, RestaurantExitScene,
};

/* ───────────────────────── dispatcher ───────────────────────── */

const SCENES: Record<string, () => React.ReactElement> = {
  town_square: TownSquareScene,
  park: ParkScene,
  cafe_corner: CafeCornerScene,
  gift_shop: GiftShopScene,
  home_routine: HomeRoutineScene,
  bus_stop: BusStopScene,
  town_gate: TownGateScene,
  living_room: LivingRoomScene,
  kitchen: KitchenScene,
  bedroom_trip: BedroomTripScene,
  doorway_sorry: DoorwaySorryScene,
  dining_table: DiningTableScene,
  neighbourhood_park: NeighbourhoodParkScene,
  balcony: BalconyScene,
  restaurant_host: RestaurantHostScene,
  restaurant_entrance: RestaurantEntranceScene,
  restaurant_menu: RestaurantMenuScene,
  restaurant_ordering: RestaurantOrderingScene,
  restaurant_billing: RestaurantBillingScene,
  restaurant_exit: RestaurantExitScene,
};

function LocationScene({ scene }: { scene: LayoutScene }) {
  const Comp = SCENES[scene.sceneType] ?? ParkScene;
  return (
    <G transform={`translate(${scene.ox} ${scene.oy}) scale(${scene.s})`}>
      <Comp />
    </G>
  );
}

export default LocationScene;
