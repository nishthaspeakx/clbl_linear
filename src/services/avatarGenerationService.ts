/**
 * avatarGenerationService — turns a user photo/selfie into a game-style avatar.
 *
 * WHAT IT DOES NOW (prototype, no backend / no external API):
 *  - `pickPhoto()` opens the device file picker (web) so the learner uploads a
 *    real photo or captures a selfie.
 *  - `generateAvatarFromPhoto()` runs a lightweight, fully client-side
 *    "cartoonify" pass (square crop → saturate → posterize → outline edges) so
 *    the result genuinely looks like a caricature of the uploaded photo.
 *
 * ── FUTURE INTEGRATION ──────────────────────────────────────────────────────
 * Replace `stylizeToCaricature` (or the whole body of `generateAvatarFromPhoto`)
 * with a call to an AI image-generation API (selfie → stylised game avatar):
 *   1. upload `photoUri` to the model endpoint,
 *   2. await the generated avatar image URL,
 *   3. return it as `imageUri`.
 * The call sites already handle the async + "Creating your game avatar…" state,
 * so no UI changes are needed when the real API lands.
 * ────────────────────────────────────────────────────────────────────────────
 */
import { AvatarSelection } from '../storage/avatarStorage';
import { IS_WEB } from '../utils/viewport';

export interface GeneratedAvatar {
  /** Source photo/selfie the avatar was generated from. */
  sourceUri: string;
  /**
   * Generated caricature image (data URL). Null only if stylisation could not
   * run (e.g. native, where a real picker/model isn't wired yet) — callers then
   * fall back to the parametric persona avatar.
   */
  imageUri: string | null;
  /** Persona used as the base / fallback. */
  profile: AvatarSelection;
}

/** Small floor on the loading state so "Creating…" is actually visible. */
export const GENERATION_DELAY_MS = 1400;

/**
 * Open the system file picker and return the chosen image as a data URL.
 * `source: 'selfie'` hints the front camera on mobile browsers.
 * Resolves to null if the user cancels (or on platforms without a web picker).
 */
export function pickPhoto(source: 'upload' | 'selfie' = 'upload'): Promise<string | null> {
  if (!IS_WEB || typeof document === 'undefined') {
    // NATIVE: wire expo-image-picker here later. Prototype is web-first.
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (source === 'selfie') input.setAttribute('capture', 'user');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    let settled = false;
    const done = (v: string | null) => { if (!settled) { settled = true; resolve(v); input.remove(); } };
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return done(null);
      const reader = new FileReader();
      reader.onload = () => done(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => done(null);
      reader.readAsDataURL(file);
    };
    // If the dialog is dismissed without a selection, resolve null on refocus.
    const onFocus = () => setTimeout(() => { if (!input.files || !input.files.length) done(null); window.removeEventListener('focus', onFocus); }, 400);
    window.addEventListener('focus', onFocus);
    document.body.appendChild(input);
    input.click();
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new (window as any).Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const clamp255 = (n: number) => (n < 0 ? 0 : n > 255 ? 255 : n);

/**
 * Client-side "cartoonify": center-crop to square, boost saturation/contrast,
 * posterize colours into flat bands, then darken edges for a hand-drawn outline.
 * Returns a JPEG data URL. Web only.
 */
async function stylizeToCaricature(src: string): Promise<string | null> {
  if (!IS_WEB || typeof document === 'undefined') return null;
  try {
    const img = await loadImage(src);
    const SIZE = 384;
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // center-crop to a square then draw (smooths slightly on rescale)
    const s = Math.min(img.width, img.height) || SIZE;
    const sx = (img.width - s) / 2;
    const sy = (img.height - s) / 2;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, sx, sy, s, s, 0, 0, SIZE, SIZE);

    const id = ctx.getImageData(0, 0, SIZE, SIZE);
    const d = id.data;

    const levels = 6;
    const step = 255 / (levels - 1);
    const sat = 1.4;   // saturation boost
    const con = 1.12;  // contrast
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i], g = d[i + 1], b = d[i + 2];
      const avg = (r + g + b) / 3;
      r = avg + (r - avg) * sat;
      g = avg + (g - avg) * sat;
      b = avg + (b - avg) * sat;
      r = (r - 128) * con + 128;
      g = (g - 128) * con + 128;
      b = (b - 128) * con + 128;
      r = Math.round(r / step) * step;
      g = Math.round(g / step) * step;
      b = Math.round(b / step) * step;
      d[i] = clamp255(r);
      d[i + 1] = clamp255(g);
      d[i + 2] = clamp255(b);
    }

    // edge outline pass (Sobel-ish) for a drawn, comic look
    const lum = new Float32Array(SIZE * SIZE);
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      lum[p] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    }
    for (let y = 1; y < SIZE - 1; y++) {
      for (let x = 1; x < SIZE - 1; x++) {
        const p = y * SIZE + x;
        const gx = lum[p - 1] - lum[p + 1];
        const gy = lum[p - SIZE] - lum[p + SIZE];
        const mag = Math.sqrt(gx * gx + gy * gy);
        if (mag > 38) {
          const i = p * 4;
          const k = 0.32;
          d[i] *= k; d[i + 1] *= k; d[i + 2] *= k;
        }
      }
    }

    ctx.putImageData(id, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.92);
  } catch {
    return null;
  }
}

/**
 * Generate a game-style caricature avatar from a photo.
 *
 * @param photoUri    Data URL of the uploaded photo / captured selfie.
 * @param userProfile The learner's selected persona (used as a fallback).
 */
export async function generateAvatarFromPhoto(
  photoUri: string,
  userProfile: AvatarSelection
): Promise<GeneratedAvatar> {
  // FUTURE: swap stylizeToCaricature for a real selfie→avatar AI API call.
  const [imageUri] = await Promise.all([
    stylizeToCaricature(photoUri),
    new Promise((r) => setTimeout(r, GENERATION_DELAY_MS)), // keep the loading state visible
  ]);

  return {
    sourceUri: photoUri,
    imageUri, // the cartoonified caricature (null → caller uses persona fallback)
    profile: userProfile,
  };
}
