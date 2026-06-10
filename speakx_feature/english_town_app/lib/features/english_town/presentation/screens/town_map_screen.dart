import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/theme/app_colors.dart';
import '../../application/avatar_controller.dart';
import '../../application/reward_controller.dart';
import '../../domain/avatar/avatar_profiles.dart';
import '../../domain/repositories/progress_repository.dart';
import '../../domain/entities/progress.dart';
import '../../domain/town/map_layout.dart';
import '../../domain/town/subtopics.dart';
import '../../domain/town/topic_zones.dart';
import '../widgets/app_header.dart';
import '../widgets/avatar_figure.dart';
import '../widgets/town_decor_painter.dart';
import '../widgets/town_scene_painter.dart';
import 'avatar_setup_screen.dart';
import 'rewards_screen.dart';
import 'vocabulary_exercise_screen.dart';

const _coinsPerLevel = 10;
const _walk = Duration(milliseconds: 1450);

/// The English Town map — vertical scrolling journey of 20 lesson pins along a
/// winding road, grouped into topic zones. Port of EnglishTownScreen.tsx
/// (functional core: pins, road, zones, character walk, coins, camera).
/// Rich per-location SVG scenes are stood in with location markers for now.
class TownMapScreen extends StatefulWidget {
  const TownMapScreen({
    super.key,
    required this.avatarController,
    required this.rewardController,
  });

  final AvatarController avatarController;
  final RewardController rewardController;

  @override
  State<TownMapScreen> createState() => _TownMapScreenState();
}

