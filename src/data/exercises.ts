/**
 * exercises.ts — the 6 exercises every subtopic/level contains.
 * Each subtopic is a "level"; each level is a mini-journey of these 6 exercises.
 */
export interface ExerciseType {
  id: number;
  key: string;
  title: string;
  icon: string;
}

export const exerciseTypes: ExerciseType[] = [
  { id: 1, key: 'vocab', title: 'Vocab', icon: '📘' },
  { id: 2, key: 'read', title: 'Read', icon: '🎧' },
  { id: 3, key: 'grammar', title: 'Grammar', icon: '✍️' },
  { id: 4, key: 'roleplay', title: 'Roleplay', icon: '🎭' },
  { id: 5, key: 'practice', title: 'Practice', icon: '⚡' },
  { id: 6, key: 'speak', title: 'Speak', icon: '🎙️' },
];

export const TOTAL_EXERCISES = exerciseTypes.length;
