import 'package:flutter/material.dart';
import '../avatar/avatar_profiles.dart';

/// Reward system (ported from src/data/rewardCategories.ts + the 5 reward data
/// files). Five categories; wardrobe is filtered by avatar profile. Unlock state
/// derives from completed-level count.
enum RewardCategory { wardrobe, home, vehicles, lifestyle, garden }

enum RewardRarity { common, rare, epic, legendary }

class RewardItem {
  final String id;
  final RewardCategory category;
  final String name;
  final String icon;
  final int unlockLevel;
  final bool isEquippable;
  final List<Gender>? genders; // wardrobe profile filter
  final List<AgeGroup>? ageGroups;

  const RewardItem({
    required this.id,
    required this.category,
    required this.name,
    required this.icon,
    required this.unlockLevel,
    this.isEquippable = false,
    this.genders,
    this.ageGroups,
  });

  RewardRarity get rarity {
    final n = name.toLowerCase();
    if (n.contains('premium') || n.contains('dream') || n.contains('designer') || n.contains('trophy')) {
      return RewardRarity.legendary;
    }
    if (unlockLevel >= 15) return RewardRarity.legendary;
    if (unlockLevel >= 11) return RewardRarity.epic;
    if (unlockLevel >= 6) return RewardRarity.rare;
    return RewardRarity.common;
  }
}

class RarityStyle {
  final String label;
  final Color color;
  final Color tint;
  final bool glow;
  final bool sparkle;
  const RarityStyle(this.label, this.color, this.tint, this.glow, this.sparkle);
}

const _rarityStyles = {
  RewardRarity.common: RarityStyle('Common', Color(0xFF9AA0A6), Color(0xFFF1F2F4), false, false),
  RewardRarity.rare: RarityStyle('Rare', Color(0xFF3B82F6), Color(0xFFE8F0FE), true, false),
  RewardRarity.epic: RarityStyle('Epic', Color(0xFFA855F7), Color(0xFFF3E8FF), true, false),
  RewardRarity.legendary: RarityStyle('Legendary', Color(0xFFE0A526), Color(0xFFFFF6E0), true, true),
};

RarityStyle rarityStyle(RewardRarity r) => _rarityStyles[r]!;

const _all = AgeGroup.values;
const _young = [AgeGroup.a18_25, AgeGroup.a25_40];
const _mature = [AgeGroup.a25_40, AgeGroup.a40plus];

