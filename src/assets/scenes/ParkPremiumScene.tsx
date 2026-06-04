/**
 * ParkPremiumScene — a leafy neighbourhood park: a winding path, a small
 * fountain, benches, flower clusters, a pond, and families strolling/playing.
 * Greenery-led (the "talk about yourself / visiting a park" beats).
 */
import React from 'react';
import { G, Path } from 'react-native-svg';
import { GX, GY, PGround, PNPC, PPlanter } from './premiumKit';
import { WorldTree, WorldBench, Pond, Flower, Bush, Fountain } from '../../components/LocationScene';

export default function ParkPremiumScene() {
  return (
    <G>
      <PGround grass side="#9ECB78" />

      {/* winding gravel path */}
      <Path d={`M ${GX - 92} ${GY + 24} Q ${GX - 20} ${GY + 2} ${GX + 20} ${GY - 6} T ${GX + 92} ${GY - 18}`} stroke="#D8C9A0" strokeWidth={13} fill="none" strokeLinecap="round" />
      <Path d={`M ${GX - 92} ${GY + 24} Q ${GX - 20} ${GY + 2} ${GX + 20} ${GY - 6} T ${GX + 92} ${GY - 18}`} stroke="#EADCBB" strokeWidth={6} fill="none" strokeLinecap="round" />

      {/* trees & shrubs */}
      <WorldTree x={GX - 70} y={GY - 18} s={1.15} />
      <WorldTree x={GX + 78} y={GY - 12} s={1.25} />
      <WorldTree x={GX + 30} y={GY - 28} s={0.85} />
      <Bush x={GX - 40} y={GY + 14} s={0.85} />
      <Bush x={GX + 56} y={GY + 12} s={0.8} />

      {/* centre fountain */}
      <Fountain x={GX + 2} y={GY + 2} s={0.85} />

      {/* pond */}
      <Pond x={GX - 64} y={GY + 16} s={0.8} />

      {/* benches + flowers */}
      <WorldBench x={GX + 48} y={GY + 20} s={0.95} />
      <Flower x={GX - 18} y={GY + 22} color="#E0699A" />
      <Flower x={GX - 10} y={GY + 24} color="#FFD24C" />
      <Flower x={GX + 18} y={GY + 22} color="#7E6BD0" />
      <PPlanter x={GX + 72} base={GY + 16} color="#FF9FC0" />

      {/* people: a stroller, a waver, two kids */}
      <PNPC x={GX - 28} base={GY + 20} shirt="#5BA6C9" />
      <PNPC x={GX + 40} base={GY + 18} shirt="#E0764B" dress wave />
      <PNPC x={GX + 8} base={GY + 26} shirt="#7FB04F" s={0.7} />
      <PNPC x={GX + 16} base={GY + 27} shirt="#E0A526" s={0.66} />
    </G>
  );
}
