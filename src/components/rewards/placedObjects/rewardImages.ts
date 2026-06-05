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
  fountain: require('../../../assets/rewards/fountain.png'),
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
};

export function rewardImageFor(imageKey: string): number | undefined {
  return REWARD_IMAGES[imageKey];
}

export function hasRewardImage(imageKey: string): boolean {
  return imageKey in REWARD_IMAGES;
}
