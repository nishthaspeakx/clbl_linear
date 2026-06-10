/**
 * perspectivePath — math for the Fable/Mythos-style moving world.
 *
 * The journey is a 1-D distance along an endless road (1 unit = one level).
 * The AVATAR stays anchored near the bottom-centre of the screen; the WORLD
 * (road, pins, props) flows underneath it. Every world element has a journey
 * coordinate `s`; given the camera's `journey`, its depth-ahead is
 * `u = s - journey`, which maps to:
 *
 *   t  ∈ [0..1]  screen depth (0 = bottom edge, 1 = horizon)   t = T(u)
 *   y           screen y                                       y = yForDepth(t)
 *   x           screen x via a winding centreline               roadCenterX(s, t)
 *   scale       perspective size                                scaleForDepth(t)
 *
 * T(u) is a classic perspective compression 1 − A/(u+B) ahead of the anchor and
 * a C¹ linear extension behind it, so passed items slide smoothly off-screen.
 */
import { VIEWPORT_W, VIEWPORT_H } from './viewport';

export const HORIZON_Y = Math.round(VIEWPORT_H * 0.225); // sky above this line
export const BOTTOM_Y = VIEWPORT_H + 44;                  // road exits past bottom edge
export const CENTER_X = VIEWPORT_W / 2;

/** Avatar's anchored screen depth/position. */
export const ANCHOR_Y = Math.round(VIEWPORT_H * 0.732);
export const ANCHOR_T = (BOTTOM_Y - ANCHOR_Y) / (BOTTOM_Y - HORIZON_Y);

/** The current pin settles this far AHEAD of the avatar (journey units) —
 * effectively underfoot, so the traveller stands ON the glowing current node. */
export const PIN_AHEAD = 0.1;

const B = 2.6;                       // perspective rate (smaller = faster recede)
const A = (1 - ANCHOR_T) * B;        // so T(0) === ANCHOR_T
const SLOPE0 = A / (B * B);          // dT/du at u = 0 (for the behind-extension)

/** Depth t for a journey offset u (u > 0 = ahead of the avatar). */
export function depthForOffset(u: number): number {
  'worklet';
  if (u >= 0) return 1 - A / (u + B);
  return ANCHOR_T + u * SLOPE0;
}

/** Inverse of depthForOffset (used to sample the road by screen depth). */
export function offsetForDepth(t: number): number {
  if (t >= ANCHOR_T) return A / (1 - t) - B;
  return (t - ANCHOR_T) / SLOPE0;
}

export function yForDepth(t: number): number {
  return BOTTOM_Y - t * (BOTTOM_Y - HORIZON_Y);
}

/** Road half-width by depth — wide near the player, narrow at the horizon. */
export function roadHalfWidth(t: number): number {
  const w = 150 * (1 - t) + 22 * t;
  return w / 2;
}

/** Element scale by depth (pins, props, labels). */
export function scaleForDepth(t: number): number {
  return Math.max(0.4, Math.min(1.12, 0.4 + (1 - t) * 0.98));
}

/** Lateral bend of the road (−1..1) at absolute journey distance s. */
function bend(s: number): number {
  return Math.sin(s * 0.82) * 0.62 + Math.sin(s * 0.353 + 1.4) * 0.38;
}

const AMP_NEAR = 118; // max lateral sway at the bottom edge (px)

/** Screen x of the road centre for a world point at distance s, depth t. */
export function roadCenterX(s: number, t: number): number {
  const amp = AMP_NEAR * Math.pow(Math.max(0, 1 - t), 1.32);
  return CENTER_X + bend(s) * amp;
}

export interface RoadSample { x: number; y: number; t: number; half: number }

/** Sample the visible road (bottom → horizon) for the current journey. */
export function sampleRoad(journey: number, n = 30): RoadSample[] {
  const out: RoadSample[] = [];
  const tMin = -0.035;
  const tMax = 0.968;
  for (let i = 0; i <= n; i++) {
    const t = tMin + (i / n) * (tMax - tMin);
    const u = offsetForDepth(t);
    const s = journey + u;
    out.push({ x: roadCenterX(s, t), y: yForDepth(t), t, half: roadHalfWidth(t) });
  }
  return out;
}

/** Closed SVG polygon for the road body from samples. */
export function roadBodyPath(samples: RoadSample[]): string {
  const left = samples.map((p) => `${(p.x - p.half).toFixed(1)} ${p.y.toFixed(1)}`);
  const right = [...samples].reverse().map((p) => `${(p.x + p.half).toFixed(1)} ${p.y.toFixed(1)}`);
  return `M ${left[0]} L ${left.slice(1).join(' L ')} L ${right.join(' L ')} Z`;
}

/** Polyline for the road centreline (dashed paint). */
export function roadCenterPath(samples: RoadSample[]): string {
  return `M ${samples.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')}`;
}

// ── Deterministic roadside decor ─────────────────────────────────────────────

export type DecorKind = 'pine' | 'tree' | 'bush' | 'rock' | 'flower';

export interface DecorItem {
  key: string;
  s: number;        // journey coordinate
  side: -1 | 1;     // left / right of the road
  margin: number;   // lateral distance beyond the road edge (at t=0 scale)
  kind: DecorKind;
  size: number;     // 0.8..1.3 prop size factor
  hue: number;      // 0..1 colour variation
}

/** Stable pseudo-random in [0,1) from integers (same prop layout every visit). */
function rnd(k: number, slot: number, salt: number): number {
  const v = Math.sin(k * 127.1 + slot * 311.7 + salt * 74.7) * 43758.5453;
  return v - Math.floor(v);
}

const KINDS: DecorKind[] = ['pine', 'tree', 'bush', 'rock', 'flower', 'pine', 'tree', 'bush'];

/** Decor items whose journey coordinate falls in [from, to]. */
export function decorBetween(from: number, to: number): DecorItem[] {
  const out: DecorItem[] = [];
  const k0 = Math.floor(from);
  const k1 = Math.ceil(to);
  for (let k = k0; k <= k1; k++) {
    for (let slot = 0; slot < 5; slot++) {
      const s = k + rnd(k, slot, 1);
      if (s < from || s > to) continue;
      out.push({
        key: `d${k}_${slot}`,
        s,
        side: rnd(k, slot, 2) < 0.5 ? -1 : 1,
        margin: 26 + rnd(k, slot, 3) * 92,
        kind: KINDS[Math.floor(rnd(k, slot, 4) * KINDS.length)],
        size: 0.8 + rnd(k, slot, 5) * 0.5,
        hue: rnd(k, slot, 6),
      });
    }
  }
  return out;
}
