/**
 * CafePremiumScene — a lively street cafe: striped awning, glass storefront,
 * hanging OPEN board, outdoor tables with coffee cups & umbrella, a chalk menu
 * board, a barista and seated guests. ~40% building, 30% props, 20% people.
 */
import React from 'react';
import { G } from 'react-native-svg';
import {
  GX, GY, PGround, PBuilding, PNPC, PCafeTable, PChairOutdoor, PUmbrella,
  PMenuBoard, PPlanter, PStringLights,
} from './premiumKit';
import { WorldTree, Bush } from '../../components/LocationScene';

export default function CafePremiumScene() {
  return (
    <G>
      <PGround top="#E9DAC0" side="#CBBA97" paved />

      {/* trees behind for depth */}
      <WorldTree x={GX - 86} y={GY - 14} s={0.8} />
      <WorldTree x={GX + 92} y={GY - 10} s={0.85} />

      {/* the cafe (hero) */}
      <PBuilding
        x={GX - 44} base={GY - 6} w={82} h={58}
        wall="#F0E3C6" roof="#B5603C" accent="#C0432F"
        sign="CAFÉ" hangSign="OPEN" awning="#C84B36" doorAccent="#8C5A36"
      />
      <PStringLights x1={GX - 40} y1={GY - 58} x2={GX + 6} y2={GY - 56} />

      {/* outdoor seating */}
      <PUmbrella x={GX + 30} base={GY + 18} color="#C84B36" />
      <PCafeTable x={GX + 30} base={GY + 20} />
      <PChairOutdoor x={GX + 18} base={GY + 22} color="#6FA0C0" />
      <PChairOutdoor x={GX + 42} base={GY + 22} color="#6FA0C0" />
      <PCafeTable x={GX - 12} base={GY + 24} />
      <PChairOutdoor x={GX - 24} base={GY + 26} color="#D7A24E" />

      <PMenuBoard x={GX - 46} base={GY + 18} />
      <PPlanter x={GX + 54} base={GY + 14} color="#E0699A" />
      <PPlanter x={GX - 60} base={GY + 8} color="#7E6BD0" />
      <Bush x={GX + 66} y={GY + 2} s={0.7} />

      {/* people: barista at the door, a guest, a passer-by */}
      <PNPC x={GX - 6} base={GY + 2} shirt="#3C5A3A" apron="#E8DFC8" hair="#221A14" />
      <PNPC x={GX + 18} base={GY + 22} shirt="#E0764B" wave />
      <PNPC x={GX - 24} base={GY + 26} shirt="#7E6BD0" dress s={0.95} />
    </G>
  );
}
