/**
 * lifestyleRewards — 20 lifestyle / accessory items for the Lifestyle category.
 * Order matters: Sunglasses is the FIRST reward (Level 1) so the learner sees
 * their avatar instantly wearing something cool. The first 8 follow the
 * designed sequence (Sunglasses → Backpack → Watch → Shoes → …).
 *
 * Items with an `equipKey` drive a real avatar overlay (Sunglasses, Backpack,
 * Shoes). Other equippable accessories toggle on the avatar's collection but
 * have no overlay yet.
 */
import type { RewardItem } from './rewardCategories';

export const LIFESTYLE_REWARDS: RewardItem[] = [
  // First 5 are premium AI assets (spec sequence): Sunglasses, Shoes, Cap, Backpack, Laptop Bag.
  { id: 'lifestyle_01', category: 'lifestyle', name: 'Sunglasses', icon: '🕶️', imageKey: 'sunglasses', unlockLevel: 1, isEquippable: true, equipKey: 'sunglasses' },
  { id: 'lifestyle_04', category: 'lifestyle', name: 'Sneakers', icon: '👟', imageKey: 'sneakers', unlockLevel: 2, isEquippable: true, equipKey: 'shoes' },
  { id: 'lifestyle_11', category: 'lifestyle', name: 'Cap', icon: '🧢', imageKey: 'cap', unlockLevel: 3, isEquippable: true },
  { id: 'lifestyle_02', category: 'lifestyle', name: 'Backpack', icon: '🎒', imageKey: 'backpack', unlockLevel: 4, isEquippable: true, equipKey: 'backpack' },
  { id: 'lifestyle_07', category: 'lifestyle', name: 'Laptop Bag', icon: '💼', imageKey: 'laptop_bag', unlockLevel: 5, isEquippable: true },
  { id: 'lifestyle_03', category: 'lifestyle', name: 'Watch', icon: '⌚', imageKey: 'watch', unlockLevel: 6, isEquippable: true },
  { id: 'lifestyle_05', category: 'lifestyle', name: 'Earbuds', icon: '🎵', imageKey: 'earbuds', unlockLevel: 7, isEquippable: true },
  { id: 'lifestyle_06', category: 'lifestyle', name: 'Smartphone', icon: '📱', imageKey: 'smartphone', unlockLevel: 8, isEquippable: false },
  { id: 'lifestyle_08', category: 'lifestyle', name: 'Water Bottle', icon: '🍶', imageKey: 'water_bottle', unlockLevel: 9, isEquippable: false },
  { id: 'lifestyle_09', category: 'lifestyle', name: 'Handbag', icon: '👜', imageKey: 'handbag', unlockLevel: 10, isEquippable: true },
  { id: 'lifestyle_10', category: 'lifestyle', name: 'Coffee Mug', icon: '☕', imageKey: 'coffee_mug', unlockLevel: 11, isEquippable: false },
  { id: 'lifestyle_12', category: 'lifestyle', name: 'Headphones', icon: '🎧', imageKey: 'headphones', unlockLevel: 12, isEquippable: true },
  { id: 'lifestyle_13', category: 'lifestyle', name: 'Wallet', icon: '👛', imageKey: 'wallet', unlockLevel: 13, isEquippable: false },
  { id: 'lifestyle_14', category: 'lifestyle', name: 'Makeup Kit', icon: '💄', imageKey: 'makeup_kit', unlockLevel: 14, isEquippable: false },
  { id: 'lifestyle_15', category: 'lifestyle', name: 'Notebook', icon: '📓', imageKey: 'notebook', unlockLevel: 15, isEquippable: false },
  { id: 'lifestyle_16', category: 'lifestyle', name: 'Travel Bag', icon: '🧳', imageKey: 'travel_bag', unlockLevel: 16, isEquippable: true },
  { id: 'lifestyle_17', category: 'lifestyle', name: 'Smartwatch', icon: '⏱️', imageKey: 'smartwatch', unlockLevel: 17, isEquippable: true },
  { id: 'lifestyle_18', category: 'lifestyle', name: 'Perfume', icon: '🧴', imageKey: 'perfume', unlockLevel: 18, isEquippable: false },
  { id: 'lifestyle_19', category: 'lifestyle', name: 'Trophy Badge', icon: '🏆', imageKey: 'trophy_badge', unlockLevel: 19, isEquippable: false },
  { id: 'lifestyle_20', category: 'lifestyle', name: 'Premium Gift', icon: '🎁', imageKey: 'premium_gift', unlockLevel: 20, isEquippable: false },
];
