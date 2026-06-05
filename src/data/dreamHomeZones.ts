/**
 * dreamHomeZones — logical placement zones on the Dream Home image.
 *
 * Coordinates are percentages (0–100) of the rendered house image. Zones are
 * used for (a) debug-mode overlays that visualise where each category belongs
 * and (b) documenting/clamping placements. They are NOT shown in normal mode.
 */
export interface ZoneBounds { xMin: number; xMax: number; yMin: number; yMax: number; }
export interface DreamZone { name: string; bounds: ZoneBounds; }

export const dreamHomeZones: Record<string, DreamZone> = {
  garden: { name: 'Garden', bounds: { xMin: 4, xMax: 45, yMin: 55, yMax: 96 } },
  backyard: { name: 'Backyard', bounds: { xMin: 82, xMax: 100, yMin: 58, yMax: 96 } },
  interior: { name: 'House', bounds: { xMin: 46, xMax: 96, yMin: 22, yMax: 68 } },
  driveway: { name: 'Driveway', bounds: { xMin: 6, xMax: 34, yMin: 46, yMax: 74 } },
  porch: { name: 'Porch', bounds: { xMin: 34, xMax: 52, yMin: 66, yMax: 84 } },
};
