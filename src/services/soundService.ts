/**
 * soundService — centralised game sound-effects.
 *
 * Usage:
 *   import { playSound } from '../services/soundService';
 *   playSound('button_tap');
 *   playSound('coin_collect');         // pitch/volume varies slightly each call
 *   playSound('reward_legendary');
 *
 * Design notes
 * ------------
 * • Subtle & optional. A single preference (`soundEnabled`, default ON) is stored
 *   in AsyncStorage and gates everything. When muted, playSound() is a no-op.
 * • Respects iOS silent mode: we configure expo-av with playsInSilentModeIOS=false,
 *   so effects stay quiet when the user flips the hardware mute switch.
 * • Graceful with MISSING assets: drop real files into src/assets/sounds/ and add
 *   the matching `require(...)` to SOUND_ASSETS below. Any event whose asset is
 *   still `null` simply does nothing — the app never crashes for a missing file.
 * • Debounced: a global min-gap plus a per-event min-gap stop "too many at once".
 *
 * Background music is intentionally NOT handled here — short effects only.
 */
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

export type SoundEvent =
  | 'button_tap'
  | 'pin_tap'
  | 'start_lesson'
  | 'correct_answer'
  | 'wrong_answer'
  | 'exercise_complete'
  | 'level_complete'
  | 'character_walk'
  | 'coin_collect'
  | 'coin_cascade'
  | 'reward_box_appear'
  | 'reward_box_shake'
  | 'reward_box_open'
  | 'reward_unlocked'
  | 'claim_reward'
  | 'reward_rare'
  | 'reward_epic'
  | 'reward_legendary'
  | 'tab_switch'
  | 'item_placed'
  | 'invalid_place'
  | 'day_night_toggle'
  | 'avatar_changed';

/**
 * Map each event to a bundled audio module.
 *
 * Today every event reuses one of six shared base clips in assets/sounds/
 * (tap / coin / success / levelup / toggle / walk) so the whole app is audible
 * immediately. To upgrade an event to a DEDICATED clip:
 *   1. Drop the file into src/assets/sounds/ (see that folder's README), then
 *   2. Point its entry below at the new require(), e.g.
 *        reward_legendary: require('../assets/sounds/reward_legendary.mp3'),
 *
 * An entry set to `null` is silently skipped (no crash) — handy if you'd rather
 * a given event stay silent until you have the right clip.
 */
const TAP = require('../../assets/sounds/tap.wav');
const COIN = require('../../assets/sounds/coin.wav');
const SUCCESS = require('../../assets/sounds/success.wav');
const LEVELUP = require('../../assets/sounds/levelup.wav');
const TOGGLE = require('../../assets/sounds/toggle.wav');
const WALK = require('../../assets/sounds/walk.wav');

const SOUND_ASSETS: Record<SoundEvent, number | null> = {
  // — UI / navigation — (soft taps)
  button_tap: TAP,
  tab_switch: TAP,
  pin_tap: TAP,
  // — lessons / exercises —
  start_lesson: SUCCESS,
  correct_answer: SUCCESS,
  wrong_answer: TOGGLE,        // soft, non-harsh stand-in for an error buzz
  exercise_complete: SUCCESS,
  level_complete: LEVELUP,
  // — map / world —
  character_walk: WALK,
  coin_collect: COIN,
  coin_cascade: COIN,
  day_night_toggle: TOGGLE,
  // — rewards —
  reward_box_appear: TOGGLE,   // magical whoosh
  reward_box_shake: TAP,       // small rattle
  reward_box_open: SUCCESS,    // sparkle burst
  reward_unlocked: LEVELUP,    // achievement fanfare
  claim_reward: COIN,          // satisfying collect
  reward_rare: SUCCESS,        // blue crystal chime
  reward_epic: SUCCESS,        // magical purple sparkle
  reward_legendary: LEVELUP,   // big golden celebration
  // — dream home / avatar —
  item_placed: TAP,
  invalid_place: TOGGLE,
  avatar_changed: SUCCESS,
};

/** Per-event base volume (0..1). Keep moderate — effects enhance, not distract. */
const VOLUME: Partial<Record<SoundEvent, number>> = {
  button_tap: 0.35,
  tab_switch: 0.3,
  pin_tap: 0.4,
  character_walk: 0.25,
  coin_collect: 0.45,
  wrong_answer: 0.4,
  reward_legendary: 0.8,
  level_complete: 0.7,
};
const DEFAULT_VOLUME = 0.5;

