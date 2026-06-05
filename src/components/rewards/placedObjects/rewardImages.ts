/**
 * rewardImages — premium AI-generated miniature 3D reward assets (transparent
 * PNGs), keyed by the reward item's `imageKey`. When a key has an image here it
 * is rendered everywhere ObjectVisual is used (cards, the unlock chest, the
 * Dream Home preview and the editor), replacing the old code-drawn SVG / emoji.
 *
 * Generated in the Township / The Sims collectible style, cut out to a clean
 * transparent background so they sit naturally on grass, floors and cards.
 * Add a key here (and drop the matching PNG in assets/rewards) to upgrade a
 * reward's visual — no call-site changes needed.
 */
export const REWARD_IMAGES: Record<string, number> = {
  // ── Garden ──
  pet_dog: require('../../../assets/rewards/pet_dog.png'),
  pet_cat: require('../../../assets/rewards/pet_cat.png'),
  // fountain intentionally uses the original code-drawn SVG (PlacedFountain)
  slide: require('../../../assets/rewards/slide.png'),
  flower_pots: require('../../../assets/rewards/flower_pots.png'),
  // ── Home ──
  bed: require('../../../assets/rewards/bed.png'),
  rug: require('../../../assets/rewards/rug.png'),
  dining_table: require('../../../assets/rewards/dining_table.png'),
  lamp: require('../../../assets/rewards/lamp.png'),
  study_table: require('../../../assets/rewards/study_table.png'),
  // ── Wardrobe (male first-5) ──
  casual_tshirt: require('../../../assets/rewards/casual_tshirt.png'),
  shirt: require('../../../assets/rewards/shirt.png'),
  jeans: require('../../../assets/rewards/jeans.png'),
  kurta: require('../../../assets/rewards/kurta.png'),
  formal_shirt: require('../../../assets/rewards/formal_shirt.png'),
  // ── Lifestyle ──
  sunglasses: require('../../../assets/rewards/sunglasses.png'),
  sneakers: require('../../../assets/rewards/sneakers.png'),
  cap: require('../../../assets/rewards/cap.png'),
  backpack: require('../../../assets/rewards/backpack.png'),
  laptop_bag: require('../../../assets/rewards/laptop_bag.png'),
  // ── Vehicles (first-5: Cycle, Bike, BMW, Mercedes, Audi) ──
  cycle: require('../../../assets/rewards/cycle.png'),
  motorbike: require('../../../assets/rewards/motorbike.png'),
  bmw: require('../../../assets/rewards/bmw.png'),
  mercedes: require('../../../assets/rewards/mercedes.png'),
  audi: require('../../../assets/rewards/audi.png'),
  // ── Wardrobe (female) ──
  kurti: require('../../../assets/rewards/kurti.png'),
  dress: require('../../../assets/rewards/dress.png'),
  cardigan: require('../../../assets/rewards/cardigan.png'),
  handbag_outfit: require('../../../assets/rewards/handbag_outfit.png'),
  formal_blouse: require('../../../assets/rewards/formal_blouse.png'),
  office_suit: require('../../../assets/rewards/office_suit.png'),
  saree: require('../../../assets/rewards/saree.png'),
  traditional_outfit: require('../../../assets/rewards/traditional_outfit.png'),
  lehenga: require('../../../assets/rewards/lehenga.png'),
  designer_outfit: require('../../../assets/rewards/designer_outfit.png'),
};

export function rewardImageFor(imageKey: string): number | undefined {
  return REWARD_IMAGES[imageKey];
}

export function hasRewardImage(imageKey: string): boolean {
  return imageKey in REWARD_IMAGES;
}
