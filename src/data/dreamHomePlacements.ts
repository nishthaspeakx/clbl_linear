/**
 * dreamHomePlacements — where each reward sits on the Dream Home image.
 *
 * Keyed by the reward item's `imageKey`. Coordinates are percentages relative to
 * the rendered house image (0–100). Each object is anchored at its BASE (bottom-
 * centre), so `yPercent` is the floor/ground line the object rests on — this
 * keeps objects grounded rather than floating. `scale` sizes the object,
 * `zone`/`zIndex`/`rotate` are optional.
 *
 * Only Home, Garden/Pets and Vehicles are placed on the canvas. Equippable
 * Wardrobe + Lifestyle items dress the avatar instead, and non-equippable
 * lifestyle trinkets are intentionally NOT placed here (they'd clutter the
 * scene) — they still appear in the category grid.
 */
export type DreamArea =
  | 'driveway' | 'front_porch' | 'garage'
  | 'living_room' | 'dining_room' | 'bedroom' | 'study' | 'kitchen' | 'room_wall' | 'shelf'
  | 'garden' | 'lawn' | 'backyard';

export interface DreamPlacement {
  xPercent: number;
  yPercent: number;
  scale: number;
  area: DreamArea;
  /** Optional logical zone key (see dreamHomeZones). */
  zone?: string;
  /** Optional explicit stacking order (else derived from yPercent depth). */
  zIndex?: number;
  /** Optional rotation in degrees. */
  rotate?: number;
}

export const dreamHomePlacements: Record<string, DreamPlacement> = {
  // ── Vehicles — driveway (cars) / front path (two-wheelers) ───────────────
  bicycle: { xPercent: 36, yPercent: 76, scale: 0.8, area: 'front_porch', zone: 'porch' },
  scooter: { xPercent: 35, yPercent: 76, scale: 0.85, area: 'front_porch', zone: 'porch' },
  bike: { xPercent: 34, yPercent: 76, scale: 0.9, area: 'front_porch', zone: 'porch' },
  electric_scooter: { xPercent: 35, yPercent: 76, scale: 0.85, area: 'front_porch', zone: 'porch' },
  premium_bike: { xPercent: 34, yPercent: 76, scale: 0.95, area: 'front_porch', zone: 'porch' },
  auto_ride: { xPercent: 18, yPercent: 66, scale: 1.0, area: 'driveway', zone: 'driveway' },
  small_car: { xPercent: 18, yPercent: 66, scale: 1.0, area: 'driveway', zone: 'driveway' },
  hatchback: { xPercent: 18, yPercent: 66, scale: 1.05, area: 'driveway', zone: 'driveway' },
  sedan: { xPercent: 18, yPercent: 66, scale: 1.1, area: 'driveway', zone: 'driveway' },
  suv: { xPercent: 18, yPercent: 65, scale: 1.15, area: 'driveway', zone: 'driveway' },
  premium_car: { xPercent: 18, yPercent: 66, scale: 1.15, area: 'driveway', zone: 'driveway' },
  dream_car: { xPercent: 17, yPercent: 66, scale: 1.25, area: 'driveway', zone: 'driveway' },

  // ── Home interior — objects rest on room floors / against walls ──────────
  rug: { xPercent: 60, yPercent: 66, scale: 0.85, area: 'living_room', zone: 'interior', zIndex: 5 },
  sofa: { xPercent: 57, yPercent: 61, scale: 0.85, area: 'living_room', zone: 'interior' },
  tv: { xPercent: 70, yPercent: 57, scale: 0.7, area: 'living_room', zone: 'interior' },
  chair: { xPercent: 51, yPercent: 63, scale: 0.55, area: 'living_room', zone: 'interior' },
  lamp: { xPercent: 48, yPercent: 59, scale: 0.7, area: 'living_room', zone: 'interior' },
  cooler: { xPercent: 47, yPercent: 56, scale: 0.55, area: 'living_room', zone: 'interior' },
  study_table: { xPercent: 66, yPercent: 63, scale: 0.7, area: 'study', zone: 'interior' },
  bookshelf: { xPercent: 90, yPercent: 56, scale: 0.7, area: 'study', zone: 'interior' },
  dining_table: { xPercent: 62, yPercent: 43, scale: 0.78, area: 'dining_room', zone: 'interior' },
  kitchen_set: { xPercent: 72, yPercent: 43, scale: 0.7, area: 'kitchen', zone: 'interior' },
  bed: { xPercent: 82, yPercent: 37, scale: 0.85, area: 'bedroom', zone: 'interior' },
  wardrobe_unit: { xPercent: 91, yPercent: 39, scale: 0.78, area: 'bedroom', zone: 'interior' },
  premium_room: { xPercent: 76, yPercent: 47, scale: 0.7, area: 'bedroom', zone: 'interior' },
  ac: { xPercent: 80, yPercent: 27, scale: 0.5, area: 'room_wall', zone: 'interior' },
  balcony_plants: { xPercent: 95, yPercent: 48, scale: 0.55, area: 'room_wall', zone: 'interior' },

  // ── Garden / yard — objects rest on the ground ───────────────────────────
  garden_bench: { xPercent: 12, yPercent: 70, scale: 0.7, area: 'garden', zone: 'garden' },
  bird_house: { xPercent: 9, yPercent: 52, scale: 0.62, area: 'garden', zone: 'garden' },
  tree_house: { xPercent: 7, yPercent: 44, scale: 0.9, area: 'garden', zone: 'garden' },
  flower_pots: { xPercent: 26, yPercent: 74, scale: 0.62, area: 'garden', zone: 'garden' },
  rose_garden: { xPercent: 20, yPercent: 86, scale: 0.66, area: 'garden', zone: 'garden' },
  pet_dog: { xPercent: 37, yPercent: 85, scale: 0.6, area: 'lawn', zone: 'garden' },
  pet_cat: { xPercent: 29, yPercent: 90, scale: 0.5, area: 'lawn', zone: 'garden' },
  outdoor_lamp: { xPercent: 44, yPercent: 89, scale: 0.62, area: 'lawn', zone: 'garden' },
  fountain: { xPercent: 50, yPercent: 93, scale: 0.78, area: 'lawn', zone: 'garden' },
  swing: { xPercent: 90, yPercent: 75, scale: 0.8, area: 'backyard', zone: 'backyard' },
  slide: { xPercent: 96, yPercent: 69, scale: 0.78, area: 'backyard', zone: 'backyard' },
  fish_pond: { xPercent: 95, yPercent: 85, scale: 0.72, area: 'backyard', zone: 'backyard' },
  garden_table: { xPercent: 88, yPercent: 91, scale: 0.62, area: 'backyard', zone: 'backyard' },
  butterfly_corner: { xPercent: 98, yPercent: 62, scale: 0.55, area: 'garden', zone: 'backyard' },
  premium_garden: { xPercent: 85, yPercent: 95, scale: 0.85, area: 'backyard', zone: 'backyard' },
};

export function placementFor(imageKey: string): DreamPlacement | undefined {
  return dreamHomePlacements[imageKey];
}
