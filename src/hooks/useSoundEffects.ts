/**
 * useSoundEffects — React access to the sound + haptic system.
 *
 *   const { playSound, triggerHaptic, soundEnabled, toggleSound } = useSoundEffects();
 *
 * `soundEnabled` is reactive (re-renders on mute/unmute from anywhere). The
 * play/haptic helpers are stable references safe to call inside handlers.
 */
import { useCallback, useEffect, useState } from 'react';
import {
  SoundEvent,
  isSoundEnabled,
  playSound as playSoundSvc,
  setSoundEnabled as setSoundEnabledSvc,
  subscribeSound,
  toggleSound as toggleSoundSvc,
} from '../services/soundService';
import { HapticType, triggerHaptic as triggerHapticSvc } from '../services/hapticService';

export function useSoundEffects() {
  const [soundEnabled, setEnabled] = useState(isSoundEnabled());

  useEffect(() => subscribeSound(setEnabled), []);

  const playSound = useCallback((event: SoundEvent, opts?: { volume?: number; vary?: boolean }) => {
    playSoundSvc(event, opts);
  }, []);

  const triggerHaptic = useCallback((type: HapticType) => {
    triggerHapticSvc(type);
  }, []);

  const toggleSound = useCallback(() => toggleSoundSvc(), []);
  const setSoundEnabled = useCallback((on: boolean) => setSoundEnabledSvc(on), []);

  return { soundEnabled, playSound, triggerHaptic, toggleSound, setSoundEnabled };
}
