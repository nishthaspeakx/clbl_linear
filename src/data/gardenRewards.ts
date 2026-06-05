/**
 * gardenRewards — 15 outdoor / garden items for the Garden category.
 * Shown to all learners (no profile filtering). Not equippable — these bring
 * the learner's outdoor world to life (pets, plants, play areas) and appear in
 * the garden/world area as they unlock.
 */
import type { RewardItem } from './rewardCategories';

export const GARDEN_REWARDS: RewardItem[] = [
  { id: 'garden_01', category: 'garden', name: 'Pet Dog', icon: '🐶', imageKey: 'pet_dog', unlockLevel: 1, isEquippable: false },
  { id: 'garden_02', category: 'garden', name: 'Pet Cat', icon: '🐱', imageKey: 'pet_cat', unlockLevel: 2, isEquippable: false },
  { id: 'garden_03', category: 'garden', name: 'Garden Bench', icon: '🪑', imageKey: 'garden_bench', unlockLevel: 3, isEquippable: false },
  { id: 'garden_04', category: 'garden', name: 'Flower Pots', icon: '🪴', imageKey: 'flower_pots', unlockLevel: 4, isEquippable: false },
  { id: 'garden_05', category: 'garden', name: 'Rose Garden', icon: '🌹', imageKey: 'rose_garden', unlockLevel: 5, isEquippable: false },
  { id: 'garden_06', category: 'garden', name: 'Fountain', icon: '⛲', imageKey: 'fountain', unlockLevel: 6, isEquippable: false },
  { id: 'garden_07', category: 'garden', name: 'Swing', icon: '🎠', imageKey: 'swing', unlockLevel: 7, isEquippable: false },
  { id: 'garden_08', category: 'garden', name: 'Slide', icon: '🛝', imageKey: 'slide', unlockLevel: 8, isEquippable: false },
  { id: 'garden_09', category: 'garden', name: 'Outdoor Lamp', icon: '🏮', imageKey: 'outdoor_lamp', unlockLevel: 9, isEquippable: false },
  { id: 'garden_10', category: 'garden', name: 'Bird House', icon: '🐦', imageKey: 'bird_house', unlockLevel: 10, isEquippable: false },
  { id: 'garden_11', category: 'garden', name: 'Tree House', icon: '🛖', imageKey: 'tree_house', unlockLevel: 11, isEquippable: false },
  { id: 'garden_12', category: 'garden', name: 'Fish Pond', icon: '🐟', imageKey: 'fish_pond', unlockLevel: 12, isEquippable: false },
  { id: 'garden_13', category: 'garden', name: 'Garden Table', icon: '⛱️', imageKey: 'garden_table', unlockLevel: 13, isEquippable: false },
  { id: 'garden_14', category: 'garden', name: 'Butterfly Corner', icon: '🦋', imageKey: 'butterfly_corner', unlockLevel: 14, isEquippable: false },
  { id: 'garden_15', category: 'garden', name: 'Premium Garden', icon: '🏞️', imageKey: 'premium_garden', unlockLevel: 15, isEquippable: false },
];