/** Min ms between two plays of the SAME event (debounce rapid fire). */
const PER_EVENT_GAP = 70;
/** Min ms between ANY two sounds (don't play too many at once). */
const GLOBAL_GAP = 28;

const STORAGE_KEY = '@english_town_map/sound_enabled';
const IS_WEB = Platform.OS === 'web';

let enabled = true;
let initialised = false;
const listeners = new Set<(on: boolean) => void>();
const lastPlayed: Partial<Record<SoundEvent, number>> = {};
let lastAny = 0;
/** Pre-loaded Audio.Sound objects, lazily created per event. */
const pool: Partial<Record<SoundEvent, Audio.Sound>> = {};

function now(): number {
  // Date.now is fine in app runtime (only forbidden inside workflow scripts).
  return Date.now();
}

function notify() {
  listeners.forEach((l) => l(enabled));
}

/** Subscribe to mute/unmute changes. Returns an unsubscribe fn. */
export function subscribeSound(fn: (on: boolean) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isSoundEnabled(): boolean {
  return enabled;
}

/** Load the saved preference + configure the audio session. Call once at startup. */
export async function initSound(): Promise<void> {
  if (initialised) return;
  initialised = true;
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved != null) enabled = saved === 'true';
  } catch {
    /* keep default */
  }
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false, // respect the hardware silent switch
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  } catch {
    /* audio mode is best-effort */
  }
  notify();
}

export async function setSoundEnabled(on: boolean): Promise<void> {
  enabled = on;
  notify();
  try {
    await AsyncStorage.setItem(STORAGE_KEY, on ? 'true' : 'false');
  } catch {
    /* ignore persistence errors */
  }
}

export async function toggleSound(): Promise<boolean> {
  await setSoundEnabled(!enabled);
  return enabled;
}

interface PlayOptions {
  /** Extra volume multiplier (0..1+). */
  volume?: number;
  /** Randomise rate/volume a touch (used for coin pickups). */
  vary?: boolean;
}

/**
 * Play a sound effect. No-op when muted, when the asset is missing, or when the
 * debounce window hasn't elapsed. Always fire-and-forget — never throws.
 */
export function playSound(event: SoundEvent, opts: PlayOptions = {}): void {
  if (!enabled) return;
  const asset = SOUND_ASSETS[event];
  if (asset == null) return; // no file wired yet → silent, no crash

  const t = now();
  if (t - (lastPlayed[event] ?? 0) < PER_EVENT_GAP) return;
  if (t - lastAny < GLOBAL_GAP) return;
  lastPlayed[event] = t;
  lastAny = t;

  void playAsync(event, asset, opts);
}

async function playAsync(event: SoundEvent, asset: number, opts: PlayOptions) {
  try {
    const baseVol = VOLUME[event] ?? DEFAULT_VOLUME;
    // slight variation so repeated coins/taps don't sound robotic
    const variance = opts.vary ? 0.85 + pseudoRandom() * 0.3 : 1;
    const volume = Math.min(1, baseVol * variance * (opts.volume ?? 1));
    const rate = opts.vary ? 0.94 + pseudoRandom() * 0.12 : 1;

    let sound = pool[event];
    if (!sound) {
      const created = await Audio.Sound.createAsync(asset, { volume });
      sound = created.sound;
      pool[event] = sound;
    }
    await sound.setStatusAsync({
      shouldPlay: true,
      positionMillis: 0,
      volume,
      // rate adjustment needs pitch correction disabled to actually shift pitch
      rate: IS_WEB ? undefined : rate,
      shouldCorrectPitch: false,
    } as any);
  } catch {
    /* a flaky decode / unsupported rate must never break gameplay */
  }
}

/** Tiny deterministic-ish jitter (Math.random is fine in app runtime). */
function pseudoRandom(): number {
  return Math.random();
}

/** Release all loaded sounds (optional cleanup). */
export async function unloadSounds(): Promise<void> {
  await Promise.all(
    Object.values(pool).map((s) => s?.unloadAsync().catch(() => undefined)),
  );
  (Object.keys(pool) as SoundEvent[]).forEach((k) => delete pool[k]);
}