const List<RewardItem> kWardrobe = [
  RewardItem(id: 'wardrobe_m01', category: RewardCategory.wardrobe, name: 'T-Shirt', icon: '👕', unlockLevel: 1, isEquippable: true, genders: [Gender.male], ageGroups: _all),
  RewardItem(id: 'wardrobe_m02', category: RewardCategory.wardrobe, name: 'Shirt', icon: '👔', unlockLevel: 2, isEquippable: true, genders: [Gender.male], ageGroups: _all),
  RewardItem(id: 'wardrobe_m03', category: RewardCategory.wardrobe, name: 'Jeans', icon: '👖', unlockLevel: 3, isEquippable: true, genders: [Gender.male], ageGroups: _all),
  RewardItem(id: 'wardrobe_m04', category: RewardCategory.wardrobe, name: 'Kurta', icon: '🥻', unlockLevel: 4, isEquippable: true, genders: [Gender.male], ageGroups: _all),
  RewardItem(id: 'wardrobe_m05', category: RewardCategory.wardrobe, name: 'Formal Shirt', icon: '👔', unlockLevel: 5, isEquippable: true, genders: [Gender.male], ageGroups: _all),
  RewardItem(id: 'wardrobe_m06', category: RewardCategory.wardrobe, name: 'Hoodie', icon: '🧥', unlockLevel: 6, isEquippable: true, genders: [Gender.male], ageGroups: _young),
  RewardItem(id: 'wardrobe_m07', category: RewardCategory.wardrobe, name: 'Casual Jacket', icon: '🧥', unlockLevel: 7, isEquippable: true, genders: [Gender.male], ageGroups: _young),
  RewardItem(id: 'wardrobe_m08', category: RewardCategory.wardrobe, name: 'Blazer', icon: '🧥', unlockLevel: 8, isEquippable: true, genders: [Gender.male], ageGroups: _mature),
  RewardItem(id: 'wardrobe_m09', category: RewardCategory.wardrobe, name: 'Business Suit', icon: '🤵', unlockLevel: 9, isEquippable: true, genders: [Gender.male], ageGroups: _mature),
  RewardItem(id: 'wardrobe_m10', category: RewardCategory.wardrobe, name: 'Sherwani', icon: '🤵', unlockLevel: 10, isEquippable: true, genders: [Gender.male], ageGroups: _mature),
  RewardItem(id: 'wardrobe_f01', category: RewardCategory.wardrobe, name: 'Kurti', icon: '🥻', unlockLevel: 1, isEquippable: true, genders: [Gender.female], ageGroups: _all),
  RewardItem(id: 'wardrobe_f02', category: RewardCategory.wardrobe, name: 'Dress', icon: '👗', unlockLevel: 2, isEquippable: true, genders: [Gender.female], ageGroups: _young),
  RewardItem(id: 'wardrobe_f03', category: RewardCategory.wardrobe, name: 'Cardigan', icon: '🧥', unlockLevel: 3, isEquippable: true, genders: [Gender.female], ageGroups: _all),
  RewardItem(id: 'wardrobe_f04', category: RewardCategory.wardrobe, name: 'Handbag Outfit', icon: '👜', unlockLevel: 4, isEquippable: true, genders: [Gender.female], ageGroups: _young),
  RewardItem(id: 'wardrobe_f05', category: RewardCategory.wardrobe, name: 'Formal Blouse', icon: '👚', unlockLevel: 5, isEquippable: true, genders: [Gender.female], ageGroups: _mature),
  RewardItem(id: 'wardrobe_f06', category: RewardCategory.wardrobe, name: 'Office Suit', icon: '👩‍💼', unlockLevel: 6, isEquippable: true, genders: [Gender.female], ageGroups: _mature),
  RewardItem(id: 'wardrobe_f07', category: RewardCategory.wardrobe, name: 'Saree', icon: '🥻', unlockLevel: 7, isEquippable: true, genders: [Gender.female], ageGroups: _mature),
  RewardItem(id: 'wardrobe_f08', category: RewardCategory.wardrobe, name: 'Traditional Outfit', icon: '👘', unlockLevel: 8, isEquippable: true, genders: [Gender.female], ageGroups: [AgeGroup.a40plus]),
  RewardItem(id: 'wardrobe_f09', category: RewardCategory.wardrobe, name: 'Lehenga', icon: '👗', unlockLevel: 9, isEquippable: true, genders: [Gender.female], ageGroups: _young),
  RewardItem(id: 'wardrobe_f10', category: RewardCategory.wardrobe, name: 'Designer Outfit', icon: '🌟', unlockLevel: 10, isEquippable: true, genders: [Gender.female], ageGroups: _all),
];

const List<RewardItem> kHome = [
  RewardItem(id: 'home_06', category: RewardCategory.home, name: 'Bed', icon: '🛏️', unlockLevel: 1),
  RewardItem(id: 'home_05', category: RewardCategory.home, name: 'Rug', icon: '🟫', unlockLevel: 2),
  RewardItem(id: 'home_08', category: RewardCategory.home, name: 'Dining Table', icon: '🍽️', unlockLevel: 3),
  RewardItem(id: 'home_02', category: RewardCategory.home, name: 'Lamp', icon: '💡', unlockLevel: 4),
  RewardItem(id: 'home_03', category: RewardCategory.home, name: 'Study Table', icon: '🖥️', unlockLevel: 5),
  RewardItem(id: 'home_01', category: RewardCategory.home, name: 'Chair', icon: '🪑', unlockLevel: 6),
  RewardItem(id: 'home_04', category: RewardCategory.home, name: 'Bookshelf', icon: '📚', unlockLevel: 7),
  RewardItem(id: 'home_07', category: RewardCategory.home, name: 'Sofa', icon: '🛋️', unlockLevel: 8),
  RewardItem(id: 'home_09', category: RewardCategory.home, name: 'Cooler', icon: '❄️', unlockLevel: 9),
  RewardItem(id: 'home_10', category: RewardCategory.home, name: 'TV', icon: '📺', unlockLevel: 10),
  RewardItem(id: 'home_11', category: RewardCategory.home, name: 'AC', icon: '🌬️', unlockLevel: 11),
  RewardItem(id: 'home_12', category: RewardCategory.home, name: 'Wardrobe', icon: '🗄️', unlockLevel: 12),
  RewardItem(id: 'home_13', category: RewardCategory.home, name: 'Kitchen Set', icon: '🍳', unlockLevel: 13),
  RewardItem(id: 'home_14', category: RewardCategory.home, name: 'Balcony Plants', icon: '🪴', unlockLevel: 14),
  RewardItem(id: 'home_15', category: RewardCategory.home, name: 'Premium Room', icon: '🛌', unlockLevel: 15),
];