class _TownMapScreenState extends State<TownMapScreen>
    with SingleTickerProviderStateMixin {
  final _scroll = ScrollController();
  final GlobalKey _currentKey = GlobalKey();
  late final AnimationController _walkCtl;

  TownLayout? _layout;

  Progress _progress = Progress.initial;
  bool _loaded = false;
  bool _busy = false;
  bool _night = false;

  // walk animation endpoints (world coords)
  Offset _charFrom = Offset.zero;
  Offset _charTo = Offset.zero;
  String? _toast;

  @override
  void initState() {
    super.initState();
    _walkCtl = AnimationController(vsync: this, duration: _walk)
      ..addListener(() => setState(() {}));
    widget.avatarController.addListener(_onAvatarChanged);
    _load();
  }

  void _onAvatarChanged() => setState(() {});

  Future<void> _load() async {
    final repo = context.read<ProgressRepository>();
    final p = await repo.getProgress();
    setState(() {
      _progress = p;
      _loaded = true;
    });
    _centerCurrent(animate: false);
  }

  @override
  void dispose() {
    widget.avatarController.removeListener(_onAvatarChanged);
    _walkCtl.dispose();
    _scroll.dispose();
    super.dispose();
  }

  void _openRewards() {
    Navigator.of(context).push(MaterialPageRoute(
      fullscreenDialog: true,
      builder: (_) => RewardsScreen(
        avatarController: widget.avatarController,
        rewardController: widget.rewardController,
        completedCount: _progress.completedIds.length,
        level: _progress.currentId,
        coins: _progress.coins,
      ),
    ));
  }

  void _openAvatarSetup() {
    Navigator.of(context).push(MaterialPageRoute(
      fullscreenDialog: true,
      builder: (_) => AvatarSetupScreen(
        initial: widget.avatarController.selection,
        onSave: (sel) {
          widget.avatarController.setSelection(sel);
          Navigator.of(context).pop();
          _showToast('✨ Avatar updated!');
        },
      ),
    ));
  }

  /// Scroll so the CURRENT lesson pin sits ~44% from the top — robust against
  /// layout timing via Scrollable.ensureVisible (vs fragile manual offsets).
  void _centerCurrent({bool animate = true}) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final ctx = _currentKey.currentContext;
      if (ctx == null) return;
      Scrollable.ensureVisible(
        ctx,
        alignment: 0.44,
        duration: animate ? _walk : Duration.zero,
        curve: Curves.easeInOut,
      );
    });
  }

  _PinStatus _statusOf(int id) {
    if (_progress.completedIds.contains(id)) return _PinStatus.completed;
    if (id == _progress.currentId) return _PinStatus.current;
    return _PinStatus.locked;
  }

  void _showToast(String msg) {
    setState(() => _toast = msg);
    Future.delayed(const Duration(milliseconds: 1700), () {
      if (mounted) setState(() => _toast = null);
    });
  }

  void _onPinTap(int id) {
    if (_busy) return;
    final locked = !_progress.completedIds.contains(id) && id != _progress.currentId;
    if (locked) {
      _showToast('🔒 Complete previous level first.');
      return;
    }
    if (id == _progress.currentId) {
      _openExercise(id);
    }
  }

  void _openExercise(int id) {
    Navigator.of(context).push(MaterialPageRoute(
      fullscreenDialog: true,
      builder: (_) => VocabularyExerciseScreen(
        onComplete: () {
          Navigator.of(context).pop();
          _complete(id);
        },
      ),
    ));
  }

  Future<void> _complete(int id) async {
    if (id != _progress.currentId || _busy) return;
    final isLast = id == kTotalSubtopics;
    final nextId = isLast ? id : id + 1;

    final repo = context.read<ProgressRepository>();
    setState(() => _busy = true);
    HapticFeedback.mediumImpact();

    if (!isLast) {
      _charFrom = _layout!.lessonPos(id);
      _charTo = _layout!.lessonPos(nextId);
      await _walkCtl.forward(from: 0);
    }

    final updated = _progress.copyWith(
      currentId: nextId,
      completedIds: [..._progress.completedIds, id],
      coins: _progress.coins + _coinsPerLevel,
    );
    setState(() {
      _progress = updated;
      _busy = false;
    });
    _centerCurrent(animate: true);
    await repo.saveProgress(updated);

    if (isLast) {
      _showToast('🏆 English Champion! All lessons complete.');
    } else {
      _showToast('✅ Level complete!  +$_coinsPerLevel 🪙');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_loaded) {
      return const ColoredBox(
        color: Color(0xFFDCEBD6),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(color: Color(0xFFFF8A3D)),
              SizedBox(height: 12),
              Text('Building your town…',
                  style: TextStyle(color: Color(0xFF7C8186), fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      );
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        _layout ??= buildTownLayout(constraints.maxWidth);
        final layout = _layout!;

        // current topic progress
        final cur = kSubtopics[_progress.currentId - 1];
        final zone = topicZoneOf(cur.topicIndex);
        final inTopic = kSubtopics.where((s) => s.topicIndex == cur.topicIndex).toList();
        final doneInTopic =
            inTopic.where((s) => _progress.completedIds.contains(s.id)).length;
        final pct = inTopic.isEmpty ? 0.0 : doneInTopic / inTopic.length;

        return Stack(
          children: [
            // ── Scrolling world ──
            SingleChildScrollView(
              controller: _scroll,
              child: SizedBox(
                width: layout.worldW,
                height: layout.worldH,
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    // zone ground bands
                    for (final z in layout.zones)
                      Positioned(
                        top: z.top,
                        left: 0,
                        right: 0,
                        height: z.height,
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [z.groundTop, z.groundBottom],
                            ),
                          ),
                        ),
                      ),
                    // road
                    Positioned.fill(
                      child: CustomPaint(painter: _RoadPainter(layout.roadPath)),
                    ),
                    // roadside decor (trees, shops, lamps, hedges, flowers…)
                    Positioned.fill(
                      child: CustomPaint(painter: TownDecorPainter(layout.decor, night: _night)),
                    ),
                    // per-location isometric scenes (town square, cafe, rooms…)
                    Positioned.fill(
                      child: CustomPaint(painter: TownScenePainter(layout)),
                    ),
                    // topic signboards
                    for (final z in layout.zones)
                      Positioned(
                        top: z.signY - 18,
                        left: layout.worldW / 2 - 90,
                        width: 180,
                        child: _Signboard(emoji: topicZoneOf(z.topicIndex).emoji, name: z.name, accent: z.accent),
                      ),
                    // lesson pins
                    for (final l in layout.lessons) ...[
                      Positioned(
                        left: l.px - 30,
                        top: l.py - 30,
                        child: _LessonPin(
                          key: l.id == _progress.currentId ? _currentKey : null,
                          number: l.id,
                          status: _statusOf(l.id),
                          accent: topicZoneOf(l.topicIndex).accent,
                          onTap: () => _onPinTap(l.id),
                        ),
                      ),
                    ],
                    // character
                    Positioned(
                      left: _charPos(layout).dx - 20,
                      top: _charPos(layout).dy - 64,
                      child: _Character(selection: widget.avatarController.selection),
                    ),
                    if (_night)
                      Positioned.fill(
                        child: IgnorePointer(
                          child: ColoredBox(color: const Color(0x33182040)),
                        ),
                      ),
                  ],
                ),
              ),
            ),

            // ── Header overlay ──
            AppHeader(
                trophies: _progress.completedIds.length, coins: _progress.coins),

            // topic progress card
            Positioned(
              top: kHeaderHeight + 10,
              left: 12,
              width: 220,
              child: _TopicCard(
                  emoji: zone.emoji,
                  name: zone.name,
                  done: doneInTopic,
                  total: inTopic.length,
                  pct: pct,
                  accent: zone.accent),
            ),

            // day/night + sound toggles
            Positioned(
              top: kHeaderHeight + 10,
              right: 12,
              child: Column(
                children: [
                  _ToggleBtn(label: '🔊', onTap: () {}),
                  const SizedBox(height: 8),
                  _ToggleBtn(
                      label: _night ? '🌙' : '☀️',
                      night: _night,
                      onTap: () => setState(() => _night = !_night)),
                ],
              ),
            ),

            // Rewards FAB
            Positioned(
              left: 14,
              bottom: 16,
              child: GestureDetector(
                onTap: _openRewards,
                child: Container(
                  padding: const EdgeInsets.fromLTRB(11, 6.5, 15, 6.5),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(19),
                    boxShadow: const [
                      BoxShadow(color: Color(0x38000000), blurRadius: 8, offset: Offset(0, 3)),
                    ],
                  ),
                  child: Row(mainAxisSize: MainAxisSize.min, children: const [
                    Text('🎁', style: TextStyle(fontSize: 16)),
                    SizedBox(width: 6),
                    Text('Rewards',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 13.5)),
                  ]),
                ),
              ),
            ),

            // Avatar button (bottom-right) — opens avatar setup; reflects the
            // current persona live via the shared controller.
            Positioned(
              right: 14,
              bottom: 16,
              child: GestureDetector(
                onTap: _openAvatarSetup,
                child: Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF6EC),
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.primary, width: 2),
                    boxShadow: const [
                      BoxShadow(color: Color(0x33000000), blurRadius: 8, offset: Offset(0, 3)),
                    ],
                  ),
                  clipBehavior: Clip.antiAlias,
                  alignment: Alignment.bottomCenter,
                  child: AvatarFigure(selection: widget.avatarController.selection, size: 56, shadow: false),
                ),
              ),
            ),

            // toast
            if (_toast != null)
              Positioned(
                bottom: 40,
                left: 0,
                right: 0,
                child: IgnorePointer(
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 11),
                      decoration: BoxDecoration(
                        color: const Color(0xF01E2026),
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: Text(_toast!,
                          style: const TextStyle(
                              color: Colors.white, fontWeight: FontWeight.w800, fontSize: 14)),
                    ),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }

  Offset _charPos(TownLayout layout) {
    if (_walkCtl.isAnimating) {
      return Offset.lerp(_charFrom, _charTo, Curves.easeInOut.transform(_walkCtl.value))!;
    }
    return layout.lessonPos(_progress.currentId);
  }
}

