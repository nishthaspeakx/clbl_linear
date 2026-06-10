import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../domain/avatar/avatar_profiles.dart';

/// Shares the selected learner avatar across tabs so the map character and the
/// setup screen stay in sync (Flutter equivalent of AvatarContext). Persists to
/// shared_preferences; swap for the gRPC-backed avatar API in production.
class AvatarController extends ChangeNotifier {
  static const _key = 'english_town/avatar_v1';
  final SharedPreferences _prefs;

  AvatarSelection _selection = AvatarSelection.initial;
  AvatarSelection get selection => _selection;

  AvatarController(this._prefs) {
    final raw = _prefs.getString(_key);
    if (raw != null) {
      try {
        _selection = AvatarSelection.fromJson(jsonDecode(raw) as Map<String, dynamic>);
      } catch (_) {/* keep default */}
    }
  }

  void setSelection(AvatarSelection s) {
    _selection = s;
    notifyListeners();
    _prefs.setString(_key, jsonEncode(s.toJson()));
  }
}