const List<RewardItem> kVehicles = [
  RewardItem(id: 'vehicle_01', category: RewardCategory.vehicles, name: 'Cycle', icon: '🚲', unlockLevel: 1),
  RewardItem(id: 'vehicle_03', category: RewardCategory.vehicles, name: 'Bike', icon: '🏍️', unlockLevel: 2),
  RewardItem(id: 'vehicle_10', category: RewardCategory.vehicles, name: 'BMW', icon: '🚘', unlockLevel: 3),
  RewardItem(id: 'vehicle_11', category: RewardCategory.vehicles, name: 'Mercedes', icon: '🏎️', unlockLevel: 4),
  RewardItem(id: 'vehicle_09', category: RewardCategory.vehicles, name: 'Audi', icon: '🚗', unlockLevel: 5),
  RewardItem(id: 'vehicle_02', category: RewardCategory.vehicles, name: 'Scooter', icon: '🛵', unlockLevel: 6),
  RewardItem(id: 'vehicle_04', category: RewardCategory.vehicles, name: 'Auto', icon: '🛺', unlockLevel: 7),
  RewardItem(id: 'vehicle_05', category: RewardCategory.vehicles, name: 'Small Car', icon: '🚗', unlockLevel: 8),
  RewardItem(id: 'vehicle_06', category: RewardCategory.vehicles, name: 'Hatchback', icon: '🚙', unlockLevel: 9),
  RewardItem(id: 'vehicle_07', category: RewardCategory.vehicles, name: 'Sedan', icon: '🚘', unlockLevel: 10),
  RewardItem(id: 'vehicle_08', category: RewardCategory.vehicles, name: 'SUV', icon: '🚙', unlockLevel: 11),
  RewardItem(id: 'vehicle_12', category: RewardCategory.vehicles, name: 'Dream Sports Car', icon: '🏎️', unlockLevel: 12),
];

const List<RewardItem> kLifestyle = [
  RewardItem(id: 'lifestyle_01', category: RewardCategory.lifestyle, name: 'Sunglasses', icon: '🕶️', unlockLevel: 1, isEquippable: true),
  RewardItem(id: 'lifestyle_04', category: RewardCategory.lifestyle, name: 'Sneakers', icon: '👟', unlockLevel: 2, isEquippable: true),
  RewardItem(id: 'lifestyle_11', category: RewardCategory.lifestyle, name: 'Cap', icon: '🧢', unlockLevel: 3, isEquippable: true),
  RewardItem(id: 'lifestyle_02', category: RewardCategory.lifestyle, name: 'Backpack', icon: '🎒', unlockLevel: 4, isEquippable: true),
  RewardItem(id: 'lifestyle_07', category: RewardCategory.lifestyle, name: 'Laptop Bag', icon: '💼', unlockLevel: 5, isEquippable: true),
  RewardItem(id: 'lifestyle_03', category: RewardCategory.lifestyle, name: 'Watch', icon: '⌚', unlockLevel: 6, isEquippable: true),
  RewardItem(id: 'lifestyle_05', category: RewardCategory.lifestyle, name: 'Earbuds', icon: '🎵', unlockLevel: 7, isEquippable: true),
  RewardItem(id: 'lifestyle_06', category: RewardCategory.lifestyle, name: 'Smartphone', icon: '📱', unlockLevel: 8),
  RewardItem(id: 'lifestyle_08', category: RewardCategory.lifestyle, name: 'Water Bottle', icon: '🍶', unlockLevel: 9),
  RewardItem(id: 'lifestyle_09', category: RewardCategory.lifestyle, name: 'Handbag', icon: '👜', unlockLevel: 10, isEquippable: true),
  RewardItem(id: 'lifestyle_10', category: RewardCategory.lifestyle, name: 'Coffee Mug', icon: '☕', unlockLevel: 11),
  RewardItem(id: 'lifestyle_12', category: RewardCategory.lifestyle, name: 'Headphones', icon: '🎧', unlockLevel: 12, isEquippable: true),
  RewardItem(id: 'lifestyle_13', category: RewardCategory.lifestyle, name: 'Wallet', icon: '👛', unlockLevel: 13),
  RewardItem(id: 'lifestyle_14', category: RewardCategory.lifestyle, name: 'Makeup Kit', icon: '💄', unlockLevel: 14),
  RewardItem(id: 'lifestyle_15', category: RewardCategory.lifestyle, name: 'Notebook', icon: '📓', unlockLevel: 15),
  RewardItem(id: 'lifestyle_16', category: RewardCategory.lifestyle, name: 'Travel Bag', icon: '🧳', unlockLevel: 16, isEquippable: true),
  RewardItem(id: 'lifestyle_17', category: RewardCategory.lifestyle, name: 'Smartwatch', icon: '⏱️', unlockLevel: 17, isEquippable: true),
  RewardItem(id: 'lifestyle_18', category: RewardCategory.lifestyle, name: 'Perfume', icon: '🧴', unlockLevel: 18),
  RewardItem(id: 'lifestyle_19', category: RewardCategory.lifestyle, name: 'Trophy Badge', icon: '🏆', unlockLevel: 19),
  RewardItem(id: 'lifestyle_20', category: RewardCategory.lifestyle, name: 'Premium Gift', icon: '🎁', unlockLevel: 20),
];

