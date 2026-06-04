/**
 * Local progress persistence using AsyncStorage.
 *
 * This is the "dummy" local progress system for the MVP — no backend required.
 *
 * ── FUTURE API INTEGRATION ────────────────────────────────────────────────
 * Replace the read/write bodies below with calls to your learning backend,
 * e.g. `await api.getProgress(userId)` / `await api.saveProgress(userId, p)`.
 * Keep the same `Progress` shape so the UI code does not change.
 * ──────────────────────────────────────────────────────────────────────────
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOTAL_SUBTOPICS } from '../data/subtopics';

const STORAGE_KEY = '@english_town_map/progress_v1';

export interface Progress {
  /** id of the lesson the learner is currently on (1-based). */
  currentId: number;
  /** ids of lessons already completed. */
  completedIds: number[];
  /** running coin total (collected while walking + level rewards). */
  coins?: number;
}

export const DEFAULT_PROGRESS: Progress = {
  currentId: 1,
  completedIds: [],
  coins: 0,
};

/** Coins awarded per level (collected as a trail while walking to the next). */
export const COINS_PER_LEVEL = 10;

/** Load saved progress, or the default (start at lesson 1) if none exists. */
export async function loadProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Progress;
    // Defensive: make sure values are sane after any data change.
    if (
      typeof parsed.currentId !== 'number' ||
      !Array.isArray(parsed.completedIds)
    ) {
      return { ...DEFAULT_PROGRESS };
    }
    return parsed;
  } catch (e) {
    console.warn('[progressStorage] failed to load, using default', e);
    return { ...DEFAULT_PROGRESS };
  }
}

/** Persist progress to disk. */
export async function saveProgress(progress: Progress): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('[progressStorage] failed to save', e);
  }
}

/** Wipe progress (handy for testing / a future "reset town" button). */
export async function resetProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('[progressStorage] failed to reset', e);
  }
}

/** True once every lesson is completed. */
export function isTownCompleted(progress: Progress): boolean {
  return progress.completedIds.length >= TOTAL_SUBTOPICS;
}
