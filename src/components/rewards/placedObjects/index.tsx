/**
 * placedObjects — lightweight isometric-ish SVG objects placed on the Dream
 * Home canvas. Each renders a full object (NOT an emoji-in-a-circle) on a
 * transparent background with a soft ground shadow, drawn in a 100×100 viewBox
 * with the object's base near y≈84 so it sits naturally on the ground/floor.
 *
 * These are temporary code-drawn assets — swap for real illustration PNGs later
 * via the same registry without touching call sites.
 */
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Rect } from 'react-native-svg';
import type { RewardItem } from '../../../data/rewardCategories';
import { REWARD_IMAGES } from './rewardImages';

type P = { size?: number };
const VB = '0 0 100 100';
const Ground = ({ rx = 30, cy = 88, op = 0.16 }: { rx?: number; cy?: number; op?: number }) => (
  <Ellipse cx={50} cy={cy} rx={rx} ry={rx * 0.18} fill="#000" opacity={op} />
);

/* ── HOME ── */
export const PlacedSofa = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={36} />
    <Rect x={20} y={40} width={60} height={26} rx={8} fill="#5C79A6" />
    <Rect x={14} y={48} width={14} height={34} rx={7} fill="#4C678F" />
    <Rect x={72} y={48} width={14} height={34} rx={7} fill="#4C678F" />
    <Rect x={22} y={58} width={56} height={22} rx={7} fill="#6E8BB5" />
    <Rect x={26} y={50} width={22} height={13} rx={5} fill="#7E99C0" />
    <Rect x={52} y={50} width={22} height={13} rx={5} fill="#7E99C0" />
    <Line x1={50} y1={58} x2={50} y2={79} stroke="#5C79A6" strokeWidth={2} />
  </Svg>
);

export const PlacedTV = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={24} />
    <Rect x={42} y={74} width={16} height={6} fill="#2A2E33" />
    <Rect x={32} y={80} width={36} height={4} rx={2} fill="#2A2E33" />
    <Rect x={16} y={28} width={68} height={46} rx={5} fill="#1B1D22" />
    <Rect x={20} y={32} width={60} height={38} rx={2} fill="#3A6E8C" />
    <Polygon points="24,36 40,36 24,60" fill="#4E86A6" opacity={0.5} />
  </Svg>
);

export const PlacedDiningTable = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={34} />
    <Rect x={16} y={46} width={8} height={18} rx={2} fill="#9A6A3C" />
    <Rect x={76} y={46} width={8} height={18} rx={2} fill="#9A6A3C" />
    <Polygon points="22,52 78,52 88,62 12,62" fill="#B07A45" />
    <Polygon points="12,62 88,62 88,66 12,66" fill="#8A5E36" />
    <Rect x={18} y={66} width={4} height={16} fill="#6E4A28" />
    <Rect x={78} y={66} width={4} height={16} fill="#6E4A28" />
    <Rect x={30} y={66} width={4} height={14} fill="#6E4A28" />
    <Rect x={66} y={66} width={4} height={14} fill="#6E4A28" />
  </Svg>
);

export const PlacedBed = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={36} />
    <Rect x={12} y={34} width={12} height={48} rx={3} fill="#8A5E36" />
    <Rect x={20} y={56} width={66} height={26} rx={5} fill="#6E4A28" />
    <Rect x={22} y={50} width={62} height={16} rx={5} fill="#EFE7D8" />
    <Rect x={26} y={47} width={20} height={13} rx={4} fill="#FFFFFF" />
    <Rect x={48} y={56} width={36} height={20} rx={4} fill="#7FA8C0" />
    <Path d="M 48 62 Q 66 58 84 62" stroke="#6E93AB" strokeWidth={2} fill="none" />
  </Svg>
);

export const PlacedAC = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={22} op={0.1} />
    <Rect x={16} y={40} width={68} height={20} rx={9} fill="#F4F6F8" />
    <Rect x={16} y={40} width={68} height={8} rx={6} fill="#FFFFFF" />
    <Rect x={22} y={54} width={56} height={3} rx={1.5} fill="#C7CDD3" />
    <Rect x={24} y={57} width={52} height={2} fill="#AEB6BD" />
    <Circle cx={74} cy={47} r={1.8} fill="#3BB273" />
  </Svg>
);

