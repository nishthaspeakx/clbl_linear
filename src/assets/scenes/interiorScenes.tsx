/**
 * interiorScenes — premium isometric cutaway rooms for the "My Family" beats.
 * Each is a distinct interior (no repeated house) built from premiumKit:
 * Living Room, Kitchen, Bedroom, Dining, Balcony, Doorway.
 */
import React from 'react';
import { G, Polygon, Rect, Line, Circle } from 'react-native-svg';
import {
  GX, GY, PRoom, PRug, PSofa, PTV, PBookshelf, PFloorLamp, PWallFrame,
  PCounter, PUpperCabinets, PFridge, PStove, PBed, PSuitcase, PWallMap,
  PDiningSet, PSeated, PBalconyView, PRailing, PShoeRack, PMat, PNPC,
  PPlanter, PChairOutdoor, PCafeTable, shade,
} from './premiumKit';

export function LivingRoomPremiumScene() {
  return (
    <G>
      <PRoom wall="#EBD9BD" floor="#CBA877" accent="#C98F5E" />
      <PWallFrame x={GX - 36} y={GY - 42} color="#7FB04F" />
      <PWallFrame x={GX - 20} y={GY - 46} color="#E0764B" />
      <PWallFrame x={GX - 4} y={GY - 42} color="#5BA6C9" />
      <PBookshelf x={GX - 60} base={GY + 4} />
      <PTV x={GX + 50} base={GY + 4} />
      <PRug x={GX - 4} base={GY + 24} color="#B85C7E" w={86} />
      <PSofa x={GX - 6} base={GY + 18} color="#5E80B0" />
      <PFloorLamp x={GX + 30} base={GY + 8} />
      {/* father chatting */}
      <PNPC x={GX + 24} base={GY + 26} shirt="#3C5A8A" hair="#2A211A" />
      <PSeated x={GX - 16} base={GY + 14} shirt="#E0A85A" chair="#5E80B0" />
    </G>
  );
}

export function KitchenPremiumScene() {
  return (
    <G>
      <PRoom wall="#E6E0CE" floor="#D2BE9A" accent="#BBA478" window />
      <PUpperCabinets x={GX - 36} y={GY - 48} w={64} />
      <PCounter x={GX - 22} base={GY + 14} w={86} />
      <PStove x={GX + 6} base={GY + 14} />
      <PFridge x={GX + 54} base={GY + 6} />
      {/* hanging utensils */}
      <Rect x={GX - 50} y={GY - 30} width={26} height={1.6} rx={1} fill="#9A764C" />
      {[-46, -40, -34].map((dx, i) => <Line key={i} x1={GX + dx} y1={GY - 30} x2={GX + dx} y2={GY - 24} stroke="#8A8F96" strokeWidth={1.2} />)}
      <Circle cx={GX - 46} cy={GY - 23} r={2} fill="#AEB4BA" />
      {/* mom cooking */}
      <PNPC x={GX + 4} base={GY + 26} shirt="#C0567B" apron="#FBE7F0" dress />
      <PNPC x={GX + 44} base={GY + 26} shirt="#7FB04F" s={0.78} />
    </G>
  );
}

export function BedroomPremiumScene() {
  return (
    <G>
      <PRoom wall="#DDE2EC" floor="#C8AE86" accent="#A9B0C0" />
      <PWallMap x={GX + 34} y={GY - 36} />
      <PWallFrame x={GX - 40} y={GY - 40} color="#E0764B" />
      <PBed x={GX - 28} base={GY + 18} color="#7E6BD0" />
      <PSuitcase x={GX + 36} base={GY + 22} color="#E0764B" />
      <PFloorLamp x={GX + 58} base={GY + 6} />
      {/* sibling planning the trip, pointing at the map */}
      <PNPC x={GX + 12} base={GY + 26} shirt="#5BA6C9" wave hair="#2A211A" s={0.96} />
      <PSeated x={GX - 28} base={GY + 6} shirt="#E0A85A" chair="#7E6BD0" />
    </G>
  );
}