const List<RewardItem> kGarden = [
  RewardItem(id: 'garden_01', category: RewardCategory.garden, name: 'Pet Dog', icon: '🐶', unlockLevel: 1),
  RewardItem(id: 'garden_02', category: RewardCategory.garden, name: 'Pet Cat', icon: '🐱', unlockLevel: 2),
  RewardItem(id: 'garden_06', category: RewardCategory.garden, name: 'Fountain', icon: '⛲', unlockLevel: 3),
  RewardItem(id: 'garden_08', category: RewardCategory.garden, name: 'Slide', icon: '🛝', unlockLevel: 4),
  RewardItem(id: 'garden_04', category: RewardCategory.garden, name: 'Flower Pots', icon: '🪴', unlockLevel: 5),
  RewardItem(id: 'garden_03', category: RewardCategory.garden, name: 'Garden Bench', icon: '🪑', unlockLevel: 6),
  RewardItem(id: 'garden_05', category: RewardCategory.garden, name: 'Rose Garden', icon: '🌹', unlockLevel: 7),
  RewardItem(id: 'garden_07', category: RewardCategory.garden, name: 'Swing', icon: '🎠', unlockLevel: 8),
  RewardItem(id: 'garden_09', category: RewardCategory.garden, name: 'Outdoor Lamp', icon: '🏮', unlockLevel: 9),
  RewardItem(id: 'garden_10', category: RewardCategory.garden, name: 'Bird House', icon: '🐦', unlockLevel: 10),
  RewardItem(id: 'garden_11', category: RewardCategory.garden, name: 'Tree House', icon: '🛖', unlockLevel: 11),
  RewardItem(id: 'garden_12', category: RewardCategory.garden, name: 'Fish Pond', icon: '🐟', unlockLevel: 12),
  RewardItem(id: 'garden_13', category: RewardCategory.garden, name: 'Garden Table', icon: '⛱️', unlockLevel: 13),
  RewardItem(id: 'garden_14', category: RewardCategory.garden, name: 'Butterfly Corner', icon: '🦋', unlockLevel: 14),
  RewardItem(id: 'garden_15', category: RewardCategory.garden, name: 'Premium Garden', icon: '🏞️', unlockLevel: 15),
];

List<RewardItem> itemsForCategory(RewardCategory c) {
  switch (c) {
    case RewardCategory.wardrobe:
      return kWardrobe;
    case RewardCategory.home:
      return kHome;
    case RewardCategory.vehicles:
      return kVehicles;
    case RewardCategory.lifestyle:
      return kLifestyle;
    case RewardCategory.garden:
      return kGarden;
  }
}

final List<RewardItem> kAllRewards = [
  ...kWardrobe, ...kHome, ...kVehicles, ...kLifestyle, ...kGarden,
];

RewardItem? rewardById(String id) {
  for (final r in kAllRewards) {
    if (r.id == id) return r;
  }
  return null;
}

bool isItemUnlocked(RewardItem i, int completedCount) => completedCount >= i.unlockLevel;

/// Wardrobe filtered to the avatar profile; other categories show all.
List<RewardItem> visibleItems(RewardCategory c, AvatarSelection sel) {
  final items = itemsForCategory(c);
  if (c != RewardCategory.wardrobe) return items;
  final group = ageToGroup(sel.age);
  return items.where((i) {
    if (i.genders != null && !i.genders!.contains(sel.gender)) return false;
    if (i.ageGroups != null && !i.ageGroups!.contains(group)) return false;
    return true;
  }).toList();
}

/// Headline reward for completing a level — the lifestyle item unlocking there,
/// else any reward at that level.
RewardItem? featuredRewardForLevel(int level) {
  for (final i in kLifestyle) {
    if (i.unlockLevel == level) return i;
  }
  for (final i in kAllRewards) {
    if (i.unlockLevel == level) return i;
  }
  return null;
}

const rewardCategoryMeta = [
  (key: RewardCategory.wardrobe, name: 'Wardrobe', icon: '👕'),
  (key: RewardCategory.home, name: 'Home', icon: '🏠'),
  (key: RewardCategory.vehicles, name: 'Vehicles', icon: '🚗'),
  (key: RewardCategory.lifestyle, name: 'Lifestyle', icon: '🕶️'),
  (key: RewardCategory.garden, name: 'Garden', icon: '🌳'),
];
