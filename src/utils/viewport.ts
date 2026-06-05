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

// Cap to a phone frame on web, but never exceed the actual browser window so
// it still fits inside small/short browser viewports.
export const VIEWPORT_W = IS_WEB ? Math.min(PHONE_W, win.width) : win.width;
export const VIEWPORT_H = IS_WEB ? Math.min(PHONE_H, win.height) : win.height;