export const PlacedCooler = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={26} />
    <Rect x={26} y={38} width={48} height={8} rx={3} fill="#4E94B4" />
    <Rect x={28} y={44} width={44} height={40} rx={5} fill="#5FA8C9" />
    {[36, 44, 52, 60, 68].map((x) => <Line key={x} x1={x} y1={48} x2={x} y2={78} stroke="#3F86A6" strokeWidth={2} />)}
    <Circle cx={50} cy={62} r={9} fill="#CFEAF5" />
    <Path d="M 50 62 L 50 53 M 50 62 L 58 66 M 50 62 L 42 66" stroke="#7FB3C9" strokeWidth={2} />
  </Svg>
);

export const PlacedBookshelf = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={26} />
    <Rect x={26} y={24} width={48} height={62} rx={3} fill="#8A5E36" />
    <Rect x={30} y={28} width={40} height={54} fill="#6E4A28" />
    {[42, 56, 70].map((y) => <Rect key={y} x={30} y={y} width={40} height={3} fill="#5A3C24" />)}
    {[['#C0432F', 32], ['#E0A526', 37], ['#3BA45A', 42], ['#5BA6C9', 47], ['#7E6BD0', 52]].map(([c, x], i) => (
      <Rect key={i} x={x as number} y={31} width={4} height={10} fill={c as string} />
    ))}
    {[['#5BA6C9', 33], ['#E0699A', 39], ['#7FB04F', 45], ['#E0764B', 51]].map(([c, x], i) => (
      <Rect key={`b${i}`} x={x as number} y={45} width={4.5} height={10} fill={c as string} />
    ))}
    {[['#E0A526', 34], ['#7E6BD0', 40], ['#C0432F', 46], ['#3BA45A', 52]].map(([c, x], i) => (
      <Rect key={`c${i}`} x={x as number} y={59} width={4.5} height={10} fill={c as string} />
    ))}
  </Svg>
);

export const PlacedWardrobe = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={26} />
    <Rect x={30} y={24} width={40} height={62} rx={3} fill="#9A6A3C" />
    <Rect x={33} y={28} width={15} height={54} rx={2} fill="#8A5E36" />
    <Rect x={52} y={28} width={15} height={54} rx={2} fill="#8A5E36" />
    <Line x1={50} y1={26} x2={50} y2={84} stroke="#6E4A28" strokeWidth={2} />
    <Rect x={46} y={52} width={2.4} height={9} rx={1} fill="#3A2A1E" />
    <Rect x={51.6} y={52} width={2.4} height={9} rx={1} fill="#3A2A1E" />
  </Svg>
);

/* ── VEHICLES ── */
export const PlacedCar = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={40} />
    <Path d="M 30 52 L 40 38 L 64 38 L 76 52 Z" fill="#C44239" />
    <Polygon points="42,40 50,40 50,51 35,51" fill="#BFE0EE" />
    <Polygon points="52,40 62,40 72,51 52,51" fill="#BFE0EE" />
    <Rect x={12} y={50} width={76} height={20} rx={10} fill="#D94F46" />
    <Rect x={14} y={58} width={72} height={5} fill="#B23A33" opacity={0.5} />
    <Circle cx={32} cy={72} r={10} fill="#232323" />
    <Circle cx={32} cy={72} r={4} fill="#9AA0A6" />
    <Circle cx={68} cy={72} r={10} fill="#232323" />
    <Circle cx={68} cy={72} r={4} fill="#9AA0A6" />
    <Circle cx={85} cy={56} r={2.4} fill="#FFE08A" />
  </Svg>
);

