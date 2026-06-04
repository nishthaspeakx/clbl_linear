/**
 * exteriorScenes — premium outdoor town scenes: Town Square, Home exterior,
 * Bus Stop, Town Gate, Neighbourhood Park. Built from premiumKit + the shared
 * world props so they match the upgraded lighting.
 */
import React from 'react';
import { G, Rect, Line, Circle, Polygon, Ellipse, Text as SvgText } from 'react-native-svg';
import {
  GX, GY, PGround, PBuilding, PNPC, PPlanter, PMailbox, PMat, shade, tint,
} from './premiumKit';
import {
  WorldTree, Bush, Flower, WorldBench, WorldLamp, Pond, Fountain, FlowerBed,
} from '../../components/LocationScene';

export function TownSquarePremiumScene() {
  return (
    <G>
      <PGround top="#E4D7BC" side="#CBBA97" paved />
      {/* corner trees + lamps */}
      <WorldTree x={GX - 90} y={GY - 12} s={0.92} />
      <WorldTree x={GX + 92} y={GY - 10} s={0.92} />
      <WorldLamp x={GX - 70} y={GY + 2} s={0.95} />
      <WorldLamp x={GX + 72} y={GY + 2} s={0.95} />
      {/* central fountain */}
      <Fountain x={GX - 6} y={GY - 2} s={1.0} />
      {/* greeting group on the LEFT (keeps the right corner clear for the pin) */}
      <WorldBench x={GX - 52} y={GY + 18} s={0.9} />
      <PNPC x={GX - 44} base={GY + 22} shirt="#5BA6C9" wave />
      <PNPC x={GX - 28} base={GY + 24} shirt="#E0764B" dress />
      <PNPC x={GX - 12} base={GY + 26} shirt="#7FB04F" s={0.85} />
      <FlowerBed x={GX - 70} y={GY + 22} s={0.7} />
      {/* lighter right side (pin lands here) */}
      <WorldBench x={GX + 54} y={GY + 18} s={0.9} />
      <PPlanter x={GX + 70} base={GY + 14} color="#E0699A" />
      <Flower x={GX + 16} y={GY + 24} color="#FFD24C" />
      <Flower x={GX + 26} y={GY + 26} color="#7E6BD0" />
    </G>
  );
}

export function HomeExteriorPremiumScene() {
  return (
    <G>
      <PGround top="#B6D98E" side="#9ECB78" />
      {/* front path */}
      <Polygon points={`${GX - 10},${GY - 6} ${GX + 10},${GY - 6} ${GX + 22},${GY + 30} ${GX - 22},${GY + 30}`} fill="#D8C9A0" />
      <Polygon points={`${GX - 7},${GY - 4} ${GX + 7},${GY - 4} ${GX + 16},${GY + 28} ${GX - 16},${GY + 28}`} fill="#E8DBBB" />
      {/* the house */}
      <PBuilding
        x={GX - 42} base={GY - 4} w={80} h={52}
        wall="#F1E2C2" roof="#C46B43" accent="#7FA86A" peak doorAccent="#8C5A36"
      />
      {/* porch lamp glow + a couple flower pots by the door */}
      <PPlanter x={GX - 16} base={GY + 6} color="#E0699A" />
      <PPlanter x={GX + 12} base={GY + 6} color="#7E6BD0" />
      <PMailbox x={GX + 52} base={GY + 12} color="#5BA6C9" />
      <Bush x={GX - 60} y={GY + 6} s={0.85} />
      <WorldTree x={GX + 84} y={GY - 8} s={1.0} />
      <Flower x={GX - 34} y={GY + 22} color="#FFD24C" />
      <Flower x={GX + 34} y={GY + 22} color="#FF9FC0" />
      {/* morning routine: stepping out with a cup */}
      <PNPC x={GX + 26} base={GY + 26} shirt="#5BA6C9" />
      <PNPC x={GX - 26} base={GY + 26} shirt="#E0A85A" dress s={0.85} />
    </G>
  );
}

