/**
 * topicZones.ts
 *
 * Visual theme for each of the 10 TOPICS (not "districts"). Each topic becomes
 * one isometric town zone in the vertical journey, with its own pastel ground
 * tint, accent colour and a small integrated topic banner.
 *
 * Topic names come straight from the CSV `topic` column.
 */
export interface TopicZone {
  index: number; // 1-based, matches Subtopic.topicIndex
  name: string;
  emoji: string;
  /** Ground tint (the grass / land), kept soft and varied — never plain green. */
  groundTop: string;
  groundBottom: string;
  accent: string;
}

export const TOPIC_ZONES: TopicZone[] = [
  { index: 1, name: 'Everyday Life', emoji: '🏛️', groundTop: '#E8F3DC', groundBottom: '#D6E9C4', accent: '#5BA64E' },
  { index: 2, name: 'My Family', emoji: '🏠', groundTop: '#FBEFE0', groundBottom: '#F6E0C6', accent: '#E2904F' },
  { index: 3, name: 'Talk at Restaurant', emoji: '🍽️', groundTop: '#FaEbe2', groundBottom: '#F4D8C7', accent: '#D9714A' },
  { index: 4, name: 'Talk to Friends', emoji: '🎬', groundTop: '#F1ECFA', groundBottom: '#E2D6F3', accent: '#9168C9' },
  { index: 5, name: 'Travel', emoji: '🧭', groundTop: '#E4F1F2', groundBottom: '#CDE6E6', accent: '#3FA39B' },
  { index: 6, name: 'At Work', emoji: '🏢', groundTop: '#E9EDF6', groundBottom: '#D7DEEE', accent: '#5C6BC0' },
  { index: 7, name: 'Shopping', emoji: '🛍️', groundTop: '#FBF1DE', groundBottom: '#F6E3BE', accent: '#E0A526' },
  { index: 8, name: 'Social Interactions', emoji: '🎉', groundTop: '#FCEDF3', groundBottom: '#F7D7E5', accent: '#E0699A' },
  { index: 9, name: 'At the Hotel', emoji: '🏨', groundTop: '#ECE9F6', groundBottom: '#DBD4EF', accent: '#7E6BD0' },
  { index: 10, name: 'At the Airport', emoji: '✈️', groundTop: '#E6F2FA', groundBottom: '#CCE6F6', accent: '#3FA0D8' },
];

export function topicZoneOf(topicIndex: number): TopicZone {
  return TOPIC_ZONES[topicIndex - 1];
}