export const PlacedScooter = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={28} />
    <Path d="M 28 66 Q 36 56 46 58 L 60 58 Q 70 58 72 48" fill="none" stroke="#4FA3A3" strokeWidth={10} strokeLinecap="round" />
    <Path d="M 26 66 Q 22 58 30 54 L 40 54 L 36 66 Z" fill="#E0764B" />
    <Rect x={42} y={52} width={20} height={7} rx={3} fill="#2A2E33" />
    <Line x1={70} y1={50} x2={72} y2={34} stroke="#555B61" strokeWidth={4} strokeLinecap="round" />
    <Line x1={66} y1={36} x2={80} y2={33} stroke="#333" strokeWidth={3} strokeLinecap="round" />
    <Circle cx={28} cy={74} r={9} fill="#232323" />
    <Circle cx={28} cy={74} r={3.5} fill="#9AA0A6" />
    <Circle cx={74} cy={74} r={9} fill="#232323" />
    <Circle cx={74} cy={74} r={3.5} fill="#9AA0A6" />
  </Svg>
);

export const PlacedBicycle = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={28} />
    <Circle cx={28} cy={66} r={15} fill="none" stroke="#2A2E33" strokeWidth={3} />
    <Circle cx={74} cy={66} r={15} fill="none" stroke="#2A2E33" strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => (
      <G key={i}>
        <Line x1={28} y1={66} x2={28 + 15 * Math.cos((i * Math.PI) / 2)} y2={66 + 15 * Math.sin((i * Math.PI) / 2)} stroke="#AEB6BD" strokeWidth={1} />
        <Line x1={74} y1={66} x2={74 + 15 * Math.cos((i * Math.PI) / 2)} y2={66 + 15 * Math.sin((i * Math.PI) / 2)} stroke="#AEB6BD" strokeWidth={1} />
      </G>
    ))}
    <Path d="M 28 66 L 52 66 L 64 48 M 52 66 L 64 48 L 74 66 M 52 66 L 46 48 L 64 48" fill="none" stroke="#2E7D8A" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    <Line x1={42} y1={44} x2={50} y2={44} stroke="#2A2E33" strokeWidth={3} strokeLinecap="round" />
    <Rect x={60} y={44} width={10} height={4} rx={2} fill="#2A2E33" />
    <Circle cx={52} cy={66} r={3} fill="#2A2E33" />
  </Svg>
);

/* ── VEHICLES (each imageKey renders a distinct, recognisable ride) ── */
const GLASS = '#CFE8F4';

/** A 4-wheel car parameterised by colours + silhouette (compact / suv / sport). */
function makeCar(body: string, roof: string, opts: { suv?: boolean; sport?: boolean; chrome?: string; accent?: string } = {}) {
  const { suv, sport, chrome, accent = '#FFE08A' } = opts;
  return ({ size = 50 }: P) => {
    if (sport) {
      return (
        <Svg width={size} height={size} viewBox={VB}>
          <Ground rx={42} />
          <Path d="M 30 54 L 44 45 L 62 45 L 72 54 Z" fill={roof} />
          <Polygon points="45,47 61,47 69,54 37,54" fill={GLASS} />
          <Path d="M 10 66 L 14 56 Q 50 50 86 56 L 90 66 Q 50 73 10 66 Z" fill={body} />
          <Rect x={70} y={49} width={18} height={3.5} rx={1.5} fill={body} />
          <Rect x={70} y={49} width={3} height={6} fill={body} />
          <Rect x={85} y={49} width={3} height={6} fill={body} />
          <Circle cx={30} cy={70} r={9} fill="#1B1B1B" /><Circle cx={30} cy={70} r={3.6} fill={accent} />
          <Circle cx={70} cy={70} r={9} fill="#1B1B1B" /><Circle cx={70} cy={70} r={3.6} fill={accent} />
          <Circle cx={88} cy={59} r={2.4} fill={accent} />
        </Svg>
      );
    }
    const roofTop = suv ? 36 : 41;
    const bodyTop = suv ? 50 : 49;
    const bodyH = suv ? 22 : 19;
    const wheelY = suv ? 74 : 72;
    const wheelR = suv ? 10 : 9;
    return (
      <Svg width={size} height={size} viewBox={VB}>
        <Ground rx={40} />
        <Path
          d={suv
            ? `M 30 ${bodyTop} L 31 ${roofTop} L 71 ${roofTop} L 72 ${bodyTop} Z`
            : `M 32 ${bodyTop} L 42 ${roofTop} L 60 ${roofTop} L 70 ${bodyTop} Z`}
          fill={roof}
        />
        <Polygon points={`43,${roofTop + 2} 50,${roofTop + 2} 50,${bodyTop} 36,${bodyTop}`} fill={GLASS} />
        <Polygon points={`52,${roofTop + 2} 59,${roofTop + 2} 66,${bodyTop} 52,${bodyTop}`} fill={GLASS} />
        <Rect x={14} y={bodyTop - 1} width={72} height={bodyH} rx={suv ? 7 : 9} fill={body} />
        <Rect x={16} y={bodyTop + 7} width={68} height={4} fill="#000" opacity={0.12} />
        {!!chrome && <Rect x={16} y={bodyTop + bodyH - 5} width={68} height={3} rx={1.5} fill={chrome} />}
        {!!chrome && <Rect x={18} y={bodyTop + 1} width={9} height={6} rx={2} fill={chrome} opacity={0.85} />}
        <Circle cx={32} cy={wheelY} r={wheelR} fill="#1B1B1B" /><Circle cx={32} cy={wheelY} r={wheelR * 0.4} fill="#C7CDD3" />
        <Circle cx={68} cy={wheelY} r={wheelR} fill="#1B1B1B" /><Circle cx={68} cy={wheelY} r={wheelR * 0.4} fill="#C7CDD3" />
        <Circle cx={84} cy={bodyTop + 6} r={2.4} fill={accent} />
      </Svg>
    );
  };
}

