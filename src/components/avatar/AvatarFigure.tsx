/**
 * AvatarFigure — a parametric, friendly isometric-style full-body learner.
 * One figure driven by an `AvatarStyle` descriptor (resolved by `styleFor`)
 * renders all 18 personas with distinct outfits, hair and accessories.
 *
 * Drawn in a 64×120 viewBox (feet ≈ y118), transparent background, so it can
 * stand on a map pin or sit in a profile card. Swap this out for PNG/WebP later
 * without changing call sites — UserAvatar is the single render entry point.
 */
import React from 'react';
import { Circle, Ellipse, G, Line, Path, Polygon, Rect } from 'react-native-svg';
import { AgeGroup, Gender, UserType } from '../../data/avatarProfiles';
import { EquipKey } from '../../data/rewards';

function shade(hex: string, a = 24): string {
  const m = hex.replace('#', '');
  const n = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  return `rgb(${Math.max(0, ((n >> 16) & 255) - a)},${Math.max(0, ((n >> 8) & 255) - a)},${Math.max(0, (n & 255) - a)})`;
}
function tint(hex: string, a = 20): string {
  const m = hex.replace('#', '');
  const n = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  return `rgb(${Math.min(255, ((n >> 16) & 255) + a)},${Math.min(255, ((n >> 8) & 255) + a)},${Math.min(255, (n & 255) + a)})`;
}

export type AvatarPose = 'standing' | 'walking' | 'celebrating';
type TopKind = 'blazer' | 'shirt' | 'tshirt' | 'hoodie' | 'kurta' | 'saree';
type BottomKind = 'trousers' | 'jeans' | 'track' | 'sareeSkirt';
type Accessory = 'laptopBag' | 'handbag' | 'backpack' | 'notebook' | 'book' | 'tablet' | 'shoppingBag' | 'phone';

export interface AvatarStyle {
  skin: string;
  hair: string;
  hairStyle: 'long' | 'bun' | 'short';
  grey: boolean;
  topKind: TopKind;
  top: string;
  inner: string;
  tie?: string;
  bottomKind: BottomKind;
  bottom: string;
  accessory: Accessory;
  accent: string;
  bindi?: boolean;
}

const SKIN: Record<AgeGroup, string> = { '18_25': '#C68A5E', '25_40': '#B97E54', '40_plus': '#A9744B' };

