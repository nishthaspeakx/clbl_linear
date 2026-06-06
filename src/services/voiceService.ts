/**
 * voiceService — short spoken celebration lines for the reward reveal, in a
 * female voice with an expressive tone (expo-speech / Web Speech API). Respects
 * the global sound/mute toggle and never throws.
 *
 * Demo: only Levels 1 and 2 speak — see speakLevelReveal / speakLevelApplied.
 */
import * as Speech from 'expo-speech';
import { isSoundEnabled } from './soundService';

// Cache a female English voice identifier once available.
let femaleVoiceId: string | undefined;
let lookedUp = false;

const FEMALE_HINT = /(female|samantha|karen|moira|tessa|fiona|veena|victoria|zira|susan|serena|allison|ava|joanna|salli|kendra|google uk english female|google us english)/i;

async function ensureFemaleVoice(): Promise<void> {
  if (lookedUp) return;
  lookedUp = true;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const en = voices.filter((v) => /en[-_]/i.test(v.language || '') || /english/i.test(v.name || ''));
    const pick = en.find((v) => FEMALE_HINT.test(`${v.name} ${v.identifier}`))
      || voices.find((v) => FEMALE_HINT.test(`${v.name} ${v.identifier}`));
    femaleVoiceId = pick?.identifier;
  } catch {
    // best effort — fall back to a higher pitch
  }
}
// warm the lookup up front (voices may load async on web)
void ensureFemaleVoice();

export function speak(text: string): void {
  if (!isSoundEnabled()) return; // muted = no voice
  const say = () => {
    try {
      Speech.stop();
      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.18,   // brighter → female / expressive
        rate: 0.98,
        voice: femaleVoiceId,
      });
    } catch {
      // best effort
    }
  };
  if (!lookedUp || femaleVoiceId === undefined) {
    // try to resolve a female voice, then speak (small delay is fine)
    void ensureFemaleVoice().then(say);
  } else {
    say();
  }
}

/** Spoken when the reward popup appears (only Levels 1–2 for the demo). */
export function speakLevelReveal(levelId?: number): void {
  if (levelId === 1) speak("Great job! Let's move to level 2.");
  else if (levelId === 2) speak('Great! Level 2 is complete.');
}

/** Spoken after the user wears/applies the reward (only Levels 1–2). */
export function speakLevelApplied(levelId?: number): void {
  if (levelId === 1) speak("Wow! Sunglasses suit you. Let's go to the park.");
  else if (levelId === 2) speak("New shoes! Let's run to level 3.");
}
