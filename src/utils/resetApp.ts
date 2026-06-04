/**
 * resetApp — wipe all saved progress (town levels + per-level exercises) so the
 * app returns to its initial state: Level 1 current, 0 completed, Vocabulary
 * playable from the start. On web we reload so every screen re-reads defaults.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const PREFIX = '@english_town_map';

export async function resetApp(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const ours = keys.filter((k) => k.startsWith(PREFIX));
    if (ours.length) await AsyncStorage.multiRemove(ours);
  } catch {
    // ignore — best effort
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.location.reload();
  }
}