/** Resolve the visual descriptor for a persona. */
export function styleFor(userType: UserType, gender: Gender, ageGroup: AgeGroup): AvatarStyle {
  const skin = SKIN[ageGroup];
  const grey = ageGroup === '40_plus';
  const hairStyle: AvatarStyle['hairStyle'] = gender === 'female' ? (ageGroup === '18_25' ? 'long' : 'bun') : 'short';
  const base: AvatarStyle = {
    skin, hair: '#2A201A', hairStyle, grey,
    topKind: 'shirt', top: '#5BA6C9', inner: '#F4ECD8',
    bottomKind: 'trousers', bottom: '#3A3E4A',
    accessory: 'notebook', accent: '#5A4634',
  };
  const key = `${userType}_${gender}_${ageGroup}`;
  const M: Record<string, Partial<AvatarStyle>> = {
    // Working professional — female
    working_professional_female_18_25: { topKind: 'blazer', top: '#2E7D8A', inner: '#F4ECD8', bottom: '#34384A', accessory: 'laptopBag', accent: '#5A4634' },
    working_professional_female_25_40: { topKind: 'kurta', top: '#8A3A57', inner: '#F2E7D8', bottom: '#2E3340', accessory: 'handbag', accent: '#7A5A3A' },
    working_professional_female_40_plus: { topKind: 'blazer', top: '#34553F', inner: '#EFE6D4', bottom: '#33384A', accessory: 'handbag', accent: '#5A4634' },
    // Working professional — male
    working_professional_male_18_25: { topKind: 'shirt', top: '#6FA8D6', inner: '#FFFFFF', bottom: '#C8B189', accessory: 'backpack', accent: '#3A6E8C' },
    working_professional_male_25_40: { topKind: 'blazer', top: '#2C3550', inner: '#FFFFFF', tie: '#9B2F3A', bottom: '#2C3550', accessory: 'laptopBag', accent: '#3A2E22' },
    working_professional_male_40_plus: { topKind: 'blazer', top: '#4A4E58', inner: '#EDEFF2', tie: '#3A5A86', bottom: '#3A3E47', accessory: 'laptopBag', accent: '#3A2E22' },
    // Student — female
    student_female_18_25: { topKind: 'tshirt', top: '#E0699A', inner: '#E0699A', bottomKind: 'jeans', bottom: '#3E5C86', accessory: 'backpack', accent: '#E0A526' },
    student_female_25_40: { topKind: 'kurta', top: '#5BA6C9', inner: '#EAF4FA', bottom: '#2E3340', accessory: 'tablet', accent: '#3A3530' },
    student_female_40_plus: { topKind: 'kurta', top: '#7E6BD0', inner: '#EFEAFB', bottom: '#3A3E47', accessory: 'notebook', accent: '#C0432F' },
    // Student — male
    student_male_18_25: { topKind: 'hoodie', top: '#E0764B', inner: '#F4ECD8', bottomKind: 'jeans', bottom: '#3E5C86', accessory: 'backpack', accent: '#33508A' },
    student_male_25_40: { topKind: 'shirt', top: '#7FB04F', inner: '#FFFFFF', bottomKind: 'jeans', bottom: '#3E5C86', accessory: 'tablet', accent: '#3A3530' },
    student_male_40_plus: { topKind: 'shirt', top: '#9AA0A6', inner: '#FFFFFF', bottom: '#3A3E47', accessory: 'book', accent: '#7A2E2E' },
    // Homemaker — female
    homemaker_female_18_25: { topKind: 'kurta', top: '#E0985F', inner: '#FBEFD8', bottom: '#5A4634', accessory: 'shoppingBag', accent: '#3BB273' },
    homemaker_female_25_40: { topKind: 'saree', top: '#C0567B', inner: '#7A2E4E', bottomKind: 'sareeSkirt', bottom: '#C0567B', accessory: 'notebook', accent: '#5BA6C9', bindi: true },
    homemaker_female_40_plus: { topKind: 'saree', top: '#34553F', inner: '#7A2E2E', bottomKind: 'sareeSkirt', bottom: '#34553F', accessory: 'book', accent: '#C8821A', bindi: true },
    // Homemaker — male
    homemaker_male_18_25: { topKind: 'tshirt', top: '#5BA6C9', inner: '#5BA6C9', bottomKind: 'track', bottom: '#3A3E47', accessory: 'phone', accent: '#2A2E33' },
    homemaker_male_25_40: { topKind: 'shirt', top: '#E0A526', inner: '#FFFFFF', bottom: '#3A3E47', accessory: 'notebook', accent: '#5BA6C9' },
    homemaker_male_40_plus: { topKind: 'kurta', top: '#EDE6D4', inner: '#F6F1E4', bottom: '#5A4634', accessory: 'book', accent: '#7A2E2E' },
  };
  return { ...base, ...(M[key] ?? {}) };
}

const CX = 32;

