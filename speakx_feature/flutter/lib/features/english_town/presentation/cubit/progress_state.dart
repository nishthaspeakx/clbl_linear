part of 'progress_cubit.dart';

enum ProgressStatus { initial, loading, ready, error }

class ProgressState extends Equatable {
  final ProgressStatus status;
  final Progress progress;
  final String? error;

  const ProgressState({
    this.status = ProgressStatus.initial,
    this.progress = Progress.initial,
    this.error,
  });

  ProgressState copyWith({
    ProgressStatus? status,
    Progress? progress,
    String? error,
  }) {
    return ProgressState(
      status: status ?? this.status,
      progress: progress ?? this.progress,
      error: error,
    );
  }

  @override
  List<Object?> get props => [status, progress, error];
}