export function DiningPremiumScene() {
  return (
    <G>
      <PRoom wall="#ECDCC2" floor="#CBA877" accent="#C98F5E" />
      <PWallFrame x={GX - 30} y={GY - 42} color="#7FB04F" />
      <PFloorLamp x={GX + 60} base={GY + 6} />
      {/* diners around the table (back first) */}
      <PSeated x={GX} base={GY - 4} shirt="#5BA6C9" chair="#9B6B4B" />
      <PDiningSet x={GX} base={GY + 14} />
      <PSeated x={GX - 32} base={GY + 22} shirt="#E0764B" chair="#9B6B4B" />
      <PSeated x={GX + 32} base={GY + 22} shirt="#C0567B" dress chair="#9B6B4B" />
    </G>
  );
}

export function BalconyPremiumScene() {
  return (
    <G>
      <PBalconyView accent="#9CC0E0" />
      {/* balcony floor */}
      <Polygon points={`${GX - 92},${GY - 10} ${GX + 92},${GY - 10} ${GX + 100},${GY + 30} ${GX - 100},${GY + 30}`} fill="#C8A877" />
      {[0.4, 0.7].map((t, i) => (
        <Line key={i} x1={GX - 92 - 8 * t} y1={GY - 10 + 40 * t} x2={GX + 92 + 8 * t} y2={GY - 10 + 40 * t} stroke={shade('#C8A877', 12)} strokeWidth={0.8} opacity={0.5} />
      ))}
      <PPlanter x={GX - 64} base={GY + 8} color="#E0699A" />
      <PPlanter x={GX + 64} base={GY + 8} color="#7E6BD0" />
      <PCafeTable x={GX + 36} base={GY + 18} />
      <PChairOutdoor x={GX + 22} base={GY + 22} color="#7FB04F" />
      {/* relative + person asking for help */}
      <PNPC x={GX - 16} base={GY + 24} shirt="#5BA6C9" />
      <PNPC x={GX + 6} base={GY + 26} shirt="#E0764B" wave dress />
      <PRailing x={GX} base={GY + 26} w={184} />
    </G>
  );
}

export function DoorwayPremiumScene() {
  return (
    <G>
      <PRoom wall="#E7D6BC" floor="#CBA877" accent="#C98F5E" window={false} />
      {/* entrance door on the back wall */}
      <Rect x={GX - 18} y={GY - 50} width={30} height={44} rx={2} fill="#9B6B4B" stroke="#7E5736" strokeWidth={1.4} />
      <Rect x={GX - 15} y={GY - 47} width={24} height={26} rx={1.5} fill="#BFD9EC" opacity={0.85} />
      <Polygon points={`${GX - 15},${GY - 47} ${GX - 4},${GY - 47} ${GX - 15},${GY - 33}`} fill="#FFFFFF" opacity={0.3} />
      <Circle cx={GX + 6} cy={GY - 26} r={1.4} fill="#F4D58A" />
      {/* warm light spilling from the open door */}
      <Polygon points={`${GX - 14},${GY - 6} ${GX + 8},${GY - 6} ${GX + 18},${GY + 18} ${GX - 24},${GY + 18}`} fill="#FFE49A" opacity={0.22} />
      <PWallFrame x={GX + 40} y={GY - 38} color="#E0764B" />
      {/* coat hooks */}
      <Rect x={GX - 56} y={GY - 34} width={20} height={2} rx={1} fill="#9A764C" />
      {[-52, -46, -40].map((dx, i) => <Line key={i} x1={GX + dx} y1={GY - 32} x2={GX + dx} y2={GY - 28} stroke="#7E5736" strokeWidth={1.4} />)}
      <Polygon points={`${GX - 52},${GY - 28} ${GX - 48},${GY - 28} ${GX - 50},${GY - 18}`} fill="#5BA6C9" />
      <PShoeRack x={GX - 44} base={GY + 16} />
      <PMat x={GX - 4} base={GY + 26} color="#B85C7E" />
      {/* apology moment at the door */}
      <PNPC x={GX - 6} base={GY + 24} shirt="#7E6BD0" hair="#2A211A" />
      <PNPC x={GX + 30} base={GY + 22} shirt="#5BA6C9" dress />
      <PPlanter x={GX + 56} base={GY + 14} color="#7FB04F" />
    </G>
  );
}
