/**
 * wardrobeRewards — gender- and age-specific clothing for the Wardrobe category.
 *
 * STRICT separation (FIX 5/6): every item is male-only or female-only via
 * `suitableFor.gender`, and age-targeted via `suitableFor.ageGroup`. The Wardrobe
 * grid filters to the avatar's profile, so a male avatar never sees female
 * clothes and vice-versa, and outfits match the age band.
 *
 * Equipping an item changes the avatar's appearance: items map to an outfit
 * override (see data/avatarOutfits) and/or an `equipKey` overlay (jacket/shoes).
 */
import type { AgeGroup } from './avatarProfiles';
import type { RewardItem } from './rewardCategories';

const YOUNG: AgeGroup[] = ['18_25', '25_40'];
const MATURE: AgeGroup[] = ['25_40', '40_plus'];
const ALL: AgeGroup[] = ['18_25', '25_40', '40_plus'];

export const WARDROBE_REWARDS: RewardItem[] = [
  // ── Male (10) — first 5 are premium AI assets in the spec sequence ────────
  { id: 'wardrobe_m01', category: 'wardrobe', name: 'T-Shirt', icon: '👕', imageKey: 'casual_tshirt', unlockLevel: 1, isEquippable: true,
    suitableFor: { gender: ['male'], ageGroup: ALL } },
  { id: 'wardrobe_m02', category: 'wardrobe', name: 'Shirt', icon: '👔', imageKey: 'shirt', unlockLevel: 2, isEquippable: true,
    suitableFor: { gender: ['male'], ageGroup: ALL } },
  { id: 'wardrobe_m03', category: 'wardrobe', name: 'Jeans', icon: '👖', imageKey: 'jeans', unlockLevel: 3, isEquippable: true,
    suitableFor: { gender: ['male'], ageGroup: ALL } },
  { id: 'wardrobe_m04', category: 'wardrobe', name: 'Kurta', icon: '🥻', imageKey: 'kurta', unlockLevel: 4, isEquippable: true,
    suitableFor: { gender: ['male'], ageGroup: ALL } },
  { id: 'wardrobe_m05', category: 'wardrobe', name: 'Formal Shirt', icon: '👔', imageKey: 'formal_shirt', unlockLevel: 5, isEquippable: true,
    suitableFor: { gender: ['male'], ageGroup: ALL } },
  { id: 'wardrobe_m06', category: 'wardrobe', name: 'Hoodie', icon: '🧥', imageKey: 'hoodie', unlockLevel: 6, isEquippable: true,
    suitableFor: { gender: ['male'], ageGroup: YOUNG } },
  { id: 'wardrobe_m07', category: 'wardrobe', name: 'Casual Jacket', icon: '🧥', imageKey: 'casual_jacket', unlockLevel: 7, isEquippable: true, equipKey: 'jacket',
    suitableFor: { gender: ['male'], ageGroup: YOUNG } },
  { id: 'wardrobe_m08', category: 'wardrobe', name: 'Blazer', icon: '🧥', imageKey: 'blazer', unlockLevel: 8, isEquippable: true,
    suitableFor: { gender: ['male'], ageGroup: MATURE } },
  { id: 'wardrobe_m09', category: 'wardrobe', name: 'Business Suit', icon: '🤵', imageKey: 'business_suit', unlockLevel: 9, isEquippable: true,
    suitableFor: { gender: ['male'], ageGroup: MATURE } },
  { id: 'wardrobe_m10', category: 'wardrobe', name: 'Sherwani', icon: '🤵', imageKey: 'sherwani', unlockLevel: 10, isEquippable: true,
    suitableFor: { gender: ['male'], ageGroup: MATURE } },

  // ── Female (10) ──────────────────────────────────────────────────────────
  { id: 'wardrobe_f01', category: 'wardrobe', name: 'Kurti', icon: '🥻', imageKey: 'kurti', unlockLevel: 1, isEquippable: true,
    suitableFor: { gender: ['female'], ageGroup: ALL } },
  { id: 'wardrobe_f02', category: 'wardrobe', name: 'Dress', icon: '👗', imageKey: 'dress', unlockLevel: 2, isEquippable: true,
    suitableFor: { gender: ['female'], ageGroup: YOUNG } },
  { id: 'wardrobe_f03', category: 'wardrobe', name: 'Cardigan', icon: '🧥', imageKey: 'cardigan', unlockLevel: 3, isEquippable: true,
    suitableFor: { gender: ['female'], ageGroup: ALL } },
  { id: 'wardrobe_f04', category: 'wardrobe', name: 'Handbag Outfit', icon: '👜', imageKey: 'handbag_outfit', unlockLevel: 4, isEquippable: true,
    suitableFor: { gender: ['female'], ageGroup: YOUNG } },
  { id: 'wardrobe_f05', category: 'wardrobe', name: 'Formal Blouse', icon: '👚', imageKey: 'formal_blouse', unlockLevel: 5, isEquippable: true,
    suitableFor: { gender: ['female'], ageGroup: MATURE } },
  { id: 'wardrobe_f06', category: 'wardrobe', name: 'Office Suit', icon: '👩‍💼', imageKey: 'office_suit', unlockLevel: 6, isEquippable: true,
    suitableFor: { gender: ['female'], ageGroup: MATURE } },
  { id: 'wardrobe_f07', category: 'wardrobe', name: 'Saree', icon: '🥻', imageKey: 'saree', unlockLevel: 7, isEquippable: true,
    suitableFor: { gender: ['female'], ageGroup: MATURE } },
  { id: 'wardrobe_f08', category: 'wardrobe', name: 'Traditional Outfit', icon: '👘', imageKey: 'traditional_outfit', unlockLevel: 8, isEquippable: true,
    suitableFor: { gender: ['female'], ageGroup: ['40_plus'] } },
  { id: 'wardrobe_f09', category: 'wardrobe', name: 'Lehenga', icon: '👗', imageKey: 'lehenga', unlockLevel: 9, isEquippable: true,
    suitableFor: { gender: ['female'], ageGroup: YOUNG } },
  { id: 'wardrobe_f10', category: 'wardrobe', name: 'Designer Outfit', icon: '🌟', imageKey: 'designer_outfit', unlockLevel: 10, isEquippable: true,
    suitableFor: { gender: ['female'], ageGroup: ALL } },
];
