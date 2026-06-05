/**
 * rewardCategories.ts — the redesigned "My World" reward system.
 *
 * Four reward categories, each with its own item set:
 *   👕 Wardrobe   — clothing, filtered by the avatar's profile (gender/age/profession)
 *   🏠 Home       — interior items (shown to everyone)
 *   🚗 Vehicles   — vehicles (shown to everyone)
 *   🕶️ Lifestyle  — accessories & gadgets (shown to everyone)
 *
 * This file owns the shared types, the category definitions and the registry
 * helpers (lookup, per-category counts, wardrobe profile filtering). The actual
 * item arrays live in the four data files and are aggregated here.
 *
 * NOTE: unlock state is derived from the learner's completed-level count
 * (`isItemUnlocked`) — rewards are not yet wired to the level-completion
 * pipeline (that is a later step). `icon` is an emoji placeholder; swap to real
 * illustration assets later via `imageKey` without changing this shape.
 */
import { AgeGroup, Gender, UserType } from './avatarProfiles';
import { EquipKey } from './rewards';
import { ageToGroup } from '../utils/avatarResolver';
import { SUBTOPICS } from './subtopics';
import { RewardRarity, rarityForReward } from './rewardRarity';
import { WARDROBE_REWARDS } from './wardrobeRewards';
import { HOME_REWARDS } from './homeRewards';
import { VEHICLE_REWARDS } from './vehicleRewards';
import { LIFESTYLE_REWARDS } from './lifestyleRewards';
import { GARDEN_REWARDS } from './gardenRewards';

/** The learning topic a level belongs to (Everyday Life, My Family, …). */
export function topicForLevel(level: number): string {
  return SUBTOPICS[level - 1]?.topic ?? '';
}

export type RewardCategoryKey = 'wardrobe' | 'home' | 'vehicles' | 'lifestyle' | 'garden';

/** Which avatar profiles an item suits (used to filter the Wardrobe). */
export interface SuitableFor {
  gender?: Gender[];
  ageGroup?: AgeGroup[];
  profession?: UserType[];
}

export interface RewardItem {
  id: string;
  category: RewardCategoryKey;
  name: string;
  icon: string;
  imageKey: string;
  unlockLevel: number;
  suitableFor?: SuitableFor;
  isEquippable: boolean;
  /** If set, equipping this item drives an avatar overlay (see AvatarFigure). */
  equipKey?: EquipKey;
  /** Learning topic the reward is earned from (derived from unlockLevel). */
  topic?: string;
  /** Rarity tier (derived; drives the card glow + badge). */
  rarity?: RewardRarity;
}

export interface RewardCategoryDef {
  key: RewardCategoryKey;
  name: string;
  icon: string;
}

export const REWARD_CATEGORIES: RewardCategoryDef[] = [
  { key: 'wardrobe', name: 'Wardrobe', icon: '👕' },
  { key: 'home', name: 'Home', icon: '🏠' },
  { key: 'vehicles', name: 'Vehicles', icon: '🚗' },
  { key: 'lifestyle', name: 'Lifestyle', icon: '🕶️' },
  { key: 'garden', name: 'Garden', icon: '🌳' },
];

/** Tag a reward with its learning topic + rarity. */
function withTopic(i: RewardItem): RewardItem {
  return {
    ...i,
    topic: i.topic ?? topicForLevel(i.unlockLevel),
    rarity: i.rarity ?? rarityForReward(i),
  };
}

const WARDROBE = WARDROBE_REWARDS.map(withTopic);
const HOME = HOME_REWARDS.map(withTopic);
const VEHICLES = VEHICLE_REWARDS.map(withTopic);
const LIFESTYLE = LIFESTYLE_REWARDS.map(withTopic);
const GARDEN = GARDEN_REWARDS.map(withTopic);

/** All items across every category (registry) — each tagged with its topic. */
export const ALL_REWARD_ITEMS: RewardItem[] = [
  ...WARDROBE,
  ...HOME,
  ...VEHICLES,
  ...LIFESTYLE,
  ...GARDEN,
];

export function rewardItemById(id: string): RewardItem | undefined {
  return ALL_REWARD_ITEMS.find((i) => i.id === id);
}

/**
 * The headline reward for completing a given level — the Lifestyle accessory
 * that unlocks at that level (a cool, instantly-wearable item). Used by the
 * level-completion popup. Falls back to any reward unlocking at that level.
 */
export function featuredRewardForLevel(levelId: number): RewardItem | undefined {
  return (
    LIFESTYLE.find((i) => i.unlockLevel === levelId) ??
    ALL_REWARD_ITEMS.find((i) => i.unlockLevel === levelId)
  );
}

export function itemsForCategory(cat: RewardCategoryKey): RewardItem[] {
  switch (cat) {
    case 'wardrobe': return WARDROBE;
    case 'home': return HOME;
    case 'vehicles': return VEHICLES;
    case 'lifestyle': return LIFESTYLE;
    case 'garden': return GARDEN;
  }
}

/** An item is unlocked once the learner has completed `unlockLevel` levels. */
export function isItemUnlocked(item: RewardItem, completedCount: number): boolean {
  return completedCount >= item.unlockLevel;
}

/** Avatar profile shape used for wardrobe filtering. */
export interface AvatarProfileLite {
  gender: Gender;
  age: number;
  userType: UserType;
}

function matchesProfile(item: RewardItem, gender: Gender, ageGroup: AgeGroup, profession: UserType): boolean {
  const s = item.suitableFor;
  if (!s) return true;
  if (s.gender && !s.gender.includes(gender)) return false;
  if (s.ageGroup && !s.ageGroup.includes(ageGroup)) return false;
  if (s.profession && !s.profession.includes(profession)) return false;
  return true;
}

/**
 * Items to show for a category. Wardrobe is filtered to suit the avatar's
 * profile; the other categories show everything.
 */
export function visibleItems(cat: RewardCategoryKey, profile: AvatarProfileLite): RewardItem[] {
  const items = itemsForCategory(cat);
  if (cat !== 'wardrobe') return items;
  const group = ageToGroup(profile.age);
  return items.filter((i) => matchesProfile(i, profile.gender, group, profile.userType));
}

export interface CategoryCount { unlocked: number; total: number; }

export function categoryCount(cat: RewardCategoryKey, completedCount: number, profile: AvatarProfileLite): CategoryCount {
  const items = visibleItems(cat, profile);
  return {
    total: items.length,
    unlocked: items.filter((i) => isItemUnlocked(i, completedCount)).length,
  };
}

/** Totals across all four categories (wardrobe counted after profile filtering). */
export function overallCount(completedCount: number, profile: AvatarProfileLite): CategoryCount {
  return REWARD_CATEGORIES.reduce<CategoryCount>(
    (acc, c) => {
      const cc = categoryCount(c.key, completedCount, profile);
      return { unlocked: acc.unlocked + cc.unlocked, total: acc.total + cc.total };
    },
    { unlocked: 0, total: 0 }
  );
}
