/**
 * rewards.ts — the lifestyle reward ladder for the gamified journey.
 *
 * Every completed level unlocks exactly one reward (levelRequired === level id).
 * Rewards live in the learner's "My World" room and progressively upgrade their
 * avatar (outfit/accessory), home (furniture/appliances) and parking (vehicles).
 *
 * `isUnlocked` is NOT stored here — it is derived at runtime from how many
 * levels the learner has completed (see `isRewardUnlocked`). This keeps the
 * single source of truth in progress storage and avoids state drift.
 *
 * ── FUTURE ASSET INTEGRATION ──────────────────────────────────────────────
 * `icon` is an emoji placeholder. Swap to real image assets later by adding an
 * optional `image: require('...')` field and rendering it in RewardCard /
 * MyWorldScreen without touching this data shape.
 * ──────────────────────────────────────────────────────────────────────────
 */

export type RewardCategory =
  | 'outfit'
  | 'accessory'
  | 'vehicle'
  | 'home'
  | 'furniture'
  | 'lifestyle';

/** Where the reward is shown inside the My World room. */
export type PlacementArea = 'wardrobe' | 'parking' | 'home' | 'shelf';

/** Which My World tab a reward belongs to. */
export type RewardTab = 'wardrobe' | 'home' | 'vehicles';

export interface Reward {
  id: number;
  levelRequired: number;
  name: string;
  category: RewardCategory;
  icon: string;
  description: string;
  placementArea: PlacementArea;
  /**
   * Present only for equippable rewards (outfit / accessory). Maps to an avatar
   * overlay key drawn by AvatarFigure (see EQUIP_KEYS).
   */
  equipKey?: EquipKey;
}

/** Overlay keys the avatar can wear (Part 7 — Equip system). */
export type EquipKey = 'shoes' | 'backpack' | 'sunglasses' | 'jacket';

export const REWARDS: Reward[] = [
  { id: 1, levelRequired: 1, name: 'New Shoes', category: 'outfit', icon: '👟', description: 'Fresh kicks for your avatar.', placementArea: 'wardrobe', equipKey: 'shoes' },
  { id: 2, levelRequired: 2, name: 'Backpack', category: 'accessory', icon: '🎒', description: 'Carry your learning in style.', placementArea: 'wardrobe', equipKey: 'backpack' },
  { id: 3, levelRequired: 3, name: 'Sunglasses', category: 'accessory', icon: '🕶️', description: 'Look cool on the journey.', placementArea: 'wardrobe', equipKey: 'sunglasses' },
  { id: 4, levelRequired: 4, name: 'Casual Jacket', category: 'outfit', icon: '🧥', description: 'A smart-casual upgrade.', placementArea: 'wardrobe', equipKey: 'jacket' },
  { id: 5, levelRequired: 5, name: 'Phone', category: 'lifestyle', icon: '📱', description: 'Stay connected.', placementArea: 'shelf' },
  { id: 6, levelRequired: 6, name: 'Bicycle', category: 'vehicle', icon: '🚲', description: 'Your first set of wheels.', placementArea: 'parking' },
  { id: 7, levelRequired: 7, name: 'Scooter', category: 'vehicle', icon: '🛵', description: 'Zip around town.', placementArea: 'parking' },
  { id: 8, levelRequired: 8, name: 'Study Table', category: 'furniture', icon: '🖥️', description: 'A place to focus.', placementArea: 'home' },
  { id: 9, levelRequired: 9, name: 'Bookshelf', category: 'furniture', icon: '📚', description: 'Room for every story.', placementArea: 'home' },
  { id: 10, levelRequired: 10, name: 'Wardrobe', category: 'furniture', icon: '🗄️', description: 'Store your growing collection.', placementArea: 'home' },
  { id: 11, levelRequired: 11, name: 'Cooler', category: 'home', icon: '❄️', description: 'Beat the heat.', placementArea: 'home' },
  { id: 12, levelRequired: 12, name: 'AC', category: 'home', icon: '🌬️', description: 'Cool comfort all year.', placementArea: 'home' },
  { id: 13, levelRequired: 13, name: 'Sofa', category: 'furniture', icon: '🛋️', description: 'Relax after learning.', placementArea: 'home' },
  { id: 14, levelRequired: 14, name: 'TV', category: 'home', icon: '📺', description: 'Entertainment unlocked.', placementArea: 'home' },
  { id: 15, levelRequired: 15, name: 'Kitchen Upgrade', category: 'home', icon: '🍳', description: 'Cook up something great.', placementArea: 'home' },
  { id: 16, levelRequired: 16, name: 'Dining Table', category: 'furniture', icon: '🍽️', description: 'Gather and share.', placementArea: 'home' },
  { id: 17, levelRequired: 17, name: 'Bike', category: 'vehicle', icon: '🏍️', description: 'Pick up the pace.', placementArea: 'parking' },
  { id: 18, levelRequired: 18, name: 'Car', category: 'vehicle', icon: '🚗', description: 'Travel in comfort.', placementArea: 'parking' },
  { id: 19, levelRequired: 19, name: 'Small Home', category: 'home', icon: '🏠', description: 'A place to call your own.', placementArea: 'home' },
  { id: 20, levelRequired: 20, name: 'Dream Room Upgrade', category: 'lifestyle', icon: '🏡', description: 'Your fully upgraded dream world.', placementArea: 'shelf' },
];

/** Which My World tab a reward category maps to. */
export function tabForCategory(category: RewardCategory): RewardTab {
  if (category === 'outfit' || category === 'accessory') return 'wardrobe';
  if (category === 'vehicle') return 'vehicles';
  return 'home'; // home / furniture / lifestyle
}

/** A reward is unlocked once the learner has completed `levelRequired` levels. */
export function isRewardUnlocked(reward: Reward, completedCount: number): boolean {
  return completedCount >= reward.levelRequired;
}

/** The reward granted by completing a given level id (1-based), if any. */
export function rewardForLevel(levelId: number): Reward | undefined {
  return REWARDS.find((r) => r.levelRequired === levelId);
}

export function rewardById(id: number): Reward | undefined {
  return REWARDS.find((r) => r.id === id);
}

/** Equippable rewards only (outfit / accessory). */
export const EQUIPPABLE_REWARDS = REWARDS.filter((r) => !!r.equipKey);
