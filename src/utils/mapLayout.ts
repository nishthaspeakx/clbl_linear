/**
 * mapLayout.ts — vertical world layout for the first 20 lessons.
 *
 * Builds: world size, lesson pixel positions on one continuous winding road
 * (bottom → top), a placed SCENE per lesson (left / right / centre gutter),
 * per-topic ground bands + a small roadside signboard, and a few road coins.
 *
 * Deterministic (no Math.random). Scenes are authored in a 220×170 local box
 * (see LocationScene.tsx); here we compute each scene's translate + scale.
 */
import { SUBTOPICS } from '../data/subtopics';
import { locationScenes } from '../data/locationScenes';
import { TOPIC_ZONES } from '../data/topicZones';
import { buildCurvedPath } from './position';
import { VIEWPORT_W as SCREEN_W } from './viewport';

export const WORLD_W = Math.max(380, SCREEN_W);

const STEP = 250; // generous vertical room for a scene per lesson
const TOPIC_GAP = 96; // extra space at a topic change (for the signboard)
// Lesson 1 ends up at on-screen y = VIEWPORT_H − BOTTOM_PAD (camera is clamped to
// the world bottom). Keep this small so Town Square sits just above the footer
// with only a little breathing room — not a big empty green gap.
const BOTTOM_PAD = 132;
const TOP_PAD = 210;

const SCENE_LOCAL_W = 220;
const SCENE_LOCAL_H = 170;
const SCENE_SCALE = (WORLD_W * 0.47) / SCENE_LOCAL_W;

export interface LayoutLesson {
  id: number;
  px: number;
  py: number;
  topicIndex: number;
}
export interface LayoutScene {
  id: number;
  sceneType: string;
  side: 'left' | 'right' | 'center';
  ox: number;
  oy: number;
  s: number;
}
export interface LayoutZone {
  topicIndex: number;
  name: string;
  accent: string;
  groundTop: string;
  groundBottom: string;
  top: number;
  bottom: number;
  signY: number;
}
export interface LayoutCoin {
  x: number;
  y: number;
  star: boolean;
}

