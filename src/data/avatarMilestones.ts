/**
 * avatarMilestones — the learner's evolving status/title, based on level.
 * Purely a title/badge derived from progress — the avatar selection is unchanged.
 */
export interface Milestone {
  level: number;
  title: string;
  emoji: string;
}

export const MILESTONES: Milestone[] = [
  { level: 1, title: 'Beginner', emoji: '🌱' },
  { level: 10, title: 'Confident Speaker', emoji: '🗣️' },
  { level: 20, title: 'Everyday Communicator', emoji: '💬' },
  { level: 40, title: 'Fluent Speaker', emoji: '🎯' },
  { level: 60, title: 'English Champion', emoji: '🏆' },
];

/** The current status for a given level (highest milestone reached). */
export function statusForLevel(level: number): Milestone {
  let cur = MILESTONES[0];
  for (const m of MILESTONES) if (level >= m.level) cur = m;
  return cur;
}

/** A milestone whose threshold is exactly this level (for crossing detection). */
export function milestoneAt(level: number): Milestone | undefined {
  return MILESTONES.find((m) => m.level === level);
}