export const PlacedSmallCar = makeCar('#E0544A', '#C44239');
export const PlacedHatchback = makeCar('#2E9E8F', '#247E72');
export const PlacedSedan = makeCar('#3E66B0', '#31528C', { chrome: '#C7CDD3' });
export const PlacedSUV = makeCar('#3A4750', '#2C363D', { suv: true, chrome: '#9AA0A6' });
export const PlacedAudi = makeCar('#C9CDD2', '#AEB3B8', { chrome: '#7E858C' });
export const PlacedBMW = makeCar('#2E5FA3', '#244C84', { chrome: '#D7DCE0' });
export const PlacedMercedes = makeCar('#2B2E33', '#1E2024', { chrome: '#CFD3D8' });
export const PlacedSportsCar = makeCar('#E0392B', '#B72B20', { sport: true, accent: '#FFD24A' });

export const PlacedMotorbike = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={28} />
    <Circle cx={28} cy={72} r={13} fill="#1B1B1B" /><Circle cx={28} cy={72} r={5} fill="#9AA0A6" />
    <Circle cx={74} cy={72} r={13} fill="#1B1B1B" /><Circle cx={74} cy={72} r={5} fill="#9AA0A6" />
    <Path d="M 28 72 L 46 58 L 64 58 L 74 72" fill="none" stroke="#2A2E33" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M 40 60 Q 52 49 67 55 L 64 63 L 46 64 Z" fill="#C4302A" />
    <Path d="M 60 57 L 80 53" stroke="#2A2E33" strokeWidth={3} strokeLinecap="round" />
    <Path d="M 20 60 Q 30 56 38 61" stroke="#444B52" strokeWidth={3} fill="none" strokeLinecap="round" />
    <Circle cx={52} cy={62} r={3} fill="#2A2E33" />
  </Svg>
);

export const PlacedAuto = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={34} />
    <Path d="M 26 50 Q 40 30 60 36 L 70 56 L 24 56 Z" fill="#0E7C4A" />
    <Path d="M 18 70 L 22 56 L 72 56 L 76 70 Q 48 76 18 70 Z" fill="#F4C518" />
    <Rect x={30} y={42} width={20} height={12} rx={3} fill={GLASS} />
    <Rect x={20} y={60} width={54} height={4} fill="#000" opacity={0.12} />
    <Circle cx={26} cy={72} r={9} fill="#1B1B1B" /><Circle cx={26} cy={72} r={3.5} fill="#C7CDD3" />
    <Circle cx={68} cy={72} r={9} fill="#1B1B1B" /><Circle cx={68} cy={72} r={3.5} fill="#C7CDD3" />
    <Circle cx={71} cy={51} r={2.4} fill="#FFE08A" />
  </Svg>
);

