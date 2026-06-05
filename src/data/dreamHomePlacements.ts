/**
 * dreamHomePlacements — where each reward sits on the Dream Home image.
 *
 * Keyed by the reward item's `imageKey`. Coordinates are percentages relative to
 * the rendered house image (0–100). Each object is anchored at its BASE (bottom-
 * centre), so `yPercent` is the floor/ground line the object rests on — this
 * keeps objects grounded rather than floating. `scale` sizes the object,
 * `zone`/`zIndex`/`rotate` are optional.
 *
 * Tuned for the current house image: cutaway rooms on the centre-right (wooden
 * floor), driveway/patio front-left, porch centre-front, lawn front-left and
 * backyard on the right. Users can drag any item in the Home Builder editor.
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
  // ── Vehicles — driveway/patio (cars) / front path (two-wheelers) ─────────
  bicycle: { xPercent: 38, yPercent: 73, scale: 0.8, area: 'front_porch', zone: 'porch' },
  scooter: { xPercent: 37, yPercent: 73, scale: 0.85, area: 'front_porch', zone: 'porch' },
  bike: { xPercent: 36, yPercent: 73, scale: 0.9, area: 'front_porch', zone: 'porch' },
  electric_scooter: { xPercent: 37, yPercent: 73, scale: 0.85, area: 'front_porch', zone: 'porch' },
  premium_bike: { xPercent: 36, yPercent: 73, scale: 0.95, area: 'front_porch', zone: 'porch' },
  auto_ride: { xPercent: 27, yPercent: 60, scale: 1.0, area: 'driveway', zone: 'driveway' },
  small_car: { xPercent: 27, yPercent: 60, scale: 1.0, area: 'driveway', zone: 'driveway' },
  hatchback: { xPercent: 27, yPercent: 60, scale: 1.05, area: 'driveway', zone: 'driveway' },
  sedan: { xPercent: 27, yPercent: 60, scale: 1.1, area: 'driveway', zone: 'driveway' },
  suv: { xPercent: 27, yPercent: 59, scale: 1.15, area: 'driveway', zone: 'driveway' },
  premium_car: { xPercent: 27, yPercent: 60, scale: 1.15, area: 'driveway', zone: 'driveway' },
  dream_car: { xPercent: 26, yPercent: 60, scale: 1.25, area: 'driveway', zone: 'driveway' },

  // ── Home interior — objects rest on the wooden-floor rooms ───────────────
  rug: { xPercent: 60, yPercent: 60, scale: 0.85, area: 'living_room', zone: 'interior', zIndex: 5 },
  sofa: { xPercent: 58, yPercent: 56, scale: 0.85, area: 'living_room', zone: 'interior' },
  tv: { xPercent: 70, yPercent: 51, scale: 0.7, area: 'living_room', zone: 'interior' },
  chair: { xPercent: 52, yPercent: 58, scale: 0.55, area: 'living_room', zone: 'interior' },
  lamp: { xPercent: 49, yPercent: 53, scale: 0.7, area: 'living_room', zone: 'interior' },
  cooler: { xPercent: 47, yPercent: 55, scale: 0.55, area: 'living_room', zone: 'interior' },
  study_table: { xPercent: 66, yPercent: 55, scale: 0.7, area: 'study', zone: 'interior' },
  bookshelf: { xPercent: 85, yPercent: 46, scale: 0.7, area: 'study', zone: 'interior' },
  dining_table: { xPercent: 61, yPercent: 37, scale: 0.78, area: 'dining_room', zone: 'interior' },
  kitchen_set: { xPercent: 72, yPercent: 35, scale: 0.7, area: 'kitchen', zone: 'interior' },
  bed: { xPercent: 80, yPercent: 28, scale: 0.85, area: 'bedroom', zone: 'interior' },
  wardrobe_unit: { xPercent: 88, yPercent: 30, scale: 0.78, area: 'bedroom', zone: 'interior' },
  premium_room: { xPercent: 74, yPercent: 33, scale: 0.7, area: 'bedroom', zone: 'interior' },
  ac: { xPercent: 78, yPercent: 19, scale: 0.5, area: 'room_wall', zone: 'interior' },
  balcony_plants: { xPercent: 90, yPercent: 40, scale: 0.55, area: 'room_wall', zone: 'interior' },

  // ── Garden / yard — objects rest on the lawn ─────────────────────────────
  garden_bench: { xPercent: 14, yPercent: 70, scale: 0.7, area: 'garden', zone: 'garden' },
  bird_house: { xPercent: 9, yPercent: 54, scale: 0.62, area: 'garden', zone: 'garden' },
  tree_house: { xPercent: 6, yPercent: 46, scale: 0.9, area: 'garden', zone: 'garden' },
  flower_pots: { xPercent: 22, yPercent: 74, scale: 0.62, area: 'garden', zone: 'garden' },
  rose_garden: { xPercent: 16, yPercent: 86, scale: 0.66, area: 'garden', zone: 'garden' },
  pet_dog: { xPercent: 32, yPercent: 84, scale: 0.6, area: 'lawn', zone: 'garden' },
  pet_cat: { xPercent: 26, yPercent: 90, scale: 0.5, area: 'lawn', zone: 'garden' },
  outdoor_lamp: { xPercent: 41, yPercent: 88, scale: 0.62, area: 'lawn', zone: 'garden' },
  fountain: { xPercent: 45, yPercent: 92, scale: 0.78, area: 'lawn', zone: 'garden' },
  swing: { xPercent: 90, yPercent: 78, scale: 0.8, area: 'backyard', zone: 'backyard' },
  slide: { xPercent: 95, yPercent: 72, scale: 0.78, area: 'backyard', zone: 'backyard' },
  fish_pond: { xPercent: 94, yPercent: 88, scale: 0.72, area: 'backyard', zone: 'backyard' },
  garden_table: { xPercent: 88, yPercent: 92, scale: 0.62, area: 'backyard', zone: 'backyard' },
  butterfly_corner: { xPercent: 97, yPercent: 64, scale: 0.55, area: 'garden', zone: 'backyard' },
  premium_garden: { xPercent: 84, yPercent: 95, scale: 0.85, area: 'backyard', zone: 'backyard' },
};

export function placementFor(imageKey: string): DreamPlacement | undefined {
  return dreamHomePlacements[imageKey];
}
