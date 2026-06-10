import 'package:equatable/equatable.dart';

/// Domain entity for a learner's English Town progress.
///
/// Mirrors the prototype's `Progress` shape (src/storage/progressStorage.ts)
/// so the migration is 1:1: { currentId, completedIds, coins }.
class Progress extends Equatable {
  /// id of the lesson the learner is currently on (1-based).
  final int currentId;

  /// ids of lessons already completed.
  final List<int> completedIds;

  /// running coin total.
  final int coins;

  const Progress({
    required this.currentId,
    required this.completedIds,
    required this.coins,
  });

  static const Progress initial = Progress(
    currentId: 1,
    completedIds: [],
    coins: 0,
  );

  /// Total lessons completed across all topics.
  int get completedCount => completedIds.length;

  bool isTownCompleted(int totalSubtopics) =>
      completedIds.length >= totalSubtopics;

  Progress copyWith({int? currentId, List<int>? completedIds, int? coins}) {
    return Progress(
      currentId: currentId ?? this.currentId,
      completedIds: completedIds ?? this.completedIds,
      coins: coins ?? this.coins,
    );
  }

  @override
  List<Object?> get props => [currentId, completedIds, coins];
}
