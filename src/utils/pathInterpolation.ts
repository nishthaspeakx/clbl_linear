/**
 * pathInterpolation — sample a smooth (Catmull-Rom) path between two adjacent
 * level pins so the character walks ALONG the winding road instead of cutting a
 * straight line, and so coins can be dropped at fractions of that path.
 */
import { LAYOUT } from './mapLayout';

export interface Pt { x: number; y: number }

function catmull(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    2 * p1 +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

/**
 * Sample `n` points along the road segment from lesson `fromId` → `toId`.
 * Uses the neighbouring pins as Catmull-Rom control points so the sampled
 * curve matches the rendered road.
 */
export function samplePath(fromId: number, toId: number, n = 18): { xs: number[]; ys: number[]; pts: Pt[] } {
  const L = LAYOUT.lessons;
  const a = L[fromId - 1];
  const b = L[toId - 1];
  const p0 = L[fromId - 2] ?? a;
  const p3 = L[toId] ?? b;
  const xs: number[] = [];
  const ys: number[] = [];
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = catmull(p0.px, a.px, b.px, p3.px, t);
    const y = catmull(p0.py, a.py, b.py, p3.py, t);
    xs.push(x); ys.push(y); pts.push({ x, y });
  }
  return { xs, ys, pts };
}

/** Point at fraction `t` (0..1) of a sampled point list (linear between samples). */
export function pointAt(pts: Pt[], t: number): Pt {
  if (pts.length === 0) return { x: 0, y: 0 };
  if (pts.length === 1) return pts[0];
  const f = Math.max(0, Math.min(1, t)) * (pts.length - 1);
  const i = Math.min(pts.length - 2, Math.floor(f));
  const frac = f - i;
  return {
    x: pts[i].x + (pts[i + 1].x - pts[i].x) * frac,
    y: pts[i].y + (pts[i + 1].y - pts[i].y) * frac,
  };
}