/* ── PETS ── */
export const PlacedDog = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={28} />
    <Ellipse cx={54} cy={58} rx={23} ry={14} fill="#B07A45" />
    <Rect x={40} y={64} width={6} height={18} rx={3} fill="#9A6636" />
    <Rect x={50} y={66} width={6} height={16} rx={3} fill="#A06C3A" />
    <Rect x={62} y={64} width={6} height={18} rx={3} fill="#9A6636" />
    <Rect x={70} y={66} width={6} height={16} rx={3} fill="#A06C3A" />
    <Path d="M 74 50 Q 86 40 84 56 Q 80 56 76 58 Z" fill="#9A6636" />
    <Circle cx={28} cy={50} r={13} fill="#B07A45" />
    <Path d="M 20 40 Q 14 44 18 54 Q 24 50 26 46 Z" fill="#8A5E36" />
    <Ellipse cx={18} cy={54} rx={8} ry={6} fill="#C99A6E" />
    <Circle cx={13} cy={53} r={2.4} fill="#2A2018" />
    <Circle cx={26} cy={46} r={2} fill="#2A2018" />
  </Svg>
);

export const PlacedCat = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={24} />
    <Ellipse cx={54} cy={60} rx={20} ry={11} fill="#E0985F" />
    <Rect x={44} y={66} width={5} height={16} rx={2.5} fill="#CE8550" />
    <Rect x={54} y={66} width={5} height={16} rx={2.5} fill="#D88E55" />
    <Rect x={64} y={66} width={5} height={16} rx={2.5} fill="#CE8550" />
    <Path d="M 72 56 Q 88 50 84 36 Q 80 44 74 50 Z" fill="#D88E55" />
    <Circle cx={30} cy={52} r={11} fill="#E0985F" />
    <Polygon points="22,44 26,34 32,44" fill="#E0985F" />
    <Polygon points="30,44 36,34 40,44" fill="#E0985F" />
    {[44, 52, 60].map((x) => <Line key={x} x1={x} y1={52} x2={x + 4} y2={50} stroke="#C57A3E" strokeWidth={2} />)}
    <Circle cx={26} cy={51} r={1.8} fill="#2A2018" />
    <Circle cx={34} cy={51} r={1.8} fill="#2A2018" />
    <Path d="M 28 56 Q 30 58 32 56" stroke="#9A5238" strokeWidth={1.2} fill="none" />
  </Svg>
);

/* ── GARDEN ── */
export const PlacedFountain = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={34} />
    <Ellipse cx={50} cy={80} rx={30} ry={9} fill="#9BB7C4" />
    <Ellipse cx={50} cy={78} rx={24} ry={6} fill="#6FA8D6" />
    <Rect x={45} y={58} width={10} height={22} fill="#B7C2C8" />
    <Ellipse cx={50} cy={58} rx={16} ry={5} fill="#9BB7C4" />
    <Ellipse cx={50} cy={57} rx={12} ry={3.4} fill="#6FA8D6" />
    <Rect x={47.5} y={44} width={5} height={14} fill="#B7C2C8" />
    <Ellipse cx={50} cy={44} rx={9} ry={3} fill="#9BB7C4" />
    <Path d="M 50 44 Q 44 50 42 56 M 50 44 Q 56 50 58 56" stroke="#BFE0EE" strokeWidth={2} fill="none" strokeLinecap="round" />
  </Svg>
);

export const PlacedSwing = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={28} />
    <Line x1={28} y1={84} x2={50} y2={32} stroke="#6E7378" strokeWidth={4} strokeLinecap="round" />
    <Line x1={72} y1={84} x2={50} y2={32} stroke="#6E7378" strokeWidth={4} strokeLinecap="round" />
    <Line x1={42} y1={84} x2={58} y2={32} stroke="#7C8186" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
    <Line x1={44} y1={36} x2={44} y2={66} stroke="#5A3C24" strokeWidth={2} />
    <Line x1={58} y1={36} x2={58} y2={66} stroke="#5A3C24" strokeWidth={2} />
    <Rect x={41} y={66} width={20} height={5} rx={2} fill="#B07A45" />
  </Svg>
);

