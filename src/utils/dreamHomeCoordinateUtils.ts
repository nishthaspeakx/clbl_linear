/**
 * dreamHomeCoordinateUtils — convert between screen pixels and image-relative
 * percentages, and compute safe pan boundaries for the zoomable canvas.
 *
 * Positions are stored as PERCENTAGES (0–100) of the base (un-zoomed) image so
 * they stay correct at any render size or zoom level. Items are bottom-centre
 * anchored: xPercent is the horizontal centre, yPercent is the ground line.
 */
export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export function pxToPercent(px: number, dim: number): number {
  return dim > 0 ? (px / dim) * 100 : 0;
}

export function percentToPx(pct: number, dim: number): number {
  return (pct / 100) * dim;
}

export function clampPercent(p: number): number {
  return clamp(p, 0, 100);
}

/**
 * Max |translate| (px) so a `scale`-zoomed canvas of size `viewport` never
 * reveals empty space past its edges. 0 when not zoomed in.
 */
export function maxTranslate(viewport: number, scale: number): number {
  return Math.max(0, (viewport * scale - viewport) / 2);
}

/** Bottom-centre anchored top-left pixel for an item of `size` px. */
export function anchorTopLeft(xPercent: number, yPercent: number, baseW: number, baseH: number, size: number) {
  return {
    left: percentToPx(xPercent, baseW) - size / 2,
    top: percentToPx(yPercent, baseH) - size,
  };
}
