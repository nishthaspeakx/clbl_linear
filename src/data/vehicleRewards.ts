/**
 * vehicleRewards — 12 vehicles for the Vehicles category.
 * Shown to all learners (no profile filtering). Not equippable — these park
 * outside the learner's home.
 */
import type { RewardItem } from './rewardCategories';

export const VEHICLE_REWARDS: RewardItem[] = [
  { id: 'vehicle_01', category: 'vehicles', name: 'Bicycle', icon: '🚲', imageKey: 'bicycle', unlockLevel: 1, isEquippable: false },
  { id: 'vehicle_02', category: 'vehicles', name: 'Scooter', icon: '🛵', imageKey: 'scooter', unlockLevel: 2, isEquippable: false },
  { id: 'vehicle_03', category: 'vehicles', name: 'Bike', icon: '🏍️', imageKey: 'bike', unlockLevel: 3, isEquippable: false },
  { id: 'vehicle_04', category: 'vehicles', name: 'Auto Ride', icon: '🛺', imageKey: 'auto_ride', unlockLevel: 4, isEquippable: false },
  { id: 'vehicle_05', category: 'vehicles', name: 'Small Car', icon: '🚗', imageKey: 'small_car', unlockLevel: 5, isEquippable: false },
  { id: 'vehicle_06', category: 'vehicles', name: 'Hatchback', icon: '🚙', imageKey: 'hatchback', unlockLevel: 6, isEquippable: false },
  { id: 'vehicle_07', category: 'vehicles', name: 'Sedan', icon: '🚘', imageKey: 'sedan', unlockLevel: 7, isEquippable: false },
  { id: 'vehicle_08', category: 'vehicles', name: 'SUV', icon: '🚐', imageKey: 'suv', unlockLevel: 8, isEquippable: false },
  { id: 'vehicle_09', category: 'vehicles', name: 'Electric Scooter', icon: '🛴', imageKey: 'electric_scooter', unlockLevel: 9, isEquippable: false },
  { id: 'vehicle_10', category: 'vehicles', name: 'Premium Bike', icon: '🏍️', imageKey: 'premium_bike', unlockLevel: 10, isEquippable: false },
  { id: 'vehicle_11', category: 'vehicles', name: 'Premium Car', icon: '🚗', imageKey: 'premium_car', unlockLevel: 11, isEquippable: false },
  { id: 'vehicle_12', category: 'vehicles', name: 'Dream Car', icon: '🏎️', imageKey: 'dream_car', unlockLevel: 12, isEquippable: false },
];