enum _PinStatus { completed, current, locked }

class _LessonPin extends StatelessWidget {
  const _LessonPin({
    super.key,
    required this.number,
    required this.status,
    required this.accent,
    required this.onTap,
  });

  final int number;
  final _PinStatus status;
  final Color accent;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bool current = status == _PinStatus.current;
    final bool done = status == _PinStatus.completed;
    final Color bg = done
        ? accent
        : current
            ? AppColors.primary
            : const Color(0xFFC9CDD2);
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          color: bg,
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white, width: 4),
          boxShadow: [
            BoxShadow(
              color: (current ? AppColors.primary : Colors.black).withValues(alpha: current ? 0.45 : 0.18),
              blurRadius: current ? 16 : 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        alignment: Alignment.center,
        child: done
            ? const Icon(Icons.check_rounded, color: Colors.white, size: 30)
            : status == _PinStatus.locked
                ? const Icon(Icons.lock, color: Colors.white, size: 22)
                : Text('$number',
                    style: const TextStyle(
                        color: Colors.white, fontWeight: FontWeight.w900, fontSize: 20)),
      ),
    );
  }
}

class _Character extends StatelessWidget {
  const _Character({required this.selection});
  final AvatarSelection selection;
  @override
  Widget build(BuildContext context) {
    // Full-body figure standing on the pin (drop shadow grounds it).
    return SizedBox(
      width: 40,
      height: 64,
      child: Align(
        alignment: Alignment.bottomCenter,
        child: AvatarFigure(selection: selection, size: 62),
      ),
    );
  }
}

