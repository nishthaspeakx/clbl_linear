/**
 * viewport.ts — single source of truth for the app viewport size.
 *
 * On native, this is just the device window. On web, we lock the app to a
 * phone-sized frame (Pixel-class 412×915) so the experience always looks like
 * an Android phone — never stretched across a desktop browser. Every component
 * that needs screen dimensions imports from here, so the layout math and the
 * visible frame always agree.
 */
import { Dimensions, Platform } from 'react-native';

// iPhone Pro Max-class logical size — a large flagship phone for a premium demo.
const PHONE_W = 440;
const PHONE_H = 956;

const win = Dimensions.get('window');

export const IS_WEB = Platform.OS === 'web';

// On web, always use the FULL phone size (440×956) regardless of the browser
// window — the device mockup is then scaled down to fit (see AppTabs
// DEVICE_SCALE). This keeps the layout/proportions identical on every screen,
// instead of producing a short/stubby phone on a short browser window.
export const VIEWPORT_W = IS_WEB ? PHONE_W : win.width;
export const VIEWPORT_H = IS_WEB ? PHONE_H : win.height;

/**
 * Scale factor to fit the full phone (incl. ~16px bezel) into the browser
 * window — used by the device mockup AND by full-screen Modals so nothing
 * overflows a short desktop window. 1 on native.
 */
export const WEB_SCALE = (() => {
  if (!IS_WEB || typeof window === 'undefined') return 1;
  const DEV_W = PHONE_W + 32;
  const DEV_H = PHONE_H + 32;
  const s = Math.min((window.innerHeight * 0.95) / DEV_H, (window.innerWidth * 0.95) / DEV_W);
  return Math.max(0.4, Math.min(s, 2.2));
})();
