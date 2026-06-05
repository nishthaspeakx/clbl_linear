/**
 * dreamHomePlacementStorage — the persistence API for Dream Home placements
 * used by the decoration editor. Placements are stored as image-percentage
 * coordinates plus scale + rotation (see PlacedItem) so they survive resizes,
 * zoom, and app restarts.
 *
 * This is a thin, intention-revealing facade over dreamHomeLayoutStorage (the
 * single source of truth) so the editor imports a placement-focused module.
 */
export * from './dreamHomeLayoutStorage';