export const PlacedSlide = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={30} />
    <Polygon points="44,44 54,44 80,82 68,82" fill="#E0A526" />
    <Line x1={46} y1={44} x2={70} y2={82} stroke="#C8821A" strokeWidth={2} />
    <Line x1={26} y1={84} x2={26} y2={42} stroke="#C0432F" strokeWidth={4} strokeLinecap="round" />
    <Line x1={36} y1={84} x2={36} y2={42} stroke="#C0432F" strokeWidth={4} strokeLinecap="round" />
    {[50, 58, 66, 74].map((y) => <Line key={y} x1={26} y1={y} x2={36} y2={y} stroke="#E0764B" strokeWidth={2.5} />)}
    <Rect x={24} y={40} width={22} height={6} rx={2} fill="#2E7D8A" />
  </Svg>
);

export const PlacedFlowerPots = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={24} />
    <Line x1={44} y1={66} x2={42} y2={50} stroke="#3BA45A" strokeWidth={2.5} />
    <Line x1={50} y1={66} x2={50} y2={45} stroke="#3BA45A" strokeWidth={2.5} />
    <Line x1={56} y1={66} x2={58} y2={50} stroke="#3BA45A" strokeWidth={2.5} />
    <Circle cx={42} cy={48} r={6} fill="#E0699A" />
    <Circle cx={50} cy={43} r={6} fill="#E0A526" />
    <Circle cx={58} cy={48} r={6} fill="#7E6BD0" />
    <Circle cx={42} cy={48} r={2} fill="#FFF3D6" />
    <Circle cx={50} cy={43} r={2} fill="#FFF3D6" />
    <Circle cx={58} cy={48} r={2} fill="#FFF3D6" />
    <Rect x={34} y={62} width={32} height={6} rx={2} fill="#A8542E" />
    <Polygon points="37,68 63,68 59,84 41,84" fill="#C0653A" />
  </Svg>
);

export const PlacedGardenBench = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={30} />
    <Rect x={24} y={42} width={52} height={4} rx={2} fill="#9A6A3C" />
    <Rect x={24} y={48} width={52} height={4} rx={2} fill="#9A6A3C" />
    <Rect x={26} y={42} width={4} height={16} fill="#8A5E36" />
    <Rect x={70} y={42} width={4} height={16} fill="#8A5E36" />
    <Rect x={22} y={58} width={56} height={6} rx={2} fill="#B07A45" />
    <Rect x={26} y={64} width={5} height={16} fill="#6E4A28" />
    <Rect x={69} y={64} width={5} height={16} fill="#6E4A28" />
  </Svg>
);

export const PlacedLamp = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={16} />
    <Ellipse cx={50} cy={84} rx={11} ry={3.4} fill="#3A3530" />
    <Rect x={48} y={44} width={4} height={40} fill="#6E625A" />
    <Polygon points="36,44 64,44 58,26 42,26" fill="#EBCF7A" />
    <Polygon points="42,26 58,26 56,30 44,30" fill="#F6E6AE" />
  </Svg>
);

export const PlacedDesk = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={30} />
    <Polygon points="22,50 78,50 88,60 12,60" fill="#9A6A3C" />
    <Polygon points="12,60 88,60 88,64 12,64" fill="#7A4E2A" />
    <Rect x={18} y={64} width={4} height={18} fill="#6E4A28" />
    <Rect x={78} y={64} width={4} height={18} fill="#6E4A28" />
    <Rect x={42} y={36} width={20} height={14} rx={1.5} fill="#1B1D22" />
    <Rect x={44} y={38} width={16} height={10} fill="#3A6E8C" />
    <Rect x={46} y={50} width={12} height={3} fill="#2A2E33" />
  </Svg>
);

