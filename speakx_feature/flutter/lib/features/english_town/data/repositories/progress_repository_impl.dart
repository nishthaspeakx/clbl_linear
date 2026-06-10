import '../../domain/entities/progress.dart';
import '../../domain/repositories/progress_repository.dart';
import '../datasources/progress_local_datasource.dart';
import '../datasources/progress_remote_datasource.dart';

/// Server-authoritative with a local cache:
///  - reads return cached value immediately if present, then refresh in caller;
///  - writes go to the server, then update the cache.
class ProgressRepositoryImpl implements ProgressRepository {
  final ProgressRemoteDataSource remote;
  final ProgressLocalDataSource local;

  ProgressRepositoryImpl({required this.remote, required this.local});

  @override
  Future<Progress> getProgress() async {
    try {
      final fresh = await remote.getProgress();
      await local.write(fresh);
      return fresh;
    } catch (_) {
      // Offline / transient failure: fall back to cache, else initial.
      return local.read() ?? Progress.initial;
    }
  }

  @override
  Future<Progress> saveProgress(Progress progress) async {
    final saved = await remote.saveProgress(progress);
    await local.write(saved);
    return saved;
  }
}
