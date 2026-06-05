/**
 * hapticService — light, optional haptic feedback (expo-haptics).
 *
 *   triggerHaptic('light')    // button taps, pin taps
 *   triggerHaptic('medium')   // coin collect, item placed
 *   triggerHaptic('success')  // level / exercise complete, reward unlocked
 *   triggerHaptic('warning')  // wrong answer, invalid placement
 *   triggerHaptic('heavy')    // legendary reward
 *
 * • No-ops on web (no haptics engine) and is wrapped so a missing/again-unsupported
 *   engine never throws.
 * • Shares the single "game feedback" preference with sound: when the user mutes
 *   via SoundToggle, haptics go quiet too (one control for all feedback).
 */
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { isSoundEnabled } from './soundService';

export type HapticType = 'light' | 'medium' | 'success' | 'warning' | 'heavy';

const IS_WEB = Platform.OS === 'web';

export function triggerHaptic(type: HapticType): void {
  if (IS_WEB) return;
  if (!isSoundEnabled()) return; // muted = no buzz either
  try {
    switch (type) {
      case 'light':
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
    }
  } catch {
    /* haptics are best-effort */
  }
}
