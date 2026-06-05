/**
 * homeRewards — 15 home/interior items for the Home category.
 * Shown to all learners (no profile filtering). Not equippable — these furnish
 * the learner's room rather than dress the avatar.
 */
import type { RewardItem } from './rewardCategories';

export const HOME_REWARDS: RewardItem[] = [
  { id: 'home_01', category: 'home', name: 'Chair', icon: '🪑', imageKey: 'chair', unlockLevel: 1, isEquippable: false },
  { id: 'home_02', category: 'home', name: 'Lamp', icon: '💡', imageKey: 'lamp', unlockLevel: 2, isEquippable: false },
  { id: 'home_03', category: 'home', name: 'Study Table', icon: '🖥️', imageKey: 'study_table', unlockLevel: 3, isEquippable: false },
  { id: 'home_04', category: 'home', name: 'Bookshelf', icon: '📚', imageKey: 'bookshelf', unlockLevel: 4, isEquippable: false },
  { id: 'home_05', category: 'home', name: 'Rug', icon: '🟫', imageKey: 'rug', unlockLevel: 5, isEquippable: false },
  { id: 'home_06', category: 'home', name: 'Bed', icon: '🛏️', imageKey: 'bed', unlockLevel: 6, isEquippable: false },
  { id: 'home_07', category: 'home', name: 'Sofa', icon: '🛋️', imageKey: 'sofa', unlockLevel: 7, isEquippable: false },
  { id: 'home_08', category: 'home', name: 'Dining Table', icon: '🍽️', imageKey: 'dining_table', unlockLevel: 8, isEquippable: false },
  { id: 'home_09', category: 'home', name: 'Cooler', icon: '❄️', imageKey: 'cooler', unlockLevel: 9, isEquippable: false },
  { id: 'home_10', category: 'home', name: 'TV', icon: '📺', imageKey: 'tv', unlockLevel: 10, isEquippable: false },
  { id: 'home_11', category: 'home', name: 'AC', icon: '🌬️', imageKey: 'ac', unlockLevel: 11, isEquippable: false },
  { id: 'home_12', category: 'home', name: 'Wardrobe', icon: '🗄️', imageKey: 'wardrobe_unit', unlockLevel: 12, isEquippable: false },
  { id: 'home_13', category: 'home', name: 'Kitchen Set', icon: '🍳', imageKey: 'kitchen_set', unlockLevel: 13, isEquippable: false },
  { id: 'home_14', category: 'home', name: 'Balcony Plants', icon: '🪴', imageKey: 'balcony_plants', unlockLevel: 14, isEquippable: false },
  { id: 'home_15', category: 'home', name: 'Premium Room', icon: '🛌', imageKey: 'premium_room', unlockLevel: 15, isEquippable: false },
];
