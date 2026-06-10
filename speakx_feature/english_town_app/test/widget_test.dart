import 'package:flutter_test/flutter_test.dart';

import 'package:english_town_app/features/english_town/domain/entities/progress.dart';
import 'package:english_town_app/features/english_town/domain/repositories/progress_repository.dart';
import 'package:english_town_app/features/english_town/presentation/cubit/progress_cubit.dart';

/// In-memory fake repo so tests need no shared_preferences / backend.
class _FakeRepo implements ProgressRepository {
  Progress _stored = Progress.initial;
  @override
  Future<Progress> getProgress() async => _stored;
  @override
  Future<Progress> saveProgress(Progress p) async => _stored = p;
}

void main() {
  group('ProgressCubit', () {
    test('load() emits ready with initial progress', () async {
      final cubit = ProgressCubit(_FakeRepo());
      await cubit.load();
      expect(cubit.state.status, ProgressStatus.ready);
      expect(cubit.state.progress.currentId, 1);
      expect(cubit.state.progress.coins, 0);
    });

    test('completeCurrentLesson() advances, completes, and awards coins',
        () async {
      final cubit = ProgressCubit(_FakeRepo());
      await cubit.load();
      await cubit.completeCurrentLesson(coinsPerLevel: 10);

      final p = cubit.state.progress;
      expect(p.completedIds, contains(1));
      expect(p.currentId, 2);
      expect(p.coins, 10);
    });

    test('completing successive lessons accumulates coins', () async {
      final cubit = ProgressCubit(_FakeRepo());
      await cubit.load();
      await cubit.completeCurrentLesson();
      // currentId is now 2; completing again completes lesson 2, not 1 again.
      await cubit.completeCurrentLesson();
      expect(cubit.state.progress.completedIds, [1, 2]);
      expect(cubit.state.progress.coins, 20);
    });
  });
}