/* ── parts ── */
function Head({ s }: { s: AvatarStyle }) {
  const skin = s.skin;
  const longBack = s.hairStyle === 'long';
  return (
    <G>
      {/* long hair behind shoulders */}
      {longBack && (
        <Path d={`M 21 16 Q 16 30 19 48 L 26 48 Q 23 30 25 16 Z M 43 16 Q 48 30 45 48 L 38 48 Q 41 30 39 16 Z`} fill={s.grey ? '#5A5048' : shade(s.hair, 10)} />
      )}
      {/* bun behind */}
      {s.hairStyle === 'bun' && <Circle cx={CX} cy={10} r={5.6} fill={s.grey ? '#6A625A' : s.hair} />}
      {/* neck */}
      <Rect x={28.5} y={28} width={7} height={8} rx={2.5} fill={shade(skin, 12)} />
      {/* ears + earrings (female) */}
      <Circle cx={20.6} cy={21} r={2.4} fill={skin} />
      <Circle cx={43.4} cy={21} r={2.4} fill={skin} />
      {s.hairStyle !== 'short' && (
        <>
          <Circle cx={20.6} cy={24.4} r={1.1} fill="#F4D58A" />
          <Circle cx={43.4} cy={24.4} r={1.1} fill="#F4D58A" />
        </>
      )}
      {/* head (rounder, friendlier) */}
      <Circle cx={CX} cy={19.5} r={12.5} fill={skin} />
      <Ellipse cx={27.5} cy={14.5} rx={5} ry={4} fill={tint(skin, 16)} opacity={0.4} />
      {/* hair cap — fuller, soft */}
      <Path d={`M 19.5 21 Q 18 5.5 32 5 Q 46 5.5 44.5 21 Q 43 16 40 13.5 Q 36 11.5 32 11.5 Q 28 11.5 24 13.5 Q 21 16 19.5 21 Z`} fill={s.hair} />
      {!s.grey && <Path d={`M 24 13.5 Q 28 11.5 33 12`} stroke={tint(s.hair, 30)} strokeWidth={1} fill="none" opacity={0.5} strokeLinecap="round" />}
      {s.grey && <Path d={`M 20 20 Q 21.5 11 27 9 M 44 20 Q 42.5 11 37 9`} stroke="#A7A099" strokeWidth={1.6} fill="none" strokeLinecap="round" />}
      {/* eyes — bigger, with highlights */}
      <Ellipse cx={27.4} cy={20.5} rx={1.9} ry={2.4} fill="#FFFFFF" />
      <Ellipse cx={36.6} cy={20.5} rx={1.9} ry={2.4} fill="#FFFFFF" />
      <Circle cx={27.6} cy={20.9} r={1.4} fill="#2A2018" />
      <Circle cx={36.4} cy={20.9} r={1.4} fill="#2A2018" />
      <Circle cx={28.1} cy={20.3} r={0.5} fill="#FFFFFF" />
      <Circle cx={36.9} cy={20.3} r={0.5} fill="#FFFFFF" />
      {/* eyebrows — soft */}
      <Path d="M 25 16.6 Q 27.4 15.2 29.6 16.4" stroke={shade(s.hair, 6)} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <Path d="M 34.4 16.4 Q 36.6 15.2 39 16.6" stroke={shade(s.hair, 6)} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      {/* nose */}
      <Path d="M 32 21.5 q 0.9 1.4 -0.6 2" stroke={shade(skin, 28)} strokeWidth={0.8} fill="none" strokeLinecap="round" />
      {/* rosy cheeks */}
      <Circle cx={25} cy={24} r={2} fill="#F7A8A0" opacity={0.45} />
      <Circle cx={39} cy={24} r={2} fill="#F7A8A0" opacity={0.45} />
      {/* warm smile */}
      <Path d="M 28 25.4 Q 32 29 36 25.4" stroke="#9A5238" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      {s.bindi && <Circle cx={CX} cy={13.5} r={1.2} fill="#C0392B" />}
    </G>
  );
}

function Legs({ s }: { s: AvatarStyle }) {
  if (s.bottomKind === 'sareeSkirt') {
    // feet only; skirt covers legs
    return (
      <G>
        <Ellipse cx={28} cy={116} rx={4} ry={2} fill={shade(s.skin, 16)} />
        <Ellipse cx={36} cy={116} rx={4} ry={2} fill={shade(s.skin, 16)} />
      </G>
    );
  }
  const c = s.bottom;
  const shoe = '#3A352F';
  return (
    <G>
      <Rect x={25} y={76} width={6.5} height={37} rx={3} fill={c} />
      <Rect x={32.5} y={76} width={6.5} height={37} rx={3} fill={shade(c, 12)} />
      {s.bottomKind === 'track' && (
        <>
          <Rect x={25.5} y={78} width={1.4} height={33} fill="#FFFFFF" opacity={0.6} />
          <Rect x={37.6} y={78} width={1.4} height={33} fill="#FFFFFF" opacity={0.6} />
        </>
      )}
      {s.bottomKind === 'jeans' && <Line x1={28.2} y1={78} x2={28.2} y2={110} stroke={shade(c, 20)} strokeWidth={0.7} />}
      {/* shoes */}
      <Rect x={23.5} y={112} width={9} height={5} rx={2.4} fill={s.bottomKind === 'track' ? '#FFFFFF' : shoe} stroke={shoe} strokeWidth={s.bottomKind === 'track' ? 1 : 0} />
      <Rect x={31.5} y={112} width={9} height={5} rx={2.4} fill={s.bottomKind === 'track' ? '#EDEDED' : '#2C2823'} />
    </G>
  );
}

