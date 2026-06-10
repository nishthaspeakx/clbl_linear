/// First 20 lessons of the vertical "English Town Journey" (ported from
/// src/data/subtopics.ts). Bottom → top: lesson 1 at yPercent≈95.
class Subtopic {
  final int id;
  final String topic;
  final String title;
  final String location;
  final double xPercent;
  final double yPercent;
  final int topicIndex;

  const Subtopic({
    required this.id,
    required this.topic,
    required this.title,
    required this.location,
    required this.xPercent,
    required this.yPercent,
    required this.topicIndex,
  });
}

const List<Subtopic> kSubtopics = [
  Subtopic(id: 1, topic: 'Everyday Life', title: 'Meet & Greet New People', location: 'Town Square', xPercent: 57, yPercent: 95, topicIndex: 1),
  Subtopic(id: 2, topic: 'Everyday Life', title: 'Talk about Yourself', location: 'Park', xPercent: 56.3, yPercent: 90.3, topicIndex: 1),
  Subtopic(id: 3, topic: 'Everyday Life', title: 'Make New Friends', location: 'Cafe Corner', xPercent: 57.8, yPercent: 85.5, topicIndex: 1),
  Subtopic(id: 4, topic: 'Everyday Life', title: 'Say "Thank You"', location: 'Gift Shop', xPercent: 53.4, yPercent: 80.8, topicIndex: 1),
  Subtopic(id: 5, topic: 'Everyday Life', title: 'Discuss Daily Routine', location: 'Home', xPercent: 46.5, yPercent: 76.1, topicIndex: 1),
  Subtopic(id: 6, topic: 'Everyday Life', title: 'Say "Please" & "Excuse Me"', location: 'Bus Stop', xPercent: 42.2, yPercent: 71.3, topicIndex: 1),
  Subtopic(id: 7, topic: 'Everyday Life', title: 'Saying "Goodbye"', location: 'Town Gate', xPercent: 43.8, yPercent: 66.6, topicIndex: 1),
  Subtopic(id: 8, topic: 'My Family', title: 'Talk to Father', location: 'Home - Living Room', xPercent: 50.1, yPercent: 61.8, topicIndex: 2),
  Subtopic(id: 9, topic: 'My Family', title: 'Talk to Mom', location: 'Home - Kitchen', xPercent: 56.3, yPercent: 57.1, topicIndex: 2),
  Subtopic(id: 10, topic: 'My Family', title: 'Plan a Trip with Sibling', location: 'Home - Bedroom', xPercent: 57.8, yPercent: 52.4, topicIndex: 2),
  Subtopic(id: 11, topic: 'My Family', title: 'Say "Sorry"', location: 'Home - Doorway', xPercent: 53.3, yPercent: 47.6, topicIndex: 2),
  Subtopic(id: 12, topic: 'My Family', title: 'Talk at Dinner', location: 'Home - Dining Table', xPercent: 46.3, yPercent: 42.9, topicIndex: 2),
  Subtopic(id: 13, topic: 'My Family', title: 'Visiting a Park', location: 'Neighbourhood Park', xPercent: 42.2, yPercent: 38.2, topicIndex: 2),
  Subtopic(id: 14, topic: 'My Family', title: 'Ask for Help from Relative', location: 'Home - Balcony', xPercent: 43.9, yPercent: 33.4, topicIndex: 2),
  Subtopic(id: 15, topic: 'Talk at Restaurant', title: 'Make a booking', location: 'Restaurant - Host Desk', xPercent: 50.3, yPercent: 28.7, topicIndex: 3),
  Subtopic(id: 16, topic: 'Talk at Restaurant', title: 'Arriving at the restaurant', location: 'Restaurant - Entrance', xPercent: 56.4, yPercent: 23.9, topicIndex: 3),
  Subtopic(id: 17, topic: 'Talk at Restaurant', title: 'Asking for the menu', location: 'Restaurant - Table (Menu)', xPercent: 57.7, yPercent: 19.2, topicIndex: 3),
  Subtopic(id: 18, topic: 'Talk at Restaurant', title: 'Order food & drinks', location: 'Restaurant - Table (Ordering)', xPercent: 53.2, yPercent: 14.5, topicIndex: 3),
  Subtopic(id: 19, topic: 'Talk at Restaurant', title: 'Asking for bill', location: 'Restaurant - Billing Counter', xPercent: 46.2, yPercent: 9.7, topicIndex: 3),
  Subtopic(id: 20, topic: 'Talk at Restaurant', title: 'Feedback before leaving', location: 'Restaurant - Exit', xPercent: 42.1, yPercent: 5, topicIndex: 3),
];

const int kTotalSubtopics = 20; // == kSubtopics.length

/// Location emoji stand-in for the rich per-scene SVG art (deferred to the
/// scenes migration task). Keeps the world readable as a town.
String locationEmoji(String location) {
  final l = location.toLowerCase();
  if (l.contains('square')) return '🏛️';
  if (l.contains('park')) return '🌳';
  if (l.contains('cafe')) return '☕';
  if (l.contains('gift')) return '🎁';
  if (l.contains('bus')) return '🚌';
  if (l.contains('gate')) return '🚪';
  if (l.contains('living')) return '🛋️';
  if (l.contains('kitchen')) return '🍳';
  if (l.contains('bedroom')) return '🛏️';
  if (l.contains('doorway')) return '🚪';
  if (l.contains('dining')) return '🍽️';
  if (l.contains('balcony')) return '🪟';
  if (l.contains('restaurant')) return '🍴';
  if (l.contains('home')) return '🏠';
  return '📍';
}
