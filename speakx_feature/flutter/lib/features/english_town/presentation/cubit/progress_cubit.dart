import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../domain/entities/progress.dart';
import '../../domain/repositories/progress_repository.dart';

part 'progress_state.dart';

class ProgressCubit extends Cubit<ProgressState> {
  final ProgressRepository _repo;

  ProgressCubit(this._repo) : super(const ProgressState());

  Future<void> load() async {
    emit(state.copyWith(status: ProgressStatus.loading));
    try {
      final p = await _repo.getProgress();
      emit(state.copyWith(status: ProgressStatus.ready, progress: p));
    } catch (e) {
      emit(state.copyWith(status: ProgressStatus.error, error: e.toString()));
    }
  }

  /// Mark the current lesson complete, advance, and award coins.
  /// (Equivalent of the prototype's completion flow; see COINS_PER_LEVEL.)
  Future<void> completeCurrentLesson({int coinsPerLevel = 10}) async {
    final p = state.progress;
    if (p.completedIds.contains(p.currentId)) return;

    final updated = p.copyWith(
      completedIds: [...p.completedIds, p.currentId],
      currentId: p.currentId + 1,
      coins: p.coins + coinsPerLevel,
    );

    // Optimistic update, then persist.
    emit(state.copyWith(progress: updated));
    try {
      final saved = await _repo.saveProgress(updated);
      emit(state.copyWith(status: ProgressStatus.ready, progress: saved));
    } catch (e) {
      // Roll back on failure.
      emit(state.copyWith(
          status: ProgressStatus.error, progress: p, error: e.toString()));
    }
  }
}
