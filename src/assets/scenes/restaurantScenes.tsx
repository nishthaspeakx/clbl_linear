/**
 * restaurantScenes — premium scenes for the "Talk at Restaurant" beats:
 * Host Desk, Entrance, Menu, Ordering, Billing, Exit. Warm interiors with
 * pendant lights, dressed tables, waiters and diners; a rich exterior facade.
 */
import React from 'react';
import { G, Rect, Line, Circle, Polygon, Ellipse, Text as SvgText } from 'react-native-svg';
import {
  GX, GY, PRoom, PDiningSet, PSeated, PNPC, PHostDesk, PPendant, PWallFrame,
  PPlanter, PGround, PBuilding, PStringLights, PMenuBoard, PCounter, PMat,
  shade, tint,
} from './premiumKit';
import { WorldTree } from '../../components/LocationScene';

const WALL = '#E9D6BB';
const FLOOR = '#C49B6A';
const ACCENT = '#9B3F3A';

/** Waiter: apron NPC carrying a small round tray. */
function Waiter({ x, base, tray = true }: { x: number; base: number; tray?: boolean }) {
  return (
    <G>
      <PNPC x={x} base={base} shirt="#3A3530" apron="#E8DFC8" hair="#221A14" />
      {tray && (
        <G>
          <Ellipse cx={x - 8} cy={base - 16} rx={5} ry={1.8} fill="#CFB98E" />
          <Ellipse cx={x - 8} cy={base - 16.6} rx={3.6} ry={1.2} fill="#EAD9BE" />
          <Rect x={x - 9.5} y={base - 19} width={2} height={2.6} rx={0.6} fill="#E0764B" />
          <Rect x={x - 6.5} y={base - 19} width={2} height={2.6} rx={0.6} fill="#9FD0EC" />
        </G>
      )}
    </G>
  );
}

export function RestaurantHostPremiumScene() {
  return (
    <G>
      <PRoom wall={WALL} floor={FLOOR} accent={ACCENT} />
      <PPendant x={GX - 30} top={GY - 60} base={GY - 34} />
      <PPendant x={GX + 30} top={GY - 60} base={GY - 34} />
      <PWallFrame x={GX - 50} y={GY - 40} color="#9B3F3A" />
      {/* RESERVATIONS sign */}
      <Rect x={GX - 26} y={GY - 50} width={52} height={9} rx={2} fill={ACCENT} />
      <SvgText x={GX} y={GY - 43.5} fontSize={5.4} fontWeight="bold" fill="#FBF4E6" textAnchor="middle">RESERVATIONS</SvgText>
      <PHostDesk x={GX - 4} base={GY + 16} />
      <PNPC x={GX + 12} base={GY + 6} shirt="#3A3530" apron="#E8DFC8" />
      {/* guests booking a table */}
      <PNPC x={GX - 40} base={GY + 24} shirt="#5BA6C9" />
      <PNPC x={GX + 44} base={GY + 24} shirt="#C0567B" dress />
      <PPlanter x={GX + 64} base={GY + 14} color="#7FB04F" />
    </G>
  );
}

export function RestaurantEntrancePremiumScene() {
  return (
    <G>
      <PGround top="#E7D8BC" side="#CBBA97" paved />
      <WorldTree x={GX - 88} y={GY - 12} s={0.82} />
      <PBuilding
        x={GX - 44} base={GY - 6} w={82} h={58}
        wall="#EFE0C4" roof="#7E5333" accent="#9B3F3A"
        sign="BISTRO" hangSign="OPEN" awning="#9B3F3A" doorAccent="#5E3A24"
      />
      <PStringLights x1={GX - 40} y1={GY - 58} x2={GX + 8} y2={GY - 56} />
      <PMenuBoard x={GX - 50} base={GY + 18} />
      <PPlanter x={GX + 52} base={GY + 14} color="#E0699A" />
      <PPlanter x={GX - 62} base={GY + 8} color="#7E6BD0" />
      {/* guests arriving, doorman greeting */}
      <PNPC x={GX - 8} base={GY + 4} shirt="#3A3530" apron="#E8DFC8" />
      <PNPC x={GX + 26} base={GY + 22} shirt="#5BA6C9" wave />
      <PNPC x={GX + 44} base={GY + 24} shirt="#E0A85A" dress s={0.95} />
    </G>
  );
}

export function RestaurantMenuPremiumScene() {
  return (
    <G>
      <PRoom wall={WALL} floor={FLOOR} accent={ACCENT} />
      <PPendant x={GX} top={GY - 60} base={GY - 30} />
      <PWallFrame x={GX - 44} y={GY - 40} color="#E0A85A" />
      <PWallFrame x={GX + 44} y={GY - 40} color="#7FB04F" />
      <PSeated x={GX} base={GY - 2} shirt="#5BA6C9" chair="#7E5333" />
      <PDiningSet x={GX} base={GY + 16} />
      <PSeated x={GX - 30} base={GY + 22} shirt="#E0764B" chair="#7E5333" />
      {/* waiter presenting the menu */}
      <Waiter x={GX + 40} base={GY + 24} tray={false} />
      <Rect x={GX + 30} y={GY + 4} width={9} height={12} rx={1} fill="#9B3F3A" transform={`rotate(-14 ${GX + 34} ${GY + 10})`} />
      <Line x1={GX + 31} y1={GY + 8} x2={GX + 37} y2={GY + 7} stroke="#FBF4E6" strokeWidth={0.6} transform={`rotate(-14 ${GX + 34} ${GY + 10})`} />
    </G>
  );
}

