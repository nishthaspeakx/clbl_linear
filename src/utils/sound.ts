/**
 * sound.ts — tiny game sound manager (expo-av).
 *
 * Preloads short synthesized SFX and plays them on game events. All playback
 * is fire-and-forget and guarded by a global mute flag. Sounds are bundled
 * WAVs in assets/sounds/.
 */
import { Audio } from 'expo-av';

export type SoundName = 'tap' | 'coin' | 'success' | 'levelup' | 'toggle' | 'walk';

const FILES: Record<SoundName, number> = {
  tap: require('../../assets/sounds/tap.wav'),
  coin: require('../../assets/sounds/coin.wav'),
  success: require('../../assets/sounds/success.wav'),
  levelup: require('../../assets/sounds/levelup.wav'),
  toggle: require('../../assets/sounds/toggle.wav'),
  walk: require('../../assets/sounds/walk.wav'),
};

const VOLUME: Record<SoundName, number> = {
  tap: 0.5,
  coin: 0.7,
  success: 0.7,
  levelup: 0.8,
  toggle: 0.5,
  walk: 0.4,
};

const sounds: Partial<Record<SoundName, Audio.Sound>> = {};
let enabled = true;
let ready = false;

/** Preload all sounds once (call on app start). */
export async function initSounds(): Promise<void> {
  if (ready) return;
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, shouldDuckAndroid: true });
    await Promise.all(
      (Object.keys(FILES) as SoundName[]).map(async (k) => {
        try {
          const { sound } = await Audio.Sound.createAsync(FILES[k], { volume: VOLUME[k] });
          sounds[k] = sound;
        } catch {
          /* ignore individual load errors */
        }
      })
    );
    ready = true;
  } catch {
    /* audio unavailable — game still works silently */
  }
}

export function setSoundEnabled(v: boolean): void {
  enabled = v;
}
export function isSoundEnabled(): boolean {
  return enabled;
}

/** Play a sound by name (no-op if muted / not loaded). */
export function playSound(name: SoundName): void {
  if (!enabled) return;
  const s = sounds[name];
  if (!s) return;
  // replayAsync restarts from 0 so rapid repeats still trigger.
  s.replayAsync().catch(() => {});
}
