/**
 * exerciseProgressStorage.ts — per-LEVEL exercise progress in AsyncStorage.
 *
 * levelExerciseProgress = {
 *   [levelId]: { completedExerciseIds: [1,2], currentExerciseId: 3 }
 * }
 *
 * Closing the overlay must NOT reset progress, so it is persisted on every
 * exercise completion.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@english_town_map/exercise_progress_v1';

export interface LevelExerciseProgress {
  completedExerciseIds: number[];
  currentExerciseId: number;
}

export const DEFAULT_LEVEL: LevelExerciseProgress = {
  completedExerciseIds: [],
  currentExerciseId: 1,
};

type Store = Record<number, LevelExerciseProgress>;

async function loadAll(): Promise<Store> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

/** Load one level's exercise progress (default = nothing done, current = 1). */
export async function loadLevelExercises(levelId: number): Promise<LevelExerciseProgress> {
  const all = await loadAll();
  const lvl = all[levelId];
  if (!lvl || !Array.isArray(lvl.completedExerciseIds)) return { ...DEFAULT_LEVEL };
  return lvl;
}

/** Persist one level's exercise progress. */
export async function saveLevelExercises(levelId: number, data: LevelExerciseProgress): Promise<void> {
  try {
    const all = await loadAll();
    all[levelId] = data;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
