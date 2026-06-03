/**
 * Position helpers.
 *
 * The map is rendered at a fixed VIRTUAL size and then panned / zoomed inside
 * the phone viewport. Every pin stores its location as a percentage so the
 * design stays resolution-independent — we only convert to pixels here.
 */
import { Subtopic } from '../data/subtopics';

/**
 * Virtual map size in px. The town image is rendered at this size, then panned
 * and zoomed inside the phone viewport. Kept close to the requested
 * ~2400 x 1500 and matched to the town image aspect ratio (1376:768) so the
 * artwork fills the world with no awkward cropping.
 */
export const MAP_WIDTH = 2400;
export const MAP_HEIGHT = 1340;

export interface Point {
  x: number;
  y: number;
}

/**
 * Convert a percentage pair (0–100) into virtual pixel coordinates.
 *
 * Coordinates are now hand-placed directly on the town artwork (see the
 * location audit), so we map them RAW across the whole image — no inset.
 */
export function percentToPixel(xPercent: number, yPercent: number): Point {
  return {
    x: (xPercent / 100) * MAP_WIDTH,
    y: (yPercent / 100) * MAP_HEIGHT,
  };
}

/** Inverse of percentToPixel — used by the debug coordinate reader. */
export function pixelToPercent(x: number, y: number): Point {
  return {
    x: (x / MAP_WIDTH) * 100,
    y: (y / MAP_HEIGHT) * 100,
  };
}

/** Convenience: pixel position of a subtopic pin. */
export function pinPosition(s: Subtopic): Point {
  return percentToPixel(s.xPercent, s.yPercent);
}

/** Pixel positions for every subtopic, in lesson order. */
export function allPinPositions(subtopics: Subtopic[]): Point[] {
  return subtopics.map(pinPosition);
}

/**
 * Build a smooth curved SVG path string that connects all pins in order using
 * Catmull-Rom -> cubic Bézier conversion. This gives the "winding road" look
 * instead of harsh straight segments.
 */
export function buildCurvedPath(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    // Catmull-Rom to Bézier control points (tension = 1/6 standard).
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/** Clamp helper used by the camera / gesture maths. */
export function clamp(value: number, min: number, max: number): number {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

/**
 * Keep a camera translation within bounds so the map edge never pulls away from
 * the viewport edge (no empty space beyond the artwork).
 *   - When the scaled map is larger than the viewport: pan between the two edges.
 *   - When it is smaller (zoomed far out): keep it centred.
 */
export function clampTranslate(
  t: number,
  viewport: number,
  mapSize: number,
  scale: number
): number {
  'worklet';
  const scaled = mapSize * scale;
  if (scaled <= viewport) {
    // Centre the (smaller) map.
    return (viewport - scaled) / 2;
  }
  const min = viewport - scaled; // negative
  const max = 0;
  return clamp(t, min, max);
}