function Arms({ s, pose }: { s: AvatarStyle; pose: AvatarPose }) {
  const longSleeve = s.topKind !== 'tshirt';
  const sleeve = s.top;
  const skin = s.skin;
  const Arm = ({ x, side }: { x: number; side: 1 | -1 }) => (
    <G>
      {longSleeve ? (
        <Rect x={x} y={38} width={6} height={30} rx={3} fill={shade(sleeve, side === 1 ? 0 : 12)} />
      ) : (
        <>
          <Rect x={x} y={38} width={6} height={11} rx={3} fill={shade(sleeve, side === 1 ? 0 : 10)} />
          <Rect x={x + 0.6} y={48} width={4.8} height={18} rx={2.4} fill={skin} />
        </>
      )}
      <Circle cx={x + 3} cy={68} r={2.6} fill={skin} />
    </G>
  );
  const raised = pose === 'celebrating';
  return (
    <G>
      <Arm x={13.5} side={-1} />
      {raised ? (
        <G>
          <Rect x={45} y={20} width={6} height={26} rx={3} fill={sleeve} transform="rotate(24 48 33)" />
          <Circle cx={52} cy={20} r={2.8} fill={skin} />
        </G>
      ) : (
        <Arm x={44.5} side={1} />
      )}
    </G>
  );
}

function Torso({ s }: { s: AvatarStyle }) {
  const t = s.top;
  switch (s.topKind) {
    case 'saree':
      return (
        <G>
          {/* skirt (covers legs) */}
          <Polygon points="26,52 38,52 47,114 17,114" fill={t} />
          <Polygon points="26,52 38,52 41,114 23,114" fill={tint(t, 10)} opacity={0.5} />
          {[28, 32, 36].map((x, i) => <Line key={i} x1={x} y1={70} x2={x} y2={113} stroke={shade(t, 18)} strokeWidth={0.7} opacity={0.6} />)}
          {/* blouse */}
          <Rect x={21} y={36} width={22} height={18} rx={5} fill={s.inner} />
          {/* pallu drape across */}
          <Polygon points="20,54 30,40 46,30 50,36 30,52 24,58" fill={t} />
          <Polygon points="46,30 50,36 50,70 46,66" fill={shade(t, 10)} />
          <Rect x={21} y={36} width={22} height={3} rx={1.5} fill={shade(t, 16)} opacity={0.5} />
        </G>
      );
    case 'kurta':
      return (
        <G>
          <Rect x={19} y={35} width={26} height={54} rx={7} fill={t} />
          <Rect x={19} y={35} width={9} height={54} rx={7} fill={tint(t, 12)} opacity={0.45} />
          {/* placket + neckline */}
          <Path d={`M 28 36 L 32 44 L 36 36`} fill={s.inner} />
          <Rect x={31} y={38} width={2} height={44} fill={shade(t, 16)} />
          {/* side slits */}
          <Line x1={20} y1={78} x2={20} y2={89} stroke={shade(t, 20)} strokeWidth={1} />
          <Line x1={44} y1={78} x2={44} y2={89} stroke={shade(t, 20)} strokeWidth={1} />
        </G>
      );
    case 'hoodie':
      return (
        <G>
          {/* hood */}
          <Path d="M 24 33 Q 32 28 40 33 L 38 40 Q 32 36 26 40 Z" fill={shade(t, 14)} />
          <Rect x={18} y={37} width={28} height={42} rx={7} fill={t} />
          {/* pocket */}
          <Rect x={24} y={58} width={16} height={12} rx={4} fill={shade(t, 12)} />
          {/* drawstrings */}
          <Line x1={29} y1={38} x2={29} y2={48} stroke="#F4ECD8" strokeWidth={1.2} />
          <Line x1={35} y1={38} x2={35} y2={48} stroke="#F4ECD8" strokeWidth={1.2} />
        </G>
      );
    case 'tshirt':
      return (
        <G>
          <Rect x={19} y={37} width={26} height={40} rx={8} fill={t} />
          <Path d="M 27 37 Q 32 42 37 37" stroke={shade(t, 16)} strokeWidth={1.4} fill="none" />
          <Rect x={19} y={37} width={8} height={40} rx={7} fill={tint(t, 14)} opacity={0.4} />
        </G>
      );
    case 'blazer':
    case 'shirt':
    default: {
      const isBlazer = s.topKind === 'blazer';
      return (
        <G>
          {/* inner shirt */}
          <Polygon points="26,36 38,36 35,60 29,60" fill={s.inner} />
          {/* body */}
          <Rect x={18.5} y={35} width={27} height={44} rx={6} fill={t} />
          {/* open V to show inner */}
          <Polygon points="26,35 32,52 38,35" fill={s.inner} />
          {isBlazer && (
            <>
              <Polygon points="26,35 32,52 28,40" fill={shade(t, 16)} />
              <Polygon points="38,35 32,52 36,40" fill={shade(t, 16)} />
            </>
          )}
          {s.tie && <Polygon points="31,40 33,40 34,58 30,58" fill={s.tie} />}
          {!s.tie && !isBlazer && (
            <>
              <Line x1={32} y1={38} x2={32} y2={74} stroke={shade(t, 16)} strokeWidth={0.8} />
              {[44, 54, 64].map((y) => <Circle key={y} cx={32} cy={y} r={0.9} fill={shade(t, 22)} />)}
            </>
          )}
          {isBlazer && (
            <>
              <Circle cx={31} cy={60} r={1} fill={shade(t, 26)} />
              <Circle cx={31} cy={66} r={1} fill={shade(t, 26)} />
            </>
          )}
          <Rect x={18.5} y={35} width={8} height={44} rx={6} fill={tint(t, 12)} opacity={0.4} />
        </G>
      );
    }
  }
}

