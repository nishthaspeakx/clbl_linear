/**
 * featureFlags — runtime switches for experimental presentation layers.
 *
 * PERSPECTIVE_WORLD — the Fable/Mythos-style moving world (avatar anchored,
 * world scrolls beneath). Defaults ON. The classic static isometric map stays
 * fully intact and can be restored per-session on web with `?world=classic`
 * (and the new one forced with `?world=path`).
 */
import { Platform } from 'react-native';

export const PERSPECTIVE_WORLD: boolean = (() => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const q = window.location.search || '';
    if (q.includes('world=classic')) return false;
    if (q.includes('world=path')) return true;
  }
  return true;
})();
