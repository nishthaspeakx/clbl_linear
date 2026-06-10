import '../entities/progress.dart';

/// Repository contract for English Town progress.
/// The presentation layer (Cubit) depends on this, not on gRPC/Mongo details.
abstract class ProgressRepository {
  Future<Progress> getProgress();
  Future<Progress> saveProgress(Progress progress);
}