export const PlacedChair = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={18} />
    <Rect x={40} y={36} width={20} height={26} rx={3} fill="#7E99C0" />
    <Polygon points="38,58 62,58 66,66 34,66" fill="#6E8BB5" />
    <Rect x={36} y={66} width={4} height={16} fill="#4C678F" />
    <Rect x={60} y={66} width={4} height={16} fill="#4C678F" />
  </Svg>
);

export const PlacedRug = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ellipse cx={50} cy={68} rx={36} ry={13} fill="#B85C7E" />
    <Ellipse cx={50} cy={68} rx={28} ry={9.5} fill="#D27D9B" />
    <Ellipse cx={50} cy={68} rx={16} ry={5.5} fill="#EBC7D4" />
  </Svg>
);

export const PlacedKitchen = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={28} />
    <Rect x={24} y={34} width={40} height={16} rx={2} fill="#C99A6E" />
    <Rect x={28} y={38} width={14} height={10} fill="#A8794E" />
    <Rect x={46} y={38} width={14} height={10} fill="#A8794E" />
    <Rect x={26} y={52} width={48} height={6} rx={2} fill="#D7DDE2" />
    <Rect x={28} y={58} width={44} height={24} rx={2} fill="#C99A6E" />
    <Circle cx={40} cy={55} r={3} fill="#2A2E33" />
    <Circle cx={52} cy={55} r={3} fill="#2A2E33" />
    <Rect x={36} y={64} width={2} height={10} fill="#6E4A28" />
    <Rect x={62} y={64} width={2} height={10} fill="#6E4A28" />
  </Svg>
);

export const PlacedFishPond = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ellipse cx={50} cy={70} rx={34} ry={14} fill="#8A9BA4" />
    <Ellipse cx={50} cy={69} rx={27} ry={10} fill="#5FA8D6" />
    <Ellipse cx={50} cy={67} rx={20} ry={6} fill="#7FBEE2" opacity={0.6} />
    <Ellipse cx={40} cy={70} rx={6} ry={2.6} fill="#3BA45A" />
    <Path d="M 58 68 q 5 -3 9 0 q -4 1.5 -9 0 Z" fill="#E0764B" />
    <Circle cx={66} cy={68} r={1} fill="#2A2018" />
  </Svg>
);

export const PlacedBirdHouse = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={14} />
    <Rect x={47} y={52} width={6} height={32} fill="#8A5E36" />
    <Rect x={38} y={38} width={24} height={18} rx={2} fill="#C9A06E" />
    <Polygon points="34,38 66,38 50,26" fill="#B23A33" />
    <Circle cx={50} cy={46} r={4} fill="#3A2A1E" />
    <Rect x={49} y={50} width={2} height={5} fill="#6E4A28" />
  </Svg>
);

export const PlacedTreeHouse = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={24} />
    <Rect x={44} y={48} width={10} height={36} fill="#6E4A28" />
    <Path d="M 49 84 L 40 78 M 49 80 L 58 74" stroke="#6E4A28" strokeWidth={3} />
    <Circle cx={40} cy={36} r={16} fill="#4E8A3C" />
    <Circle cx={62} cy={38} r={14} fill="#3E7A30" />
    <Circle cx={52} cy={26} r={14} fill="#5A9A46" />
    <Rect x={42} y={44} width={20} height={16} rx={2} fill="#B07A45" />
    <Polygon points="40,44 64,44 52,34" fill="#8A5E36" />
    <Rect x={49} y={50} width={6} height={10} fill="#5A3C24" />
  </Svg>
);

export const PlacedLampPost = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={12} />
    <Ellipse cx={50} cy={84} rx={8} ry={2.6} fill="#3A3530" />
    <Rect x={48} y={36} width={4} height={48} fill="#3A3530" />
    <Path d="M 50 36 q 0 -6 8 -6" stroke="#3A3530" strokeWidth={3} fill="none" />
    <Rect x={54} y={28} width={10} height={12} rx={2} fill="#EBCF7A" />
    <Polygon points="53,28 65,28 59,22" fill="#3A3530" />
  </Svg>
);

