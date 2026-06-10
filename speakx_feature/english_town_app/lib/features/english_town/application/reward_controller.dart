import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Placement of a reward on the Dream Home canvas (image percentages + scale +
/// rotation), ported from the prototype's dream-home layout.
class Placement {
  final double xPercent;
  final double yPercent;
  final double scale;
  final double rotation; // degrees

  const Placement({
    this.xPercent = 50,
    this.yPercent = 55,
    this.scale = 1,
    this.rotation = 0,
  });

  Placement copyWith({double? xPercent, double? yPercent, double? scale, double? rotation}) =>
      Placement(
        xPercent: xPercent ?? this.xPercent,
        yPercent: yPercent ?? this.yPercent,
        scale: scale ?? this.scale,
        rotation: rotation ?? this.rotation,
      );

  Map<String, dynamic> toJson() =>
      {'x': xPercent, 'y': yPercent, 's': scale, 'r': rotation};

  static Placement fromJson(Map<String, dynamic> m) => Placement(
        xPercent: (m['x'] as num).toDouble(),
        yPercent: (m['y'] as num).toDouble(),
        scale: (m['s'] as num).toDouble(),
        rotation: (m['r'] as num).toDouble(),
      );
}

/// Tracks which rewards the learner is wearing / has placed (the "collected"
/// state). Flutter equivalent of the prototype's RewardContext + dream-home
/// layout, persisted to shared_preferences.
class RewardController extends ChangeNotifier {
  static const _key = 'english_town/rewards_v2';
  final SharedPreferences _prefs;

  String? _wearingWardrobeId; // single
  final Set<String> _wearingLifestyle = {}; // many
  final Map<String, Placement> _placed = {}; // home/garden/vehicles on the dream home

  RewardController(this._prefs) {
    final raw = _prefs.getString(_key);
    if (raw != null) {
      try {
        final m = jsonDecode(raw) as Map<String, dynamic>;
        _wearingWardrobeId = m['wardrobe'] as String?;
        _wearingLifestyle.addAll((m['lifestyle'] as List? ?? []).cast<String>());
        final pl = (m['placed'] as Map?)?.cast<String, dynamic>() ?? {};
        pl.forEach((k, v) => _placed[k] = Placement.fromJson((v as Map).cast<String, dynamic>()));
      } catch (_) {/* keep defaults */}
    }
  }

  String? get wearingWardrobeId => _wearingWardrobeId;
  bool isWearingWardrobe(String id) => _wearingWardrobeId == id;
  bool isWearingLifestyle(String id) => _wearingLifestyle.contains(id);
  bool isPlaced(String id) => _placed.containsKey(id);

  Map<String, Placement> get placements => Map.unmodifiable(_placed);

  Set<String> get claimedIds => {
        ?_wearingWardrobeId,
        ..._wearingLifestyle,
        ..._placed.keys,
      };

  void wearWardrobe(String id) {
    _wearingWardrobeId = _wearingWardrobeId == id ? null : id;
    _save();
  }

  void toggleLifestyle(String id) {
    _wearingLifestyle.contains(id) ? _wearingLifestyle.remove(id) : _wearingLifestyle.add(id);
    _save();
  }

  /// Claim/place an item at a default spot on the canvas.
  void place(String id) {
    _placed[id] = const Placement();
    _save();
  }

  void updatePlacement(String id, {double? xPercent, double? yPercent, double? scale, double? rotation}) {
    final cur = _placed[id] ?? const Placement();
    _placed[id] = cur.copyWith(xPercent: xPercent, yPercent: yPercent, scale: scale, rotation: rotation);
    _save();
  }

  void removePlacement(String id) {
    _placed.remove(id);
    _save();
  }

  void resetPlacements() {
    _placed.clear();
    _save();
  }

  void _save() {
    notifyListeners();
    _prefs.setString(
      _key,
      jsonEncode({
        'wardrobe': _wearingWardrobeId,
        'lifestyle': _wearingLifestyle.toList(),
        'placed': {for (final e in _placed.entries) e.key: e.value.toJson()},
      }),
    );
  }
}