function HeldAccessory({ s }: { s: AvatarStyle }) {
  const a = s.accent;
  switch (s.accessory) {
    case 'backpack':
      return null; // drawn in Backpack()
    case 'laptopBag':
      return (
        <G>
          <Path d="M 22 39 L 44 62" stroke={shade(a, 10)} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <Rect x={40} y={58} width={13} height={14} rx={2.5} fill={a} />
          <Rect x={40} y={58} width={13} height={4} rx={2} fill={tint(a, 14)} />
          <Rect x={45} y={56} width={3} height={3} rx={1} fill={shade(a, 16)} />
        </G>
      );
    case 'handbag':
      return (
        <G>
          <Path d="M 44 56 q 4 -3 8 0" stroke={shade(a, 12)} strokeWidth={1.4} fill="none" />
          <Rect x={44} y={56} width={11} height={9} rx={2} fill={a} />
          <Rect x={44} y={56} width={11} height={3} rx={1.5} fill={tint(a, 14)} />
        </G>
      );
    case 'shoppingBag':
      return (
        <G>
          <Path d="M 45 56 q 3.5 -4 7 0" stroke={shade(a, 14)} strokeWidth={1.4} fill="none" />
          <Polygon points="43,58 55,58 53.5,72 44.5,72" fill={a} />
          <Rect x={43} y={58} width={12} height={3} fill={tint(a, 12)} />
        </G>
      );
    case 'phone':
      return <Rect x={45} y={58} width={5} height={9} rx={1.4} fill={a} stroke={tint(a, 30)} strokeWidth={0.6} />;
    case 'tablet':
      return (
        <G>
          <Rect x={36} y={56} width={13} height={17} rx={2} fill="#2C2E33" transform="rotate(-10 42 64)" />
          <Rect x={37.4} y={58} width={10} height={13} rx={1} fill={tint(a, 30)} transform="rotate(-10 42 64)" />
        </G>
      );
    case 'book':
    case 'notebook':
    default:
      return (
        <G>
          <Rect x={35} y={56} width={14} height={18} rx={1.5} fill={a} transform="rotate(-8 42 65)" />
          <Rect x={35} y={56} width={3.5} height={18} rx={1} fill={shade(a, 22)} transform="rotate(-8 42 65)" />
          {[60, 64, 68].map((y) => <Line key={y} x1={40} y1={y} x2={47} y2={y - 1} stroke="#FFFFFF" strokeWidth={0.7} opacity={0.7} transform="rotate(-8 42 65)" />)}
        </G>
      );
  }
}

function Backpack({ s }: { s: AvatarStyle }) {
  if (s.accessory !== 'backpack') return null;
  const a = s.accent;
  return (
    <G>
      {/* pack behind torso */}
      <Rect x={17} y={40} width={30} height={34} rx={7} fill={shade(a, 6)} />
      <Rect x={20} y={50} width={24} height={14} rx={4} fill={tint(a, 10)} opacity={0.6} />
    </G>
  );
}
function BackpackStraps({ s }: { s: AvatarStyle }) {
  if (s.accessory !== 'backpack') return null;
  const a = shade(s.accent, 14);
  return (
    <G>
      <Path d="M 24 37 Q 22 52 24 66" stroke={a} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <Path d="M 40 37 Q 42 52 40 66" stroke={a} strokeWidth={2.6} fill="none" strokeLinecap="round" />
    </G>
  );
}

/* ── equippable reward overlays (Part 7 — Equip system) ──
 * Each unlocked outfit/accessory reward draws a lightweight overlay on top of
 * the base figure so "equipping" visibly changes the avatar everywhere. */
