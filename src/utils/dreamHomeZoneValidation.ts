/**
 * dreamHomeZoneValidation — placement bounds for the Dream Home editor.
 *
 * Prototype rule: items can be placed ANYWHERE on the canvas (no category/zone
 * restrictions, no error toasts). The only guard is a boundary clamp so an item
 * can never end up fully outside the Dream Home image — positions stay within
 * 0–100% of the image.
 */
export function clampToCanvas(xPercent: number, yPercent: number): { xPercent: number; yPercent: number } {
  return {
    xPercent: Math.min(100, Math.max(0, xPercent)),
    yPercent: Math.min(100, Math.max(0, yPercent)),
  };
}
