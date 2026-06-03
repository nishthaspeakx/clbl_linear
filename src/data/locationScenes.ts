/**
 * locationScenes.ts
 *
 * One rich isometric SCENE per lesson (first 20). `sceneType` selects the
 * dedicated component in src/components/LocationScene.tsx; `side` decides which
 * gutter of the road the scene sits in ('center' straddles the road, e.g. the
 * town gate). `yPosition` mirrors the lesson's yPercent for reference.
 */
export type SceneSide = 'left' | 'right' | 'center';

export interface LocationScene {
  id: number;
  topic: string;
  title: string;
  location: string;
  sceneType: string;
  description: string;
  side: SceneSide;
  yPosition: number;
}

export const locationScenes: LocationScene[] = [
  { id: 1, topic: 'Everyday Life', title: 'Meet & Greet New People', location: 'Town Square', sceneType: 'town_square', description: 'Town square plaza with fountain, benches, lamp posts and people greeting', side: 'center', yPosition: 95 },
  { id: 2, topic: 'Everyday Life', title: 'Talk about Yourself', location: 'Park', sceneType: 'park', description: 'Park corner with bench, trees, path; one person sitting, another listening', side: 'right', yPosition: 90.3 },
  { id: 3, topic: 'Everyday Life', title: 'Make New Friends', location: 'Cafe Corner', sceneType: 'cafe_corner', description: 'Outdoor cafe with round tables, chairs, coffee cups, two people chatting', side: 'left', yPosition: 85.5 },
  { id: 4, topic: 'Everyday Life', title: 'Say "Thank You"', location: 'Gift Shop', sceneType: 'gift_shop', description: 'Gift shop with colourful boxes, ribbons, counter, shopkeeper with a gift bag', side: 'right', yPosition: 80.8 },
  { id: 5, topic: 'Everyday Life', title: 'Discuss Daily Routine', location: 'Home', sceneType: 'home_routine', description: 'Home cutaway: bed, clock, breakfast table, calendar', side: 'left', yPosition: 76.1 },
  { id: 6, topic: 'Everyday Life', title: 'Say "Please" & "Excuse Me"', location: 'Bus Stop', sceneType: 'bus_stop', description: 'Bus stop with shelter, signboard, bus lane, a small queue', side: 'right', yPosition: 71.3 },
  { id: 7, topic: 'Everyday Life', title: 'Saying "Goodbye"', location: 'Town Gate', sceneType: 'town_gate', description: 'Town exit gate "English Town", road continuing up, person waving', side: 'center', yPosition: 66.6 },
  { id: 8, topic: 'My Family', title: 'Talk to Father', location: 'Home - Living Room', sceneType: 'living_room', description: 'Living room cutaway: sofa, table, TV; father seated, learner talking', side: 'left', yPosition: 61.8 },
  { id: 9, topic: 'My Family', title: 'Talk to Mom', location: 'Home - Kitchen', sceneType: 'kitchen', description: 'Kitchen: counter, utensils, fridge; mom cooking, learner speaking', side: 'right', yPosition: 57.1 },
  { id: 10, topic: 'My Family', title: 'Plan a Trip with Sibling', location: 'Home - Bedroom', sceneType: 'bedroom_trip', description: 'Bedroom with map, suitcase; sibling and learner planning a trip', side: 'left', yPosition: 52.4 },
  { id: 11, topic: 'My Family', title: 'Say "Sorry"', location: 'Home - Doorway', sceneType: 'doorway_sorry', description: 'Home doorway, shoes by the door, one person apologising', side: 'right', yPosition: 47.6 },
  { id: 12, topic: 'My Family', title: 'Talk at Dinner', location: 'Home - Dining Table', sceneType: 'dining_table', description: 'Dining table with plates and bowls; family seated, learner speaking', side: 'left', yPosition: 42.9 },
  { id: 13, topic: 'My Family', title: 'Visiting a Park', location: 'Neighbourhood Park', sceneType: 'neighbourhood_park', description: 'Family park with swings, track, picnic mat, trees and flowers', side: 'right', yPosition: 38.2 },
  { id: 14, topic: 'My Family', title: 'Ask for Help from Relative', location: 'Home - Balcony', sceneType: 'balcony', description: 'Balcony with railing and plants; relative standing, learner asking for help', side: 'left', yPosition: 33.4 },
  { id: 15, topic: 'Talk at Restaurant', title: 'Make a booking', location: 'Restaurant - Host Desk', sceneType: 'restaurant_host', description: 'Host desk with booking register, "Reservation" sign, elegant entrance', side: 'right', yPosition: 28.7 },
  { id: 16, topic: 'Talk at Restaurant', title: 'Arriving at the restaurant', location: 'Restaurant - Entrance', sceneType: 'restaurant_entrance', description: 'Restaurant entrance, welcome mat, glass door, waiter greeting, warm lights', side: 'left', yPosition: 23.9 },
  { id: 17, topic: 'Talk at Restaurant', title: 'Asking for the menu', location: 'Restaurant - Table (Menu)', sceneType: 'restaurant_menu', description: 'Table with open menu card, waiter giving menu, plates and water', side: 'right', yPosition: 19.2 },
  { id: 18, topic: 'Talk at Restaurant', title: 'Order food & drinks', location: 'Restaurant - Table (Ordering)', sceneType: 'restaurant_ordering', description: 'Table; waiter taking order on a notepad, drinks and food', side: 'left', yPosition: 14.5 },
  { id: 19, topic: 'Talk at Restaurant', title: 'Asking for bill', location: 'Restaurant - Billing Counter', sceneType: 'restaurant_billing', description: 'Billing counter with cashier, bill folder, card machine', side: 'right', yPosition: 9.7 },
  { id: 20, topic: 'Talk at Restaurant', title: 'Feedback before leaving', location: 'Restaurant - Exit', sceneType: 'restaurant_exit', description: 'Restaurant exit with feedback stand, smiling waiter, learner leaving', side: 'left', yPosition: 5 },
];

export function sceneOf(id: number): LocationScene {
  return locationScenes[id - 1];
}