export function RestaurantOrderingPremiumScene() {
  return (
    <G>
      <PRoom wall={WALL} floor={FLOOR} accent={ACCENT} />
      <PPendant x={GX - 4} top={GY - 60} base={GY - 30} />
      <PWallFrame x={GX - 48} y={GY - 42} color="#9B3F3A" />
      <PSeated x={GX - 6} base={GY - 2} shirt="#C0567B" dress chair="#7E5333" />
      <PDiningSet x={GX - 6} base={GY + 16} />
      <PSeated x={GX - 34} base={GY + 22} shirt="#5BA6C9" chair="#7E5333" />
      <PSeated x={GX + 20} base={GY + 22} shirt="#7FB04F" chair="#7E5333" />
      {/* waiter taking the order with a tray */}
      <Waiter x={GX + 50} base={GY + 24} />
      <PPlanter x={GX + 70} base={GY + 14} color="#7E6BD0" />
    </G>
  );
}

export function RestaurantBillingPremiumScene() {
  return (
    <G>
      <PRoom wall={WALL} floor={FLOOR} accent={ACCENT} />
      <PPendant x={GX + 26} top={GY - 60} base={GY - 34} />
      <PWallFrame x={GX - 48} y={GY - 40} color="#E0A85A" />
      {/* billing counter + POS + dessert display */}
      <PCounter x={GX - 6} base={GY + 14} w={78} />
      <Rect x={GX - 30} y={GY - 6} width={14} height={9} rx={1.5} fill="#3C4A66" />
      <Rect x={GX - 28} y={GY - 4} width={10} height={5} rx={1} fill="#9FD0EC" />
      {/* QR stand */}
      <Rect x={GX + 2} y={GY - 12} width={9} height={9} rx={1} fill="#FBF4E6" stroke="#3C4A66" strokeWidth={1} />
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
        <Rect key={`${r}-${c}`} x={GX + 3.5 + c * 2.4} y={GY - 10.5 + r * 2.4} width={1.4} height={1.4} fill={(r + c) % 2 ? '#3C4A66' : '#FBF4E6'} />
      )))}
      {/* dessert display */}
      <Rect x={GX + 22} y={GY - 2} width={18} height={9} rx={1.5} fill="#CFE7F4" stroke="#FBF4E6" strokeWidth={1} opacity={0.9} />
      <Circle cx={GX + 28} cy={GY + 3} r={1.8} fill="#E0699A" />
      <Circle cx={GX + 34} cy={GY + 3} r={1.8} fill="#FFD24C" />
      {/* cashier + guest paying */}
      <PNPC x={GX - 20} base={GY + 26} shirt="#3A3530" apron="#E8DFC8" />
      <PNPC x={GX + 30} base={GY + 26} shirt="#5BA6C9" />
    </G>
  );
}

export function RestaurantExitPremiumScene() {
  return (
    <G>
      <PGround top="#E9D9C0" side="#CDBE9A" paved />
      <PBuilding
        x={GX - 44} base={GY - 6} w={82} h={56}
        wall="#EFE0C4" roof="#7E5333" accent="#3B8F5E"
        sign="THANK YOU" hangSign="AGAIN" awning="#3B8F5E" doorAccent="#5E3A24"
      />
      <PStringLights x1={GX - 38} y1={GY - 56} x2={GX + 10} y2={GY - 54} />
      {/* feedback stand with stars */}
      <Rect x={GX + 36} y={GY - 22} width={22} height={18} rx={2} fill="#FBF4E6" stroke="#C9B393" strokeWidth={1.4} />
      <SvgText x={GX + 47} y={GY - 13} fontSize={8} fill="#FFC53D" textAnchor="middle">★★★</SvgText>
      <SvgText x={GX + 47} y={GY - 6} fontSize={3.6} fill="#8A7B5E" textAnchor="middle">RATE US</SvgText>
      <Rect x={GX + 46} y={GY - 30} width={2} height={9} fill="#9A764C" />
      <PMenuBoard x={GX - 54} base={GY + 16} />
      {/* happy guests leaving + waving waiter */}
      <PNPC x={GX + 6} base={GY + 22} shirt="#3C4A66" />
      <PNPC x={GX + 24} base={GY + 24} shirt="#E0699A" dress wave />
      <PNPC x={GX - 8} base={GY + 4} shirt="#3A3530" apron="#E8DFC8" wave />
      <PPlanter x={GX + 64} base={GY + 12} color="#7FB04F" />
    </G>
  );
}