export function BusStopPremiumScene() {
  return (
    <G>
      <PGround top="#D9CDB0" side="#C0B292" paved />
      {/* kerb strip */}
      <Polygon points={`${GX - 96},${GY + 8} ${GX + 96},${GY + 8} ${GX + 100},${GY + 18} ${GX - 100},${GY + 18}`} fill="#B7B2A6" />
      {/* a small bus pulling in */}
      <G>
        <Ellipse cx={GX + 58} cy={GY + 16} rx={34} ry={4} fill="#000" opacity={0.12} />
        <Rect x={GX + 26} y={GY - 14} width={64} height={26} rx={5} fill="#E0A526" />
        <Rect x={GX + 26} y={GY - 14} width={64} height={8} rx={5} fill={tint('#E0A526', 14)} />
        <Rect x={GX + 30} y={GY - 8} width={54} height={10} rx={2} fill="#CFE7F4" />
        {[0, 1, 2, 3].map((i) => <Line key={i} x1={GX + 32 + i * 13} y1={GY - 8} x2={GX + 32 + i * 13} y2={GY + 2} stroke="#E0A526" strokeWidth={2} />)}
        <Circle cx={GX + 40} cy={GY + 12} r={5} fill="#3F3B37" />
        <Circle cx={GX + 40} cy={GY + 12} r={2} fill="#7E7873" />
        <Circle cx={GX + 76} cy={GY + 12} r={5} fill="#3F3B37" />
        <Circle cx={GX + 76} cy={GY + 12} r={2} fill="#7E7873" />
        <Circle cx={GX + 90} cy={GY - 2} r={1.6} fill="#FFE9A8" />
      </G>
      {/* shelter */}
      <G>
        <Rect x={GX - 86} y={GY - 4} width={3} height={22} fill="#8A8F96" />
        <Rect x={GX - 22} y={GY - 4} width={3} height={22} fill="#8A8F96" />
        <Rect x={GX - 88} y={GY - 38} width={70} height={6} rx={2} fill="#5BA6C9" />
        <Rect x={GX - 88} y={GY - 38} width={70} height={2.4} rx={1} fill={tint('#5BA6C9', 16)} />
        <Rect x={GX - 86} y={GY - 32} width={66} height={20} rx={1} fill="#CFE7F4" opacity={0.55} />
        <Rect x={GX - 84} y={GY + 4} width={60} height={4} rx={2} fill="#9A764C" />
        <Rect x={GX - 84} y={GY + 8} width={60} height={3} rx={1} fill="#7E5736" />
        <Rect x={GX - 80} y={GY + 8} width={2.4} height={8} fill="#7E5736" />
        <Rect x={GX - 28} y={GY + 8} width={2.4} height={8} fill="#7E5736" />
      </G>
      {/* bus-stop sign */}
      <Rect x={GX - 14} y={GY - 34} width={2.4} height={30} fill="#8A8F96" />
      <Rect x={GX - 22} y={GY - 40} width={18} height={9} rx={2} fill="#3B6FA0" />
      <SvgText x={GX - 13} y={GY - 33.5} fontSize={5} fontWeight="bold" fill="#FFFFFF" textAnchor="middle">BUS</SvgText>
      {/* people queueing politely */}
      <PNPC x={GX - 60} base={GY + 14} shirt="#E0764B" />
      <PNPC x={GX - 44} base={GY + 16} shirt="#7E6BD0" dress />
      <PNPC x={GX - 8} base={GY + 18} shirt="#7FB04F" />
      <Bush x={GX - 96} y={GY + 8} s={0.7} />
    </G>
  );
}

