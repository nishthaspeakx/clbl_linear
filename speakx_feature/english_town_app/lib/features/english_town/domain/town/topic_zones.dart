import 'package:flutter/material.dart';

/// Visual theme per TOPIC zone in the vertical journey (ported from
/// src/data/topicZones.ts). Only the 3 topics present in the first 20 lessons
/// are exercised, but all are included.
class TopicZone {
  final int index;
  final String name;
  final String emoji;
  final Color groundTop;
  final Color groundBottom;
  final Color accent;

  const TopicZone({
    required this.index,
    required this.name,
    required this.emoji,
    required this.groundTop,
    required this.groundBottom,
    required this.accent,
  });
}

const List<TopicZone> kTopicZones = [
  TopicZone(index: 1, name: 'Everyday Life', emoji: '🏛️', groundTop: Color(0xFFE8F3DC), groundBottom: Color(0xFFD6E9C4), accent: Color(0xFF5BA64E)),
  TopicZone(index: 2, name: 'My Family', emoji: '🏠', groundTop: Color(0xFFFBEFE0), groundBottom: Color(0xFFF6E0C6), accent: Color(0xFFE2904F)),
  TopicZone(index: 3, name: 'Talk at Restaurant', emoji: '🍽️', groundTop: Color(0xFFFAEBE2), groundBottom: Color(0xFFF4D8C7), accent: Color(0xFFD9714A)),
  TopicZone(index: 4, name: 'Talk to Friends', emoji: '🎬', groundTop: Color(0xFFF1ECFA), groundBottom: Color(0xFFE2D6F3), accent: Color(0xFF9168C9)),
  TopicZone(index: 5, name: 'Travel', emoji: '🧭', groundTop: Color(0xFFE4F1F2), groundBottom: Color(0xFFCDE6E6), accent: Color(0xFF3FA39B)),
];

TopicZone topicZoneOf(int topicIndex) => kTopicZones[topicIndex - 1];