export const PlacedPlant = ({ size = 50 }: P) => (
  <Svg width={size} height={size} viewBox={VB}>
    <Ground rx={20} />
    <Circle cx={42} cy={52} r={13} fill="#4E8A3C" />
    <Circle cx={58} cy={50} r={14} fill="#3E7A30" />
    <Circle cx={50} cy={42} r={13} fill="#5A9A46" />
    <Circle cx={46} cy={46} r={3} fill="#E0699A" />
    <Circle cx={56} cy={48} r={3} fill="#E0A526" />
    <Polygon points="40,64 60,64 56,82 44,82" fill="#C0653A" />
    <Rect x={38} y={60} width={24} height={6} rx={2} fill="#A8542E" />
  </Svg>
);

/** imageKey → placed object component. Items without an entry fall back to a
 * shadowed emoji (see PlacedRewardObject). */
const REGISTRY: Record<string, React.FC<P>> = {
  // home
  sofa: PlacedSofa,
  tv: PlacedTV,
  dining_table: PlacedDiningTable,
  garden_table: PlacedDiningTable,
  bed: PlacedBed,
  premium_room: PlacedBed,
  ac: PlacedAC,
  cooler: PlacedCooler,
  bookshelf: PlacedBookshelf,
  wardrobe_unit: PlacedWardrobe,
  chair: PlacedChair,
  lamp: PlacedLamp,
  study_table: PlacedDesk,
  rug: PlacedRug,
  kitchen_set: PlacedKitchen,
  balcony_plants: PlacedPlant,
  // vehicles — each a distinct ride
  cycle: PlacedBicycle,
  scooter: PlacedScooter,
  motorbike: PlacedMotorbike,
  auto: PlacedAuto,
  small_car: PlacedSmallCar,
  hatchback: PlacedHatchback,
  sedan: PlacedSedan,
  suv: PlacedSUV,
  audi: PlacedAudi,
  bmw: PlacedBMW,
  mercedes: PlacedMercedes,
  sports_car: PlacedSportsCar,
  // pets
  pet_dog: PlacedDog,
  pet_cat: PlacedCat,
  // garden
  fountain: PlacedFountain,
  swing: PlacedSwing,
  slide: PlacedSlide,
  flower_pots: PlacedFlowerPots,
  rose_garden: PlacedFlowerPots,
  garden_bench: PlacedGardenBench,
  fish_pond: PlacedFishPond,
  bird_house: PlacedBirdHouse,
  tree_house: PlacedTreeHouse,
  premium_garden: PlacedTreeHouse,
  butterfly_corner: PlacedPlant,
  outdoor_lamp: PlacedLampPost,
};

export function placedComponentFor(imageKey: string): React.FC<P> | undefined {
  return REGISTRY[imageKey];
}

/** True if this item has a dedicated isometric object (vs emoji fallback). */
export function hasPlacedObject(imageKey: string): boolean {
  return !!REGISTRY[imageKey];
}

/**
 * ObjectVisual — the single source of truth for a reward's visual: a full
 * isometric object when one exists, else a shadowed emoji (no circle/bubble).
 * Used identically by the reward cards, the Dream Home preview and the editor
 * so the same asset shows everywhere.
 */
export function ObjectVisual({ item, size }: { item: RewardItem; size: number }) {
  // 1) premium AI-generated PNG asset (preferred) — shown everywhere identically
  const img = REWARD_IMAGES[item.imageKey];
  if (img) {
    return <Image source={img} style={{ width: size, height: size }} resizeMode="contain" />;
  }
  // 2) legacy code-drawn isometric object
  const Comp = REGISTRY[item.imageKey];
  if (Comp) return <Comp size={size} />;
  // 3) emoji fallback (shadowed, no circle)
  return (
    <View style={evStyles.wrap}>
      <View style={[evStyles.shadow, { width: size * 0.56, height: size * 0.14, bottom: size * 0.04 }]} />
      <Text style={{ fontSize: size * 0.66 }}>{item.icon}</Text>
    </View>
  );
}

const evStyles = StyleSheet.create({
  wrap: { flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'flex-end' },
  shadow: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.16)' },
});
