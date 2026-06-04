/**
 * GiftShopPremiumScene — a cheerful gift shop: pink facade, big "GIFTS" sign,
 * striped awning, a glowing display window full of wrapped boxes, balloons tied
 * out front, stacked presents, a shopkeeper and a delighted customer.
 */
import React from 'react';
import { G, Rect } from 'react-native-svg';
import {
  GX, GY, PGround, PBuilding, PNPC, PGiftBox, PBalloon, PPlanter,
} from './premiumKit';
import { WorldTree, Bush } from '../../components/LocationScene';

export default function GiftShopPremiumScene() {
  return (
    <G>
      <PGround top="#ECDFC8" side="#CBBA97" paved />
      <WorldTree x={GX + 92} y={GY - 10} s={0.82} />

      {/* shop (hero) */}
      <PBuilding
        x={GX - 44} base={GY - 6} w={82} h={58}
        wall="#F6DCE7" roof="#D06A93" accent="#D6568C"
        sign="GIFTS" hangSign="SALE" awning="#E68FB4" doorAccent="#B45D86"
      />

      {/* glowing display window with little presents */}
      <Rect x={GX - 36} y={GY - 40} width={26} height={20} rx={2} fill="#FFF7E6" stroke="#FFFFFF" strokeWidth={1.4} />
      <PGiftBox x={GX - 30} base={GY - 22} color="#7E6BD0" ribbon="#FFD24C" s={0.45} />
      <PGiftBox x={GX - 22} base={GY - 22} color="#5BA6C9" ribbon="#FF9FC0" s={0.45} />
      <PGiftBox x={GX - 16} base={GY - 23} color="#E0764B" ribbon="#FFFFFF" s={0.4} />

      {/* balloons tied at the door */}
      <PBalloon x={GX + 8} base={GY - 14} color="#E0764B" h={30} />
      <PBalloon x={GX + 13} base={GY - 14} color="#5BA6C9" h={36} />
      <PBalloon x={GX + 18} base={GY - 14} color="#FFD24C" h={28} />

      {/* stacked presents out front */}
      <PGiftBox x={GX + 40} base={GY + 18} color="#7E6BD0" ribbon="#FFD24C" />
      <PGiftBox x={GX + 52} base={GY + 20} color="#5BA6C9" ribbon="#FF9FC0" s={0.85} />
      <PGiftBox x={GX + 44} base={GY + 8} color="#E0764B" ribbon="#FFFFFF" s={0.7} />
      <PPlanter x={GX - 56} base={GY + 12} color="#E0699A" />
      <Bush x={GX - 66} y={GY + 4} s={0.7} />

      {/* people */}
      <PNPC x={GX - 8} base={GY + 4} shirt="#D6568C" apron="#FBE7F0" />
      <PNPC x={GX + 28} base={GY + 22} shirt="#5BA6C9" dress wave />
      <PNPC x={GX + 60} base={GY + 16} shirt="#7FB04F" s={0.92} />
    </G>
  );
}
