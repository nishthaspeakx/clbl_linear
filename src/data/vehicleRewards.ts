/**
 * vehicleRewards — 12 vehicles for the Vehicles category, a satisfying ladder
 * from a cycle up to luxury cars (Audi · BMW · Mercedes) and a dream sports car.
 * Each imageKey maps to a DISTINCT isometric vehicle (see placedObjects), so the
 * cards and the Dream Home driveway show recognisable, individual rides.
 * Shown to all learners (no profile filtering). Not equippable — they park
 * outside the learner's home.
 */
import type { RewardItem } from './rewardCategories';

export const VEHICLE_REWARDS: RewardItem[] = [
  { id: 'vehicle_01', category: 'vehicles', name: 'Cycle', icon: '🚲', imageKey: 'cycle', unlockLevel: 1, isEquippable: false },
  { id: 'vehicle_02', category: 'vehicles', name: 'Scooter', icon: '🛵', imageKey: 'scooter', unlockLevel: 2, isEquippable: false },
  { id: 'vehicle_03', category: 'vehicles', name: 'Bike', icon: '🏍️', imageKey: 'motorbike', unlockLevel: 3, isEquippable: false },
  { id: 'vehicle_04', category: 'vehicles', name: 'Auto', icon: '🛺', imageKey: 'auto', unlockLevel: 4, isEquippable: false },
  { id: 'vehicle_05', category: 'vehicles', name: 'Small Car', icon: '🚗', imageKey: 'small_car', unlockLevel: 5, isEquippable: false },
  { id: 'vehicle_06', category: 'vehicles', name: 'Hatchback', icon: '🚙', imageKey: 'hatchback', unlockLevel: 6, isEquippable: false },
  { id: 'vehicle_07', category: 'vehicles', name: 'Sedan', icon: '🚘', imageKey: 'sedan', unlockLevel: 7, isEquippable: false },
  { id: 'vehicle_08', category: 'vehicles', name: 'SUV', icon: '🚙', imageKey: 'suv', unlockLevel: 8, isEquippable: false },
  { id: 'vehicle_09', category: 'vehicles', name: 'Audi', icon: '🚗', imageKey: 'audi', unlockLevel: 9, isEquippable: false },
  { id: 'vehicle_10', category: 'vehicles', name: 'BMW', icon: '🚘', imageKey: 'bmw', unlockLevel: 10, isEquippable: false },
  { id: 'vehicle_11', category: 'vehicles', name: 'Mercedes', icon: '🏎️', imageKey: 'mercedes', unlockLevel: 11, isEquippable: false },
  { id: 'vehicle_12', category: 'vehicles', name: 'Dream Sports Car', icon: '🏎️', imageKey: 'sports_car', unlockLevel: 12, isEquippable: false },
];