class _Signboard extends StatelessWidget {
  const _Signboard({required this.emoji, required this.name, required this.accent});
  final String emoji;
  final String name;
  final Color accent;
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.95),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: accent, width: 2),
          boxShadow: const [
            BoxShadow(color: Color(0x1F000000), blurRadius: 8, offset: Offset(0, 3)),
          ],
        ),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Text(emoji, style: const TextStyle(fontSize: 16)),
          const SizedBox(width: 6),
          Text(name,
              style: TextStyle(fontWeight: FontWeight.w900, color: accent, fontSize: 13)),
        ]),
      ),
    );
  }
}

class _TopicCard extends StatelessWidget {
  const _TopicCard({
    required this.emoji,
    required this.name,
    required this.done,
    required this.total,
    required this.pct,
    required this.accent,
  });
  final String emoji;
  final String name;
  final int done;
  final int total;
  final double pct;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.97),
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(color: Color(0x1A000000), blurRadius: 10, offset: Offset(0, 3)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
                color: accent.withValues(alpha: 0.13),
                borderRadius: BorderRadius.circular(10)),
            alignment: Alignment.center,
            child: Text(emoji, style: const TextStyle(fontSize: 17)),
          ),
          const SizedBox(width: 9),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                        fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.ink)),
                Text('$done/$total levels completed',
                    style: const TextStyle(
                        fontSize: 10.5, color: AppColors.grey, fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                ClipRRect(
                  borderRadius: BorderRadius.circular(3),
                  child: LinearProgressIndicator(
                    value: pct,
                    minHeight: 4,
                    backgroundColor: const Color(0xFFEEF0F2),
                    valueColor: AlwaysStoppedAnimation(accent),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ToggleBtn extends StatelessWidget {
  const _ToggleBtn({required this.label, required this.onTap, this.night = false});
  final String label;
  final VoidCallback onTap;
  final bool night;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: night ? const Color(0xFF2A3360) : Colors.white.withValues(alpha: 0.97),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: night ? const Color(0xFF3E4A78) : const Color(0xFFECEDEF)),
          boxShadow: const [
            BoxShadow(color: Color(0x14000000), blurRadius: 6, offset: Offset(0, 2)),
          ],
        ),
        alignment: Alignment.center,
        child: Text(label, style: const TextStyle(fontSize: 17)),
      ),
    );
  }
}

class _RoadPainter extends CustomPainter {
  _RoadPainter(this.road);
  final Path road;
  @override
  void paint(Canvas canvas, Size size) {
    // wide tan road
    canvas.drawPath(
        road,
        Paint()
          ..color = const Color(0xFFE8DCC0)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 40
          ..strokeCap = StrokeCap.round
          ..strokeJoin = StrokeJoin.round);
    // inner lighter strip
    canvas.drawPath(
        road,
        Paint()
          ..color = const Color(0xFFF3ECDA)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 30
          ..strokeCap = StrokeCap.round
          ..strokeJoin = StrokeJoin.round);
    // dashed centre line
    final dash = Paint()
      ..color = const Color(0xFFCDBF9B)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round;
    for (final m in road.computeMetrics()) {
      var d = 0.0;
      while (d < m.length) {
        canvas.drawPath(m.extractPath(d, d + 12), dash);
        d += 24;
      }
    }
  }

  @override
  bool shouldRepaint(covariant _RoadPainter oldDelegate) => false;
}