function buildLayout() {
  const n = SUBTOPICS.length;

  // Pass 1: y-from-bottom, inserting a gap at each topic change.
  const yfb: number[] = new Array(n);
  let cur = BOTTOM_PAD;
  for (let i = 0; i < n; i++) {
    if (i > 0 && SUBTOPICS[i].topicIndex !== SUBTOPICS[i - 1].topicIndex) {
      cur += TOPIC_GAP;
    }
    yfb[i] = cur;
    cur += STEP;
  }
  cur += TOP_PAD;
  const WORLD_H = cur;
  const toY = (fb: number) => WORLD_H - fb;

  const lessons: LayoutLesson[] = SUBTOPICS.map((s, i) => ({
    id: s.id,
    px: (s.xPercent / 100) * WORLD_W,
    py: toY(yfb[i]),
    topicIndex: s.topicIndex,
  }));

  const roadPath = buildCurvedPath(lessons.map((l) => ({ x: l.px, y: l.py })));

  // Scene placement.
  const s = SCENE_SCALE;
  const sceneW = SCENE_LOCAL_W * s;
  const sceneH = SCENE_LOCAL_H * s;
  const scenes: LayoutScene[] = locationScenes.slice(0, n).map((sc, i) => {
    const py = lessons[i].py;
    let ox: number;
    if (sc.side === 'left') ox = WORLD_W * 0.012;
    else if (sc.side === 'right') ox = WORLD_W - sceneW - WORLD_W * 0.012;
    else ox = WORLD_W / 2 - sceneW / 2; // center
    // centre the scene's ground roughly on the pin row.
    const oy = py - sceneH * (sc.side === 'center' ? 0.62 : 0.52);
    return { id: sc.id, sceneType: sc.sceneType, side: sc.side, ox, oy, s };
  });

  // Topic ground bands + roadside signboards (present topics only, in order).
  const order: number[] = [];
  SUBTOPICS.forEach((su) => {
    if (!order.includes(su.topicIndex)) order.push(su.topicIndex);
  });
  const firstY: Record<number, number> = {};
  const lastY: Record<number, number> = {};
  lessons.forEach((l) => {
    if (firstY[l.topicIndex] === undefined) firstY[l.topicIndex] = l.py; // entry (largest py)
    lastY[l.topicIndex] = l.py; // exit (smallest py)
  });
  const zones: LayoutZone[] = order.map((ti, idx) => {
    const theme = TOPIC_ZONES[ti - 1];
    const bottom = idx === 0 ? WORLD_H : (lastY[order[idx - 1]] + firstY[ti]) / 2;
    const top = idx === order.length - 1 ? 0 : (lastY[ti] + firstY[order[idx + 1]]) / 2;
    return {
      topicIndex: ti,
      name: theme.name,
      accent: theme.accent,
      groundTop: theme.groundTop,
      groundBottom: theme.groundBottom,
      top,
      bottom,
      signY: Math.min(bottom - 24, firstY[ti] + 96),
    };
  });

  // Ambient props that fill the world so it reads as one lush town (no empty greens).
  const FLOWER_COLORS = ['#E0699A', '#FFD24C', '#7E6BD0', '#E0764B', '#FF9FC0'];
  const CAR_COLORS = ['#E0764B', '#5BA6C9', '#7FB04F', '#E0A526'];
  const FEATURES: ('pond' | 'flowerbed' | 'bench' | 'car')[] = ['flowerbed', 'pond', 'bench', 'car'];
  const SHOPS = [
    { label: 'BAKERY', wall: '#F3DDB6', roof: '#C0533B', person: '#E0764B' },
    { label: 'BOOKS', wall: '#DCE6F0', roof: '#6F9BC0', person: '#5BA6C9' },
    { label: 'TOYS', wall: '#FAD9E2', roof: '#E0699A', person: '#7FB04F' },
    { label: 'FRUITS', wall: '#E7EFD6', roof: '#7FB04F', person: '#E0A526' },
    { label: 'SALON', wall: '#F3E0EC', roof: '#C77FB0', person: '#7E6BD0' },
    { label: 'PHARMA', wall: '#E6F4EC', roof: '#3BB273', person: '#5BA6C9' },
  ];
  type DecorKind = 'tree' | 'bush' | 'flower' | 'lamp' | 'hedge' | 'pond' | 'flowerbed' | 'bench' | 'car' | 'bird' | 'shop' | 'scooter' | 'cycle' | 'monument' | 'fountain';
  const decor: { kind: DecorKind; x: number; y: number; s: number; w?: number; color?: string; shop?: typeof SHOPS[number] }[] = [];
  scenes.forEach((sc, i) => {
    const py = lessons[i].py;
    const isCenter = sc.side === 'center';
    // Centre scenes (Town Square / Town Gate) get a monument on one side and a
    // fountain + trees on the other — never duplicate shops.
    if (isCenter) {
      decor.push({ kind: 'monument', x: WORLD_W * 0.15, y: py - 6, s: WORLD_W / 480 });
      decor.push({ kind: 'tree', x: WORLD_W * 0.04, y: py - 26, s: 1.2 });
      decor.push({ kind: 'fountain', x: WORLD_W * 0.85, y: py - 2, s: WORLD_W / 430 });
      decor.push({ kind: 'tree', x: WORLD_W * 0.96, y: py - 26, s: 1.2 });
      decor.push({ kind: 'hedge', x: 0, y: py + 72, s: 1, w: WORLD_W * 0.14 });
      decor.push({ kind: 'hedge', x: WORLD_W * 0.86, y: py + 72, s: 1, w: WORLD_W * 0.14 });
    } else {
      const gutters = sc.side === 'left' ? [0.88] : [0.12];
      gutters.forEach((gx) => {
        const opp = gx < 0.5; // this gutter is on the opposite side of the scene
        // A real little shop on the opposite side every other lesson → town on both sides.
        if (i % 2 === 0) {
          decor.push({ kind: 'shop', x: WORLD_W * (opp ? 0.16 : 0.84), y: py - 10, s: WORLD_W / 470, shop: SHOPS[(i / 2) % SHOPS.length] });
          decor.push({ kind: 'flower', x: WORLD_W * (opp ? 0.06 : 0.94), y: py + 22, s: 1, color: FLOWER_COLORS[i % FLOWER_COLORS.length] });
        } else {
          const feat = FEATURES[i % FEATURES.length];
          decor.push({ kind: feat, x: WORLD_W * (opp ? 0.16 : 0.84), y: py - 2, s: feat === 'car' ? 0.95 : 1, color: CAR_COLORS[i % CAR_COLORS.length] });
          decor.push({ kind: 'tree', x: WORLD_W * (opp ? 0.06 : 0.94), y: py - 24, s: 1.15 });
        }
        decor.push({ kind: 'bush', x: WORLD_W * (opp ? gx + 0.04 : gx - 0.04), y: py + 44, s: 0.75 });
        decor.push({ kind: 'hedge', x: WORLD_W * (opp ? 0.0 : 0.86), y: py + 72, s: 1, w: WORLD_W * 0.14 });
      });
    }
    // lamp posts hugging BOTH sides of the road (denser, like a real street).
    decor.push({ kind: 'lamp', x: lessons[i].px - 46, y: py + 16, s: 0.95 });
    decor.push({ kind: 'lamp', x: lessons[i].px + 46, y: py + 16, s: 0.95 });
    // parked scooter / cycle by the kerb (extra street life) — only beside
    // OUTDOOR scenes; never under an interior cutaway (looks odd in a kitchen).
    const INTERIOR = new Set([
      'living_room', 'kitchen', 'bedroom_trip', 'doorway_sorry', 'dining_table', 'balcony',
      'restaurant_host', 'restaurant_menu', 'restaurant_ordering', 'restaurant_billing',
    ]);
    const outdoor = !INTERIOR.has(sc.sceneType);
    if (outdoor && i % 3 === 0) decor.push({ kind: 'scooter', x: lessons[i].px - 52, y: py + 38, s: 0.7, color: CAR_COLORS[(i + 1) % CAR_COLORS.length] });
    if (outdoor && i % 3 === 2) decor.push({ kind: 'cycle', x: lessons[i].px + 52, y: py + 38, s: 0.7, color: CAR_COLORS[i % CAR_COLORS.length] });
  });

  // ── Animated actors (rendered by AmbientMotion) ──────────────────────────
  // Bird flocks drifting in the open sky between scenes.
  const birds: { x: number; y: number; s: number }[] = [];
  scenes.forEach((sc, i) => {
    if (i % 3 === 0) {
      const bx = WORLD_W * (sc.side === 'right' ? 0.22 : 0.74);
      birds.push({ x: bx, y: lessons[i].py - 72, s: 1 });
      birds.push({ x: bx + 18, y: lessons[i].py - 82, s: 0.8 });
      birds.push({ x: bx + 34, y: lessons[i].py - 70, s: 0.7 });
    }
  });
  // Two cars driving across short side-streets (masked by hedges at the ends).
  // The gift-shop car drives along the LEFT verge so it never crosses the plaza.
  const cars = [
    { x: WORLD_W * 0.2, y: lessons[3].py + 14, span: WORLD_W * 0.34, color: '#5BA6C9' },
    // Front-left verge, below the bakery — keeps the car off the shopkeeper.
    { x: WORLD_W * 0.16, y: lessons[12].py + 22, span: WORLD_W * 0.4, color: '#E0764B' },
  ];
  // Two pedestrians pacing a sidewalk near a scene.
  const walkers = [
    { x: lessons[6].px - 52, y: lessons[6].py + 52, span: 40, shirt: '#7FB04F' },
    { x: lessons[16].px + 52, y: lessons[16].py + 52, span: 40, shirt: '#E0A526' },
  ];
  const motion = { birds, cars, walkers };

  // A few coins along the road.
  const coins: LayoutCoin[] = [];
  for (let i = 0; i < n - 1; i++) {
    const a = lessons[i];
    const b = lessons[i + 1];
    coins.push({ x: (a.px + b.px) / 2, y: (a.py + b.py) / 2, star: i % 4 === 0 });
  }

  return { WORLD_W, WORLD_H, lessons, roadPath, scenes, zones, coins, decor, motion };
}

export const LAYOUT = buildLayout();
export const WORLD_H = LAYOUT.WORLD_H;

export function lessonPos(id: number): { x: number; y: number } {
  const l = LAYOUT.lessons[id - 1];
  return { x: l.px, y: l.py };
}
