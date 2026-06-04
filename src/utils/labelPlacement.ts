/**
 * labelPlacement — decides WHICH level labels are visible and on WHICH side of
 * the road they sit, so the map stays readable (never all 20 at once).
 *
 * Visible set: the previous level (collapsed if completed), the current level,
 * and the next two locked levels. A label can also be force-revealed (e.g. the
 * last tapped pin). Side defaults to the road gutter OPPOSITE the scene so the
 * card never covers the building; honours a manual `labelSide` override.
 */
import { SUBTOPICS, TOTAL_SUBTOPICS } from '../data/subtopics';
import { locationScenes } from '../data/locationScenes';

export type LabelStatus = 'completed' | 'current' | 'locked';
export type LabelSide = 'left' | 'right';

export interface LabelInfo {
  id: number;
  status: LabelStatus;
  side: LabelSide;
  variant: 'full' | 'compact';
}

const SCENE_SIDE: Record<number, 'left' | 'right' | 'center'> = {};
locationScenes.forEach((s) => { SCENE_SIDE[s.id] = s.side; });

function sideFor(id: number): LabelSide {
  const manual = SUBTOPICS[id - 1]?.labelSide;
  if (manual === 'left' || manual === 'right') return manual;
  const scene = SCENE_SIDE[id];
  if (scene === 'left') return 'right';
  if (scene === 'right') return 'left';
  return id % 2 === 0 ? 'right' : 'left'; // centre scene → alternate by parity
}

function statusOf(id: number, currentId: number, completed: number[]): LabelStatus {
  if (completed.includes(id)) return 'completed';
  if (id === currentId) return 'current';
  return 'locked';
}

/**
 * Focused label set: the previous level (collapsed/compact if completed), the
 * current level (full, prominent), and the next locked level. Everything else
 * is hidden to keep the screen clean.
 */
export function visibleLabels(currentId: number, completed: number[]): LabelInfo[] {
  const ids: number[] = [];
  if (currentId - 1 >= 1) ids.push(currentId - 1);
  ids.push(currentId);
  if (currentId + 1 <= TOTAL_SUBTOPICS) ids.push(currentId + 1);
  return ids.map((id) => {
    const status = statusOf(id, currentId, completed);
    return {
      id,
      status,
      side: sideFor(id),
      variant: status === 'completed' ? 'compact' : 'full',
    } as LabelInfo;
  });
}
