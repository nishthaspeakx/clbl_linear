import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

import '../../domain/entities/progress.dart';

/// Local cache so the screen paints instantly and works offline.
/// Mirrors the prototype's AsyncStorage behaviour as a cache, while the
/// server (gRPC) remains the source of truth.
class ProgressLocalDataSource {
  static const _key = 'english_town/progress_v1';
  final SharedPreferences _prefs;

  ProgressLocalDataSource(this._prefs);

  Progress? read() {
    final raw = _prefs.getString(_key);
    if (raw == null) return null;
    try {
      final m = jsonDecode(raw) as Map<String, dynamic>;
      return Progress(
        currentId: m['currentId'] as int,
        completedIds: (m['completedIds'] as List).cast<int>(),
        coins: (m['coins'] as int?) ?? 0,
      );
    } catch (_) {
      return null;
    }
  }

  Future<void> write(Progress p) async {
    await _prefs.setString(
      _key,
      jsonEncode({
        'currentId': p.currentId,
        'completedIds': p.completedIds,
        'coins': p.coins,
      }),
    );
  }
}
