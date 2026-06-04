/**
 * Subtopic data — first 20 lessons of the vertical isometric "English Town Journey".
 * Bottom → top: lesson 1 at yPercent≈95 (bottom), lesson 20 at yPercent≈5 (top).
 * xPercent winds gently so pins stay on the road; the rich per-location scene for
 * each pin lives in src/data/locationScenes.ts and src/components/LocationScene.tsx.
 */
export interface Subtopic {
  id: number;
  topic: string;
  title: string;
  location: string;
  xPercent: number;
  yPercent: number;
  visualObject: string;
  topicIndex: number;
  /** Optional manual label placement overrides (auto-computed if omitted). */
  labelSide?: 'left' | 'right' | 'top' | 'bottom';
  labelOffsetX?: number;
  labelOffsetY?: number;
}

export const SUBTOPICS: Subtopic[] = [
  { id: 1, topic: 'Everyday Life', title: 'Meet & Greet New People', location: 'Town Square', xPercent: 57, yPercent: 95, visualObject: 'town_square', topicIndex: 1, labelSide: 'right' },
  { id: 2, topic: 'Everyday Life', title: 'Talk about Yourself', location: 'Park', xPercent: 56.3, yPercent: 90.3, visualObject: 'park', topicIndex: 1 },
  { id: 3, topic: 'Everyday Life', title: 'Make New Friends', location: 'Cafe Corner', xPercent: 57.8, yPercent: 85.5, visualObject: 'cafe_corner', topicIndex: 1 },
  { id: 4, topic: 'Everyday Life', title: 'Say "Thank You"', location: 'Gift Shop', xPercent: 53.4, yPercent: 80.8, visualObject: 'gift_shop', topicIndex: 1 },
  { id: 5, topic: 'Everyday Life', title: 'Discuss Daily Routine', location: 'Home', xPercent: 46.5, yPercent: 76.1, visualObject: 'home_routine', topicIndex: 1 },
  { id: 6, topic: 'Everyday Life', title: 'Say "Please" & "Excuse Me"', location: 'Bus Stop', xPercent: 42.2, yPercent: 71.3, visualObject: 'bus_stop', topicIndex: 1 },
  { id: 7, topic: 'Everyday Life', title: 'Saying "Goodbye"', location: 'Town Gate', xPercent: 43.8, yPercent: 66.6, visualObject: 'town_gate', topicIndex: 1 },
  { id: 8, topic: 'My Family', title: 'Talk to Father', location: 'Home - Living Room', xPercent: 50.1, yPercent: 61.8, visualObject: 'living_room', topicIndex: 2 },
  { id: 9, topic: 'My Family', title: 'Talk to Mom', location: 'Home - Kitchen', xPercent: 56.3, yPercent: 57.1, visualObject: 'kitchen', topicIndex: 2 },
  { id: 10, topic: 'My Family', title: 'Plan a Trip with Sibling', location: 'Home - Bedroom', xPercent: 57.8, yPercent: 52.4, visualObject: 'bedroom_trip', topicIndex: 2 },
  { id: 11, topic: 'My Family', title: 'Say "Sorry"', location: 'Home - Doorway', xPercent: 53.3, yPercent: 47.6, visualObject: 'doorway_sorry', topicIndex: 2 },
  { id: 12, topic: 'My Family', title: 'Talk at Dinner', location: 'Home - Dining Table', xPercent: 46.3, yPercent: 42.9, visualObject: 'dining_table', topicIndex: 2 },
  { id: 13, topic: 'My Family', title: 'Visiting a Park', location: 'Neighbourhood Park', xPercent: 42.2, yPercent: 38.2, visualObject: 'neighbourhood_park', topicIndex: 2 },
  { id: 14, topic: 'My Family', title: 'Ask for Help from Relative', location: 'Home - Balcony', xPercent: 43.9, yPercent: 33.4, visualObject: 'balcony', topicIndex: 2 },
  { id: 15, topic: 'Talk at Restaurant', title: 'Make a booking', location: 'Restaurant - Host Desk', xPercent: 50.3, yPercent: 28.7, visualObject: 'restaurant_host', topicIndex: 3 },
  { id: 16, topic: 'Talk at Restaurant', title: 'Arriving at the restaurant', location: 'Restaurant - Entrance', xPercent: 56.4, yPercent: 23.9, visualObject: 'restaurant_entrance', topicIndex: 3 },
  { id: 17, topic: 'Talk at Restaurant', title: 'Asking for the menu', location: 'Restaurant - Table (Menu)', xPercent: 57.7, yPercent: 19.2, visualObject: 'restaurant_menu', topicIndex: 3 },
  { id: 18, topic: 'Talk at Restaurant', title: 'Order food & drinks', location: 'Restaurant - Table (Ordering)', xPercent: 53.2, yPercent: 14.5, visualObject: 'restaurant_ordering', topicIndex: 3 },
  { id: 19, topic: 'Talk at Restaurant', title: 'Asking for bill', location: 'Restaurant - Billing Counter', xPercent: 46.2, yPercent: 9.7, visualObject: 'restaurant_billing', topicIndex: 3 },
  { id: 20, topic: 'Talk at Restaurant', title: 'Feedback before leaving', location: 'Restaurant - Exit', xPercent: 42.1, yPercent: 5, visualObject: 'restaurant_exit', topicIndex: 3 },
];

export const TOTAL_SUBTOPICS = SUBTOPICS.length;
