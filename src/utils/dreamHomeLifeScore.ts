/**
 * dreamHomeLifeScore — the "aliveness" of the Dream Home, derived from how many
 * placeable rewards (home/garden/vehicles/pets) the learner has unlocked, plus
 * the progressive level-gated life effects and the world status copy.
 */
export function lifeScore(unlocked: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((unlocked / total) * 100);
}

export function lifeStatusText(score: number): string {
  if (score < 10) return 'Your dream home has just begun.';
  if (score < 30) return 'Your home is starting to come alive.';
  if (score < 60) return 'Your world is growing beautifully.';
  if (score < 90) return 'Your dream lifestyle is taking shape.';
  return 'Your world is complete and thriving.';
}

export interface LifeEffects {
  entranceSparkle: boolean; // L1
  windowLights: boolean;    // L3
  gardenLamp: boolean;      // L5
  birds: boolean;           // L7
  fountain: boolean;        // L10
  pet: boolean;             // L12
  vehicleShine: boolean;    // L15
  fullGlow: boolean;        // L20
}

export function activeEffects(completedCount: number): LifeEffects {
  return {
    entranceSparkle: completedCount >= 1,
    windowLights: completedCount >= 3,
    gardenLamp: completedCount >= 5,
    birds: completedCount >= 7,
    fountain: completedCount >= 10,
    pet: completedCount >= 12,
    vehicleShine: completedCount >= 15,
    fullGlow: completedCount >= 20,
  };
}