const JACKET = '#46566B';
function Equip({ s, equipped }: { s: AvatarStyle; equipped: EquipKey[] }) {
  if (!equipped.length) return null;
  const has = (k: EquipKey) => equipped.includes(k);
  const saree = s.bottomKind === 'sareeSkirt';
  return (
    <G>
      {/* Casual Jacket — open denim jacket over the torso + sleeves */}
      {has('jacket') && (
        <G>
          <Path d="M 19.5 36 L 30 39 L 30 78 L 19.5 78 Z" fill={JACKET} />
          <Path d="M 44.5 36 L 34 39 L 34 78 L 44.5 78 Z" fill={shade(JACKET, 12)} />
          <Path d="M 25.5 35 L 31 45 L 30.5 38 Z" fill={shade(JACKET, 20)} />
          <Path d="M 38.5 35 L 33 45 L 33.5 38 Z" fill={shade(JACKET, 20)} />
          <Rect x={13.2} y={37} width={6.6} height={22} rx={3} fill={JACKET} />
          <Rect x={44.2} y={37} width={6.6} height={22} rx={3} fill={shade(JACKET, 12)} />
          {[50, 58, 66].map((y) => <Circle key={y} cx={32} cy={y} r={0.8} fill={tint(JACKET, 30)} />)}
        </G>
      )}
      {/* Backpack straps over the shoulders */}
      {has('backpack') && (
        <G>
          <Path d="M 24 37 Q 22 52 24 66" stroke="#C2410C" strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <Path d="M 40 37 Q 42 52 40 66" stroke="#C2410C" strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <Rect x={28} y={49} width={8} height={2.6} rx={1.2} fill="#9A330A" />
        </G>
      )}
      {/* New Shoes — bright sneakers (skip for saree) */}
      {has('shoes') && !saree && (
        <G>
          <Rect x={22.6} y={111} width={10.2} height={6} rx={3} fill="#FFFFFF" stroke="#E1473D" strokeWidth={1} />
          <Rect x={31} y={111} width={10.2} height={6} rx={3} fill="#F1F1F1" stroke="#C53B32" strokeWidth={1} />
          <Rect x={22.6} y={115} width={10.2} height={2} rx={1} fill="#E1473D" />
          <Rect x={31} y={115} width={10.2} height={2} rx={1} fill="#C53B32" />
        </G>
      )}
      {/* Sunglasses over the eyes */}
      {has('sunglasses') && (
        <G>
          <Rect x={23.4} y={18.4} width={7.4} height={4.4} rx={2.2} fill="#23262B" />
          <Rect x={33.2} y={18.4} width={7.4} height={4.4} rx={2.2} fill="#23262B" />
          <Rect x={30.6} y={19.2} width={2.8} height={1.4} rx={0.7} fill="#23262B" />
          <Line x1={23.4} y1={19.2} x2={20.4} y2={18.8} stroke="#23262B" strokeWidth={1.2} strokeLinecap="round" />
          <Line x1={40.6} y1={19.2} x2={43.6} y2={18.8} stroke="#23262B" strokeWidth={1.2} strokeLinecap="round" />
          <Line x1={25} y1={19.4} x2={27} y2={21.4} stroke="#6FB0D6" strokeWidth={0.8} opacity={0.7} strokeLinecap="round" />
          <Line x1={34.8} y1={19.4} x2={36.8} y2={21.4} stroke="#6FB0D6" strokeWidth={0.8} opacity={0.7} strokeLinecap="round" />
        </G>
      )}
    </G>
  );
}

export function AvatarFigure({
  style, pose = 'standing', shadow = true, equipped = [], outfit,
}: { style: AvatarStyle; pose?: AvatarPose; shadow?: boolean; equipped?: EquipKey[]; outfit?: Partial<AvatarStyle> }) {
  // Layered render: base persona style + equipped outfit override (FIX 4).
  const s: AvatarStyle = outfit ? { ...style, ...outfit } : style;
  return (
    <G>
      {shadow && <Ellipse cx={CX} cy={117} rx={16} ry={3.6} fill="#000" opacity={0.12} />}
      <Backpack s={s} />
      <Legs s={s} />
      <Torso s={s} />
      <Arms s={s} pose={pose} />
      <BackpackStraps s={s} />
      <Head s={s} />
      <HeldAccessory s={s} />
      <Equip s={s} equipped={equipped} />
    </G>
  );
}
