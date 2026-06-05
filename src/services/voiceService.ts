/**
 * voiceService — short spoken celebration lines for the reward reveal (expo-speech,
 * which uses the Web Speech API on web). Respects the global sound/mute toggle
 * and never throws.
 */
import * as Speech from 'expo-speech';
import { isSoundEnabled } from './soundService';

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function speak(text: string): void {
  if (!isSoundEnabled()) return; // muted = no voice
  try {
    Speech.stop();
    Speech.speak(text, { rate: 1.0, pitch: 1.06 });
  } catch {
    // best effort
  }
}

/** Said when the reward popup appears. */
export function speakUnlock(_name?: string): void {
  speak('Great job!');
}

/** Said after the user wears/applies the reward. */
export function speakApplied(): void {
  speak('You look nice!');
}
