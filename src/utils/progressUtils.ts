/**
 * progressUtils.ts — per-TOPIC progress helpers.
 *
 * Levels are grouped by topic (from the CSV). The top header and progress bar
 * show progress for the CURRENT lesson's topic only (e.g. "Everyday Life 1/7"),
 * and each subtopic is shown as a "Level N" within its topic.
 */
import { SUBTOPICS } from '../data/subtopics';
import { topicZoneOf, TopicZone } from '../data/topicZones';

export interface TopicProgress {
  zone: TopicZone;
  completed: number; // levels completed in this topic
  total: number; // total levels in this topic
}

/** All lessons belonging to a topic, in order. */
function levelsOfTopic(topicIndex: number) {
  return SUBTOPICS.filter((s) => s.topicIndex === topicIndex);
}

/** 1-based level number of a lesson WITHIN its topic (each topic restarts at 1). */
export function levelInTopic(id: number): number {
  const s = SUBTOPICS[id - 1];
  return levelsOfTopic(s.topicIndex).findIndex((l) => l.id === id) + 1;
}

/** Progress for the topic that `currentId` belongs to. */
export function topicProgress(currentId: number, completedIds: number[]): TopicProgress {
  const s = SUBTOPICS[currentId - 1];
  const levels = levelsOfTopic(s.topicIndex);
  return {
    zone: topicZoneOf(s.topicIndex),
    total: levels.length,
    completed: levels.filter((l) => completedIds.includes(l.id)).length,
  };
}
