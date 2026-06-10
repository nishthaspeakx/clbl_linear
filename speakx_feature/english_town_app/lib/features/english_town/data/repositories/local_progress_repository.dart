import '../../domain/entities/progress.dart';
import '../../domain/repositories/progress_repository.dart';
import '../datasources/progress_local_datasource.dart';

/// Local-only repository for the standalone runnable build (no backend yet).
///
/// Implements the SAME [ProgressRepository] contract the production gRPC repo
/// will, so swapping to the server later is a one-line DI change — the UI and
/// Cubit don't change. Mirrors the prototype's AsyncStorage behaviour.
class LocalProgressRepository implements ProgressRepository {
  final ProgressLocalDataSource local;

  LocalProgressRepository(this.local);

  @override
  Future<Progress> getProgress() async {
    return local.read() ?? Progress.initial;
  }

  @override
  Future<Progress> saveProgress(Progress progress) async {
    await local.write(progress);
    return progress;
  }
}
