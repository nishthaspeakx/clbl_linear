/**
 * sound.ts — backwards-compatible shim.
 *
 * The real implementation now lives in src/services/soundService.ts (richer
 * event set, AsyncStorage-persisted mute, debounce, haptics companion). This
 * module keeps the old `SoundName` API working and routes it to the new service
 * so every call site shares ONE mute flag and audio session.
 *
 * Prefer importing { playSound } from '../services/soundService' in new code.
 */
import {
  SoundEvent,
  initSound,
  isSoundEnabled as isEnabled,
  playSound as playEvent,
  setSoundEnabled as setEnabled,
} from '../services/soundService';

export type SoundName = 'tap' | 'coin' | 'success' | 'levelup' | 'toggle' | 'walk';

const MAP: Record<SoundName, SoundEvent> = {
  tap: 'button_tap',
  coin: 'coin_collect',
  success: 'correct_answer',
  levelup: 'level_complete',
  toggle: 'day_night_toggle',
  walk: 'character_walk',
};

export async function initSounds(): Promise<void> {
  await initSound();
}

export function setSoundEnabled(v: boolean): void {
  void setEnabled(v);
}

export function isSoundEnabled(): boolean {
  return isEnabled();
}

export function playSound(name: SoundName): void {
  playEvent(MAP[name], name === 'coin' ? { vary: true } : undefined);
}