export function TownGatePremiumScene() {
  return (
    <G>
      <PGround top="#E4D7BC" side="#CBBA97" paved />
      <WorldTree x={GX - 92} y={GY - 12} s={0.95} />
      <WorldTree x={GX + 92} y={GY - 12} s={0.95} />
      {/* gate pillars + arch */}
      <G>
        <Rect x={GX - 70} y={GY - 54} width={18} height={54} rx={2} fill="#D8C19A" />
        <Rect x={GX - 70} y={GY - 54} width={5} height={54} fill={tint('#D8C19A', 14)} />
        <Rect x={GX - 72} y={GY - 58} width={22} height={6} rx={2} fill="#C2AC85" />
        <Rect x={GX + 52} y={GY - 54} width={18} height={54} rx={2} fill="#D8C19A" />
        <Rect x={GX + 52} y={GY - 54} width={5} height={54} fill={tint('#D8C19A', 14)} />
        <Rect x={GX + 50} y={GY - 58} width={22} height={6} rx={2} fill="#C2AC85" />
        {/* lintel banner */}
        <Rect x={GX - 64} y={GY - 66} width={128} height={14} rx={3} fill="#9B6B4B" />
        <Rect x={GX - 64} y={GY - 66} width={128} height={4} rx={2} fill={tint('#9B6B4B', 14)} />
        <SvgText x={GX} y={GY - 56} fontSize={8} fontWeight="bold" fill="#FBF4E6" textAnchor="middle">TOWN GATE</SvgText>
        {/* little flags */}
        <Polygon points={`${GX - 60},${GY - 66} ${GX - 60},${GY - 74} ${GX - 52},${GY - 70}`} fill="#E0764B" />
        <Polygon points={`${GX + 60},${GY - 66} ${GX + 60},${GY - 74} ${GX + 52},${GY - 70}`} fill="#5BA6C9" />
        <WorldLamp x={GX - 61} y={GY + 2} s={0.85} />
        <WorldLamp x={GX + 61} y={GY + 2} s={0.85} />
      </G>
      {/* waving goodbye */}
      <PNPC x={GX - 20} base={GY + 24} shirt="#5BA6C9" wave />
      <PNPC x={GX + 2} base={GY + 26} shirt="#E0699A" dress wave />
      <PNPC x={GX + 24} base={GY + 22} shirt="#7FB04F" />
      <PPlanter x={GX - 40} base={GY + 14} color="#FFD24C" />
      <PPlanter x={GX + 40} base={GY + 14} color="#7E6BD0" />
    </G>
  );
}

export function NeighbourhoodParkPremiumScene() {
  return (
    <G>
      <PGround grass side="#9ECB78" />
      {/* playground: a little slide */}
      <G>
        <Ellipse cx={GX + 44} cy={GY + 18} rx={20} ry={4} fill="#000" opacity={0.1} />
        <Line x1={GX + 34} y1={GY + 14} x2={GX + 40} y2={GY - 16} stroke="#9A8A6A" strokeWidth={2.4} />
        {[0, 1, 2, 3].map((i) => <Line key={i} x1={GX + 33 + i} y1={GY + 8 - i * 6} x2={GX + 38 + i} y2={GY + 8 - i * 6} stroke="#C2AC85" strokeWidth={1.6} />)}
        <Polygon points={`${GX + 40},${GY - 18} ${GX + 44},${GY - 18} ${GX + 58},${GY + 14} ${GX + 54},${GY + 14}`} fill="#5BA6C9" />
        <Polygon points={`${GX + 40},${GY - 18} ${GX + 44},${GY - 18} ${GX + 45},${GY - 6} ${GX + 41},${GY - 6}`} fill={tint('#5BA6C9', 16)} />
      </G>
      <WorldTree x={GX - 74} y={GY - 16} s={1.2} />
      <WorldTree x={GX + 80} y={GY - 14} s={1.05} />
      <Pond x={GX - 56} y={GY + 18} s={0.8} />
      <WorldBench x={GX + 6} y={GY + 22} s={0.95} />
      <Flower x={GX - 20} y={GY + 24} color="#E0699A" />
      <Flower x={GX - 10} y={GY + 26} color="#FFD24C" />
      <Bush x={GX + 64} y={GY + 14} s={0.78} />
      {/* a family enjoying the park */}
      <PNPC x={GX - 30} base={GY + 22} shirt="#5BA6C9" />
      <PNPC x={GX - 14} base={GY + 24} shirt="#E0764B" dress wave />
      <PNPC x={GX + 50} base={GY + 22} shirt="#FFD24C" s={0.68} />
    </G>
  );
}
